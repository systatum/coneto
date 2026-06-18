import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button.native";
import { css } from "styled-components";

const meta = {
  title: "Mobile/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
test react native
        `,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <>
        <Button>test</Button>
      </>
    );
  },
};
