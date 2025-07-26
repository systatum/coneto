import { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./pagination";
import { useArgs } from "@storybook/preview-api";

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
};

export const OverFivePages: Story = {
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
};
