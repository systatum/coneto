import { Meta, StoryObj } from "@storybook/react";
import Phonebox from "./phonebox";
import { expect, userEvent, within } from "@storybook/test";
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
    phoneNumber: "",
  },
  render: (args) => {
    const [_, setUpdateArgs] = useArgs();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!e || !("target" in e)) return;
      const { name, value } = e.target;

      setUpdateArgs({ [name]: value });
    };

    return (
      <Phonebox
        {...args}
        phoneNumber={args.phoneNumber}
        onChange={handleChange}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter your phone number");
    await userEvent.type(input, "08123456789", { delay: 80 });

    const dropdownButton = canvas.getByRole("button");
    await userEvent.click(dropdownButton);

    const searchInput = canvas.getByPlaceholderText("Search your country...");
    await userEvent.type(searchInput, "Indonesia", { delay: 80 });

    const countryOption = canvas.getByText("Indonesia");
    await userEvent.click(countryOption);
  },
};

export const DisablePhonebox: Story = {
  args: {
    label: "Phone Number",
    placeholder: "Can't edit",
    phoneNumber: "+1234567890",
    disabled: true,
  },
  render: (args) => <Phonebox {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Can't edit");
    await expect(input).toHaveAttribute("disabled");
  },
};

export const PhoneboxWithError: Story = {
  args: {
    label: "Phone Number",
    placeholder: "Enter phone number",
    phoneNumber: "",
    showError: true,
    errorMessage: "Invalid phone number",
  },
  render: (args) => <Phonebox {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter phone number");
    await userEvent.type(input, "invalid");
  },
};
