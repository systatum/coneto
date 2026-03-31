import { Meta, StoryObj } from "@storybook/react";
import { EmptySlate } from "./empty-slate";
import { Button } from "./button";
import { css } from "styled-components";

const meta: Meta<typeof EmptySlate> = {
  title: "Content/EmptySlate",
  component: EmptySlate,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
EmptySlate is a versatile component to display a visually appealing empty state in your UI. It can include an image, title, subtitle, and optional actions like buttons, guiding users on what to do next. Perfect for dashboards, lists, or any content area with no data.

---

### ✨ Features
- 🖼️ **Image support**: Display a visual illustration via the \`imageUrl\` prop.
- 📝 **Title and subtitle**: Provide clear messaging with optional subtitle for additional context.
- 🖱️ **Action support**: Render custom interactive elements like buttons, links, or call-to-action components.
- 🎨 **Fully styleable**: Customize container, image, title, subtitle, and action styles via the \`styles\` prop.
- ⚡ **Lightweight and flexible**: Minimal structure so you can compose complex empty states easily.

---

### 📌 Usage
\`\`\`tsx
<EmptySlate
  imageUrl="/images/empty-state.svg"
  title="No Items Found"
  subtitle="Try adjusting your filters or adding a new item."
  actions={
    <>
        <Button variant="default">Add Item</Button>
        <Button variant="primary">Learn More</Button>
      </>
  }
  styles={{
    containerStyle: css\`padding: 2rem; text-align: center;\`,
    imageStyle: css\`max-width: 200px; margin: 0 auto;\`,
    titleStyle: css\`font-size: 1.5rem; font-weight: 600;\`,
    subtitleStyle: css\`font-size: 1rem; color: #666;\`,
    actionsStyle: css\`margin-top: 1rem;\`,
  }}
/>
\`\`\`

- Use \`imageUrl\` to give a visual cue for the empty state.
- Titles and subtitles guide the user and provide context.
- Actions can include buttons or links to direct users on what to do next.
- Styles can be overridden for each part to match your design system.

`,
      },
    },
  },
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
- **imageStyle**: Radio input and visual circle
- **labelStyle**: Label text
- **descriptionStyle**: Description text below the label
- **errorStyle**: Error message when validation fails
...
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
