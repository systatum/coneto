import type { Meta, StoryObj } from "@storybook/react";
import Messagebox from "./messagebox";
import * as RemixIcons from "@remixicon/react";

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
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success",
    children: "This is a success message.",
  },
  render: (args) => <Messagebox {...args} />,
};

export const Danger: Story = {
  args: {
    variant: "danger",
    title: "Error",
    children: "This is a danger message.",
  },
  render: (args) => <Messagebox {...args} />,
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    children: "This is a warning message.",
  },
  render: (args) => <Messagebox {...args} />,
};

export const WithCustomIcon: Story = {
  args: {
    variant: "primary",
    title: "Custom Icon",
    children: "This message uses a custom RemixIcon.",
    icon: RemixIcons.RiAlarmWarningFill,
  },
  render: (args) => <Messagebox {...args} />,
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
        onClick: () => alert("Test click"),
      },
      {
        caption: "View Website",
        type: "link",
        href: "https://systatum.com",
      },
    ],
  },
  render: (args) => <Messagebox {...args} />,
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
        onClick: () => alert("Retry Succeed"),
      },
      {
        caption: "View Website",
        type: "link",
        href: "https://systatum.com",
      },
    ],
    closable: true,
    onCloseRequest: () => alert("Close Request Succeed"),
  },
  render: (args) => <Messagebox {...args} />,
};
