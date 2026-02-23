import { Meta, StoryObj } from "@storybook/react";
import { Moneybox } from "./moneybox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent, useState } from "react";
import { css } from "styled-components";
import { Calendar } from "./calendar";
import * as RemixIcons from "@remixicon/react";
import { DropdownOptionProps } from "./field-lane";

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
    styles: {
      control: false,
      description: `
Custom styles for this input component. This object allows you to override styles for individual visual parts:

- **style**: Styles applied to the main input box (border, padding, background, focus ring, etc)
- **containerStyle**: Outer wrapper of the input (layout, spacing, width, alignment)
- **labelStyle**: Label text styling (font, color, spacing, positioning)

Each field accepts a \`CSSProp\` (styled-components compatible) and can be used to customize layout, colors, spacing, and visual appearance without touching component logic.
  `,
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

export const Default: Story = {
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
        label="Default"
        styles={{
          containerStyle: css`
            max-width: 300px;
          `,
        }}
        value={currentArgs.value}
        onChange={onChangeValue}
        separator="dot"
      />
    );
  },
};

export const WithDropdown: Story = {
  render: () => {
    const [value, setValue] = useState({
      selectedText1: "11/12/2025",
      selectedOption1: "11/12/2025",
      selectedText2: "WFH",
      selectedOption2: "2",
      value: "",
    });

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const ATTENDANCE_OPTIONS: DropdownOptionProps[] = [
      {
        text: "On-site",
        value: "1",
        icon: { image: RemixIcons.RiHome2Line },
      },
      {
        text: "WFH",
        value: "2",
        icon: { image: RemixIcons.RiUser2Line },
      },
      {
        text: "Sick leave",
        value: "3",
        icon: { image: RemixIcons.RiSettings2Line },
      },
      {
        text: "Annual leave",
        value: "4",
        icon: { image: RemixIcons.RiLogoutBoxLine },
      },
    ];

    return (
      <Moneybox
        value={value.value}
        label="With Dropdown"
        onChange={(e) =>
          setValue((prev) => ({ ...prev, value: e.target.value }))
        }
        dropdowns={[
          {
            width: "100px",
            caption: value.selectedText1,
            render: ({ render }) =>
              render(
                <Calendar
                  selectedDates={[value.selectedOption1]}
                  monthNames={MONTH_NAMES}
                  setSelectedDates={(date: string[]) =>
                    setValue((prev) => ({
                      ...prev,
                      selectedText1: date[0],
                      selectedOption1: date[0],
                    }))
                  }
                />
              ),
          },
          {
            width: "150px",
            styles: {
              drawerStyle: css`
                width: 300px;
              `,
            },
            caption: value.selectedText2,
            options: ATTENDANCE_OPTIONS,
            onChange: (id) => {
              const selected = ATTENDANCE_OPTIONS.find(
                (item) => item.value === id
              );
              if (selected) {
                setValue((prev) => ({
                  ...prev,
                  selectedOption2: id,
                  selectedText2: selected.text,
                }));
              }
            },
            withFilter: true,
          },
        ]}
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
        styles={{
          containerStyle: css`
            max-width: 300px;
          `,
        }}
        onChange={onChangeValue}
      />
    );
  },
};
