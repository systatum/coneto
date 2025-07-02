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
      <ErrorSlate code="404">
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
