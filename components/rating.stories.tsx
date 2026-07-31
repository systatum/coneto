import { useArgs } from "@storybook/preview-api";
import { Meta, StoryObj } from "@storybook/react";
import { Rating, RatingSize } from "./rating";
import { useState } from "react";
import styled from "styled-components";

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
- ✍️ **Editable or read-only**: The component becomes editable when \`onChange\` is provided; otherwise it is displayed in read-only mode.
- 🌓 **Half-star precision**: Supports half-star selection while hovering and clicking.
- 🏷 **Custom score label**: Display a static or dynamic label with \`scoreLabel.text\`.
- 📍 **Flexible label position**: Position the score label on the top, right, bottom, or left of the rating with \`scoreLabel.position\`.
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
  scoreLabel={{
    text: ({ value, maxValue }) => \`\${value} / \${maxValue}\`,
  }}
  onChange={(e) => setRating(e.target.value)}
/>
\`\`\`

### 🎨 Custom score label

\`\`\`tsx
<Rating
  rating="4.5"
  scoreLabel={{
    text: ({ value, maxValue }) =>
      \`\${value?.toFixed(1)} out of \${maxValue}\`,
    position: RatingScoreLabelPosition.Bottom,
  }}
/>
\`\`\`

- Use \`rating\` together with \`onChange\` to control the component.
- Provide \`onChange\` to make the rating editable.
- Use \`scoreLabel.text\` to render a static string, React node, or render function.
- Use \`scoreLabel.position\` to place the label on the \`top\`, \`right\`, \`bottom\`, or \`left\` of the rating. The default position is \`right\`.
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
    scoreLabel: {
      control: "boolean",
      description:
        "Set to `true` to display the default rating label (`3.5 / 5`), or provide a render function to customize the label content.",
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
  },

  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    return (
      <Rating
        {...args}
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

const StyledRatingLabel = styled.span`
  color: #2563eb;
  font-weight: 700;
  font-style: italic;
`;

export const WithLabel: Story = {
  render: () => {
    const [rating, setRating] = useState({ default: "4.5", render: "4.5" });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div>
          <div>Default</div>
          <Rating
            rating={rating.default}
            scoreLabel={{
              text: rating.default,
            }}
            onChange={(e) =>
              setRating((prev) => ({ ...prev, default: e.target.value }))
            }
          />
        </div>

        <div>
          <div>Custom render</div>
          <Rating
            rating={rating.render}
            scoreLabel={{
              text: ({ value, maxValue }) => (
                <StyledRatingLabel>
                  {value.toFixed(1)} / {maxValue} Excellent
                </StyledRatingLabel>
              ),
            }}
            onChange={(e) =>
              setRating((prev) => ({ ...prev, render: e.target.value }))
            }
          />
        </div>
      </div>
    );
  },
};

export const Size: Story = {
  render: () => {
    const RATING_SIZES = Object.entries(RatingSize).map(([label, size]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      size,
    }));

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {RATING_SIZES.map(({ label, size }) => (
          <div key={size}>
            <div>{label}</div>
            <Rating rating="4.5" size={size} />
          </div>
        ))}
      </div>
    );
  },
};
