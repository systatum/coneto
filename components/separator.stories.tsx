import { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "Stage/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Separator is a visual divider component that separates content into sections with an optional title.

---

### ✨ Features
- ➖ **Divider line**: Adds a horizontal line across the container.
- 🔤 **Optional title**: Can display a floating text over the line.
- ↔️ **Text float**: Title can float left or right.
- 🧱 **Custom depth**: Adjust distance of the title from the container edge.
- 🎨 **Customizable styles**: Supports container, line, and title styling via CSS props.
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Optional title to display over the separator line.",
    },
    textFloat: {
      control: "radio",
      options: ["left", "right"],
      description: "Determines the side on which the title floats.",
    },
    depth: {
      control: "text",
      description: "Distance of the title from the container edge.",
    },
    styles: {
      control: false,
      description:
        "Custom styles object for container, line, and title. Not editable via controls.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  args: {},
  render: (args) => {
    return <Separator {...args} />;
  },
};

export const LeftSide: Story = {
  args: {
    textFloat: "left",
    title: "systatum.com",
  },
  render: (args) => {
    return <Separator {...args} />;
  },
};

export const RightSide: Story = {
  args: {
    textFloat: "right",
    title: "systatum.com",
  },
  render: (args) => {
    return <Separator {...args} />;
  },
};
