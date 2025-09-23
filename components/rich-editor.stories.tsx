import { Meta, StoryObj } from "@storybook/react";
import { RichEditor } from "./rich-editor";
import { useState } from "react";
import { RiPrinterFill } from "@remixicon/react";

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

    const TOOLBAR_RIGHT_PANEL_ACTIONS = (
      <RichEditor.ToolbarButton
        icon={RiPrinterFill}
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

export const ToolbarPositionBottom: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [printValue, setPrintValue] = useState("");

    const TOOLBAR_RIGHT_PANEL_ACTIONS = (
      <RichEditor.ToolbarButton
        icon={RiPrinterFill}
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
  render: () => {
    const [value, setValue] = useState("");
    const [printValue, setPrintValue] = useState("");

    const TOOLBAR_RIGHT_PANEL_ACTIONS = (
      <RichEditor.ToolbarButton
        icon={RiPrinterFill}
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
1. test [ ]
2. test [x]

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
