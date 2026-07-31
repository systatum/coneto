import { useArgs } from "@storybook/preview-api";
import { Meta, StoryObj } from "@storybook/react";
import { Rating } from "./rating";
import { useState } from "react";

const meta: Meta<typeof Rating> = {
  title: "Input Elements/Rating",
  component: Rating,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Rating** is a star-based input component for displaying or collecting ratings with optional half-star precision.

---

### ✨ Features
- ⭐ **Controlled value**: Control the rating through the \`rating\` prop and handle updates with \`onChange\`.
- ✍️ **Editable or read-only**: Enable user interaction with \`editable\`, or display ratings in read-only mode.
- 🌓 **Half-star precision**: Supports half-star selection while hovering and clicking.
- 🏷 **Custom label rendering**: Display the default rating label or customize it with \`renderLabel\`.
- 📏 **Multiple sizes**: Supports Small (\`sm\`), Medium (\`md\`), and Large (\`lg\`) star sizes.
- 🛠 **Custom styling**: Customize the wrapper, stars, and label through the \`styles\` prop.
- 🔒 **Disabled support**: Prevent interactions with \`disabled\`.
- 🧩 First-class **stateful form integration**

---

### 📌 Usage

\`\`\`tsx
const [rating, setRating] = useState("3.5");

<Rating
  rating={rating}
  editable
  renderLabel
  onChange={(e) => setRating(e.target.value)}
/>
\`\`\`

### 🎨 Custom label

\`\`\`tsx
<Rating
  rating="4.5"
  renderLabel={({ value, maxValue }) =>
    \`\${value.toFixed(1)} out of \${maxValue}\`
  }
/>
\`\`\`

- Use \`rating\` together with \`onChange\` to control the component.
- Set \`editable\` to allow users to change the rating.
- Set \`renderLabel\` to \`true\` to display the default label (\`3.5 / 5\`).
- Pass a function to \`renderLabel\` to render a custom label.
- Wrap the component in \`FieldLane\` to display labels, helper text, and validation messages.
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
    renderLabel: {
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
    renderLabel: false,
  },

  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    return (
      <Rating
        {...args}
        editable
        onChange={(e) => setUpdateArgs({ rating: e.target.value })}
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
    renderLabel: true,
  },
  render: (args) => {
    const [rating, setRating] = useState(args.rating);
    return (
      <Rating
        {...args}
        rating={rating}
        onChange={(e) => setRating(e.target.value)}
      />
    );
  },
};

export const Small: Story = {
  args: {
    rating: "4.5",
    size: "sm",
  },
  render: (args) => {
    const [rating, setRating] = useState(args.rating);
    return (
      <Rating
        {...args}
        rating={rating}
        onChange={(e) => setRating(e.target.value)}
      />
    );
  },
};

export const Medium: Story = {
  args: {
    rating: "4.5",
    size: "md",
  },
  render: (args) => {
    const [rating, setRating] = useState(args.rating);
    return (
      <Rating
        {...args}
        rating={rating}
        onChange={(e) => setRating(e.target.value)}
      />
    );
  },
};

export const Large: Story = {
  args: {
    rating: "4.5",
    size: "lg",
  },
  render: (args) => {
    const [rating, setRating] = useState(args.rating);
    return (
      <Rating
        {...args}
        rating={rating}
        onChange={(e) => setRating(e.target.value)}
      />
    );
  },
};
