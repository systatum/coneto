import {
  RiArrowRightSLine,
  RiDeleteBinLine,
  RiFileCopyLine,
  RiPrinterFill,
} from "@remixicon/react";
import { Meta, StoryObj } from "@storybook/react";
import { useMemo, useRef, useState } from "react";
import { css } from "styled-components";
import { generateSentence } from "./../lib/text";
import { Badge } from "./badge";
import { Boxbar } from "./boxbar";
import { Button } from "./button";
import { RichEditor, RichEditorRef, RichEditorCodeAction } from "./rich-editor";
import { useTheme } from "./../theme/provider";
import { TipMenuItemProps } from "./tip-menu";

const meta: Meta<typeof RichEditor> = {
  title: "Input Elements/RichEditor",
  component: RichEditor,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
✍️ **RichEditor** is a lightweight, Markdown-compatible rich text editor built on top of \`contentEditable\`. It provides a WYSIWYG editing experience while maintaining clean and structured Markdown output.

---

### ✨ Features

- **Markdown ↔ HTML sync**
  - Uses \`marked\` for parsing Markdown → HTML
  - Uses custom \`TurndownService\` rules for HTML → Markdown
  - Ensures clean spacing and consistent formatting

- **Rich formatting**
  - Bold and italic (toolbar + keyboard shortcuts)
  - Headings (H1–H3) via floating menu
  - Ordered and unordered lists
  - Smart inline formatting (auto-detect word styling)

- **Checklist support**
  - Type \`[ ]\` or \`[x]\` + space to create checkboxes
  - Interactive checkboxes synced back to Markdown
  - Preserves state via \`data-checked\`

- **Smart input behavior**
  - Auto-converts:
    - \`1.\` → ordered list
    - \`-\` or \`*\` → unordered list
  - Handles Enter key for:
    - Splitting headings properly
    - Maintaining formatting consistency
  - Intelligent Backspace behavior for lists and headings

- **Toolbar system**
  - Built-in formatting controls
  - Floating heading menu (H1–H3)
  - Supports custom right-side toolbar via \`toolbarRightPanel\`

- **Flexible layout**
  - Toolbar position: \`top\` or \`bottom\`
  - Modes:
    - \`text-editor\` (default editing)
    - \`page-editor\` (full height editor)
    - \`view-only\` (read-only with selectable text)
    - \`markdown-editor\` (text editor with embedded code blocks)
    - \`code-editor\` (standalone Monaco-based code editor)

- **Height control**
  - \`autogrow\`: expands editor dynamically
  - Fixed height with scroll support via \`height\`

---

### 🧩 Props

- \`value\` — Initial Markdown content
- \`onChange\` — Callback returning cleaned Markdown output
- \`mode\` — Editor mode: \`text-editor\` | \`page-editor\` | \`view-only\` | \`markdown-editor\` | \`code-editor\`
- \`toolbarPosition\` — Position of toolbar: \`top\` | \`bottom\`
- \`toolbarRightPanel\` — Custom React node for right-side toolbar
- \`autogrow\` — Enable dynamic height
- \`height\` — Fixed height (used when \`autogrow\` is false)
- \`styles\` — Custom styling overrides
- \`codeEditor\` — Code editor configuration (see below)

---

### 💻 Code Editor Mode (\`mode="code-editor"\`)

A standalone Monaco-based code editor. Useful when you want a pure code editing experience without rich text.

\`\`\`tsx
<RichEditor
  mode="code-editor"
  value="const hello = 'world';"
  onChange={(value) => console.log(value)}
  codeEditor={{
    language: RichEditor.SupportedLanguage.TypeScript,
    languageOptions: [
      RichEditor.SupportedLanguage.TypeScript,
      RichEditor.SupportedLanguage.JavaScript,
      RichEditor.SupportedLanguage.Python,
    ],
  }}
/>
\`\`\`

**\`codeEditor\` props:**
- \`language\` — Default language for the editor (e.g. \`"tsx"\`, \`"py"\`, \`"sql"\`)
- \`languageOptions\` — List of languages available in the language switcher dropdown
- \`actions\` — Custom toolbar buttons rendered in the code editor toolbar

**Supported languages:**

| Key | Value | Display Name |
|-----|-------|--------------|
| \`TypeScript\` | \`tsx\` | TypeScript |
| \`JavaScript\` | \`js\` | JavaScript |
| \`Python\` | \`py\` | Python |
| \`Ruby\` | \`rb\` | Ruby |
| \`CPP\` | \`cpp\` | C++ |
| \`SQL\` | \`sql\` | SQL |
| \`R\` | \`r\` | R |
| \`PHP\` | \`php\` | PHP |
| \`Go\` | \`go\` | Go |
| \`Rust\` | \`rs\` | Rust |
| \`Java\` | \`java\` | Java |
| \`HTML\` | \`html\` | HTML |
| \`CSS\` | \`css\` | CSS |
| \`Text\` | \`txt\` | Text |

**Features:**
- Syntax highlighting and IntelliSense via Monaco Editor
- Language switcher dropdown in the toolbar
- Auto-resizes height based on line count
- Keyboard navigation: Up arrow on first line / Down arrow on last line exits back to the surrounding rich text editor
- Backspace on empty editor removes the block (when embedded)
- Dark/light theme synced with the app theme

---

### 📝 Markdown Editor Mode (\`mode="markdown-editor"\`)

Extends the default text editor with support for embedded Monaco code blocks. Users can insert fenced code blocks directly into the rich text content.

\`\`\`tsx
<RichEditor
  mode="markdown-editor"
  value="# Hello\n\nSome text\n\n\`\`\`tsx\nconsole.log('hello')\n\`\`\`"
  onChange={(value) => console.log(value)}
  codeEditor={{
    language: RichEditor.SupportedLanguage.TypeScript,
    languageOptions: [
      RichEditor.SupportedLanguage.TypeScript,
      RichEditor.SupportedLanguage.Python,
    ],
  }}
/>
\`\`\`

**Features:**
- All standard rich text features (bold, italic, headings, lists, checkboxes)
- Additional **code block** button in the toolbar
- Type \`\`\`\`\`\` (three backticks) to instantly insert a code block
- Each code block is a full Monaco editor instance embedded inline
- Code blocks serialize back to fenced Markdown (\`\`\`\`\`\`lang\\n...\\n\`\`\`\`\`\`) on \`onChange\`
- Language switcher per code block
- Remove button to delete a code block
- Keyboard navigation between code blocks and surrounding text

**Serialization:**

The editor always outputs clean Markdown. Embedded code blocks are serialized as standard fenced code blocks:

\`\`\`md
# My document

Some rich text here.

\`\`\`tsx
const x = 1;
\`\`\`

More text below.
\`\`\`

---

### 🎯 Imperative API

Accessible via \`ref\`:

- \`insertPlainText(text)\`  
  Inserts raw text at cursor position

- \`insertMarkdownContent(markdown)\`  
  Parses Markdown → HTML and inserts into editor. Also hydrates any fenced code blocks found in the Markdown into live Monaco editors.

---

### ⌨️ Keyboard Shortcuts

- **Cmd/Ctrl + B** → Bold
- **Cmd/Ctrl + I** → Italic
- **Enter**
  - Smart line break handling
  - Proper heading/list splitting
- **Space**
  - Triggers list and checklist auto-format
- **\`\`\`** (three backticks, markdown-editor only)
  - Instantly inserts a Monaco code block

---

### ⚙️ Notes

- Built using \`document.execCommand\` for formatting
- Includes custom DOM normalization to:
  - Prevent invalid list wrapping
  - Clean unnecessary \`span\` styles
- Designed for predictable Markdown output rather than raw HTML editing
- Monaco Editor workers are required for full IntelliSense and completions in code blocks. Add the following to your \`vite.config.ts\`:
  \`\`\`ts
  optimizeDeps: {
    exclude: ["@systatum/coneto"],
  }
  \`\`\`

---

### 🚀 Use Cases

- Blog editors
- Notes / documentation tools
- Internal CMS editors
- Markdown-based content systems
- Technical documentation with embedded code examples
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [printValue, setPrintValue] = useState("");

    const ref = useRef<RichEditorRef>(null);

    const TIP_MENU_EMAIL: TipMenuItemProps[] = [
      {
        caption: "Duplicate",
        icon: {
          image: RiFileCopyLine,
        },
        onClick: () => console.log("Phishing reported"),
      },
      {
        caption: "Report Junk",
        icon: {
          image: RiDeleteBinLine,
        },
        variant: "danger",
        onClick: () => console.log("Junk reported"),
      },
    ];

    const sentences = useMemo(
      () => generateSentence({ minLen: 30, maxLen: 40, seed: 12345 }),
      [generateSentence]
    );
    const BADGE_ITEMS = [
      {
        title: "Markdown Example",
        content: `### Hello there!
${sentences}

This is ordered list
1. [ ] test
2. [x] test

This is unordered list
* test
* test

This is with code-block
\`\`\`tsx
import { Button } from "@systatum/coneto/button"

function Content(){
  return <Button variant="primary">Your caption</Button>
}

export default Content
\`\`\`
`,
      },
      { title: "Sender Name", content: "Sender Name" },
      { title: "Sender Email", content: "Sender Email" },
    ];

    const TOOLBAR_RIGHT_PANEL_ACTIONS = (
      <RichEditor.ToolbarButton
        icon={{ image: RiPrinterFill }}
        onClick={() => {
          setPrintValue(value);
          console.log(value);
        }}
      >
        Print
      </RichEditor.ToolbarButton>
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <RichEditor
          ref={ref}
          onChange={(e) => setValue(e)}
          value={value}
          toolbarRightPanel={TOOLBAR_RIGHT_PANEL_ACTIONS}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "8px",
            flexDirection: "row",
          }}
        >
          <Boxbar
            styles={{
              self: css`
                width: 100%;
              `,
            }}
          >
            {BADGE_ITEMS.map((data, index) => (
              <Badge
                onClick={async () => {
                  if (data.title === "Markdown Example") {
                    await ref.current?.insertMarkdownContent(data.content);
                  } else {
                    await ref.current?.insertPlainText(data.content);
                  }
                }}
                key={index}
                withCircle
                caption={data.title}
              />
            ))}
          </Boxbar>
          <div>
            <Button
              styles={{
                dropdownStyle: css`
                  min-width: 200px;
                `,
                self: css`
                  min-height: 40px;
                `,
                toggleStyle: css`
                  min-height: 40px;
                `,
              }}
              subMenu={({ list }) => list(TIP_MENU_EMAIL)}
              className="w-fit"
            >
              Save
            </Button>
          </div>
        </div>
        {printValue !== "" && (
          <pre
            style={{
              padding: 28,
              background: "#D3D3D3",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {printValue}
          </pre>
        )}
      </div>
    );
  },
};

