import { Meta, StoryObj } from "@storybook/react";
import Phonebox, { PhoneboxProps } from "./phonebox";
import { CountryCodeProps } from "./phonebox";
import { expect, userEvent, within } from "@storybook/test";
import { useArgs } from "@storybook/preview-api";

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

type OnChangeHandler = (
  field: "phone_number" | "country_code",
  value: string | CountryCodeProps
) => void;

const PhoneboxContent = (
  args: PhoneboxProps & { onChange: OnChangeHandler }
) => {
  return <Phonebox {...args} />;
};

export const DefaultPhonebox: Story = {
  args: {
    label: "Phone Number",
    placeholder: "Enter your phone number",
    phoneNumber: "",
  },
  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();

    const handleChange = (
      field: "phone_number" | "country_code",
      value: string | CountryCodeProps
    ) => {
      if (field === "phone_number") {
        setUpdateArgs({ ...currentArgs, phoneNumber: value });
      } else if (field === "country_code") {
        setUpdateArgs({ ...currentArgs, selectedCountry: value });
      }

      if (args.onChange) {
        args.onChange(field, value);
      }
    };
    return (
      <PhoneboxContent
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
  render: PhoneboxContent,
  args: {
    label: "Phone Number",
    placeholder: "Can't edit",
    phoneNumber: "+1234567890",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Can't edit");
    await expect(input).toHaveAttribute("disabled");
  },
};

export const PhoneboxWithError: Story = {
  render: PhoneboxContent,
  args: {
    label: "Phone Number",
    placeholder: "Enter phone number",
    phoneNumber: "",
    showError: true,
    errorMessage: "Invalid phone number",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter phone number");
    await userEvent.type(input, "invalid");
  },
};
