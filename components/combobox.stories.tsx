import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Combobox, ComboboxActionProps } from "./combobox";
import { OptionsProps } from "./selectbox";
import { RiAddLine } from "@remixicon/react";

const meta: Meta<typeof Combobox> = {
  title: "Input Elements/Combobox",
  component: Combobox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<OptionsProps>({
      text: "",
      value: 0,
    });

    const FRUIT_OPTIONS = [
      { text: "Apple", value: 1 },
      { text: "Banana", value: 2 },
      { text: "Orange", value: 3 },
      { text: "Grape", value: 4 },
      { text: "Pineapple", value: 5 },
      { text: "Strawberry", value: 6 },
      { text: "Watermelon", value: 7 },
    ];

    return (
      <div className="w-64">
        <Combobox
          inputValue={value}
          options={FRUIT_OPTIONS}
          setInputValue={setValue}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState<OptionsProps>({
      text: "",
      value: 0,
    });

    const FRUIT_OPTIONS = [
      { text: "Apple", value: 1 },
      { text: "Banana", value: 2 },
      { text: "Orange", value: 3 },
      { text: "Grape", value: 4 },
      { text: "Pineapple", value: 5 },
      { text: "Strawberry", value: 6 },
      { text: "Watermelon", value: 7 },
      { text: "Mango", value: 8 },
      { text: "Blueberry", value: 9 },
      { text: "Kiwi", value: 10 },
      { text: "Papaya", value: 11 },
      { text: "Cherry", value: 12 },
      { text: "Peach", value: 13 },
      { text: "Plum", value: 14 },
      { text: "Guava", value: 15 },
      { text: "Raspberry", value: 16 },
      { text: "Lychee", value: 17 },
      { text: "Coconut", value: 18 },
      { text: "Pear", value: 19 },
      { text: "Pomegranate", value: 20 },
    ];

    return (
      <div className="w-64">
        <Combobox
          clearable
          inputValue={value}
          options={FRUIT_OPTIONS}
          setInputValue={setValue}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const [value, setValue] = useState<OptionsProps>({
      text: "",
      value: 0,
    });

    const FRUIT_OPTIONS = [
      { text: "Apple", value: 1 },
      { text: "Banana", value: 2 },
      { text: "Orange", value: 3 },
      { text: "Grape", value: 4 },
      { text: "Pineapple", value: 5 },
      { text: "Strawberry", value: 6 },
      { text: "Watermelon", value: 7 },
    ];

    const FRUIT_ACTIONS: ComboboxActionProps[] = [
      {
        title: "Add Fruit",
        onClick: () => {
          console.log(`New fruit added: ${value.text}`);
        },
        icon: RiAddLine,
      },
    ];

    return (
      <div className="w-64">
        <Combobox
          clearable
          actions={FRUIT_ACTIONS}
          inputValue={value}
          options={FRUIT_OPTIONS}
          setInputValue={setValue}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

export const StrictValue: Story = {
  render: () => {
    const [value, setValue] = useState<OptionsProps>({
      text: "",
      value: 0,
    });

    const FRUIT_OPTIONS = [
      { text: "Apple", value: 1 },
      { text: "Banana", value: 2 },
      { text: "Orange", value: 3 },
      { text: "Grape", value: 4 },
      { text: "Pineapple", value: 5 },
      { text: "Strawberry", value: 6 },
      { text: "Watermelon", value: 7 },
    ];

    return (
      <div className="w-64">
        <Combobox
          clearable
          strict
          inputValue={value}
          options={FRUIT_OPTIONS}
          setInputValue={setValue}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};
