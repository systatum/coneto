import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent } from "@storybook/test";
import Searchbox from "./searchbox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent } from "react";

const meta: Meta<typeof Searchbox> = {
  title: "Components Reusable/Searchbox",
  component: Searchbox,
  argTypes: {
    name: {
      control: "text",
      description: "Name attribute for the input",
    },
    value: {
      control: "text",
      description: "Input value",
    },
    onChange: { action: "changed" },
    className: { control: false },
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Searchbox>;

export const Default: Story = {
  args: {
    name: "search",
    value: "",
    placeholder: "Search here...",
  },
  render: (args) => {
    const [{ value }, setUpdateArgs] = useArgs();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setUpdateArgs({ value: e.target.value });
      args.onChange?.(e);
    };

    return <Searchbox {...args} value={value} onChange={handleChange} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = await canvas.getByRole("textbox");
    const clearButton = await canvas.getByRole("button", {
      name: /clear search input/i,
    });

    await userEvent.clear(input);
    await userEvent.type(input, "Hello world", { delay: 40 });
    await expect(input).toHaveValue("Hello world");

    await userEvent.click(clearButton);
    await expect(input).toHaveValue("");
  },
};
