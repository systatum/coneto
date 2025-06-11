import { Meta, StoryObj } from "@storybook/react";
import Pagination from "./pagination";
import { useState } from "react";

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
      <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
    );
  },
};
