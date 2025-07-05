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
  render: () => {
    return (
      <ErrorSlate code="404" title="PageNotFound">
        <div className="max-w-[400px] text-center">
          We couldn't find the page you were looking for. Try searching or&nbsp;
          <a href="/" className="underline">
            return to the homepage
          </a>
        </div>
      </ErrorSlate>
    );
  },
};

export const Forbidden: Story = {
  render: () => {
    return (
      <ErrorSlate
        code="403"
        title="AccessDenied"
        cubeFaceStyle={{
          background: "gold",
          borderColor: "black",
          color: "black",
        }}
      >
        <div className="max-w-[400px] text-center">
          You don't have permission to view this page. Please contact the
          administrator or&nbsp;
          <a href="/" className="underline">
            return to the homepage
          </a>
        </div>
      </ErrorSlate>
    );
  },
};

export const ServerError: Story = {
  render: () => {
    return (
      <ErrorSlate
        code="500"
        title="SomethingWrong"
        cubeFaceStyle={{
          background: "blue",
          borderColor: "black",
        }}
      >
        <div className="max-w-[400px] text-center">
          Oops! Something went wrong on our end. Please try again later or&nbsp;
          <a href="/" className="underline">
            go back to the homepage
          </a>
        </div>
      </ErrorSlate>
    );
  },
};
