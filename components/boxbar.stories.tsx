import { Meta, StoryObj } from "@storybook/react";
import { Boxbar } from "./boxbar";
import { Badge } from "./badge";
import { css } from "styled-components";

const meta: Meta<typeof Boxbar> = {
  title: "Stage/Boxbar",
  component: Boxbar,
  tags: ["autodocs"],
  argTypes: {
    containerStyle: {
      control: "text",
      description:
        "Optional class name to style the container of the children.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    children: {
      control: false,
      description: "Content to render inside the Boxbar.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const BADGE_OPTIONS = [
      {
        id: 1,
        caption: "Anime",
      },
      {
        id: 2,
        caption: "Manga",
      },
      {
        id: 3,
        caption: "Comics",
      },
      {
        id: 4,
        caption: "Movies",
      },
      {
        id: 5,
        caption: "Podcasts",
      },
      {
        id: 6,
        caption: "TV Shows",
      },
      {
        id: 7,
        caption: "Novels",
      },
      {
        id: 8,
        caption: "Music",
      },
      {
        id: 9,
        caption: "Games",
      },
      {
        id: 10,
        caption: "Webtoons",
      },
    ];
    return (
      <Boxbar>
        {BADGE_OPTIONS.map((badge) => (
          <Badge
            badgeStyle={css`
              width: 100%;
              max-width: 100px;

              &:hover {
                border-color: #4cbbf7;
                cursor: pointer;
                transition: all 0.5s ease-in-out;
              }
            `}
            key={badge.id}
            caption={badge.caption}
            withCircle
          />
        ))}
      </Boxbar>
    );
  },
};
