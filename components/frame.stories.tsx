import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import Frame from "./frame";

const meta: Meta<typeof Frame> = {
  title: "Stage/Frame",
  component: Frame,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      description: "Title shown on top of the frame",
      control: "text",
    },
    className: {
      description: "Custom class for the frame container",
      control: "text",
    },
    classNameTitle: {
      description: "Custom class for the title container",
      control: "text",
    },
    children: {
      description: "Content inside the frame",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Frame>;

export const DefaultFrame: Story = {
  args: {
    className: "text-sm",
    children: <>This is inside the frame.</>,
  },
  render: (args) => {
    return <Frame {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("This is inside the frame.")
    ).toBeInTheDocument();
  },
};

export const FrameWithTitle: Story = {
  args: {
    title: "Frame Title",
    className: "text-sm",
    children: <>This frame has a title.</>,
  },
  render: (args) => {
    return <Frame {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Frame Title")).toBeInTheDocument();
    await expect(
      canvas.getByText("This frame has a title.")
    ).toBeInTheDocument();
  },
};

export const FrameWithClass: Story = {
  args: {
    title: "Frame w/ Class",
    className: "bg-blue-50 text-sm",
    classNameTitle: "bg-blue-50",
    children: <>This frame has a custom background color.</>,
  },
  render: (args) => {
    return <Frame {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Frame w/ Class")).toBeInTheDocument();
    await expect(
      canvas.getByText("This frame has a custom background color.")
    ).toBeInTheDocument();
  },
};
