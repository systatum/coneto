import { Meta, StoryObj } from "@storybook/react/*";
import { Carousel } from "./carousel";
import { useState } from "react";

const meta: Meta<typeof Carousel> = {
  title: "Stage/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **Carousel** component displays content as a horizontal sequence of slides with built-in navigation, swipe gestures, keyboard support, and pagination controls.

It supports both **controlled** and **uncontrolled** modes, allowing external state management or internal page handling depending on your use case.

---

### ✨ Features
- ↔️ Horizontal slide navigation
- 👆 Swipe gesture support
- ⌨️ Keyboard navigation
- 🎯 Controlled and uncontrolled modes
- 🔘 Built-in pagination controls
- 🎨 Customizable styling through \`styles\`
- 📏 Optional automatic height adjustment with \`autoHeight\`
- ♿ Accessibility-friendly navigation and labels

---

### 🧱 Component Structure

\`\`\`tsx
<Carousel control autoHeight>
  <SlideOne />
  <SlideTwo />
  <SlideThree />
</Carousel>
\`\`\`

---

### ⚙️ Core Behaviors

#### Navigation
- Previous and next buttons are automatically rendered
- Buttons are disabled at the first and last slide
- Supports swipe gestures on touch and pointer devices

#### Controlled Mode
- Provide \`currentPage\`
- Handle page updates through:
  - \`onNextPageRequested\`
  - \`onPrevPageRequested\`
  - \`control.onChange\`

\`\`\`tsx
<Carousel
  currentPage={page}
  onNextPageRequested={({ nextPage }) => setPage(nextPage)}
  onPrevPageRequested={({ prevPage }) => setPage(prevPage)}
/>
\`\`\`

#### Uncontrolled Mode
- Omit \`currentPage\`
- Use \`initialPage\` to define the starting slide

\`\`\`tsx
<Carousel initialPage={0}>
  ...
</Carousel>
\`\`\`

#### Pagination Controls
- Enable using \`control\`
- Supports custom positioning:
  - \`bottom-center\`
  - \`top-center\`

\`\`\`tsx
<Carousel
  control={{
    position: CarouselPosition.TopCenter,
  }}
>
  ...
</Carousel>
\`\`\`

#### Auto Height
- Enable with \`autoHeight\`
- The carousel container automatically adjusts its height to match the currently active slide
- Useful when slides contain content with different heights

\`\`\`tsx
<Carousel autoHeight>
  <ShortContent />
  <TallContent />
</Carousel>
\`\`\`

#### Keyboard Support
- ← Previous slide
- → Next slide
- Home → First slide
- End → Last slide

---

### 🎯 Usage Guidelines
- Use for step-by-step flows, onboarding, galleries, or paged content
- Prefer controlled mode when page state is managed externally
- Enable \`autoHeight\` when slide content varies significantly in height
- Use \`styles\` for visual customization instead of overriding internal elements directly
- Keep slide content widths responsive to ensure smooth swipe interactions
        `,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: () => {
    const [state, setState] = useState(0);

    return (
      <Carousel
        control={{
          onChange: (page) => setState(page),
        }}
        currentPage={state}
        onNextPageRequested={({ nextPage }) => {
          setState(nextPage);
        }}
        onPrevPageRequested={({ prevPage }) => {
          setState(prevPage);
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              height: 240,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "4rem",
              fontWeight: 700,
              background: `hsl(${i * 36}, 70%, 85%)`,
              borderRadius: 12,
            }}
          >
            {i + 1}
          </div>
        ))}
      </Carousel>
    );
  },
};

export const AutoHeight: Story = {
  render: () => {
    const [state, setState] = useState(0);

    return (
      <Carousel
        control={{
          onChange: (page) => setState(page),
        }}
        currentPage={state}
        onNextPageRequested={({ nextPage }) => {
          setState(nextPage);
        }}
        onPrevPageRequested={({ prevPage }) => {
          setState(prevPage);
        }}
        autoHeight
      >
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              height: 240 - (i % 3) * 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "4rem",
              fontWeight: 700,
              background: `hsl(${i * 36}, 70%, 85%)`,
              borderRadius: 12,
            }}
          >
            {i + 1}
          </div>
        ))}
      </Carousel>
    );
  },
};
