import type { Meta, StoryObj } from "@storybook/react";
import Messagebox from "./messagebox";
import * as RemixIcons from "@remixicon/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";

const meta: Meta<typeof Messagebox> = {
  title: "Content/Messagebox",
  component: Messagebox,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "success", "danger", "warning"],
    },
    title: {
      control: "text",
    },
    children: {
      control: "text",
    },
    icon: {
      control: {
        type: "select",
      },
      options: Object.keys(RemixIcons),
      mapping: RemixIcons,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Messagebox>;

export const Primary: Story = {
  args: {
    variant: "primary",
    title: "Information",
    children: "This is a primary message box.",
  },
  render: (args) => <Messagebox {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      await canvas.findByText("This is a primary message box.")
    ).toBeVisible();
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success",
    children: "This is a success message.",
  },
  render: (args) => <Messagebox {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findByText("This is a success message.")).toBeVisible();
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    title: "Error",
    children: "This is a danger message.",
  },
  render: (args) => <Messagebox {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findByText("This is a danger message.")).toBeVisible();
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    children: "This is a warning message.",
  },
  render: (args) => <Messagebox {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findByText("This is a warning message.")).toBeVisible();
  },
};

export const WithCustomIcon: Story = {
  args: {
    variant: "primary",
    title: "Custom Icon",
    children: "This message uses a custom RemixIcon.",
    icon: RemixIcons.RiAlarmWarningFill,
  },
  render: (args) => <Messagebox {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      await canvas.findByText("This message uses a custom RemixIcon.")
    ).toBeVisible();
  },
};

export const WithActions: Story = {
  args: {
    variant: "success",
    title: "Success with Actions",
    children: "This success message includes buttons and links.",
    actionLinks: [
      {
        caption: "Retry",
        type: "button",
        onClick: () => console.log("Test click"),
      },
      {
        caption: "View Website",
        type: "link",
        href: "https://systatum.com",
      },
    ],
  },
  render: (args) => <Messagebox {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const retryButton = await canvas.getByRole("button", { name: /retry/i });
    await userEvent.click(retryButton);
    expect(retryButton).toBeVisible();

    const link = await canvas.getByRole("link", { name: /view website/i });
    expect(link).toHaveAttribute("href", "https://systatum.com");
  },
};

export const WithActionsAndClosable: Story = {
  args: {
    variant: "success",
    title: "Success with Actions",
    children: "This success message includes buttons and links.",
    actionLinks: [
      {
        caption: "Retry",
        type: "button",
        onClick: () => console.log("Retry Succeed"),
      },
      {
        caption: "View Website",
        type: "link",
        href: "https://systatum.com",
      },
    ],
    closable: true,
    onCloseRequest: () => console.log("Close Request Succeed"),
  },
  render: (args) => <Messagebox {...args} />,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const retryButton = await canvas.getByRole("button", { name: /retry/i });
    await userEvent.click(retryButton);
    expect(retryButton).toBeVisible();

    const link = await canvas.getByRole("link", { name: /view website/i });
    expect(link).toHaveAttribute("href", "https://systatum.com");

    const closeButton = await canvas.getByLabelText("Closable request");
    await userEvent.click(closeButton);
    await waitFor(() => expect(closeButton).toBeVisible());
  },
};
