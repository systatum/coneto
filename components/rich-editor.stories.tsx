import { Meta, StoryObj } from "@storybook/react";
import { RichEditor, RichEditorRef } from "./rich-editor";
import { useRef, useState } from "react";
import {
  RiDeleteBinLine,
  RiFileCopyLine,
  RiPrinterFill,
} from "@remixicon/react";
import { Button } from "./button";
import { css } from "styled-components";
import { Boxbar } from "./boxbar";
import { Badge } from "./badge";

const meta: Meta<typeof RichEditor> = {
  title: "Input Elements/RichEditor",
  component: RichEditor,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `

✍️ A lightweight Markdown-compatible rich text editor using \`contentEditable\` div, Remix Icons, and inline HTML/Markdown conversion.

- Supports bold, italic, ordered/unordered list, and headings
- Supports checklists with \`[]\` (unchecked) and \`[x]\` (checked)
- Uses custom turndown rules for markdown conversion
- Includes a floating tip menu for H1–H3 heading options
- Optional right-panel toolbar 
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
    const BADGE_ITEMS = [
      {
        title: "Markdown Example",
        content: `### Hello there!
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit voluptate velit.

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
            containerStyle={css`
              width: 100%;
            `}
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
    const [value, setValue] = useState(
      `### Hello there!
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit voluptate velit.

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
              background: "#D3D3D3",
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
