import { Meta, StoryObj } from "@storybook/react";
import { Colorbox } from "./colorbox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent, useState } from "react";
import { css } from "styled-components";
import { FieldLaneDropdownsOptionProps } from "./field-lane";
import * as RemixIcons from "@remixicon/react";

const meta: Meta<typeof Colorbox> = {
  title: "Input Elements/Colorbox",
  component: Colorbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Colorbox** is a color picker input having both visual color preview and hexadecimal text input.

---

### ✨ Features
- 👀 **Visual color preview** along with hex input
- 🔁 Supports **real-time color changes** via typing or selecting
- 🚫 **Disabled state** to prevent interaction
- 🛠 Shows **error state** with custom message and styling
- 🎨 Fully **customizable styles**
- 🧩 First-class stateful form integration

---

### ⚙️ Behavior
- Updates color value on both color picker and text input
- Automatically prepends '#' in hex input
- Debounces onChange updates to improve performance
- Handles focus/hover interactions for UI highlighting
- Integrates with **FieldLane** for consistent layout, label, and helper text

---

### 📌 Usage Guidelines
- Use for selecting colors in forms, design tools, or settings
- Combine with **labels, helper text, and error messages** for clarity
- Override default styling using the \`styles\` prop
- Works with controlled components via \`value\` and \`onChange\`

---
        `,
      },
    },
  },
  argTypes: {
    value: {
      description: "Current color value in hex format (e.g. `#FF5733`).",
    },
    onChange: {
      description: "Callback triggered when the color value changes.",
    },
    placeholder: {
      description: "Placeholder text for the hex input field.",
    },
    disabled: {
      description: "Disables interaction with the Colorbox input.",
    },
    name: {
      description: "Name attribute of the underlying input element.",
    },
    label: {
      description: "Label displayed above the Colorbox input.",
    },
    showError: {
      description: "Displays error state styling and icon.",
    },
    errorMessage: {
      description: "Message displayed when `showError` is true.",
    },
    onClick: {
      description:
        "Triggered when the color input is clicked or loses focus after interaction.",
    },
    styles: {
      control: false,
      description: `
Custom styles for the Colorbox component.

Available fields:

- **self** → Main input container wrapping the color preview and text input
- **containerStyle** → Outer wrapper (via FieldLane)
- **labelStyle** → Label text

All fields accept \`CSSProp\` and can be used to customize layout, spacing, borders, colors, and typography.
      `,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Colorbox>;

export const Default: Story = {
  args: {
    color: "#ffffff",
  },
  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();
    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setUpdateArgs({ ...currentArgs, [name]: value });
    };

    return (
      <Colorbox
        styles={{
          containerStyle: css`
            max-width: 300px;
          `,
        }}
        {...args}
        label="Color"
        value={args.color}
        name="color"
        onChange={onChangeValue}
      />
    );
  },
};

export const WithDropdown: Story = {
  render: () => {
    const [inputValue, setInputValue] = useState({
      selectedText: "WFH",
      selectedOption: "1",
      value: "",
    });

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
      <Colorbox
        styles={{
          containerStyle: css`
            max-width: 700px;
          `,
        }}
        placeholder="Add color"
        dropdowns={[
          {
            width: "110px",
            styles: {
              drawerStyle: css`
                width: 300px;
              `,
            },
            caption: inputValue.selectedText,
            options: ATTENDANCE_OPTIONS,
            onChange: (id) => {
              const selected = ATTENDANCE_OPTIONS.find(
                (item) => item.value === id
              );
              if (selected) {
                setInputValue((prev) => ({
                  ...prev,
                  selectedOption: id,
                  selectedText: selected.text,
                }));
              }
            },
            withFilter: true,
          },
        ]}
        label="Color"
        value={inputValue.value}
        name="color"
        onChange={(e) =>
          setInputValue((prev) => ({ ...prev, value: e.target.value }))
        }
      />
    );
  },
};

export const WithError: Story = {
  args: {
    color: "#zzzzzz",
    showError: true,
    errorMessage: "Invalid color value.",
  },
  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();

    function isValidHexColor(value: string): boolean {
      const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
      return hexRegex.test(value);
    }

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      const isValidHex = isValidHexColor(value);
      setUpdateArgs({
        ...currentArgs,
        [name]: value,
        showError: !isValidHex,
        errorMessage: isValidHex ? "" : "Invalid color value.",
      });
    };

    return (
      <Colorbox
        styles={{
          containerStyle: css`
            max-width: 300px;
          `,
        }}
        {...args}
        label="Color"
        value={args.color}
        name="color"
        onChange={onChangeValue}
      />
    );
  },
};
