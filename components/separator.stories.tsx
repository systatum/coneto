import { Meta, StoryObj } from "@storybook/react";
import Separator from "./separator";

const meta: Meta<typeof Separator> = {
  title: "Stage/Separator",
  component: Separator,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  render: () => {
    return <Separator title="Test" />;
  },
};
