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
};

export default meta;

type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {
  render: () => {
    return <LoadingSpinner size={30} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const spinner = canvas.getByTestId("circle");
    expect(spinner).toBeInTheDocument();
  },
};
