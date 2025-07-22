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

  render: () => {
    const [value, setValue] = useState({
      normal: "Hello there, this is dormanted text",
      full: "Hello there, this is dormanted text with full width",
    });

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      name: string
    ) => {
      const newValue = e.target.value;
      setValue((prev) => ({ ...prev, [name]: newValue }));
    };

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="font-medium">Normal Width</span>
          <DormantText
            content={value.normal}
            onActionClick={() => {
              console.log(`The value is : ${value.normal}`);
            }}
          >
            <Textbox
              value={value.normal}
              onChange={(e) => handleChange(e, "normal")}
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Full Width</span>
          <DormantText
            fullWidth
            content={value.full}
            onActionClick={() => {
              console.log(`The value is : ${value.full}`);
            }}
          >
            <Textbox
              value={value.full}
              onChange={(e) => handleChange(e, "full")}
            />
          </DormantText>
        </div>
      </div>
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

    const dormantFullWidthLabel = await canvas.findByText(
      "Hello there, this is dormanted text with full width"
    );
    await userEvent.click(dormantFullWidthLabel);

    const fullWidthTextbox = await canvas.findByRole("textbox");
    await userEvent.clear(fullWidthTextbox);
    await userEvent.type(fullWidthTextbox, "Updated content full");

    const fullWidthCheckButton = await canvas.findByRole("button");
    await userEvent.click(fullWidthCheckButton);

    await expect(fullWidthTextbox).toHaveValue("Updated content full");
  },
};

export const WithCombobox: Story = {
  parameters: {
    layout: "padded",
  },

  render: () => {
    const [value, setValue] = useState({
      normal: { text: "Apple", value: 1 },
      full: { text: "Banana", value: 2 },
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

    const handleChange = (e: OptionsProps, name: string) => {
      const newValue = e;
      setValue((prev) => ({ ...prev, [name]: newValue }));
    };

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="font-medium">Normal Width</span>
          <DormantText
            content={value.normal.text}
            onActionClick={() => {
              console.log(`Selected value: ${value.normal.value}`);
            }}
          >
            <Combobox
              placeholder="Select a fruit..."
              strict
              inputValue={value.normal}
              options={FRUIT_OPTIONS}
              setInputValue={(e) => handleChange(e, "normal")}
            />
          </DormantText>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Full Width</span>
          <DormantText
            fullWidth
            content={value.full.text}
            onActionClick={() => {
              console.log(`Selected value: ${value.full.value}`);
            }}
          >
            <Combobox
              placeholder="Select a fruit full..."
              strict
              inputValue={value.full}
              options={FRUIT_OPTIONS}
              setInputValue={(e) => handleChange(e, "full")}
            />
          </DormantText>
        </div>
      </div>
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const normalLabel = await canvas.findByText("Apple");
    await userEvent.click(normalLabel);

    const input1 = await canvas.findByPlaceholderText("Select a fruit...");
    await userEvent.click(input1);
    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{enter}");
    await expect(input1).toHaveValue("Orange");

    const checkButton1 = await canvas.findByRole("button");
    await userEvent.click(checkButton1);

    const fullLabel = await canvas.findByText("Banana");
    await userEvent.click(fullLabel);

    const input2 = await canvas.findByPlaceholderText("Select a fruit full...");

    await userEvent.click(input2);
    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{enter}");
    await expect(input2).toHaveValue("Orange");

    const checkButton2 = await canvas.findByRole("button");
    await userEvent.click(checkButton2);
  },
};
