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
    styles: {
      description: `
Custom styles for the Searchbox component. This object allows you to override styles for individual parts:

- **self**: Styles applied directly to the input element.
- **containerStyle**: Styles applied to the outer wrapper div.
- **iconStyle**: Styles applied to the search icon.

Each field accepts a \`CSSProp\` (styled-components compatible). Use it to adjust spacing, colors, or any CSS properties.
    `,
      control: false,
    },
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
