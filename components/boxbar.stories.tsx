import { Meta, StoryObj } from "@storybook/react/*";
import Boxbar from "./boxbar";
import Badge from "./badge";

const meta: Meta<typeof Boxbar> = {
  title: "Stage/Boxbar",
  component: Boxbar,
  tags: ["autodocs"],
  argTypes: {
    containerClassName: {
      control: "text",
      description:
        "Optional class name to style the container of the children.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    childClassName: {
      control: "text",
      description: "Optional class name to style the child content.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    minHeight: {
      control: { type: "number", min: 0, step: 10 },
      description: "Minimum height of the Boxbar (when collapsed).",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "40" },
      },
    },
    maxHeight: {
      control: { type: "number", min: 0, step: 10 },
      description: "Maximum height of the Boxbar (when expanded).",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "400" },
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
      <Boxbar childClassName="gap-1">
        {BADGE_OPTIONS.map((badge) => (
          <Badge
            className="w-full max-w-[120px]"
            key={badge.id}
            caption={badge.caption}
            withCircle
          />
        ))}
      </Boxbar>
    );
  },
};
