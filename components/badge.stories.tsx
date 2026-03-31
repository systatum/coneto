import { Meta, StoryObj } from "@storybook/react";
import { Badge, BadgeVariantProps } from "./badge";
import { css } from "styled-components";
import { RiCloseLine } from "@remixicon/react";

const meta: Meta<typeof Badge> = {
  title: "Content/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **Badge** component is a flexible UI element used to display small pieces of contextual information such as statuses, labels, or tags.

It supports predefined variants, custom colors, optional indicators, and interactive actions.

---

### ✨ Features
- 🎨 Predefined **color variants** (neutral, green, yellow, red)
- 🎯 Fully customizable **background, text, and circle colors**
- 🔵 Optional **status indicator circle**
- ⚡ Support for **interactive actions (icons/buttons)**
- 🧩 Flexible layout with caption and actions
- ♿ Accessible with ARIA labels

---

### 🧱 Component Structure

\`\`\`tsx
<Badge
  variant="green"
  caption="Active"
  withCircle
/>
\`\`\`

---

### ⚙️ Core Behaviors

#### Variants
- Use \`variant\` for predefined styles
- Can be overridden by custom colors

#### Custom Colors
- \`backgroundColor\`, \`textColor\`, \`circleColor\`
- Take priority over variant styles

#### Circle Indicator
- Enable with \`withCircle\`
- Uses generated or custom color

#### Actions
- Add interactive icons via \`actions\`
- Each action supports click handlers and styles

---

### 🎯 Usage Guidelines
- Use for **status indicators** (e.g. Active, Pending, Error)
- Keep captions **short and meaningful**
- Use \`withCircle\` for visual emphasis
- Use \`actions\` for quick inline interactions
        `,
      },
    },
  },

  args: {
    variant: null,
    caption: "Badge",
    withCircle: false,
  },

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
      description: `
Predefined color variant.

- Controls background and text color
- Can be overridden by custom color props
      `,
      table: {
        type: { summary: '"neutral" | "green" | "yellow" | "red" | null' },
        defaultValue: { summary: "null" },
      },
    },

    caption: {
      control: "text",
      description: `
Text content of the badge.

- Displayed as the main label
- Should be short and concise
      `,
      table: {
        type: { summary: "string" },
      },
    },

    withCircle: {
      control: "boolean",
      description: `
Displays a small circular indicator.

- Positioned before the caption
- Useful for status representation
      `,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    backgroundColor: {
      control: "color",
      description: `
Override the badge background color.

- Takes priority over \`variant\`
      `,
      table: {
        type: { summary: "string" },
      },
    },

    textColor: {
      control: "color",
      description: `
Override the badge text color.

- Takes priority over \`variant\`
      `,
      table: {
        type: { summary: "string" },
      },
    },

    circleColor: {
      control: "color",
      description: `
Override the circle indicator color.

- Defaults to generated or variant-based color
      `,
      table: {
        type: { summary: "string" },
      },
    },

    onClick: {
      action: "badge clicked",
      description: `
Callback triggered when the badge is clicked.

- Enables clickable behavior
      `,
      table: {
        type: { summary: "() => void" },
      },
    },

    actions: {
      description: `
List of interactive actions.

Each action supports:
- icon
- onClick
- disabled
- styles
- title

Used for inline operations (e.g. remove, edit).
      `,
      control: false,
      table: {
        type: { summary: "BadgeActionProps[]" },
      },
    },

    styles: {
      description: `
Custom styles override.

Available fields:
- \`self\`: badge container
- \`actionWrapperStyle\`: wrapper for actions

Accepts \`CSSProp\` (styled-components).
      `,
      control: false,
      table: {
        type: { summary: "BadgeStylesProps" },
      },
    },
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

export const WithActions: Story = {
  args: {
    variant: null,
    caption: "With action badge",
    withCircle: true,
    actions: [
      {
        icon: { image: RiCloseLine },
        onClick: () => {
          console.log("Data was deleted");
        },
        size: 12,
        title: "This is action on the badge",
      },
    ],
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
            styles={{
              self: css`
                width: 100%;
                max-width: 120px;
              `,
            }}
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
