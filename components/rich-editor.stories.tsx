import { Meta, StoryObj } from "@storybook/react";
import { RichEditor } from "./rich-editor";
import { useState } from "react";

const meta: Meta<typeof RichEditor> = {
  title: "Input ELements/RichEditor",
  component: RichEditor,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return <RichEditor onChange={(e) => setValue(e)} value={value} />;
  },
};
