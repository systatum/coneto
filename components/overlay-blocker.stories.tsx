import type { Meta, StoryObj } from "@storybook/react";
import { OverlayBlocker, OverlayBlockerRef } from "./overlay-blocker";
import { Button } from "./button";
import { useRef } from "react";

const meta: Meta<typeof OverlayBlocker> = {
  title: "Stage/OverlayBlocker",
  component: OverlayBlocker,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
🛡 **OverlayBlocker** is a flexible overlay component that blocks interaction with the content beneath it. Ideal for modals, dialogs, and temporary UI states.  

### ✨ Features
- 👀 Show or hide overlay with the \`show\` prop
- 🔝 Control stacking order using \`zIndex\`
- 🖱 Click handling options:
  - **"close"**: Closes overlay when clicked (default)
  - **"preventDefault"**: Prevents automatic closing
  - **Function**: Custom click behavior with helpers
- 🎨 Fully styleable via \`styles.self\` (CSSProp compatible)
- 🔧 Supports imperative \`open\` and \`close\` via \`ref\`

### 🛠 Usage
\`\`\`tsx
<OverlayBlocker
  show={isOpen}
  zIndex={9999}
  onClick={({ close, preventDefault }) => {
    // custom behavior
    close();
  }}
  styles={{ self: "background: rgba(0,0,0,0.3);" }}
>
  <p>Your content here</p>
</OverlayBlocker>
\`\`\`

### 📝 Notes
- Overlay automatically disappears when \`show={false}\`.
- Use \`ref\` to programmatically open or close the overlay.
      `,
      },
    },
  },
  argTypes: {
    show: {
      control: "boolean",
      description:
        "Controls the visibility of the overlay. When true, the overlay is rendered and blocks user interaction with underlying content.",
    },
    zIndex: {
      control: { type: "number" },
      description:
        "Defines the stacking order of the overlay. Higher values place it above other positioned elements.",
    },
    onClick: {
      control: false,
      description: `
Defines how the overlay behaves when clicked.

Supported values:

- **"close"** (default): Closes the overlay when clicked.
- **"preventDefault"**: Prevents closing; clicking does nothing.
- **Function**: Custom handler receiving helpers:

\`\`\`ts
({ close, preventDefault }) => void
\`\`\`

- **close()**: Programmatically close the overlay.
- **preventDefault()**: Prevent default closing behavior.
      `,
    },
    styles: {
      control: false,
      description: `
Custom styles for the OverlayBlocker component.

- **self**: Overrides styles of the root overlay element (background, blur, positioning, animations, etc.).

Accepts a \`CSSProp\` (styled-components compatible).
      `,
    },
  },
};

export default meta;

type Story = StoryObj<typeof OverlayBlocker>;

export const Default: Story = {
  render: () => {
    const ref = useRef<OverlayBlockerRef>(null);

    return (
      <>
        <Button onClick={() => ref?.current?.open()}>Open Overlay</Button>
        <OverlayBlocker ref={ref} onClick="close" />
      </>
    );
  },
};

export const NoAutoclose: Story = {
  render: () => {
    const ref = useRef<OverlayBlockerRef>(null);

    return (
      <>
        <Button onClick={() => ref.current?.open()}>No Auto Close</Button>
        <OverlayBlocker
          ref={ref}
          onClick={({ preventDefault }) => {
            preventDefault();
          }}
        />
      </>
    );
  },
};
