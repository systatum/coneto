import { Meta, StoryObj } from "@storybook/react";
import Pagination from "./pagination";
import { useArgs } from "@storybook/preview-api";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof Pagination> = {
  title: "Controls/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    currentPage: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    showNumbers: { control: "boolean" },
  },
  args: {
    currentPage: 1,
    totalPages: 5,
    showNumbers: true,
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    return (
      <Pagination
        {...args}
        onPageChange={(page) => setUpdateArgs({ currentPage: page })}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nextButton = await canvas.getByLabelText("Next Page");
    const prevButton = await canvas.getByLabelText("Previous Page");

    await expect(prevButton).toBeDisabled();

    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await userEvent.click(prevButton);
  },
};

export const OverFivePage: Story = {
  args: {
    totalPages: 50,
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    return (
      <Pagination
        {...args}
        onPageChange={(page) => setUpdateArgs({ currentPage: page })}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nextButton = await canvas.getByLabelText("Next Page");
    const prevButton = await canvas.getByLabelText("Previous Page");

    await expect(prevButton).toBeDisabled();

    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await userEvent.click(prevButton);
  },
};
