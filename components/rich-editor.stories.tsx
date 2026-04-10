import {
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
import { RichEditor, RichEditorRef } from "./rich-editor";
import { useTheme } from "./../theme/provider";

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

- **Height control**
  - \`autogrow\`: expands editor dynamically
  - Fixed height with scroll support via \`height\`

---

### 🧩 Props

- \`value\` — Initial Markdown content
- \`onChange\` — Callback returning cleaned Markdown output
- \`mode\` — Editor mode: \`text-editor\` | \`page-editor\` | \`view-only\`
- \`toolbarPosition\` — Position of toolbar: \`top\` | \`bottom\`
- \`toolbarRightPanel\` — Custom React node for right-side toolbar
- \`autogrow\` — Enable dynamic height
- \`height\` — Fixed height (used when \`autogrow\` is false)
- \`styles\` — Custom styling overrides

---

### 🎯 Imperative API

Accessible via \`ref\`:

- \`insertPlainText(text)\`  
  Inserts raw text at cursor position

- \`insertMarkdownContent(markdown)\`  
  Parses Markdown → HTML and inserts into editor

---

### ⌨️ Keyboard Shortcuts

- **Cmd/Ctrl + B** → Bold
- **Cmd/Ctrl + I** → Italic
- **Enter**
  - Smart line break handling
  - Proper heading/list splitting
- **Space**
  - Triggers list and checklist auto-format

---

### ⚙️ Notes

- Built using \`document.execCommand\` for formatting
- Includes custom DOM normalization to:
  - Prevent invalid list wrapping
  - Clean unnecessary \`span\` styles
- Designed for predictable Markdown output rather than raw HTML editing

---

### 🚀 Use Cases

- Blog editors
- Notes / documentation tools
- Internal CMS editors
- Markdown-based content systems

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

    const TIP_MENU_EMAIL = [
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
        isDangerous: true,
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

    const TIP_MENU_EMAIL = [
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
        isDangerous: true,
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
