import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { useState, type ChangeEvent } from "react";
import { DormantedText } from "./dormanted-text";
import { Textbox } from "./textbox";
import { OptionsProps } from "./selectbox";
import { Combobox } from "./combobox";

const meta: Meta<typeof DormantedText> = {
  title: "Stage/DormantedText",
  component: DormantedText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    layout: "padded",
  },
  args: {
    content: "Hello there, this is dormanted text",
    dormantedFontSize: 30,
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const newValue = e.target.value;
      setUpdateArgs({ content: newValue });
      args.onChange?.(e);
    };

    return (
      <DormantedText
        {...args}
        containerClassName="max-w-[800px]"
        onActionClick={() => {
          console.log(`The value is : ${args.content}`);
        }}
      >
        <Textbox value={args.content} onChange={handleChange} />
      </DormantedText>
    );
  },
};

export const WithCombobox: Story = {
  parameters: {
    layout: "padded",
  },

  render: () => {
    const [args, setArgs] = useState<OptionsProps>({
      text: "Apple",
      value: 1,
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
      <DormantedText
        content={args.text}
        containerClassName="max-w-[800px]"
        onActionClick={() => {
          console.log(`The value is : ${args.value}`);
        }}
      >
        <Combobox
          strict
          inputValue={args}
          options={FRUIT_OPTIONS}
          setInputValue={setArgs}
        />
      </DormantedText>
    );
  },
};
