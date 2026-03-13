import { Meta, StoryObj } from "@storybook/react";
import { Badge, BadgeVariantProps } from "./badge";
import { css } from "styled-components";
import { RiCloseLine } from "@remixicon/react";

const meta: Meta<typeof Badge> = {
  title: "Content/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **Badge** component is a flexible, customizable UI element designed to display small, contextual information such as statuses, labels, or tags. 

Key features include:
- **Variants**: Predefined color schemes for common states (neutral, green, yellow, red).
- **Custom Colors**: Override default colors for text, background, and optional circle indicator.
- **Circle Indicator**: Optional small colored circle to visually highlight status.
- **Actions**: Optional icons or buttons for additional interactivity.
- **Accessibility**: Built with ARIA labels for badges, circles, and actions.

This component is ideal for use cases like status indicators, category tags, or badges with interactive actions.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["neutral", "green", "yellow", "red", "N/A"],
      mapping: {
        neutral: "neutral",
        green: "green",
        yellow: "yellow",
        red: "red",
        "N/A": null,
      },
      description: "Select a predefined color variant for the badge.",
    },
    withCircle: {
      control: "boolean",
      description:
        "If true, displays a small circle next to the badge caption.",
    },
    caption: {
      control: "text",
      description: "The text content of the badge.",
    },
    styles: {
      control: false,
      description: "Custom CSS styles for the badge container.",
    },
    backgroundColor: {
      control: "color",
      description: "Override the badge background color.",
    },
    textColor: {
      control: "color",
      description: "Override the badge text color.",
    },
    circleColor: {
      control: "color",
      description: "Override the circle indicator color.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: null,
    caption: "Default badge",
    withCircle: true,
  },
  render: (args) => <Badge {...args} />,
};

export const WithActions: Story = {
  args: {
    variant: null,
    caption: "With action badge",
    withCircle: true,
    actions: [
      {
        icon: { image: RiCloseLine },
        onClick: () => {
          console.log("Data was deleted");
        },
        size: 12,
        title: "This is action on the badge",
      },
    ],
  },
  render: (args) => <Badge {...args} />,
};

export const Neutral: Story = {
  args: {
    variant: "neutral",
    withCircle: true,
    caption: "Neutral badge with circle",
  },
  render: (args) => <Badge {...args} />,
};

export const Green: Story = {
  args: {
    variant: "green",
    withCircle: true,
    caption: "Green badge with circle",
  },
  render: (args) => <Badge {...args} />,
};

export const Yellow: Story = {
  args: {
    variant: "yellow",
    withCircle: true,
    caption: "Yellow badge with circle",
  },
  render: (args) => <Badge {...args} />,
};

export const Red: Story = {
  args: {
    variant: "red",
    withCircle: true,
    caption: "Proceed with caution",
  },
  render: (args) => <Badge {...args} />,
};

export const Custom: Story = {
  render: () => {
    const BADGE_OPTIONS = [
      { id: 1, variant: "neutral", caption: "Anime" },
      { id: 2, variant: "green", caption: "Manga" },
      { id: 3, variant: "yellow", caption: "Comics" },
      { id: 4, variant: "red", caption: "Movies" },
      { id: 5, variant: "neutral", caption: "Podcasts" },
      {
        id: 6,
        backgroundColor: "#4a5055",
        textColor: "#eee",
        caption: "TV Shows",
      },
      {
        id: 7,
        backgroundColor: "rgb(36, 123, 160)",
        textColor: "#fff",
        caption: "Novels",
      },
      {
        id: 8,
        backgroundColor: "#ff6f61",
        textColor: "#3b0000",
        caption: "Music",
      },
      {
        id: 9,
        backgroundColor: "rgb(94, 53, 177)",
        textColor: "#fff",
        caption: "Games",
      },
      {
        id: 10,
        backgroundColor: "#0b3d91",
        textColor: "#e0e0e0",
        caption: "Webtoons",
      },
    ];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {BADGE_OPTIONS.map((badge) => (
          <Badge
            styles={{
              self: css`
                width: 100%;
                max-width: 120px;
              `,
            }}
            backgroundColor={badge.backgroundColor}
            textColor={badge.textColor}
            variant={badge.variant as BadgeVariantProps}
            key={badge.id}
            withCircle
            caption={badge.caption}
          />
        ))}
      </div>
    );
  },
};
