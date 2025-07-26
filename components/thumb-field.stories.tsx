import { Meta, StoryObj } from "@storybook/react";
import { ThumbField } from "./thumb-field";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent } from "react";

const meta: Meta<typeof ThumbField> = {
  title: "Input Elements/ThumbField",
  component: ThumbField,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ThumbField>;

export const Default: Story = {
  args: {
    value: null,
    name: "value",
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUpdateArgs({ ...args, [name]: value });
    };

    return <ThumbField {...args} onChange={onChangeValue} />;
  },
};

export const WithLabel: Story = {
  args: {
    label: "Would you recommend this employer?",
    value: null,
    name: "value",
    containerClassName: "text-sm font-mono",
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUpdateArgs({ ...args, [name]: value });
    };

    return <ThumbField {...args} onChange={onChangeValue} />;
  },
};

export const WithError: Story = {
  args: {
    label: "How would you rate this employee’s performance?",
    value: null,
    name: "value",
    containerClassName: "text-sm font-medium",
    showError: true,
    errorMessage: "This field is required",
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      const isValidValue = value !== null;
      setUpdateArgs({
        value: value,
        showError: !isValidValue,
        errorMessage: isValidValue ? "" : "This field is required",
      });
    };

    return <ThumbField {...args} onChange={onChangeValue} />;
  },
};
