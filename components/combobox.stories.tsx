import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Combobox } from "./combobox";

const meta: Meta<typeof Combobox> = {
  title: "Components Reusable/Combobox",
  component: Combobox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const FRUIT_OPTIONS = [
  "Apple",
  "Banana",
  "Orange",
  "Grape",
  "Pineapple",
  "Strawberry",
  "Watermelon",
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div className="w-64">
        <Combobox
          inputValue={value}
          setInputValue={setValue}
          options={FRUIT_OPTIONS}
          placeholder="Search fruit..."
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText("Search fruit...");

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
