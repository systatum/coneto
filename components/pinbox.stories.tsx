import { Meta, StoryObj } from "@storybook/react";
import { Pinbox, PinboxState } from "./pinbox";
import { useState } from "react";
import { StatefulOnChangeType } from "./stateful-form";

const meta: Meta<typeof Pinbox> = {
  title: "Input Elements/Pinbox",
  component: Pinbox,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Pinbox>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState({ pinbox: "" });

    const PARTS_INPUT: PinboxState[] = [
      { type: "static", text: "S" },
      { type: "digit" },
      { type: "digit" },
      { type: "alphabet" },
      { type: "static", text: "-" },
      { type: "alphabet" },
    ];

    const onChangeValue = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const { name, value } = e.target;
        setValue((prev) => ({ ...prev, [name]: value }));
      }
    };

    return (
      <Pinbox
        label="Default"
        parts={PARTS_INPUT}
        name="pinbox"
        value={value.pinbox}
        onChange={onChangeValue}
      />
    );
  },
};

export const Masked: Story = {
  render: () => {
    const [value, setValue] = useState({ pinbox: "" });

    const PARTS_INPUT: PinboxState[] = [
      { type: "static", text: "S" },
      { type: "alphanumeric" },
      { type: "alphanumeric" },
      { type: "alphanumeric" },
      { type: "static", text: "-" },
      { type: "alphanumeric" },
    ];

    const onChangeValue = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const { name, value } = e.target;
        setValue((prev) => ({ ...prev, [name]: value }));
      }
    };

    return (
      <Pinbox
        label="Masked Mode"
        parts={PARTS_INPUT}
        name="pinbox"
        masked
        value={value.pinbox}
        onChange={onChangeValue}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState({ pinbox: "" });

    const PARTS_INPUT: PinboxState[] = [
      { type: "static", text: "S" },
      { type: "alphanumeric" },
      { type: "alphanumeric" },
      { type: "alphanumeric" },
      { type: "static", text: "-" },
      { type: "alphanumeric" },
    ];

    const onChangeValue = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const { name, value } = e.target;
        setValue((prev) => ({ ...prev, [name]: value }));
      }
    };

    return (
      <Pinbox
        disabled
        label="Disabled"
        parts={PARTS_INPUT}
        name="pinbox"
        errorMessage="Error value"
        value={value.pinbox}
        onChange={onChangeValue}
      />
    );
  },
};

export const Error: Story = {
  render: () => {
    const [value, setValue] = useState({ pinbox: "" });

    const PARTS_INPUT: PinboxState[] = [
      { type: "static", text: "S" },
      { type: "alphanumeric" },
      { type: "alphanumeric" },
      { type: "alphanumeric" },
      { type: "static", text: "-" },
      { type: "alphanumeric" },
    ];

    const onChangeValue = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const { name, value } = e.target;
        setValue((prev) => ({ ...prev, [name]: value }));
      }
    };

    return (
      <Pinbox
        label="Error"
        showError
        parts={PARTS_INPUT}
        name="pinbox"
        errorMessage="Error value"
        value={value.pinbox}
        onChange={onChangeValue}
      />
    );
  },
};
