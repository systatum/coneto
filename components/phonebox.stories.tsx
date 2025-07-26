import { Meta, StoryObj } from "@storybook/react";
import { Phonebox } from "./phonebox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent } from "react";

const meta: Meta = {
  title: "Input Elements/Phonebox",
  component: Phonebox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "changed" },
    phoneNumber: {
      control: "text",
      description: "The current phone number value",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '""' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Phonebox>;

export const DefaultPhonebox: Story = {
  args: {
    label: "Phone Number",
    placeholder: "Enter your phone number",
    value: "",
  },
  render: (args) => {
    const [_, setUpdateArgs] = useArgs();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!e || !("target" in e)) return;
      const { name, value } = e.target;

      setUpdateArgs({ [name]: value });
    };

    return <Phonebox {...args} value={args.value} onChange={handleChange} />;
  },
};

export const DisablePhonebox: Story = {
  args: {
    label: "Phone Number",
    placeholder: "Can't edit",
    value: "+1234567890",
    disabled: true,
  },
  render: (args) => <Phonebox {...args} />,
};

export const PhoneboxWithError: Story = {
  args: {
    label: "Phone Number",
    placeholder: "Enter phone number",
    value: "",
    showError: true,
    errorMessage: "Invalid phone number",
  },
  render: (args) => <Phonebox {...args} />,
};
