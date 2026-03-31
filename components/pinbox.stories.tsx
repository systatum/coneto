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
