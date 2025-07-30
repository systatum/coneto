import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Content/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Value on your Tooltip",
    },
    className: {
      control: "text",
      description: "Styling on your Tooltip",
    },
    containerClassName: {
      control: "text",
      description: "Styling on your Parent Tooltip",
    },
    openOn: {
      control: "text",
      options: ["hover", "click"],
    },
    text: {
      control: "text",
      description: "This is your text before have action on Tooltip",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Hover: Story = {
  args: {
    text: "Hover Tooltip",
    openOn: "hover",
    children: "This tooltip appears on hover",
    containerClassName: "text-sm underline",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
};

export const Click: Story = {
  args: {
    text: "Click Tooltip",
    openOn: "click",
    children: "This tooltip appears on click",
    containerClassName: "text-blue-600 text-sm cursor-pointer",
    className: "bg-blue-600 text-white",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
};

export const StyledTooltip: Story = {
  args: {
    text: "Styled Tooltip",
    openOn: "hover",
    children: "Tooltip with custom styling",
    containerClassName: "text-green-600 text-sm underline decoration-wavy",
    className: "bg-green-700 text-white shadow-lg rounded px-3 py-1 text-sm",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
};

export const DottedUnderlineTooltip: Story = {
  args: {
    text: "Dotted Underline Tooltip",
    openOn: "hover",
    children: "Tooltip with dotted underline trigger",
    underline: "underline-dot",
    containerClassName: "text-sm",
    className: "bg-gray-800 text-white",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
};

export const NoUnderlineTooltip: Story = {
  args: {
    text: "No Underline Tooltip",
    openOn: "hover",
    children: "Trigger text without underline",
    underline: "transparent",
    containerClassName: "font-semibold text-sm text-red-500",
    className: "bg-red-600 text-white",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
};

export const BlueUnderlineTooltip: Story = {
  args: {
    text: "Blue Underline Tooltip",
    openOn: "click",
    underline: "blue",
    containerClassName: "text-sm",
    children: "Clicked tooltip with blue underline",
    className: "bg-blue-700 text-white",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
};
