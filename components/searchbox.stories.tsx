import type { Meta, StoryObj } from "@storybook/react";
import { Searchbox } from "./searchbox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent } from "react";

const meta: Meta<typeof Searchbox> = {
  title: "Input Elements/Searchbox",
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
    styles: { control: false },
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
};
