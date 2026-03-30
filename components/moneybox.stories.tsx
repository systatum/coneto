import { Meta, StoryObj } from "@storybook/react";
import { Moneybox } from "./moneybox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent, useState } from "react";
import { css } from "styled-components";
import { Calendar } from "./calendar";
import * as RemixIcons from "@remixicon/react";
import { FieldLaneDropdownsOptionProps } from "./field-lane";

const meta: Meta<typeof Moneybox> = {
  title: "Input Elements/Moneybox",
  component: Moneybox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Moneybox** 💰 is a flexible numeric input component with optional currency support.  
It allows formatted numeric input with comma/dot separators, an editable currency dropdown, error handling, labels, placeholders, and full style customization.

---

### ✨ Features
- 💵 **Formatted numeric input**: Supports comma/dot separators for thousands and decimals
- 💱 **Editable currency**: Optional dropdown to select currency from \`currencyOptions\`
- ❌ **Error state**: Visual feedback with customizable error message
- 🏷 **Label support**: Optional label above the input
- 🖊 **Placeholder & helper**: Guides users on expected input
- 🎨 **Customizable styles**: Override input, container, and label styles
- 📱 **Mobile-friendly**: \`inputMode="decimal"\` by default for numeric keyboards

---

### 🛠 Usage

\`\`\`tsx
<Moneybox
  name="amount"
  value="123456.78"
  placeholder="Enter amount"
  currency="IDR"
  editableCurrency
  currencyOptions={[
    { id: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
    { id: "USD", name: "US Dollar", symbol: "$" },
  ]}
  separator="comma"
  showError={false}
  onChange={(e) => console.log(e.target.name, e.target.value)}
  styles={{
    self: css\`font-size: 14px; color: #111;\`,
    inputWrapperStyle: css\`border-radius: 4px;\`,
  }}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
      description:
        "The raw numeric value of the input. Formatted visually, but `onChange` emits the unformatted string.",
    },
    currency: {
      control: "text",
      description:
        "Active currency (e.g., `IDR`, `USD`). Used with `editableCurrency`. Must match one of `currencyOptions` if editable.",
    },
    currencyOptions: {
      control: "object",
      description:
        "Available currencies when `editableCurrency` is enabled. Each item: `{ id, name, symbol }`.",
      table: {
        type: {
          summary: "CurrencyOptionProps[]",
          detail: `{ id: string; name: string; symbol: string }[]`,
        },
      },
    },
    editableCurrency: {
      control: "boolean",
      description:
        "Enable the currency dropdown selector. Users can pick a currency from `currencyOptions`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    separator: {
      control: { type: "radio" },
      options: ["comma", "dot"],
      description:
        "Number formatting style. `comma` → `1,234.56`, `dot` → `1.234,56`.",
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
      description: "Placeholder text for the input field.",
    },
    showError: {
      control: "boolean",
      description:
        "Enable error state. Input border turns red and `errorMessage` is shown.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    errorMessage: {
      control: "text",
      description: "Error message displayed when `showError` is true.",
    },
    disabled: {
      control: "boolean",
      description: "Disables input and prevents user interaction.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    name: {
      control: "text",
      description: "Input name. Used in the `onChange` synthetic event.",
    },
    onChange: {
      action: "changed",
      description:
        "Called when value or currency changes. Emits `{ target: { name, value } }`.",
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
Custom styles for the component:

- **self**: Styles for the input itself
- **inputWrapperStyle**: Styles for the input container
- Can override layout, colors, spacing, and appearance without touching logic
      `,
    },
    inputMode: {
      control: "text",
      description:
        "Native inputMode attribute for mobile keyboards. Defaults to `decimal` for numeric input.",
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

    const ATTENDANCE_OPTIONS: FieldLaneDropdownsOptionProps[] = [
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
        currency="Rp"
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
                  onChange={(date: string[]) =>
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
