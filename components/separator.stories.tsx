import { Meta, StoryObj } from "@storybook/react";
import Separator from "./separator";

const meta: Meta<typeof Separator> = {
  title: "Stage/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    depth: {
      control: "text",
      description: "How far indented is the text from the base",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  args: {},
  render: (args) => {
    return <Separator {...args} />;
  },
};

export const WithLeftTitle: Story = {
  args: {
    textFloat: "left",
    title: "systatum.com",
  },
  render: (args) => {
    return <Separator {...args} />;
  },
};

export const WithRightTitle: Story = {
  args: {
    textFloat: "right",
    title: "systatum.com",
  },
  render: (args) => {
    return <Separator {...args} />;
  },
};
