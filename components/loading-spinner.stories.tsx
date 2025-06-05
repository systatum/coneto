import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import LoadingSpinner from "./loading-spinner";

const meta: Meta<typeof LoadingSpinner> = {
  title: "Content/LoadingSpinner",
  parameters: {
    layout: "centered",
  },
  component: LoadingSpinner,
  tags: ["autodocs"],
  argTypes: {
    iconSize: {
      control: { type: "number" },
      defaultValue: 16,
      description: "Size of the loading spinner icon (in pixels)",
    },
    textSize: {
      control: { type: "number" },
      defaultValue: 16,
      description: "Font size of the label text (in pixels)",
    },
    label: {
      control: { type: "text" },
      description: "Optional label displayed next to the spinner",
    },
    gap: {
      control: { type: "number" },
      description:
        "Optional label displayed gap on between text and spinner on pixel",
    },
  },
};

export default meta;

type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {
  args: {
    iconSize: 30,
  },
  render: (args) => {
    return <LoadingSpinner {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const spinner = canvas.getByTestId("circle");
    expect(spinner).toBeInTheDocument();
  },
};

export const WithLabel: Story = {
  args: {
    label: "Loading...",
    iconSize: 30,
    textSize: 20,
    gap: 4,
  },
  render: (args) => {
    return <LoadingSpinner {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const spinner = canvas.getByTestId("circle");
    expect(spinner).toBeInTheDocument();
  },
};
