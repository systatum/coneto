import { Meta, StoryObj } from "@storybook/react";
import { EmptySlate } from "./empty-slate";
import { Button } from "./button";
import { css } from "styled-components";

const meta: Meta<typeof EmptySlate> = {
  title: "Content/EmptySlate",
  component: EmptySlate,
  tags: ["autodocs"],
  argTypes: {
    imageUrl: {
      control: "text",
      description: "URL of the image to display as visual context.",
    },
    title: {
      control: "text",
      description: "Main title of the empty state.",
    },
    subtitle: {
      control: "text",
      description: "Optional subtitle to give more context.",
    },
    actions: {
      control: false,
      description:
        "Optional React node to render interactive elements like buttons.",
    },
    containerStyle: {
      control: false,
      description:
        "Optional styled-components CSS for container customization.",
    },
    imageStyle: {
      control: false,
      description:
        "Optional styled-components CSS for image wrapper customization.",
    },
    childStyle: {
      control: false,
      description:
        "Optional styled-components CSS for content area customization.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof EmptySlate>;

export const Default: Story = {
  args: {
    imageUrl: "https://picsum.photos/200?random=1",
    title: "Manage your inventory transfers",
    subtitle: "Track and receive your incoming inventory from suppliers.",
    actions: (
      <>
        <Button variant="default">Add Item</Button>
        <Button variant="primary">Learn More</Button>
      </>
    ),
    containerStyle: css`
      text-align: center;
    `,
  },
  render: (args) => {
    return <EmptySlate {...args} />;
  },
};
