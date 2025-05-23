import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import Checkbox from "./checkbox";
import { useState } from "react";

const meta: Meta<typeof Checkbox> = {
  title: "Components Reusable/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "I agree to the terms",
    name: "agreement",
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="I agree to the terms"
        name="agreement"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};

export const WithError: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <Checkbox
        label="I agree to the terms"
        name="agreement"
        checked={checked}
        onChange={() => setChecked(!checked)}
        showError={!checked}
        errorMessage="You must agree before continuing"
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    await expect(checkbox.className).toMatch("border-red-500");
  },
};
