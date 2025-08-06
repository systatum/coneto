import { Meta, StoryObj } from "@storybook/react";
import { Badge, BadgeVariantProps } from "./badge";
import { css } from "styled-components";

const meta: Meta<typeof Badge> = {
  title: "Content/Badge",
  component: Badge,
  tags: ["autodocs"],
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
    },
    withCircle: { control: "boolean" },
    caption: { control: "text" },
    badgeStyle: { control: false },
    backgroundColor: { control: "color" },
    textColor: { control: "color" },
    circleColor: { control: "color" },
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
            badgeStyle={css`
              width: 100%;
              max-width: 120px;
            `}
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
