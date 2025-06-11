import { Meta, StoryObj } from "@storybook/react";
import Pagination from "./pagination";
import { useState } from "react";
import { OptionsProps } from "./selectbox";

const meta: Meta<typeof Pagination> = {
  title: "Stage/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState<OptionsProps>({
      text: "1",
      value: 1,
    });

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
      />
    );
  },
};
