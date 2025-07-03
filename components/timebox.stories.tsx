import type { Meta, StoryObj } from "@storybook/react";
import { Timebox } from "./timebox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent, InputHTMLAttributes, useState } from "react";

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
    const [value, setValue] = useState({ timebox: "" });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setValue((prev) => ({ ...prev, [name]: value }));
    };

    console.log(value);

    return <Timebox {...args} onChange={onChangeValue} />;
  },
};

export const WithSeconds: Story = {
  args: {
    withSeconds: true,
  },
  render: (args) => {
    const [value, setValue] = useState({ timebox: "" });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setValue((prev) => ({ ...prev, [name]: value }));
    };

    console.log(value);

    return <Timebox {...args} onChange={onChangeValue} />;
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
