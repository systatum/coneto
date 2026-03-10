import type { Meta, StoryObj } from "@storybook/react";
import { LoadingSpinner } from "./loading-spinner";

const meta: Meta<typeof LoadingSpinner> = {
  title: "Content/LoadingSpinner",
  parameters: {
    layout: "centered",
  },
  component: LoadingSpinner,
  tags: ["autodocs"],
  argTypes: {
    iconSize: {
      control: { type: "number", min: 8, max: 64, step: 1 },
      description: "Diameter of the spinner icon in pixels.",
      defaultValue: 16,
    },
    textSize: {
      control: { type: "number", min: 8, max: 40, step: 1 },
      description: "Font size of the optional label text in pixels.",
      defaultValue: 16,
    },
    label: {
      control: "text",
      description: "Optional text displayed next to the spinner.",
    },
    gap: {
      control: { type: "number", min: 0, max: 24, step: 1 },
      description: "Space (in px) between the spinner and label.",
      defaultValue: 2,
    },
    styles: {
      control: false,
      description: `
Custom \`styled-components\` CSS to override specific parts of the LoadingSpinner.

- **containerStyle** – CSS applied to the wrapper containing the spinner and label.
- **iconStyle** – CSS applied to the spinner SVG icon.
- **labelStyle** – CSS applied to the optional label text.

This allows you to customize layout, colors, sizing, spacing, and other visual aspects without modifying the component code.
  `,
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
};
