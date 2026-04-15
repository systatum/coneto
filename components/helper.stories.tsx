import { Meta, StoryObj } from "@storybook/react";
import { Helper } from "./helper";

const meta: Meta<typeof Helper> = {
  title: "Content/Helper",
  component: Helper,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Helper>;

export const Default: Story = {
  render: () => {
    return <Helper value="Default Value" />;
  },
};