export const Autogrow: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [printValue, setPrintValue] = useState("");

    const ref = useRef<RichEditorRef>(null);

    const TIP_MENU_EMAIL: TipMenuItemProps[] = [
      {
        caption: "Duplicate",
        icon: {
          image: RiFileCopyLine,
        },
        onClick: () => console.log("Phishing reported"),
      },
      {
        caption: "Report Junk",
        icon: {
          image: RiDeleteBinLine,
        },
        variant: "danger",
        onClick: () => console.log("Junk reported"),
      },
    ];

    const sentences = useMemo(
      () => generateSentence({ minLen: 30, maxLen: 40, seed: 12345 }),
      [generateSentence]
    );
    const BADGE_ITEMS = [
      {
        title: "Markdown Example",
        content: `### Hello there!
${sentences}

This is ordered list
1. [ ] test
2. [x] test

This is unordered list
* test
* test

This is with code-block
\`\`\`tsx
import { Button } from "@systatum/coneto/button"

function Content(){
  return <Button variant="primary">Your caption</Button>
}

export default Content
\`\`\`
`,
      },
      { title: "Sender Name", content: "Sender Name" },
      { title: "Sender Email", content: "Sender Email" },
    ];

    const TOOLBAR_RIGHT_PANEL_ACTIONS = (
      <RichEditor.ToolbarButton
        icon={{ image: RiPrinterFill }}
        onClick={() => {
          setPrintValue(value);
          console.log(value);
        }}
      >
        Print
      </RichEditor.ToolbarButton>
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <RichEditor
          ref={ref}
          autogrow
          onChange={(e) => setValue(e)}
          value={value}
          toolbarRightPanel={TOOLBAR_RIGHT_PANEL_ACTIONS}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "8px",
            flexDirection: "row",
          }}
        >
          <Boxbar
            styles={{
              self: css`
                width: 100%;
              `,
            }}
          >
            {BADGE_ITEMS.map((data, index) => (
              <Badge
                onClick={async () => {
                  if (data.title === "Markdown Example") {
                    await ref.current?.insertMarkdownContent(data.content);
                  } else {
                    await ref.current?.insertPlainText(data.content);
                  }
                }}
                key={index}
                withCircle
                caption={data.title}
              />
            ))}
          </Boxbar>
          <div>
            <Button
              styles={{
                dropdownStyle: css`
                  min-width: 200px;
                `,
                self: css`
                  min-height: 40px;
                `,
                toggleStyle: css`
                  min-height: 40px;
                `,
              }}
              subMenu={({ list }) => list(TIP_MENU_EMAIL)}
              className="w-fit"
            >
              Save
            </Button>
          </div>
        </div>
        {printValue !== "" && (
          <pre
            style={{
              padding: 28,
              background: "#D3D3D3",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {printValue}
          </pre>
        )}
      </div>
    );
  },
};

