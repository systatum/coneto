import React from "react";
import Card from "./card";
import { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";

const meta: Meta<typeof Card> = {
  title: "Content/Card",
  component: Card,
  argTypes: {
    shadow: {
      control: {
        type: "select",
        options: ["none", "sm", "md", "lg", "xl", "2xl"],
      },
      description: "Shadow size",
      defaultValue: "sm",
    },
    radius: {
      control: {
        type: "select",
        options: ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "full"],
      },
      description: "Border radius",
      defaultValue: "xs",
    },
    padding: {
      control: {
        type: "select",
        options: [
          "none",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
        ],
      },
      description: "Padding size",
      defaultValue: "sm",
    },
    className: {
      control: "text",
      description: "Additional custom classes",
    },
    children: {
      control: "text",
      description: "Card content",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

const renderCard = (args) => <Card {...args}>{args.children}</Card>;

export const Default: Story = {
  args: {
    shadow: "sm",
    padding: "sm",
    children: "Card with full rounded corners",
  },
  render: renderCard,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cardContent = await canvas.getByText(
      "Card with full rounded corners"
    );
    await expect(cardContent).toBeVisible();
  },
};
