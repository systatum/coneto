import { Meta, StoryObj } from "@storybook/react";
import { Rating } from "./rating";
import { useArgs } from "@storybook/preview-api";

const meta: Meta<typeof Rating> = {
  title: "Input Elements/Rating",
  component: Rating,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Rating is a star-based input component for capturing user ratings with optional half-star support.

---

### ✨ Features
- ⭐ **Editable or read-only**: Can be interactive or display-only.
- 🌓 **Half-star support**: Accurately capture half-star ratings on mouse hover.
- 🔢 **Optional label**: Display numeric rating (e.g., 3.5 / 5) next to stars.
- 🖌 **Sizes**: Small (sm), Medium (md), Large (lg).
- 🔧 **Custom styles**: Can style container, label, or star wrapper.

        `,
      },
    },
  },
  argTypes: {
    rating: {
      control: "number",
      description: "Current rating value (0–5).",
    },
    editable: {
      control: "boolean",
      description: "Whether the stars can be interacted with to set rating.",
    },
    withLabel: {
      control: "boolean",
      description: "Display numeric label alongside stars.",
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "Star icon size.",
    },
    disabled: {
      control: "boolean",
      description: "Disables rating input if true.",
    },
    name: {
      control: "text",
      description: "Name of the hidden input field.",
    },
    id: {
      control: "text",
      description: "HTML id of the hidden input.",
    },
    styles: {
      control: false,
      description:
        "Custom styles object for container, label, or stars. Not editable via controls.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    rating: "0",
    withLabel: false,
  },

  render: (args) => {
    const [, setUpdateArgs] = useArgs();
    return (
      <Rating
        {...args}
        editable
        onChange={(e) => setUpdateArgs({ rating: e })}
      />
    );
  },
};

export const NotEditable: Story = {
  args: {
    rating: "4.5",
  },
  render: (args) => <Rating {...args} />,
};

export const WithLabel: Story = {
  args: {
    rating: "4.5",
    withLabel: true,
  },
  render: (args) => <Rating {...args} />,
};

export const Small: Story = {
  args: {
    rating: "4.5",
    size: "sm",
  },
  render: (args) => <Rating {...args} />,
};

export const Medium: Story = {
  args: {
    rating: "4.5",
    size: "md",
  },
  render: (args) => <Rating {...args} />,
};

export const Large: Story = {
  args: {
    rating: "4.5",
    size: "lg",
  },
  render: (args) => <Rating {...args} />,
};