export const ToolbarPositionBottom: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [printValue, setPrintValue] = useState("");

    const TOOLBAR_RIGHT_PANEL_ACTIONS = (
      <RichEditor.ToolbarButton
        icon={{ image: RiPrinterFill }}
        onClick={() => {
          setPrintValue(value);
          console.log(value);
        }}
      >
        Print
      </RichEditor.ToolbarButton>
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <RichEditor
          toolbarPosition="bottom"
          onChange={(e) => setValue(e)}
          value={value}
          toolbarRightPanel={TOOLBAR_RIGHT_PANEL_ACTIONS}
        />
        {printValue !== "" && (
          <pre
            style={{
              padding: 28,
              background: "#D3D3D3",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {printValue}
          </pre>
        )}
      </div>
    );
  },
};

export const PageEditor: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const [value, setValue] = useState("");
    const [printValue, setPrintValue] = useState("");

    const TOOLBAR_RIGHT_PANEL_ACTIONS = (
      <RichEditor.ToolbarButton
        icon={{ image: RiPrinterFill }}
        onClick={() => {
          setPrintValue(value);
          console.log(value);
        }}
      >
        Print
      </RichEditor.ToolbarButton>
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <RichEditor
          mode="page-editor"
          onChange={(e) => setValue(e)}
          value={value}
          toolbarRightPanel={TOOLBAR_RIGHT_PANEL_ACTIONS}
        />
        {printValue !== "" && (
          <pre
            style={{
              padding: 28,
              background: "#D3D3D3",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {printValue}
          </pre>
        )}
      </div>
    );
  },
};

