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
    - \`text-editor\`
    - \`page-editor\`
    - \`view-only\`
    - \`markdown-editor\`
    - \`code-editor\`

---

### 🔀 Editor Modes & Behavior

#### 📝 \`text-editor\` (default)
- Fully editable rich text
- Supports headings, lists, checklists, bold, italic
- Auto-formatting:
  - \`1.\` → ordered list
  - \`-\` / \`*\` → unordered list
- Smart keyboard handling (Enter, Backspace)
- Outputs clean Markdown
- No Monaco editor

---

#### 📄 \`page-editor\`
- Same as \`text-editor\`
- Optimized for full-page writing
- Expands to fill available height
- Ideal for long-form content (blogs, docs)

---

#### 👀 \`view-only\`
- Read-only mode
- No editing or toolbar interaction
- Text is selectable
- Markdown rendered as formatted content
- Code blocks are displayed (non-editable)

---

#### 💻 \`code-editor\`
- Standalone Monaco editor
- No rich text features
- Supports:
  - Syntax highlighting
  - IntelliSense (with workers)
  - Language switching
  - Custom actions
- Outputs raw code (not Markdown)
- \`codeEditor.language\` — Default language (e.g. \`"tsx"\`, \`"py"\`, \`"sql"\`)
- \`codeEditor.languageOptions\` — Languages available in the switcher dropdown
- \`codeEditor.actions\` — Custom toolbar buttons rendered in the Monaco toolbar
- Supported languages:

| Key | Value | Display Name |
|-----|-------|--------------|
| \`TypeScript\` | \`tsx\` | TypeScript |
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

---

#### 🧩 \`markdown-editor\`
- Rich text + embedded Monaco code blocks
- Supports all \`text-editor\` features
- Code block support:
  - Type \`\`\` to insert
  - Toolbar button
- Each block:
  - Has its own language
  - Can be removed
- Serialized as fenced Markdown:
\`\`\`md
\`\`\`tsx
const x = 1;
\`\`\`
\`\`\`

---

### 🧩 Props

- \`value\` — Initial Markdown content
- \`onChange\` — Callback returning cleaned Markdown output
- \`mode\` — Editor mode
- \`toolbarPosition\` — \`top\` | \`bottom\`
- \`toolbarRightPanel\` — Custom React node
- \`autogrow\` — Enable dynamic height
- \`height\` — Fixed height
- \`styles\` — Custom styling overrides
- \`codeEditor\` — Code editor configuration

---

### 💻 Code Editor Mode (\`mode="code-editor"\`)

A standalone Monaco-based code editor.

\`\`\`tsx
<RichEditor
  mode="code-editor"
  value="const hello = 'world';"
  onChange={(value) => console.log(value)}
  codeEditor={{
    language: RichEditor.codeLanguage.TypeScript,
    languageOptions: [
      RichEditor.codeLanguage.TypeScript,
      RichEditor.codeLanguage.Python,
    ],
  }}
/>
\`\`\`

**\`codeEditor\` props:**
- \`language\` — sets the active Monaco language
- \`languageOptions\` — restricts the language switcher to a subset
- \`actions\` — custom buttons injected into the Monaco toolbar

---

### 📝 Markdown Editor Mode (\`mode="markdown-editor"\`)

Supports embedded Monaco code blocks.

\`\`\`tsx
<RichEditor
  mode="markdown-editor"
  value="# Hello World."
  onChange={(value) => console.log(value)}
/>
\`\`\`

---

### 🎯 Imperative API

- \`insertPlainText(text)\`
- \`insertMarkdownContent(markdown)\`

---

### ⚙️ Notes

- Built using \`document.execCommand\`
- Includes DOM normalization
- Designed for clean Markdown output
- Monaco workers required (Vite config)

\`\`\`ts
optimizeDeps: {
  exclude: ["@systatum/coneto"],
}
\`\`\`

---

### 🚀 Use Cases

- Blog editors
- Documentation tools
- CMS editors
- Markdown systems
- Technical writing with code
`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const { currentTheme } = useTheme();
    const richEditorTheme = currentTheme?.richEditor;

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
              background: richEditorTheme?.preBackgroundColor,
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
    const { currentTheme } = useTheme();
    const richEditorTheme = currentTheme?.richEditor;

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
              background: richEditorTheme?.preBackgroundColor,
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
    const { currentTheme } = useTheme();
    const richEditorTheme = currentTheme?.richEditor;

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
              background: richEditorTheme?.preBackgroundColor,
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
        onClick: ({ code }) => console.log(`compile the content: ${code}`),
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
            onChange={(e) => setValue1(e)}
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
            onChange={(e) => setValue2(e)}
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
        onClick: ({ code }) => console.log(`compile the content: ${code}`),
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
    const [value, setValue] = useState(`### Hello there!
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
`);

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

