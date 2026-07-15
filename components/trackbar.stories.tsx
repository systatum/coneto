import { Meta, StoryObj } from "@storybook/react/*";
import { Trackbar, TrackbarVariant } from "./trackbar";
import { useEffect, useState } from "react";
import styled from "styled-components";

const meta: Meta<typeof Trackbar> = {
  title: "Controls/Trackbar",
  component: Trackbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **Trackbar** component visually represents the progress of a task or process.

It supports determinate and indeterminate states, multiple color variants, bidirectional progress, optional percentage labels, and custom styling hooks.

---

### ✨ Features

* 📊 Determinate progress with configurable values
* 🔄 Indeterminate loading animation
* 🎨 Multiple predefined variants (primary, success, danger, warning)
* ↔️ Support for left-to-right and right-to-left progress
* 🏷️ Optional percentage labeling
* 🎛️ Custom styling through style overrides
* ♿ Accessible with ARIA trackbar attributes

---

### 🧱 Component Structure

\`\`\`tsx
<Trackbar
  value={60}
  variant="primary"
  labeling="right"
/>
\`\`\`

---

### ⚙️ Core Behaviors

#### Determinate Mode

Use the \`value\` prop to display a specific completion percentage.

\`\`\`tsx
<Trackbar value={75} />
\`\`\`

* Values are automatically clamped between \`0\` and \`100\`
* Smooth width transitions are applied when the value changes

---

#### Indeterminate Mode

Use \`indeterminate\` when the progress amount is unknown.

\`\`\`tsx
<Trackbar indeterminate />
\`\`\`

* Displays a continuous loading animation
* Hides percentage labels automatically

---

#### Variants

Use \`variant\` to apply predefined semantic styles.

\`\`\`tsx
<Trackbar variant="success" />
\`\`\`

Available variants:

* \`primary\`
* \`success\`
* \`danger\`
* \`warning\`

---

#### Direction

Use \`directionTo\` to control the progress direction.

\`\`\`tsx
<Trackbar
  value={60}
  directionTo="left"
/>
\`\`\`

Available directions:

* \`right\` — fills from left to right
* \`left\` — fills from right to left

Works for both determinate and indeterminate modes.

---

#### Labeling

Display the progress percentage beside the progress bar.

\`\`\`tsx
<Trackbar
  value={60}
  labeling="right"
/>
\`\`\`

Available options:

* \`none\`
* \`right\`
* \`left\`

Labels are automatically hidden when \`indeterminate\` is enabled.

---

#### Custom Styles

Customize individual parts of the component using the \`styles\` prop.

\`\`\`tsx
<Trackbar
  value={60}
  styles={{
    containerStyle: css\`
      margin: 8px 0;
    \`,
    valueBarStyle: css\`
      border-radius: 9999px;
    \`,
    labelStyle: css\`
      font-weight: 700;
    \`,
  }}
/>
\`\`\`

Available style targets:

* \`containerStyle\`
* \`valueBarStyle\`
* \`labelStyle\`

---

### 🎯 Usage Guidelines

* Use **determinate mode** when completion progress is known
* Use **indeterminate mode** while waiting for unknown-duration operations
* Use semantic variants to communicate status and intent
* Prefer concise percentage labels for user-facing progress updates
* Use \`directionTo="left"\` for RTL interfaces or reverse progress flows
* Avoid displaying labels when progress information is not meaningful
`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Trackbar>;

export const Labelling: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setValue((prev) => (prev >= 100 ? 0 : prev + 10));
      }, 600);

      return () => clearInterval(interval);
    }, []);

    return (
      <Container>
        <Section>
          <Title>Labeling in right</Title>
          <Trackbar value={value} labeling="right" directionTo="right" />
        </Section>

        <Section>
          <Title>Labeling in left</Title>
          <Trackbar value={value} labeling="left" directionTo="left" />
        </Section>
      </Container>
    );
  },
};

export const Indeterminate: Story = {
  render: () => {
    return (
      <Container>
        <Section>
          <Title>Indeterminate direction to right</Title>
          <Trackbar indeterminate directionTo="right" />
        </Section>

        <Section>
          <Title>Indeterminate direction to left</Title>
          <Trackbar indeterminate directionTo="left" />
        </Section>
      </Container>
    );
  },
};

export const Variants: Story = {
  render: () => {
    return (
      <Container>
        {Object.values(TrackbarVariant).map((variant, index) => (
          <Section key={index}>
            <Title>Variant {variant}</Title>
            <Trackbar
              variant={variant}
              indeterminate
              directionTo={index % 2 === 0 ? "right" : "left"}
            />
          </Section>
        ))}
      </Container>
    );
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h2`
  margin: 0;
  font-weight: 500;
`;
