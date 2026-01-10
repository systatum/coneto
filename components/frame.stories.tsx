import type { Meta, StoryObj } from "@storybook/react";
import { Frame } from "./frame";
import { css } from "styled-components";

const meta: Meta<typeof Frame> = {
  title: "Stage/Frame",
  component: Frame,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      description: "Title shown on top of the frame",
      control: "text",
    },
    styles: {
      style: {
        description: "Custom class for the frame container",
        control: "text",
      },
      styleTitle: {
        description: "Custom class for the title container",
        control: "text",
      },
    },
    children: {
      description: "Content inside the frame",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Frame>;

export const Default: Story = {
  args: {
    styles: {
      style: css`
        font-size: 14px;
      `,
    },
    children: <>This is inside the frame.</>,
  },
  render: (args) => {
    return <Frame {...args} />;
  },
};

export const WithTitle: Story = {
  args: {
    title: "Frame Title",
    styles: {
      style: css`
        font-size: 14px;
      `,
    },
    children: <>This frame has a title.</>,
  },
  render: (args) => {
    return <Frame {...args} />;
  },
};

export const Custom: Story = {
  args: {
    title: "Frame w/ Class",
    styles: {
      style: css`
        font-size: 14px;
        background-color: #f5f5f5;
      `,
      titleStyle: css`
        background-color: #f5f5f5;
      `,
    },
    children: <>This frame has a custom background color.</>,
  },
  render: (args) => {
    return <Frame {...args} />;
  },
};
