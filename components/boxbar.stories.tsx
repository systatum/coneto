import { Meta, StoryObj } from "@storybook/react";
import { Boxbar } from "./boxbar";
import { Badge } from "./badge";
import { css } from "styled-components";

const meta: Meta<typeof Boxbar> = {
  title: "Stage/Boxbar",
  component: Boxbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **Boxbar** component is a responsive container designed to display a collection of items in a horizontal, wrapped layout with automatic collapsing behavior.

It intelligently measures its content and shows a toggle button when items overflow beyond the first row.

---

### ✨ Features
- 📦 Flexible **wrapped layout** using flexbox
- 📏 Automatically detects **overflow content**
- 🔽 Collapsible / expandable behavior
- 🎯 Smart **first-row height calculation**
- ⚡ Smooth animation using Framer Motion
- 🧩 Fully customizable styles

---

### 🧱 Component Structure

\`\`\`tsx
<Boxbar>
  <Badge caption="Item 1" />
  <Badge caption="Item 2" />
  <Badge caption="Item 3" />
</Boxbar>
\`\`\`

---

### ⚙️ Core Behaviors

#### Collapsing
- Initially shows only the **first row**
- Expands when toggle button is clicked

#### Auto Measurement
- Uses \`ResizeObserver\`
- Recalculates height when content changes

#### Toggle Button
- Appears only when content overflows
- Rotates icon on expand/collapse

---

### 🎯 Usage Guidelines
- Use for **tags, filters, or grouped items**
- Ideal when content can grow dynamically
- Avoid using with extremely large DOM lists
        `,
      },
    },
  },

  argTypes: {
    children: {
      control: false,
      description: `
Content inside the Boxbar.

- Typically a list of components (e.g. Badge, Chip)
- Automatically wrapped into multiple rows
      `,
      table: {
        type: { summary: "ReactNode" },
      },
    },

    styles: {
      control: false,
      description: `
Custom styles for the container.

Available fields:
- \`self\`: styles applied to the root container

Accepts \`CSSProp\` (styled-components).
      `,
      table: {
        type: { summary: "BoxbarStylesProps" },
        defaultValue: { summary: "undefined" },
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
            styles={{
              self: css`
                width: 100%;
                max-width: 100px;

                &:hover {
                  border-color: #4cbbf7;
                  cursor: pointer;
                  transition: all 0.5s ease-in-out;
                }
              `,
            }}
            key={badge.id}
            caption={badge.caption}
            withCircle
          />
        ))}
      </Boxbar>
    );
  },
};
