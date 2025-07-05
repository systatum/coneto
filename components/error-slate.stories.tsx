import { Meta, StoryObj } from "@storybook/react/*";
import { ErrorSlate } from "./error-slate";

const meta: Meta<typeof ErrorSlate> = {
  title: "Content/ErrorSlate",
  component: ErrorSlate,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ErrorSlate>;

export const Default: Story = {
  args: {
    code: "404",
    title: "PageNotFound",
    children: (
      <div className="max-w-[400px] text-center">
        We couldn't find the page you were looking for. Try searching or&nbsp;
        <a href="/" className="underline">
          return to the homepage
        </a>
      </div>
    ),
  },
  render: (args) => {
    return <ErrorSlate {...args} />;
  },
};

export const CustomColor: Story = {
  args: {
    code: "403",
    title: "AccessDenied",
    cubeFaceStyle: {
      background: "gold",
      borderColor: "black",
      color: "black",
    },
    children: (
      <div className="max-w-[400px] text-center">
        You don't have permission to view this page. Please contact the
        administrator or&nbsp;
        <a href="/" className="underline">
          return to the homepage
        </a>
      </div>
    ),
  },
  render: (args) => {
    return <ErrorSlate {...args} />;
  },
};
