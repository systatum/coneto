import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, within } from "@storybook/test";
import { Button } from "./button";
import { RiMovie2Fill } from "@remixicon/react";

const meta = {
  title: "Controls/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn() },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "primary",
        "danger",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    isLoading: {
      control: "boolean",
    },
    children: {
      control: "text",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "Button",
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Button/i });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass("h-9", "px-4");
    await expect(button).toHaveClass("bg-[rgb(243,243,243)]", "text-black");

    await canvas.getByRole("button", { name: /Button/i }).click();
    expect(meta.args.onClick).toHaveBeenCalled();
  },
};

export const DefaultLarge: Story = {
  args: {
    size: "lg",
    children: "Button",
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Button/i });
    await expect(button).toBeInTheDocument();

    await expect(button).toHaveClass("h-10", "px-6", "gap-2");
    await expect(button).toHaveClass("bg-[rgb(243,243,243)]");

    await canvas.getByRole("button", { name: /Button/i }).click();
    await expect(meta.args.onClick).toHaveBeenCalled();
  },
};

export const DefaultSmall: Story = {
  args: {
    size: "sm",
    children: "Button",
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Button/i });
    await expect(button).toBeInTheDocument();

    await expect(button).toHaveClass("h-8", "px-3", "gap-1.5");
    await expect(button).toHaveClass("bg-[rgb(243,243,243)]");

    await canvas.getByRole("button", { name: /Button/i }).click();
    await expect(meta.args.onClick).toHaveBeenCalled();
  },
};

export const DefaultIcon: Story = {
  args: {
    size: "icon",
    children: <RiMovie2Fill aria-label="Movie" />,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Movie/i });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass("size-9");

    await canvas.getByRole("button", { name: /Movie/i }).click();
    await expect(meta.args.onClick).toHaveBeenCalled();
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Button",
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Button/i });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass("h-9", "px-4");
    await expect(button).toHaveClass("bg-[rgb(86,154,236)]", "text-white");

    await canvas.getByRole("button", { name: /Button/i }).click();
    expect(meta.args.onClick).toHaveBeenCalled();
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Button",
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Button/i });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass("h-9", "px-4");
    await expect(button).toHaveClass(
      "bg-secondary",
      "text-secondary-foreground"
    );

    await canvas.getByRole("button", { name: /Button/i }).click();
    expect(meta.args.onClick).toHaveBeenCalled();
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Button",
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Button/i });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass("h-9", "px-4");
    await expect(button).toHaveClass("bg-[rgb(206,55,93)]", "text-white");

    await canvas.getByRole("button", { name: /Button/i }).click();
    await expect(meta.args.onClick).toHaveBeenCalled();
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Button",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole("button", { name: /Button/i });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass("h-9", "px-4");
    await expect(button).toHaveClass("bg-background");

    await canvas.getByRole("button", { name: /Button/i }).click();
    await expect(meta.args.onClick).toHaveBeenCalled();
  },
};

export const WithLoading: Story = {
  args: {
    variant: "default",
    isLoading: true,
    children: "Button",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole("button", { name: /Button/i });
    await expect(button).toHaveAttribute("disabled");
    await expect(button).toHaveClass("bg-[rgb(243,243,243)]");

    const spinner = canvas.getByTestId("circle");
    await expect(button).toContainElement(spinner);
    await expect(spinner).toHaveClass("animate-spin");
  },
};
