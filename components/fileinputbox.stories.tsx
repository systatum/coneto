import { Meta, StoryObj } from "@storybook/react/";
import FileInputBox from "./fileinputbox";
import { useState } from "react";

const meta: Meta<typeof FileInputBox> = {
  title: "Input Elements/FileInputBox",
  component: FileInputBox,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FileInputBox>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState();
    const onChangeValue = (e) => {
      setValue(e);
    };
    console.log(value);
    return <FileInputBox onFilesSelected={onChangeValue} />;
  },
};
