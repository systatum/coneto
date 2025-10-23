import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Combobox, ComboboxActionProps } from "./combobox";
import { OptionsProps } from "./selectbox";
import { RiAddLine } from "@remixicon/react";
import styled from "styled-components";

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
          label="Default"
          multiple
          clearable
          selectionOptions={value1}
          options={FRUIT_OPTIONS}
          setSelectionOptions={setValue1}
          placeholder="Select a fruit..."
        />
        <Combobox
          label="With Maximal Items"
          multiple
          clearable
          maxSelectableItems={2}
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

export const WithDisplay: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);

    const FRUIT_OPTIONS: OptionsProps[] = [
      {
        text: "Apple",
        value: "1",
        render: (
          <FruitDisplay
            title="Apple"
            description="A sweet red fruit often eaten raw or in pies."
          />
        ),
      },
      {
        text: "Banana",
        value: "2",
        render: (
          <FruitDisplay
            title="Banana"
            description="A long yellow fruit that’s soft and sweet."
          />
        ),
      },
      {
        text: "Orange",
        value: "3",
        render: (
          <FruitDisplay
            title="Orange"
            description="A juicy citrus fruit rich in vitamin C."
          />
        ),
      },
      {
        text: "Grape",
        value: "4",
        render: (
          <FruitDisplay
            title="Grape"
            description="Small, round fruit used in snacks, juice, and wine."
          />
        ),
      },
      {
        text: "Pineapple",
        value: "5",
        render: (
          <FruitDisplay
            title="Pineapple"
            description="A tropical fruit with sweet and tangy flavor."
          />
        ),
      },
      {
        text: "Strawberry",
        value: "6",
        render: (
          <FruitDisplay
            title="Strawberry"
            description="A small red fruit, sweet and juicy."
          />
        ),
      },
      {
        text: "Watermelon",
        value: "7",
        render: (
          <FruitDisplay
            title="Watermelon"
            description="A large green fruit with sweet pink flesh."
          />
        ),
      },
      {
        text: "Mango",
        value: "8",
        render: (
          <FruitDisplay
            title="Mango"
            description="A tropical fruit with soft, sweet yellow-orange flesh."
          />
        ),
      },
      {
        text: "Blueberry",
        value: "9",
        render: (
          <FruitDisplay
            title="Blueberry"
            description="A small round blue fruit, rich in antioxidants."
          />
        ),
      },
      {
        text: "Kiwi",
        value: "10",
        render: (
          <FruitDisplay
            title="Kiwi"
            description="A brown fuzzy fruit with bright green sweet-tart flesh."
          />
        ),
      },
      {
        text: "Papaya",
        value: "11",
        render: (
          <FruitDisplay
            title="Papaya"
            description="A tropical fruit with orange flesh and soft texture."
          />
        ),
      },
      {
        text: "Cherry",
        value: "12",
        render: (
          <FruitDisplay
            title="Cherry"
            description="Small round red fruit, sweet or tart."
          />
        ),
      },
      {
        text: "Peach",
        value: "13",
        render: (
          <FruitDisplay
            title="Peach"
            description="A soft, juicy fruit with fuzzy skin."
          />
        ),
      },
      {
        text: "Plum",
        value: "14",
        render: (
          <FruitDisplay
            title="Plum"
            description="A small, sweet fruit with smooth skin."
          />
        ),
      },
      {
        text: "Guava",
        value: "15",
        render: (
          <FruitDisplay
            title="Guava"
            description="A tropical fruit with pink or white flesh and strong aroma."
          />
        ),
      },
      {
        text: "Raspberry",
        value: "16",
        render: (
          <FruitDisplay
            title="Raspberry"
            description="A small red berry, sweet and tart."
          />
        ),
      },
      {
        text: "Lychee",
        value: "17",
        render: (
          <FruitDisplay
            title="Lychee"
            description="A small tropical fruit with sweet white flesh."
          />
        ),
      },
      {
        text: "Coconut",
        value: "18",
        render: (
          <FruitDisplay
            title="Coconut"
            description="A tropical fruit with hard shell and sweet water/flesh."
          />
        ),
      },
      {
        text: "Pear",
        value: "19",
        render: (
          <FruitDisplay
            title="Pear"
            description="A soft, sweet fruit with grainy texture."
          />
        ),
      },
      {
        text: "Pomegranate",
        value: "20",
        render: (
          <FruitDisplay
            title="Pomegranate"
            description="A fruit with many juicy red seeds, sweet-tart flavor."
          />
        ),
      },
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
          selectionOptions={value}
          options={FRUIT_OPTIONS}
          setSelectionOptions={setValue}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

const FruitDisplay = ({ title, description }: FruitDisplayProps) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Container>
  );
};
interface FruitDisplayProps {
  title: string;
  description: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const Description = styled.span`
  font-size: 12px;
  color: #555;
`;
