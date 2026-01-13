import { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./pagination";
import { useArgs } from "@storybook/preview-api";

const meta: Meta<typeof Pagination> = {
  title: "Controls/Pagination",
  component: Pagination,
  tags: ["autodocs"],

  argTypes: {
    currentPage: {
      control: { type: "number", min: 1 },
      description: "Current active page",
    },
    totalPages: {
      control: { type: "number", min: 1 },
      description: "Total number of pages",
    },
    onPageChange: {
      action: "page changed",
      description: "Callback fired when page changes",
    },
    showNumbers: {
      control: "boolean",
      description: "Show page numbers and combobox",
      defaultValue: true,
    },
    styles: {
      control: false,
      description: `
Custom styles for the Pagination component. This object allows you to override styles for individual parts:

- **containerStyle**: Wrapper around the entire pagination (layout, spacing, alignment)
- **buttonStyle**: Styles applied to each pagination button (size, colors, borders, hover state)
- **selectboxStyle**: Styles for the page size / page selector combobox

Each field accepts a \`CSSProp\` (styled-components compatible) and can be used to control layout, colors, spacing, borders, and visual appearance.
  `,
    },
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
