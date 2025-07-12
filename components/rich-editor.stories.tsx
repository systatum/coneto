import { Meta, StoryObj } from "@storybook/react";
import { RichEditor } from "./rich-editor";
import { useState } from "react";
import { RiPrinterFill } from "@remixicon/react";
import { expect, userEvent, within } from "@storybook/test";

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

    const TOOLBAR_RIGHT_PANEL_ACTIONS = (
      <RichEditor.ToolbarButton
        icon={RiPrinterFill}
        onClick={() => {
          console.log(value);
        }}
      >
        Console
      </RichEditor.ToolbarButton>
    );

    return (
      <RichEditor
        onChange={(e) => setValue(e)}
        value={value}
        toolbarRightPanel={TOOLBAR_RIGHT_PANEL_ACTIONS}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const editableDiv = canvas.getByRole("textbox");
    await userEvent.click(editableDiv);
    await userEvent.type(editableDiv, "Hello World");

    await expect(editableDiv).toHaveTextContent("Hello World");

    const boldButton = canvas.getAllByRole("button")[0];
    await userEvent.click(boldButton);

    await userEvent.click(editableDiv);
    await userEvent.type(editableDiv, "{selectall}");

    const italicButton = canvas.getAllByRole("button")[1];
    await userEvent.click(italicButton);
  },
};
