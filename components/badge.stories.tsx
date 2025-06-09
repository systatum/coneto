import { Meta, StoryObj } from "@storybook/react";
import Badge from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Content/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["neutral", "green", "yellow", "red"],
    },
    withCircle: { control: "boolean" },
    children: { control: "text" },
    className: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Neutral: Story = {
  args: {
    variant: "neutral",
    withCircle: false,
    children: "Neutral badge",
  },
  render: (args) => <Badge {...args}>{args.children}</Badge>,
};

export const NeutralWithCircle: Story = {
  args: {
    variant: "neutral",
    withCircle: true,
    children: "Neutral badge with circle",
  },
  render: (args) => <Badge {...args}>{args.children}</Badge>,
};

export const Green: Story = {
  args: {
    variant: "green",
    withCircle: false,
    children: "Green badge",
  },
  render: (args) => <Badge {...args}>{args.children}</Badge>,
};

export const GreenWithCircle: Story = {
  args: {
    variant: "green",
    withCircle: true,
    children: "Green badge with circle",
  },
  render: (args) => <Badge {...args}>{args.children}</Badge>,
};

export const Yellow: Story = {
  args: {
    variant: "yellow",
    withCircle: false,
    children: "Yellow badge",
  },
  render: (args) => <Badge {...args}>{args.children}</Badge>,
};

export const YellowWithCircle: Story = {
  args: {
    variant: "yellow",
    withCircle: true,
    children: "Yellow badge with circle",
  },
  render: (args) => <Badge {...args}>{args.children}</Badge>,
};

export const Red: Story = {
  args: {
    variant: "red",
    withCircle: false,
    children: "Proceed with caution",
  },
  render: (args) => <Badge {...args}>{args.children}</Badge>,
};

export const RedWithCircle: Story = {
  args: {
    variant: "red",
    withCircle: true,
    children: "Proceed with caution",
  },
  render: (args) => <Badge {...args}>{args.children}</Badge>,
};
