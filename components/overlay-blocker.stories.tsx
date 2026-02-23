import type { Meta, StoryObj } from "@storybook/react";
import { OverlayBlocker, OverlayBlockerRef } from "./overlay-blocker";
import { Button } from "./button";
import { useRef, useState } from "react";

const meta: Meta<typeof OverlayBlocker> = {
  title: "Stage/OverlayBlocker",
  component: OverlayBlocker,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
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

export const NoAutoClose: Story = {
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
