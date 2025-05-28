import type { Meta, StoryObj } from "@storybook/react";
import Tooltip from "./tooltip";
import { expect, fireEvent, waitFor, within } from "@storybook/test";

const meta: Meta<typeof Tooltip> = {
  title: "Content/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Value on your Tooltip",
    },
    className: {
      control: "text",
      description: "Styling on your Tooltip",
    },
    classNameParent: {
      control: "text",
      description: "Styling on your Parent Tooltip",
    },
    openOn: {
      control: "text",
      options: ["hover", "click"],
    },
    text: {
      control: "text",
      description: "This is your text before have action on Tooltip",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Hover: Story = {
  args: {
    text: "Hover Tooltip",
    openOn: "hover",
    children: "This tooltip appears on hover",
    classNameParent: "text-sm underline",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText("Hover Tooltip");

    await fireEvent.mouseEnter(trigger, { delay: 400 });

    await fireEvent.mouseLeave(trigger);
  },
};

export const Click: Story = {
  args: {
    text: "Click Tooltip",
    openOn: "click",
    children: "This tooltip appears on click",
    classNameParent: "text-blue-600 text-sm cursor-pointer",
    className: "bg-blue-600 text-white",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText("Click Tooltip");

    expect(trigger).toBeVisible();
    expect(trigger).toHaveClass("text-blue-600", "cursor-pointer");
    expect(
      canvasElement.querySelector(".bg-blue-600.text-white")
    ).not.toBeInTheDocument();

    await fireEvent.click(trigger);

    await waitFor(() => {
      const tooltip = canvasElement.querySelector(".bg-blue-600.text-white");
      expect(tooltip).toBeInTheDocument();
      expect(tooltip?.textContent?.trim()).toBe(
        "This tooltip appears on click"
      );
    });

    await fireEvent.click(trigger);

    await waitFor(() => {
      const tooltip = canvasElement.querySelector(".bg-blue-600.text-white");
      expect(tooltip).not.toBeInTheDocument();
    });
  },
};

export const StyledTooltip: Story = {
  args: {
    text: "Styled Tooltip",
    openOn: "hover",
    children: "Tooltip with custom styling",
    classNameParent: "text-green-600 text-sm underline decoration-wavy",
    className: "bg-green-700 text-white shadow-lg rounded px-3 py-1 text-sm",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText("Styled Tooltip");

    expect(trigger).toHaveClass(
      "text-green-600",
      "underline",
      "decoration-wavy"
    );

    await fireEvent.mouseEnter(trigger);

    await fireEvent.mouseLeave(trigger);
  },
};

export const DottedUnderlineTooltip: Story = {
  args: {
    text: "Dotted Underline Tooltip",
    openOn: "hover",
    children: "Tooltip with dotted underline trigger",
    underline: "underline-dot",
    classNameParent: "text-sm",
    className: "bg-gray-800 text-white",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText("Dotted Underline Tooltip");

    expect(trigger).toHaveClass("underline", "text-sm", "cursor-default");

    await fireEvent.mouseEnter(trigger);

    await fireEvent.mouseLeave(trigger);
  },
};

export const NoUnderlineTooltip: Story = {
  args: {
    text: "No Underline Tooltip",
    openOn: "hover",
    children: "Trigger text without underline",
    underline: "transparent",
    classNameParent: "font-semibold text-sm text-red-500",
    className: "bg-red-600 text-white",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText("No Underline Tooltip");

    expect(trigger).toHaveClass(
      "text-red-500",
      "text-sm",
      "font-semibold",
      "cursor-default"
    );

    await fireEvent.mouseEnter(trigger);

    await fireEvent.mouseLeave(trigger);
  },
};

export const BlueUnderlineTooltip: Story = {
  args: {
    text: "Blue Underline Tooltip",
    openOn: "click",
    underline: "blue",
    classNameParent: "text-sm",
    children: "Clicked tooltip with blue underline",
    className: "bg-blue-700 text-white",
  },
  render: (args) => {
    return <Tooltip {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText("Blue Underline Tooltip");

    expect(trigger).toBeVisible();
    expect(trigger).toHaveClass(
      "decoration-blue-500",
      "cursor-pointer",
      "underline"
    );

    await fireEvent.click(trigger);

    await waitFor(() => {
      const tooltip = canvasElement.querySelector(".bg-blue-700.text-white");
      expect(tooltip).toBeInTheDocument();
      expect(tooltip?.textContent?.trim()).toBe(
        "Clicked tooltip with blue underline"
      );
    });

    await fireEvent.click(trigger);

    await waitFor(() => {
      const tooltip = canvasElement.querySelector(".bg-blue-600.text-white");
      expect(tooltip).not.toBeInTheDocument();
    });
  },
};
