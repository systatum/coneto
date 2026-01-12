import { Meta, StoryObj } from "@storybook/react";
import { Moneybox } from "./moneybox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent } from "react";
import { css } from "styled-components";

const meta: Meta<typeof Moneybox> = {
  title: "Input Elements/Moneybox",
  component: Moneybox,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description:
        "The raw numeric value of the input. This value is automatically formatted for display, but `onChange` always emits the unformatted numeric string.",
    },
    currency: {
      control: "text",
      description:
        "The active currency reference from ID currencyOptions (e.g. `IDR`, `USD`) when given editableCurrency. When `editableCurrency` is enabled, this must match one of the provided `currencyOptions`.",
    },
    currencyOptions: {
      control: "object",
      description:
        "List of available currencies when `editableCurrency` is enabled. Each item must contain `{ id, name, symbol }`.",
      table: {
        type: {
          summary: "CurrencyOptionsProps[]",
          detail: `{ id: string; name: string; symbol: string }[]`,
        },
      },
    },
    editableCurrency: {
      control: "boolean",
      description:
        "Enables the currency selector button. When enabled, users can pick a currency from `currencyOptions`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    separator: {
      control: { type: "radio" },
      options: ["comma", "dot"],
      description:
        "Controls number formatting style. `comma` formats as `1,234.56`, `dot` formats as `1.234,56`.",
      table: {
        defaultValue: { summary: "comma" },
      },
    },
    label: {
      control: "text",
      description: "Optional label displayed above the input.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the input.",
    },
    showError: {
      control: "boolean",
      description:
        "Displays the error state. When true, the input border turns red and `errorMessage` is shown.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    errorMessage: {
      control: "text",
      description: "Error message shown when `showError` is true.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the input and prevents user interaction.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    name: {
      control: "text",
      description: "Name of the input. Used in the emitted `onChange` event.",
    },
    onChange: {
      action: "changed",
      description:
        "Called when the value or currency changes. Emits a synthetic event with `{ target: { name, value } }`.",
      table: {
        type: { summary: "(e: ChangeEvent<HTMLInputElement>) => void" },
      },
    },
    onKeyDown: {
      action: "keyDown",
      description: "Keyboard event handler for the input field.",
    },
    style: {
      control: "object",
      description:
        "Custom styles for the main input box (border, padding, background, etc).",
    },
    containerStyle: {
      control: "object",
      description: "Custom styles for the outer container.",
    },
    labelStyle: {
      control: "object",
      description: "Custom styles for the label.",
    },
    inputMode: {
      control: "text",
      description:
        "Native inputMode. Defaults to `decimal` for numeric keyboards on mobile.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Moneybox>;

export const WithCurrencyOptions: Story = {
  args: {
    value: "2000",
    name: "value",
    currency: "USD",
    editableCurrency: true,
    currencyOptions: [
      { id: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
      { id: "USD", name: "US Dollar", symbol: "$" },
      { id: "EUR", name: "Euro", symbol: "€" },
      { id: "JPY", name: "Japanese Yen", symbol: "¥" },
      { id: "GBP", name: "British Pound", symbol: "£" },
      { id: "SGD", name: "Singapore Dollar", symbol: "$" },
      { id: "AUD", name: "Australian Dollar", symbol: "$" },
      { id: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
      { id: "KRW", name: "South Korean Won", symbol: "₩" },
      { id: "CNY", name: "Chinese Yuan", symbol: "¥" },
    ],
  },
  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();
    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUpdateArgs({ ...currentArgs, [name]: value });
    };
    return (
      <Moneybox
        {...args}
        style={css`
          max-width: 300px;
        `}
        value={currentArgs.value}
        onChange={onChangeValue}
        separator="dot"
      />
    );
  },
};

export const WithLabel: Story = {
  args: {
    value: "2000",
    name: "value",
    currency: "$",
    separator: "dot",
    label: "Money",
  },
  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();
    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUpdateArgs({ ...currentArgs, [name]: value });
    };
    return (
      <Moneybox
        {...args}
        style={css`
          max-width: 300px;
        `}
        value={currentArgs.value}
        onChange={onChangeValue}
      />
    );
  },
};

export const ErrorState: Story = {
  args: {
    name: "value",
    currency: "$",
    separator: "dot",
    label: "Money",
    value: "",
    showError: true,
    errorMessage: "Invalid amount",
  },

  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const cleanedValue = value.toString().replace(/[.,]/g, "");
      const isValid = cleanedValue.length >= 4;

      setUpdateArgs({
        ...currentArgs,
        [name]: value,
        showError: !isValid,
        errorMessage: !isValid ? "Minimum numbers 4 digit are allowed" : "",
      });
    };

    return (
      <Moneybox
        {...args}
        style={css`
          max-width: 300px;
        `}
        onChange={onChangeValue}
      />
    );
  },
};
