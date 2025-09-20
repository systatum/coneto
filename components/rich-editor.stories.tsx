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
              wordBreak: "break-all",
            }}
          >
            {printValue}
          </pre>
        )}
      </div>
    );
  },
};

export const WithRef: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [printValue, setPrintValue] = useState("");

    const ref = useRef<RichEditorRef>(null);

    const TIP_MENU_EMAIL = [
      {
        caption: "Duplicate",
        icon: RiFileCopyLine,
        iconColor: "",
        onClick: () => console.log("Phishing reported"),
      },
      {
        caption: "Report Junk",
        icon: RiDeleteBinLine,
        isDangerous: true,
        onClick: () => console.log("Junk reported"),
      },
    ];

    const BADGE_ITEMS = ["Company Name", "Sender Name", "Sender Email"];

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
                  await ref.current?.insertContent(data);
                }}
                key={index}
                withCircle
                caption={data}
              />
            ))}
          </Boxbar>
          <div>
            <Button
              dropdownStyle={css`
                min-width: 200px;
                margin-top: 10px;
              `}
              buttonStyle={css`
                min-height: 40px;
              `}
              toggleStyle={css`
                min-height: 40px;
              `}
              subMenuList={TIP_MENU_EMAIL}
              className="w-fit"
              tipMenu
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
