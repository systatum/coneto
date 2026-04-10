import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-components";
import { Frame } from "./frame";

const meta: Meta<typeof Frame> = {
  title: "Stage/Frame",
  component: Frame,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Frame** is a container component to group content visually.
It optionally displays a title overlay and supports full customization of container and title styles.
Ideal for creating card-like layouts, grouped form sections, or any visually separated content.

---

### ✨ Features
- 🏷 **Title overlay**: Optional title displayed at the top border of the frame.
- 🎨 **Customizable styles**: Override styles for container and title using styled-components \`CSSProp\`.
- 🧩 **Flexible content**: Wrap any ReactNode inside the frame, such as forms, cards, or grouped inputs.
- 🖼 **Visual separation**: Provides border, padding, rounded corners, and shadow for clear separation.
- ⛔ **Accessible**: Uses \`aria-label="frame"\` for semantic clarity.

---

### 📌 Usage
\`\`\`tsx
<Frame
  title="User Information"
  styles={{
    containerStyle: css\`
      border: 2px solid #60a5fa;
      background-color: #f0f9ff;
      padding: 2rem;
    \`,
    titleStyle: css\`
      color: #1d4ed8;
      font-weight: 600;
    \`,
  }}
>
  <form>
    <label>
      Name:
      <input type="text" placeholder="Enter your name" />
    </label>
    <label>
      Email:
      <input type="email" placeholder="Enter your email" />
    </label>
  </form>
</Frame>
\`\`\`

- Use \`title\` to label the frame visually.
- Customize \`containerStyle\` for borders, shadows, background, and spacing.
- Customize \`titleStyle\` for color, font size, and spacing of the title overlay.
- Embed any ReactNode inside to structure content as needed.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      description:
        "Optional title displayed as an overlay at the top border of the frame.",
      control: "text",
    },
    styles: {
      description: `
Custom styles for the Frame component. This object allows you to override styles for specific parts of the frame:

- **containerStyle**: Styles applied to the outer frame container, including border, padding, background, and layout.
- **titleStyle**: Styles applied to the title container, controlling the overlay's typography and spacing.

Each field accepts a \`CSSProp\` (styled-components compatible), enabling advanced customization such as spacing, colors, borders, and typography without modifying the component itself.
      `,
      control: "object",
    },
    children: {
      description:
        "Content rendered inside the frame. This can be forms, grouped inputs, cards, or any structured layout.",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Frame>;

export const Default: Story = {
  args: {
    styles: {
      containerStyle: css`
        font-size: 14px;
      `,
    },
    children: <>This is inside the frame.</>,
  },
  render: (args) => {
    return <Frame {...args} />;
  },
};

export const WithTitle: Story = {
  args: {
    title: "Frame Title",
    styles: {
      containerStyle: css`
        font-size: 14px;
      `,
    },
    children: <>This frame has a title.</>,
  },
  render: (args) => {
    return <Frame {...args} />;
  },
};