export const MarkdownEditor: Story = {
  render: () => {
    const valueEditor = `Type triple backticks to add a new code editor
\`\`\`cpp
const i = 0;
\`\`\`

See, how awesome is that?
\`\`\`tsx
const fruits = ["apples", "oranges", "banana", "kesemek"]
fruits.forEach(fruit => {
  console.log(fruit)
})
\`\`\`
`;
    const [value1, setValue1] = useState(valueEditor);
    const [value2, setValue2] = useState("");

    const ref1 = useRef<RichEditorRef>(null);
    const ref2 = useRef<RichEditorRef>(null);

    const CODE_EDITOR_ACTIONS: RichEditorCodeAction[] = [
      {
        icon: {
          image: RiArrowRightSLine,
        },
        children: "Run",
        onClick: ({ content }) =>
          console.log(`compile the content: ${content}`),
      },
    ];

    return (
      <div
        style={{
          gap: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            gap: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1>Multiple coding languages supported</h1>
          <RichEditor
            ref={ref1}
            height={300}
            codeEditor={{
              languageOptions: ["tsx", "py", "rb", "cpp", "html"],
              actions: CODE_EDITOR_ACTIONS,
            }}
            mode="markdown-editor"
            onChange={(e) => setValue2(e)}
            value={value1}
          />
        </div>

        <div
          style={{
            gap: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1>Only one coding language supported</h1>
          <RichEditor
            ref={ref2}
            height={300}
            codeEditor={{
              languageOptions: ["cpp"],
              actions: CODE_EDITOR_ACTIONS,
            }}
            mode="markdown-editor"
            onChange={(e) => setValue1(e)}
            value={value2}
          />
        </div>
      </div>
    );
  },
};

export const CodeEditor: Story = {
  render: () => {
    const [value, setValue] = useState("");

    const ref = useRef<RichEditorRef>(null);

    const CODE_EDITOR_ACTIONS: RichEditorCodeAction[] = [
      {
        icon: {
          image: RiArrowRightSLine,
        },
        children: "Run",
        onClick: ({ content }) =>
          console.log(`compile the content: ${content}`),
      },
    ];

    return (
      <RichEditor
        ref={ref}
        codeEditor={{ actions: CODE_EDITOR_ACTIONS, language: "cpp" }}
        mode="code-editor"
        onChange={(e) => setValue(e)}
        value={value}
      />
    );
  },
};

export const ViewOnly: Story = {
  render: () => {
    const { currentTheme } = useTheme();
    const richEditorTheme = currentTheme?.richEditor;

    const sentences = useMemo(
      () => generateSentence({ minLen: 30, maxLen: 40, seed: 12345 }),
      [generateSentence]
    );
    const [value, setValue] = useState(
      `### Hello there!
${sentences}

This is ordered list
1. [ ] test
2. [x] test

This is unordered list
* test
* test

This is with code-block
\`\`\`tsx
import { Button } from "@systatum/coneto/button"

function Content(){
  return <Button variant="primary">Your caption</Button>
}

export default Content
\`\`\`
`
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <RichEditor
          mode="view-only"
          onChange={(e) => setValue(e)}
          value={value}
        />
        {value !== "" && (
          <pre
            style={{
              padding: 28,
              background: richEditorTheme?.preBackgroundColor,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {value}
          </pre>
        )}
      </div>
    );
  },
};
