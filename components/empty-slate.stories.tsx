import { Meta, StoryObj } from "@storybook/react";
import EmptySlate from "./empty-slate";
import { Button } from "./button";

const meta: Meta<typeof EmptySlate> = {
  title: "Content/EmptySlate",
  component: EmptySlate,
  tags: ["autodocs"],
  argTypes: {
    imageUrl: {
      control: "text",
      description: "Image URL to be displayed at the top",
      defaultValue: "https://via.placeholder.com/150",
    },
    title: {
      control: "text",
      description: "Main title text",
      defaultValue: "Nothing Here Yet",
    },
    subtitle: {
      control: "text",
      description: "Optional subtitle text",
      defaultValue: "Start by adding some content.",
    },
    actions: {
      control: false,
      description: "Optional ReactNode to render action buttons",
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
  },
  render: (args) => {
    return <EmptySlate {...args} />;
  },
};
