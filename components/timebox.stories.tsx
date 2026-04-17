import * as RemixIcons from "@remixicon/react";
import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react";
import { ChangeEvent, useEffect, useState } from "react";
import { css } from "styled-components";
import { Timebox, TimeboxDropdownOption } from "./timebox";

const meta: Meta<typeof Timebox> = {
  title: "Input Elements/Timebox",
  component: Timebox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Timebox** is a time input component allowing users to enter hours, minutes, and optionally seconds.
It supports smart focus navigation, editable/non-editable modes, and error display.

---

### ✨ Features
- 🕒 **Hour & Minute Input**: Users can input hours and minutes, optionally seconds.
- ⏱ **withSeconds**: Enables second input for precise time selection.
- 🎯 **Smart Focus**: Automatically moves focus to the next field when needed.
- ⚠️ **Error Handling**: Shows error styling when \`showError\` is true.
- 🔒 **Editable Mode**: Can be read-only when \`editable\` is false.
- 🎨 **Custom Styling**: Fully customizable via \`styles\` prop.
- 🧩 First-class **stateful form integration**

---

### 📌 Usage

\`\`\`tsx
<Timebox
  name="startTime"
  label="Start Time"
  value="08:30"
  withSeconds
  editable
  showError={false}
  placeholder={{ hour: "HH", minute: "MM", second: "SS" }}
  onChange={(e) => console.log(e.target.value)}
  styles={{
    self: css\`border-color: blue;\`,
    inputWrapperStyle: css\`background: #f0f0f0;\`,
  }}
/>
\`\`\`

- Use \`withSeconds\` to enable seconds input.
- Use \`editable={false}\` to make the input read-only.
- Use \`styles\` to customize input and wrapper styling.
- The \`onChange\` callback returns a formatted string \`HH:MM:SS\`.
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
      description: "Current time value in HH:MM or HH:MM:SS format.",
    },
    name: {
      control: "text",
      description: "Name attribute for the input (useful in forms).",
    },
    label: {
      control: "text",
      description: "Label text displayed above the input.",
    },
    withSeconds: {
      control: "boolean",
      description: "Enable seconds input field for precise time selection.",
    },
    editable: {
      control: "boolean",
      description: "Determines whether the input is editable.",
    },
    showError: {
      control: "boolean",
      description: "If true, shows error styling around the input.",
    },
    errorMessage: {
      control: "text",
      description: "Error message displayed when showError is true.",
    },
    placeholder: {
      control: "object",
      description:
        "Placeholder for each field. Example: { hour: 'HH', minute: 'MM', second: 'SS' }",
    },
    styles: {
      control: false,
      description:
        "Custom styles for the input and wrapper. Can define self and inputWrapperStyle.",
    },
    disabled: {
      control: "boolean",
      description: "If true, disables all fields and makes them non-editable.",
    },
    actions: {
      control: false,
      description:
        "Action buttons displayed inside the input. Optional, usually empty for Timebox.",
    },
    onChange: {
      action: "time changed",
      description:
        "Callback triggered when time changes. Returns event with target.value as HH:MM or HH:MM:SS.",
    },
    onKeyDown: {
      control: false,
      description:
        "Custom keydown handler. Useful for intercepting navigation keys or custom behavior.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timebox>;

export const Default: Story = {
  args: {
    label: "Timebox",
    withSeconds: false,
  },
  render: (args) => {
    const [value, setValue] = useState({ timebox: "" });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setValue((prev) => ({ ...prev, [name]: value }));
    };

    return (
      <Timebox
        {...args}
        value={value.timebox}
        name="timebox"
        onChange={onChangeValue}
      />
    );
  },
};

export const WithSeconds: Story = {
  args: {
    label: "Timebox With Seconds",
    withSeconds: true,
  },
  render: (args) => {
    const [, setValue] = useState({ timebox: "" });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setValue((prev) => ({ ...prev, [name]: value }));
    };

    return <Timebox {...args} onChange={onChangeValue} />;
  },
};

export const WithDropdown: Story = {
  render: () => {
    const [value, setValue] = useState({
      selectedText: "WFH",
      selectedOption: "2",
      value: "",
    });

    const ATTENDANCE_OPTIONS: TimeboxDropdownOption[] = [
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
      <Timebox
        label="With Dropdowns"
        value={value.value}
        onChange={(e) =>
          setValue((prev) => ({ ...prev, value: e.target.value }))
        }
        dropdowns={[
          {
            width: "120px",
            styles: {
              drawerStyle: css`
                width: 300px;
              `,
            },
            caption: value.selectedText,
            options: ATTENDANCE_OPTIONS,
            onChange: (id) => {
              const selected = ATTENDANCE_OPTIONS.find(
                (option) => option.value === id
              );
              if (selected) {
                setValue((prev) => ({
                  ...prev,
                  selectedOption: id,
                  selectedText: selected.text,
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

export const WithLiveTime: Story = {
  args: {
    label: "Timebox Live Time",
    withSeconds: true,
    editable: false,
  },
  render: (args) => {
    function formatTime(date: Date): string {
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    }

    const now = new Date();
    const [time, setTime] = useState(formatTime(now));

    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        setTime(formatTime(now));
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    return <Timebox {...args} value={time} />;
  },
};

export const WithError: Story = {
  args: {
    withSeconds: true,
    label: "With Error",
    showError: true,
    name: "value",
    errorMessage: "This field is required",
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    function isValidTime(value: string): boolean {
      const validatorRegex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
      return validatorRegex.test(value);
    }

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      const isValidValue = isValidTime(value);
      setUpdateArgs({
        value: value,
        showError: !isValidValue,
        errorMessage: isValidValue ? "" : "This field is required",
      });
    };

    return <Timebox {...args} onChange={onChangeValue} />;
  },
};
