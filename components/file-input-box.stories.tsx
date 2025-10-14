import { Meta, StoryObj } from "@storybook/react/";
import { useState } from "react";
import { FileInputBox } from "./file-input-box";

const meta: Meta<typeof FileInputBox> = {
  title: "Input Elements/FileInputBox",
  component: FileInputBox,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FileInputBox>;

export const Default: Story = {
  render: () => {
    const [, setValue] = useState();
    const onChangeValue = (e) => {
      setValue(e);
    };
    return <FileInputBox onFileSelected={onChangeValue} />;
  },
};
