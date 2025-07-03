import type { Meta, StoryObj } from "@storybook/react";
import { Timebox } from "./timebox";

const meta: Meta<typeof Timebox> = {
  title: "Input Elements/Timebox",
  component: Timebox,
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "time changed" },
    withSeconds: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Timebox>;

export const Default: Story = {
  args: {
    withSeconds: false,
  },
  render: (args) => {
    return <Timebox {...args} />;
  },
};

export const WithSeconds: Story = {
  args: {
    withSeconds: true,
  },
  render: (args) => {
    return <Timebox {...args} />;
  },
};

export const WithLiveTime: Story = {
  args: {
    withSeconds: true,
    editable: false,
  },
  render: (args) => {
    return <Timebox {...args} />;
  },
};

export const WithLiveTimeAndLocation: Story = {
  args: {
    withSeconds: true,
    editable: false,
    timezone: "Asia/Tokyo",
  },
  render: (args) => {
    return <Timebox {...args} />;
  },
};
