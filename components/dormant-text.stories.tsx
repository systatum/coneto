import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { useState, type ChangeEvent } from "react";
import { DormantText } from "./dormant-text";
import { Textbox } from "./textbox";
import { OptionsProps } from "./selectbox";
import { Combobox } from "./combobox";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof DormantText> = {
  title: "Stage/DormantText",
  component: DormantText,
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
      <DormantText
        {...args}
        onActionClick={() => {
          console.log(`The value is : ${args.content}`);
        }}
      >
        <Textbox value={args.content} onChange={handleChange} />
      </DormantText>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const dormantLabel = await canvas.findByText(
      "Hello there, this is dormanted text"
    );
    await userEvent.click(dormantLabel);

    const textbox = await canvas.findByRole("textbox");
    await userEvent.clear(textbox);
    await userEvent.type(textbox, "Updated content");

    const checkButton = await canvas.findByRole("button");
    await userEvent.click(checkButton);

    await expect(textbox).toHaveValue("Updated content");
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
      <DormantText
        content={args.text}
        onActionClick={() => {
          console.log(`The value is : ${args.value}`);
        }}
      >
        <Combobox
          placeholder="Select a fruit..."
          strict
          inputValue={args}
          options={FRUIT_OPTIONS}
          setInputValue={setArgs}
        />
      </DormantText>
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const dormantLabel = await canvas.findByText("Apple");
    await userEvent.click(dormantLabel);

    const input = await canvas.findByPlaceholderText("Select a fruit...");

    await userEvent.click(input);

    const appleOption = await canvas.findByRole("option", { name: "Apple" });
    const grapeOption = await canvas.findByRole("option", {
      name: "Grape",
    });

    await expect(appleOption).toBeVisible();
    await expect(grapeOption).toBeVisible();

    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{enter}");

    await expect((input as HTMLInputElement).value).toBe("Banana");

    const checkButton = await canvas.findByRole("button");
    await userEvent.click(checkButton);
  },
};
