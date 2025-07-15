import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import Combobox, { ComboboxActionProps } from "./combobox";
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText("Select a fruit...");

    await userEvent.type(input, "ap");

    const appleOption = await canvas.findByRole("option", { name: "Apple" });
    const grapeOption = await canvas.findByRole("option", {
      name: "Grape",
    });

    await expect(appleOption).toBeVisible();
    await expect(grapeOption).toBeVisible();

    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{enter}");

    await expect((input as HTMLInputElement).value).toBe("Grape");
  },
};

export const WithClearable: Story = {
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
          inputValue={value}
          options={FRUIT_OPTIONS}
          setInputValue={setValue}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText("Select a fruit...");

    await userEvent.type(input, "ap");

    const appleOption = await canvas.findByRole("option", { name: "Apple" });
    const grapeOption = await canvas.findByRole("option", {
      name: "Grape",
    });

    await expect(appleOption).toBeVisible();
    await expect(grapeOption).toBeVisible();

    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{enter}");

    await expect((input as HTMLInputElement).value).toBe("Grape");
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText("Select a fruit...");

    await userEvent.type(input, "ap");

    const appleOption = await canvas.findByRole("option", { name: "Apple" });
    const grapeOption = await canvas.findByRole("option", {
      name: "Grape",
    });

    await expect(appleOption).toBeVisible();
    await expect(grapeOption).toBeVisible();

    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{enter}");

    await expect((input as HTMLInputElement).value).toBe("Grape");
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
