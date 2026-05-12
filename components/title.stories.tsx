import { Meta, StoryObj } from "@storybook/react";
import { Title } from "./title";

const meta: Meta<typeof Title> = {
  title: "Content/Title",
  component: Title,
  parameters: {
    layout: "centered",
    docs: {},
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Title>;

export const Default: Story = {
  render: () => {
    return <Title pretitle="pretitle" text="title" subtitle="subtitle" />;
  },
};
