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
    styles: {
      description: `
Custom styles for the Radio component. This object allows you to override styles for individual parts:

- **containerStyle**: Outer wrapper of the Radio
- **titleStyle**: Title displayed above the radio
- **inputContainerStyle**: Wrapper for input, icon, and label
- **self / selfStyle**: Radio input and visual circle
- **labelStyle**: Label text
- **descriptionStyle**: Description text below the label
- **errorStyle**: Error message when validation fails

Each field accepts a \`CSSProp\` (styled-components compatible) and can be used to customize layout, spacing, colors, and other visual properties.
    `,
      control: false,
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
    styles: {
      containerStyle: css`
        text-align: center;
      `,
    },
  },
  render: (args) => {
    return <EmptySlate {...args} />;
  },
};
