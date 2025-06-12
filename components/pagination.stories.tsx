import { Meta, StoryObj } from "@storybook/react";
import Pagination from "./pagination";
import { useState } from "react";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof Pagination> = {
  title: "Stage/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState<number>(1);

    return (
      <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nextButton = await canvas.getByLabelText("Next Page");
    const prevButton = await canvas.getByLabelText("Previous Page");
    expect(prevButton).toBeDisabled();
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await userEvent.click(prevButton);
  },
};

export const OverFivePage: Story = {
  render: () => {
    const [page, setPage] = useState<number>(1);

    return (
      <Pagination currentPage={page} totalPages={50} onPageChange={setPage} />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nextButton = await canvas.getByLabelText("Next Page");
    const prevButton = await canvas.getByLabelText("Previous Page");
    expect(prevButton).toBeDisabled();
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
    await userEvent.click(prevButton);
  },
};
