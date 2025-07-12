import { Meta, StoryObj } from "@storybook/react";
import Rating from "./rating";
import { useArgs } from "@storybook/preview-api";
import { expect, userEvent, within } from "@storybook/test";

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const stars = canvas.getAllByRole("img", { hidden: true });
    expect(stars).toHaveLength(5);

    await userEvent.click(stars[3]);

    const updatedStars = canvas.getAllByRole("img", { hidden: true });
    expect(updatedStars).toHaveLength(5);
  },
};

export const NotEditable: Story = {
  args: {
    rating: 4.5,
  },
  render: (args) => <Rating {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const stars = canvas.getAllByRole("img", { hidden: true });
    expect(stars).toHaveLength(5);
  },
};

export const WithLabel: Story = {
  args: {
    rating: 4.5,
    withLabel: true,
  },
  render: (args) => <Rating {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText(/4\.5 \/ 5/i);
    expect(label).toBeInTheDocument();
  },
};

export const Small: Story = {
  args: {
    rating: 4.5,
    size: "sm",
  },
  render: (args) => <Rating {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const stars = canvas.getAllByRole("img", { hidden: true });
    expect(stars).toHaveLength(5);

    await userEvent.click(stars[3]);

    const updatedStars = canvas.getAllByRole("img", { hidden: true });
    expect(updatedStars).toHaveLength(5);
  },
};

export const Medium: Story = {
  args: {
    rating: 4.5,
    size: "md",
  },
  render: (args) => <Rating {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const stars = canvas.getAllByRole("img", { hidden: true });
    expect(stars).toHaveLength(5);

    await userEvent.click(stars[3]);

    const updatedStars = canvas.getAllByRole("img", { hidden: true });
    expect(updatedStars).toHaveLength(5);
  },
};

export const Large: Story = {
  args: {
    rating: 4.5,
    size: "lg",
  },
  render: (args) => <Rating {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const stars = canvas.getAllByRole("img", { hidden: true });
    expect(stars).toHaveLength(5);

    await userEvent.click(stars[3]);

    const updatedStars = canvas.getAllByRole("img", { hidden: true });
    expect(updatedStars).toHaveLength(5);
  },
};
