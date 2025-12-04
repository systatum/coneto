import { Meta, StoryObj } from "@storybook/react/";
import { useEffect, useState } from "react";
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
    const onFilesSelected = (e) => {
      setValue(e);
    };
    return <FileInputBox multiple onFilesSelected={onFilesSelected} />;
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState<File[]>([]);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
      if (value.length > 0) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }, [value]);

    const onFilesSelected = (e) => {
      setValue(e);
    };
    return (
      <FileInputBox
        multiple
        showError={isValid}
        errorMessage="At least one file is required"
        onFilesSelected={onFilesSelected}
      />
    );
  },
};
