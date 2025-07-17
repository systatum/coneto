import { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./separator";
import { expect, within } from "@storybook/test";

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

export const LeftSide: Story = {
  args: {
    textFloat: "left",
    title: "systatum.com",
  },
  render: (args) => {
    return <Separator {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = await canvas.findByText("systatum.com");
    expect(label).toBeInTheDocument();

    const labelStyle = getComputedStyle(label);
    expect(labelStyle.left).not.toBe("auto");
  },
};

export const RightSide: Story = {
  args: {
    textFloat: "right",
    title: "systatum.com",
  },
  render: (args) => {
    return <Separator {...args} />;
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = await canvas.findByText("systatum.com");
    expect(label).toBeInTheDocument();

    const labelStyle = getComputedStyle(label);
    expect(labelStyle.left).not.toBe("auto");
  },
};
