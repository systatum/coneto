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
  argTypes: {
    selectionOptions: {
      control: "text",
      description: "Currently selected value of the combobox. Example: [5, 6]",
    },
    setSelectionOptions: {
      control: false,
      description:
        "Callback function to update selectionOptions. Should not be controlled directly in Storybook.",
    },
    options: {
      control: "object",
      description:
        "Array of available options. Each option has text and value properties.",
    },
    clearable: {
      control: "boolean",
      description: "Show a clear button to reset selectionOptions.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when selectionOptions is empty.",
    },
    emptySlate: {
      control: "text",
      description: "Text to display when no options are available.",
    },
    highlightOnMatch: {
      control: "boolean",
      description:
        "Highlight matching option automatically when selectionOptions matches.",
    },
    strict: {
      control: "boolean",
      description: "Restrict input to only values that exist in options.",
    },
    label: {
      control: "text",
      description: "Label displayed above the input field.",
    },
    containerStyle: {
      control: "object",
      description: "Custom CSS style for the wrapper.",
    },
    selectboxStyle: {
      control: "object",
      description: "Custom CSS style for the input/select area.",
    },
    labelStyle: {
      control: "object",
      description: "Custom CSS style for the label element.",
    },
    actions: {
      control: "object",
      description:
        "Array of actions displayed at the top of dropdown. Each action has { title, icon, onClick, style }.",
    },
    showError: {
      control: "boolean",
      description: "Whether to show an error message below the input.",
    },
    errorMessage: {
      control: "text",
      description: "Text content of the error message.",
    },
    onKeyDown: {
      control: false,
      description: "Keyboard event handler for input field.",
    },
    onClick: {
      control: false,
      description: "Callback triggered when an option or action is clicked.",
    },
    name: {
      control: "text",
      description: "Name/id used for accessibility and aria-label.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);

    const FRUIT_OPTIONS: OptionsProps[] = [
      { text: "Apple", value: "1" },
      { text: "Banana", value: "2" },
      { text: "Orange", value: "3" },
      { text: "Grape", value: "4" },
      { text: "Pineapple", value: "5" },
      { text: "Strawberry", value: "6" },
      { text: "Watermelon", value: "7" },
    ];

    return (
      <div
        style={{
          width: "256px",
        }}
      >
        <Combobox
          selectionOptions={value}
          options={FRUIT_OPTIONS}
          setSelectionOptions={setValue}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);

    const FRUIT_OPTIONS = [
      { text: "Apple", value: "1" },
      { text: "Banana", value: "2" },
      { text: "Orange", value: "3" },
      { text: "Grape", value: "4" },
      { text: "Pineapple", value: "5" },
      { text: "Strawberry", value: "6" },
      { text: "Watermelon", value: "7" },
      { text: "Mango", value: "8" },
      { text: "Blueberry", value: "9" },
      { text: "Kiwi", value: "10" },
      { text: "Papaya", value: "11" },
      { text: "Cherry", value: "12" },
      { text: "Peach", value: "13" },
      { text: "Plum", value: "14" },
      { text: "Guava", value: "15" },
      { text: "Raspberry", value: "16" },
      { text: "Lychee", value: "17" },
      { text: "Coconut", value: "18" },
      { text: "Pear", value: "19" },
      { text: "Pomegranate", value: "20" },
    ];

    return (
      <div
        style={{
          width: "256px",
        }}
      >
        <Combobox
          clearable
          selectionOptions={value}
          options={FRUIT_OPTIONS}
          setSelectionOptions={setValue}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);

    const FRUIT_OPTIONS: OptionsProps[] = [
      { text: "Apple", value: "1" },
      { text: "Banana", value: "2" },
      { text: "Orange", value: "3" },
      { text: "Grape", value: "4" },
      { text: "Pineapple", value: "5" },
      { text: "Strawberry", value: "6" },
      { text: "Watermelon", value: "7" },
    ];

    const FRUIT_ACTIONS: ComboboxActionProps[] = [
      {
        title: "Add Fruit",
        onClick: () => {
          console.log(`New fruit added: ${value}`);
        },
        icon: RiAddLine,
      },
    ];

    return (
      <div
        style={{
          width: "256px",
        }}
      >
        <Combobox
          clearable
          actions={FRUIT_ACTIONS}
          selectionOptions={value}
          options={FRUIT_OPTIONS}
          setSelectionOptions={setValue}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

export const StrictValue: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);

    const FRUIT_OPTIONS: OptionsProps[] = [
      { text: "Apple", value: "1" },
      { text: "Banana", value: "2" },
      { text: "Orange", value: "3" },
      { text: "Grape", value: "4" },
      { text: "Pineapple", value: "5" },
      { text: "Strawberry", value: "6" },
      { text: "Watermelon", value: "7" },
    ];

    const FRUIT_ACTIONS: ComboboxActionProps[] = [
      {
        title: "Add Fruit",
        onClick: () => {
          console.log(`New fruit added: ${value}`);
        },
        icon: RiAddLine,
      },
    ];

    return (
      <div
        style={{
          width: "256px",
        }}
      >
        <Combobox
          clearable
          strict
          actions={FRUIT_ACTIONS}
          selectionOptions={value}
          options={FRUIT_OPTIONS}
          setSelectionOptions={setValue}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

export const MultipleSelection: Story = {
  render: () => {
    const [value1, setValue1] = useState<string[]>([]);
    const [value2, setValue2] = useState<string[]>([]);

    const FRUIT_ACTIONS: ComboboxActionProps[] = [
      {
        title: "Add Fruit",
        onClick: () => {
          console.log(`New fruit added`);
        },
        icon: RiAddLine,
      },
    ];

    const FRUIT_OPTIONS = [
      { text: "Apple", value: "1" },
      { text: "Banana", value: "2" },
      { text: "Orange", value: "3" },
      { text: "Grape", value: "4" },
      { text: "Pineapple", value: "5" },
      { text: "Strawberry", value: "6" },
      { text: "Watermelon", value: "7" },
      { text: "Mango", value: "8" },
      { text: "Blueberry", value: "9" },
      { text: "Kiwi", value: "10" },
      { text: "Papaya", value: "11" },
      { text: "Cherry", value: "12" },
      { text: "Peach", value: "13" },
      { text: "Plum", value: "14" },
      { text: "Guava", value: "15" },
      { text: "Raspberry", value: "16" },
      { text: "Lychee", value: "17" },
      { text: "Coconut", value: "18" },
      { text: "Pear", value: "19" },
      { text: "Pomegranate", value: "20" },
    ];

    return (
      <div
        style={{
          width: "256px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Combobox
          multiple
          clearable
          selectionOptions={value1}
          options={FRUIT_OPTIONS}
          setSelectionOptions={setValue1}
          placeholder="Select a fruit..."
        />
        <Combobox
          multiple
          clearable
          actions={FRUIT_ACTIONS}
          selectionOptions={value2}
          options={FRUIT_OPTIONS}
          setSelectionOptions={setValue2}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};
