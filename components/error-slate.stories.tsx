import { Meta, StoryObj } from "@storybook/react";
import { ErrorSlate } from "./error-slate";

const meta: Meta<typeof ErrorSlate> = {
  title: "Content/ErrorSlate",
  component: ErrorSlate,
  tags: ["autodocs"],
  argTypes: {
    code: {
      control: {
        type: "select",
        options: ErrorSlate["code"],
      },
      description: "The 3-digit HTTP error code to render on the cube faces.",
      defaultValue: "404",
    },
    title: {
      control: "text",
      description: "Optional title displayed below the cube.",
    },
    children: {
      control: false,
      description:
        "Optional ReactNode to render below the title (e.g. message, actions).",
    },
    styles: {
      control: false,
      description:
        "- `titleStyle`: Custom CSS for the error title text (typography, color, spacing).\n" +
        "- `cubeFaceStyle`: Custom CSS for each cube face (background, border, color, font styles, visual effects). Does not affect layout or 3D transforms.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorSlate>;

export const Default: Story = {
  args: {
    code: "404",
    title: "PageNotFound",
    children: (
      <div
        style={{
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        We couldn't find the page you were looking for. Try searching or&nbsp;
        <a
          href="/"
          style={{
            textDecoration: "underline",
          }}
        >
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
    styles: {
      cubeFaceStyle: {
        background: "gold",
        borderColor: "black",
        color: "black",
      },
    },
    children: (
      <div
        style={{
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        You don't have permission to view this page. Please contact the
        administrator or&nbsp;
        <a
          href="/"
          style={{
            textDecoration: "underline",
          }}
        >
          return to the homepage
        </a>
      </div>
    ),
  },
  render: (args) => {
    return <ErrorSlate {...args} />;
  },
};