export const LegalDocument: Story = {
  render: () => {
    return (
      <RichEditor
        height={700}
        mode="view-only"
        value={`                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1.  Definitions.

    "License" shall mean the terms and conditions for use, reproduction,
    and distribution as defined by Sections 1 through 9 of this document.

    "Licensor" shall mean the copyright owner or entity authorized by
    the copyright owner that is granting the License.

    "Legal Entity" shall mean the union of the acting entity and all
    other entities that control, are controlled by, or are under common
    control with that entity. For the purposes of this definition,
    "control" means (i) the power, direct or indirect, to cause the
    direction or management of such entity, whether by contract or
    otherwise, or (ii) ownership of fifty percent (50%) or more of the
    outstanding shares, or (iii) beneficial ownership of such entity.

    "You" (or "Your") shall mean an individual or Legal Entity
    exercising permissions granted by this License.

    "Source" form shall mean the preferred form for making modifications,
    including but not limited to software source code, documentation
    source, and configuration files.

    "Object" form shall mean any form resulting from mechanical
    transformation or translation of a Source form, including but
    not limited to compiled object code, generated documentation,
    and conversions to other media types.

    "Work" shall mean the work of authorship, whether in Source or
    Object form, made available under the License, as indicated by a
    copyright notice that is included in or attached to the work
    (an example is provided in the Appendix below).

    "Derivative Works" shall mean any work, whether in Source or Object
    form, that is based on (or derived from) the Work and for which the
    editorial revisions, annotations, elaborations, or other modifications
    represent, as a whole, an original work of authorship. For the purposes
    of this License, Derivative Works shall not include works that remain
    separable from, or merely link (or bind by name) to the interfaces of,
    the Work and Derivative Works thereof.

    "Contribution" shall mean any work of authorship, including
    the original version of the Work and any modifications or additions
    to that Work or Derivative Works thereof, that is intentionally
    submitted to Licensor for inclusion in the Work by the copyright owner
    or by an individual or Legal Entity authorized to submit on behalf of
    the copyright owner. For the purposes of this definition, "submitted"
    means any form of electronic, verbal, or written communication sent
    to the Licensor or its representatives, including but not limited to
    communication on electronic mailing lists, source code control systems,
    and issue tracking systems that are managed by, or on behalf of, the
    Licensor for the purpose of discussing and improving the Work, but
    excluding communication that is conspicuously marked or otherwise
    designated in writing by the copyright owner as "Not a Contribution."

    "Contributor" shall mean Licensor and any individual or Legal Entity
    on behalf of whom a Contribution has been received by Licensor and
    subsequently incorporated within the Work.

2.  Grant of Copyright License. Subject to the terms and conditions of
    this License, each Contributor hereby grants to You a perpetual,
    worldwide, non-exclusive, no-charge, royalty-free, irrevocable
    copyright license to reproduce, prepare Derivative Works of,
    publicly display, publicly perform, sublicense, and distribute the
    Work and such Derivative Works in Source or Object form.

3.  Grant of Patent License. Subject to the terms and conditions of
    this License, each Contributor hereby grants to You a perpetual,
    worldwide, non-exclusive, no-charge, royalty-free, irrevocable
    (except as stated in this section) patent license to make, have made,
    use, offer to sell, sell, import, and otherwise transfer the Work,
    where such license applies only to those patent claims licensable
    by such Contributor that are necessarily infringed by their
    Contribution(s) alone or by combination of their Contribution(s)
    with the Work to which such Contribution(s) was submitted. If You
    institute patent litigation against any entity (including a
    cross-claim or counterclaim in a lawsuit) alleging that the Work
    or a Contribution incorporated within the Work constitutes direct
    or contributory patent infringement, then any patent licenses
    granted to You under this License for that Work shall terminate
    as of the date such litigation is filed.

4.  Redistribution. You may reproduce and distribute copies of the
    Work or Derivative Works thereof in any medium, with or without
    modifications, and in Source or Object form, provided that You
    meet the following conditions:

    (a) You must give any other recipients of the Work or
    Derivative Works a copy of this License; and

    (b) You must cause any modified files to carry prominent notices
    stating that You changed the files; and

    (c) You must retain, in the Source form of any Derivative Works
    that You distribute, all copyright, patent, trademark, and
    attribution notices from the Source form of the Work,
    excluding those notices that do not pertain to any part of
    the Derivative Works; and

    (d) If the Work includes a "NOTICE" text file as part of its
    distribution, then any Derivative Works that You distribute must
    include a readable copy of the attribution notices contained
    within such NOTICE file, excluding those notices that do not
    pertain to any part of the Derivative Works, in at least one
    of the following places: within a NOTICE text file distributed
    as part of the Derivative Works; within the Source form or
    documentation, if provided along with the Derivative Works; or,
    within a display generated by the Derivative Works, if and
    wherever such third-party notices normally appear. The contents
    of the NOTICE file are for informational purposes only and
    do not modify the License. You may add Your own attribution
    notices within Derivative Works that You distribute, alongside
    or as an addendum to the NOTICE text from the Work, provided
    that such additional attribution notices cannot be construed
    as modifying the License.

    You may add Your own copyright statement to Your modifications and
    may provide additional or different license terms and conditions
    for use, reproduction, or distribution of Your modifications, or
    for any such Derivative Works as a whole, provided Your use,
    reproduction, and distribution of the Work otherwise complies with
    the conditions stated in this License.

5.  Submission of Contributions. Unless You explicitly state otherwise,
    any Contribution intentionally submitted for inclusion in the Work
    by You to the Licensor shall be under the terms and conditions of
    this License, without any additional terms or conditions.
    Notwithstanding the above, nothing herein shall supersede or modify
    the terms of any separate license agreement you may have executed
    with Licensor regarding such Contributions.

6.  Trademarks. This License does not grant permission to use the trade
    names, trademarks, service marks, or product names of the Licensor,
    except as required for reasonable and customary use in describing the
    origin of the Work and reproducing the content of the NOTICE file.

7.  Disclaimer of Warranty. Unless required by applicable law or
    agreed to in writing, Licensor provides the Work (and each
    Contributor provides its Contributions) on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
    implied, including, without limitation, any warranties or conditions
    of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
    PARTICULAR PURPOSE. You are solely responsible for determining the
    appropriateness of using or redistributing the Work and assume any
    risks associated with Your exercise of permissions under this License.

8.  Limitation of Liability. In no event and under no legal theory,
    whether in tort (including negligence), contract, or otherwise,
    unless required by applicable law (such as deliberate and grossly
    negligent acts) or agreed to in writing, shall any Contributor be
    liable to You for damages, including any direct, indirect, special,
    incidental, or consequential damages of any character arising as a
    result of this License or out of the use or inability to use the
    Work (including but not limited to damages for loss of goodwill,
    work stoppage, computer failure or malfunction, or any and all
    other commercial damages or losses), even if such Contributor
    has been advised of the possibility of such damages.

9.  Accepting Warranty or Additional Liability. While redistributing
    the Work or Derivative Works thereof, You may choose to offer,
    and charge a fee for, acceptance of support, warranty, indemnity,
    or other liability obligations and/or rights consistent with this
    License. However, in accepting such obligations, You may act only
    on Your own behalf and on Your sole responsibility, not on behalf
    of any other Contributor, and only if You agree to indemnify,
    defend, and hold each Contributor harmless for any liability
    incurred by, or claims asserted against, such Contributor by reason
    of your accepting any such warranty or additional liability.

END OF TERMS AND CONDITIONS
`}
      />
    );
  },
};
