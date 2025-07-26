import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  RiMovie2Fill,
  RiSpam2Line,
  RiForbid2Line,
  RiShieldLine,
  RiCheckLine,
  RiInboxArchiveLine,
  RiDownloadLine,
  RiLink,
  RiShareLine,
  RiEditLine,
} from "@remixicon/react";

const meta = {
  title: "Controls/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
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

const TIP_MENU_ITEMS = [
  {
    caption: "Report Phishing",
    icon: RiSpam2Line,
    iconColor: "blue",
    onClick: () => console.log("Phishing reported"),
  },
  {
    caption: "Report Junk",
    icon: RiForbid2Line,
    iconColor: "red",
    onClick: () => console.log("Junk reported"),
  },
  {
    caption: "Block Sender",
    icon: RiShieldLine,
    iconColor: "orange",
    isDangerous: true,
    onClick: () => console.log("Sender blocked"),
  },
  {
    caption: "Mark as Read",
    icon: RiCheckLine,
    iconColor: "green",
    onClick: () => console.log("Marked as read"),
  },
  {
    caption: "Move to Spam",
    icon: RiInboxArchiveLine,
    iconColor: "purple",
    onClick: () => console.log("Moved to spam"),
  },
  {
    caption: "Download Attachment",
    icon: RiDownloadLine,
    iconColor: "teal",
    onClick: () => console.log("Downloading"),
  },
  {
    caption: "Copy Link",
    icon: RiLink,
    iconColor: "gray",
    onClick: () => console.log("Link copied"),
  },
  {
    caption: "Share",
    icon: RiShareLine,
    iconColor: "indigo",
    isDangerous: true,
    onClick: () => console.log("Shared"),
  },
  {
    caption: "Edit",
    icon: RiEditLine,
    iconColor: "yellow",
    onClick: () => console.log("Edit mode"),
  },
];

export const Default: Story = {
  args: {
    variant: "default",
    children: "Button",
  },
  render: (args) => {
    return <Button {...args} />;
  },
};

export const DefaultLarge: Story = {
  args: {
    size: "lg",
    children: "Button",
  },
  render: (args) => {
    return <Button {...args} />;
  },
};

export const DefaultSmall: Story = {
  args: {
    size: "sm",
    children: "Button",
  },
  render: (args) => {
    return <Button {...args} />;
  },
};

export const DefaultIcon: Story = {
  args: {
    size: "icon",
    children: <RiMovie2Fill aria-label="Movie" />,
  },
  render: (args) => {
    return <Button {...args} />;
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Button",
  },
  render: (args) => {
    return <Button {...args} />;
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Button",
  },
  render: (args) => {
    return <Button {...args} />;
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Button",
  },
  render: (args) => {
    return <Button {...args} />;
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Button",
  },
  render: (args) => {
    return <Button {...args} />;
  },
};

export const WithLoading: Story = {
  args: {
    variant: "default",
    isLoading: true,
    children: "Button",
  },
  render: (args) => {
    return <Button {...args} />;
  },
};

export const WithTipMenu: Story = {
  args: {
    variant: "default",
    children: "Button",
    tipMenu: true,
    subMenuList: TIP_MENU_ITEMS,
    dropdownClassName: "min-w-[300px] mt-2",
  },
  render: (args) => {
    return <Button {...args} />;
  },
};
