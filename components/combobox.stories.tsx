import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import Combobox from "./combobox";

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
    const [value, setValue] = useState("");

    const FRUIT_OPTIONS = [
      "Apple",
      "Banana",
      "Orange",
      "Grape",
      "Pineapple",
      "Strawberry",
      "Watermelon",
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
