import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pinbox, PinboxState } from "./pinbox";
import { StatefulOnChangeType } from "./stateful-form";

const meta: Meta<typeof Pinbox> = {
  title: "Input Elements/Pinbox",
  component: Pinbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Pinbox** is a multi-part input component used for entering codes, PINs, OTPs, or other structured sequences. It supports having static characters, pasting value from clipboard, as well as keyboard navigation among other things.

---

### ✨ Features
- 🔢 **Multi-part input**: Each character or block is a separate input for better control.
- 👁️ **Masked input**: Optionally mask sensitive characters.
- ⌨️ **Keyboard navigation**: Supports arrow keys, backspace, and tab to move between inputs.
- ⚠️ **Error states**: Visual indication for invalid input.
- 📝 **Helper text**: Supports extra helper text under the input.
- 🔧 **Custom styles**: Styles for the wrapper, inputs, and error indicators.
- 🧩 First-class **stateful form integration**
        `,
      },
    },
  },
  argTypes: {
    fontSize: {
      control: "number",
      description: "Font size for input characters.",
    },
    label: { control: "text", description: "Label for the pinbox field." },
    helper: {
      control: "text",
      description: "Helper text displayed below the input.",
    },
    showError: {
      control: "boolean",
      description: "Whether to show the error state.",
    },
    errorMessage: {
      control: "text",
      description: "Error message text to display.",
    },
    masked: {
      control: "boolean",
      description: "Masks characters with a bullet after typing.",
    },
    parts: {
      control: false,
      description:
        "Defines each input part with type and optional static text.",
    },
    name: {
      control: "text",
      description: "Name attribute for the input fields.",
    },
    onChange: {
      action: "changed",
      description: "Callback fired when the input value changes.",
    },
    onBlur: {
      action: "blur",
      description: "Callback fired when focus leaves the pinbox.",
    },
    value: { control: "text", description: "Controlled value of the pinbox." },
    disabled: {
      control: "boolean",
      description: "Disables all input interactions.",
    },
    id: {
      control: "text",
      description: "Base id for inputs, used to generate individual input ids.",
    },
    required: {
      control: "boolean",
      description: "Marks the pinbox as required.",
    },
    styles: {
      control: false,
      description: "Custom styles for wrapper, inputs, and indicators.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Pinbox>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");

    const PARTS_INPUT: PinboxState[] = [
      { type: "static", text: "S" },
      { type: "alphanumeric" },
      { type: "digit" },
      { type: "alphabet" },
      { type: "static", text: "-" },
      { type: "alphabet" },
    ];

    return (
      <Pinbox
        label="Default"
        parts={PARTS_INPUT}
        name="pinbox"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const Masked: Story = {
  render: () => {
    const [value, setValue] = useState("");

    const PARTS_INPUT: PinboxState[] = [
      { type: "static", text: "S" },
      { type: "alphanumeric" },
      { type: "alphanumeric" },
      { type: "alphanumeric" },
      { type: "static", text: "-" },
      { type: "alphanumeric" },
    ];

    return (
      <Pinbox
        label="Masked Mode"
        parts={PARTS_INPUT}
        name="pinbox"
        masked
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState("");

    const PARTS_INPUT: PinboxState[] = [
      { type: "static", text: "S" },
      { type: "alphanumeric" },
      { type: "alphanumeric" },
      { type: "alphanumeric" },
      { type: "static", text: "-" },
      { type: "alphanumeric" },
    ];

    return (
      <Pinbox
        disabled
        label="Disabled"
        parts={PARTS_INPUT}
        name="pinbox"
        errorMessage="Error value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const Error: Story = {
  render: () => {
    const [value, setValue] = useState("");

    const PARTS_INPUT: PinboxState[] = [
      { type: "static", text: "S" },
      { type: "alphanumeric" },
      { type: "alphanumeric" },
      { type: "alphanumeric" },
      { type: "static", text: "-" },
      { type: "alphanumeric" },
    ];

    return (
      <Pinbox
        label="Error"
        showError
        parts={PARTS_INPUT}
        name="pinbox"
        errorMessage="Error value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};
