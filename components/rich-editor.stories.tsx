import { Meta, StoryObj } from "@storybook/react";
import { RichEditor } from "./rich-editor";
import { useState } from "react";
import { RiPrinterFill } from "@remixicon/react";

const meta: Meta<typeof RichEditor> = {
  title: "Input Elements/RichEditor",
  component: RichEditor,
  tags: ["autodocs"],
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
        Print Content
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
};
