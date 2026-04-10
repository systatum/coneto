import { Meta, StoryObj } from "@storybook/react";
import { Stepline, SteplineItemProps } from "./stepline";
import { useState } from "react";

const meta: Meta<typeof Stepline> = {
  title: "Controls/Stepline",
  component: Stepline,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Stepline is a horizontal step indicator component designed for workflows, progress tracking, or multi-step forms.
It supports icons, labels, collapsible tooltips, customizable styles, and click events for individual steps.

---

### ✨ Features
- 🖱 **Clickable steps**: Each step can trigger an \`onClick\` callback.
- 📐 **Custom spacing**: Use the \`gap\` prop to adjust space between steps.
- 🛠 **Custom styles**: Fully styleable using \`styles\` prop for wrapper, circles, and text.
- 🎨 **Variants**: Steps can have different variants (\`todo\`, \`current\`, \`completed\`, \`error\`).
- 🖌 **Collapsible mode**: Collapse step labels and show them as tooltips when hovered.
- 📦 **Composable children**: Each step can have a title, subtitle, and custom sidenotes.

---

### 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`children\` | ReactNode | — | Step components (\`Stepline.Item\`) to render inside the stepline. |
| \`styles\` | SteplineStyles | — | Custom CSS styles for the wrapper. |
| \`gap\` | number | 8 | Space in pixels between steps. |
| \`collapsed\` | boolean | false | Collapses step labels into tooltips. |

---

### 🔧 Stepline.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`title\` | string | — | Step main title. |
| \`subtitle\` | string | — | Step subtitle or description. |
| \`variant\` | 'todo' \| 'current' \| 'completed' \| 'error' | 'todo' | Step visual variant affecting circle color and line color. |
| \`active\` | boolean | false | Scale the outer circle to indicate active state. |
| \`onClick\` | () => void | — | Callback when the step is clicked. |
| \`styles\` | SteplineItemStyles | — | Custom styles for the item, outer/inner circle, and text wrapper. |

---

### 📌 Usage

\`\`\`tsx
<Stepline gap={16} collapsed={false} styles={{ self: css\`padding: 1rem;\` }}>
  <Stepline.Item
    title="Step 1"
    subtitle="Start"
    variant="completed"
    onClick={() => console.log("Step 1 clicked")}
  />
  <Stepline.Item
    title="Step 2"
    subtitle="In progress"
    variant="current"
  />
  <Stepline.Item
    title="Step 3"
    subtitle="Review"
    variant="todo"
    active
  />
  <Stepline.Item
    title="Step 4"
    subtitle="Complete"
    variant="todo"
  />
</Stepline>
\`\`\`

- Use \`gap\` to adjust spacing between steps.
- Set \`collapsed\` to show labels inside tooltips instead of inline.
- Pass \`onClick\` to handle step click events.
- Fully style via \`styles.self\` for wrapper or individual step styles.
        `,
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description:
        "Step components (Stepline.Item) to render inside the stepline.",
    },
    styles: {
      control: false,
      description: "Custom CSS styles for the Stepline wrapper.",
    },
    gap: { control: "number", description: "Space in pixels between steps." },
    collapsed: {
      control: "boolean",
      description: "Whether to collapse step labels into tooltips.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Stepline>;

export const Default: Story = {
  render: () => {
    return (
      <Stepline>
        {Array.from({ length: 5 }).map((_, index) => {
          return <Stepline.Item key={index} variant={"todo"} />;
        })}
      </Stepline>
    );
  },
};

export const Reversable: Story = {
  render: () => {
    const [active, setActive] = useState(10);

    const STEPLINE_ITEMS: SteplineItemProps[] = [
      {
        title: "Application Submitted",
        subtitle: "Your application has been received",
        variant: "completed",
      },
      {
        title: "Initial Screening",
        subtitle: "Resume and profile review",
        variant: "completed",
      },
      {
        title: "Technical Interview",
        subtitle: "Assessment of technical skills",
        variant: "error",
      },
      {
        title: "Final Interview",
        subtitle: "Discussion with the team lead",
        line: "dash",
      },
      {
        title: "Offer Sent",
        subtitle: "Waiting for your confirmation",
        line: "dash",
      },
    ];

    return (
      <Stepline>
        {STEPLINE_ITEMS.map((data, index) => (
          <Stepline.Item
            {...data}
            onClick={() => setActive(index)}
            active={active === index}
            key={index}
          />
        ))}
      </Stepline>
    );
  },
};

export const Collapsed: Story = {
  render: () => {
    const [active, setActive] = useState(10);

    const STEPLINE_ITEMS: SteplineItemProps[] = [
      {
        title: "Application Submitted",
        subtitle: "Your application has been received",
        variant: "completed",
      },
      {
        title: "Initial Screening",
        subtitle: "Resume and profile review",
        variant: "completed",
      },
      {
        title: "Technical Interview",
        subtitle: "Assessment of technical skills",
        variant: "error",
      },
      {
        title: "Final Interview",
        subtitle: "Discussion with the team lead",
        line: "dash",
      },
      {
        title: "Offer Sent",
        subtitle: "Waiting for your confirmation",
        line: "dash",
      },
    ];

    return (
      <Stepline collapsed gap={4}>
        {STEPLINE_ITEMS.map((data, index) => (
          <Stepline.Item
            {...data}
            onClick={() => setActive(index)}
            active={active === index}
            key={index}
          />
        ))}
      </Stepline>
    );
  },
};
