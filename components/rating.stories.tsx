import { Meta, StoryObj } from "@storybook/react";
import Rating from "./rating";
import { useArgs } from "@storybook/preview-api";

const meta: Meta<typeof Rating> = {
  title: "Input Elements/Rating",
  component: Rating,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    rating: 0,
    withLabel: false,
  },

  render: (args) => {
    const [, setUpdateArgs] = useArgs();
    return (
      <Rating
        {...args}
        editable
        onChange={(e) => setUpdateArgs({ rating: e })}
      />
    );
  },
};

export const NotEditable: Story = {
  args: {
    rating: 4.5,
  },
  render: (args) => <Rating {...args} />,
};

export const WithLabel: Story = {
  args: {
    rating: 4.5,
    withLabel: true,
  },
  render: (args) => <Rating {...args} />,
};

export const Small: Story = {
  args: {
    rating: 4.5,
    size: "sm",
  },
  render: (args) => <Rating {...args} />,
};

export const Medium: Story = {
  args: {
    rating: 4.5,
    size: "md",
  },
  render: (args) => <Rating {...args} />,
};

export const Large: Story = {
  args: {
    rating: 4.5,
    size: "lg",
  },
  render: (args) => <Rating {...args} />,
};
