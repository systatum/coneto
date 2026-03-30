import { Meta, StoryObj } from "@storybook/react";
import { Togglebox } from "./togglebox";
import { useEffect } from "react";
import * as RemixIcons from "@remixicon/react";
import { useArgs } from "@storybook/preview-api";
import { css } from "styled-components";

const meta: Meta<typeof Togglebox> = {
  title: "Input Elements/Togglebox",
  component: Togglebox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Togglebox is a flexible toggle switch component for React, designed for binary on/off states. 
It supports icons, loading states, custom sizes, labels, descriptions, and full styling control. 
It integrates seamlessly with \`FieldLane\` for form layout and validation support.

---

### ✨ Features
- 🔘 **Binary toggle**: Represents on/off or true/false states.
- 🏷 **Label and description**: Display text next to the toggle for context.
- 🎨 **Custom icons**: Render an optional icon inside the toggle thumb.
- ⏳ **Loading state**: Show a spinner while an action is processing.
- 📐 **Resizable**: Control toggle size via the \`size\` prop.
- 🧩 **Composable**: Integrates with \`FieldLane\` for structured form layouts.
- 🎛 **Full styling control**: Override styles for label, description, row, text wrapper, error messages, and toggle thumb.

---

### 📌 Usage

\`\`\`tsx
<Togglebox
  checked={true}
  label="Enable notifications"
  description="Receive email updates for new activity"
  icon={{ image: RiNotificationLine, color: "white" }}
  size={32}
  isLoading={false}
  onChange={(e) => console.log("Toggle changed:", e.target.checked)}
  styles={{
    rowStyle: css\`margin-top: 16px;\`,
    textWrapperStyle: css\`gap: 4px;\`,
    labelStyle: css\`font-weight: 600;\`,
    descriptionStyle: css\`color: #6B7280;\`,
  }}
/>

{/* Integration with FieldLane and validation */}
<Togglebox
  title="Enable dark mode"
  label="Dark Mode"
  showError={true}
  errorMessage="This toggle is required"
  helper="Toggle to switch theme"
  required
/>
\`\`\`

---

### 💡 Notes
- Clicking the toggle updates the \`checked\` state.
- The toggle thumb can display a custom icon or loading spinner.
- Fully responsive and accessible — includes labels, ARIA attributes, and keyboard support.
- Works with \`FieldLane\` for structured forms with labels, errors, and helper text.
- Use the \`styles\` prop to override individual sub-elements without breaking default behavior.
- \`size\` controls the toggle width, height, and thumb dimensions automatically.
      `,
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the toggle is on (true = active, false= inactive).",
      defaultValue: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description: "Shows a loading spinner inside the toggle thumb when true.",
      defaultValue: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      action: "changed",
      description:
        "Callback function triggered when toggle state changes. Receives the ChangeEvent<HTMLInputElement>.",
      table: {
        type: { summary: "(e: ChangeEvent<HTMLInputElement>) => void" },
      },
    },
    icon: {
      control: { type: "select" },
      description:
        "Optional icon displayed inside the toggle thumb. Accepts FigureProps.",
      options: Object.keys(RemixIcons),
      mapping: RemixIcons,
      table: {
        type: { summary: "FigureProps" },
      },
    },
    label: {
      control: "text",
      description: "Text label displayed next to the toggle.",
      table: {
        type: { summary: "string" },
      },
    },
    description: {
      control: "text",
      description: "Optional description text displayed below the label.",
      table: {
        type: { summary: "string" },
      },
    },
    size: {
      control: "number",
      description:
        "Base size of the toggle (controls width, height, and thumb size). Default is 24.",
      defaultValue: 24,
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "24" },
      },
    },
    styles: {
      description:
        "Custom styles for individual sub-elements of the togglebox. Accepts a ToggleboxStylesProps object.",
      table: {
        type: { summary: "ToggleboxStylesProps" },
      },
      control: { type: "object" },
    },
    disabled: {
      control: "boolean",
      description: "Disables the togglebox, preventing interaction.",
      defaultValue: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    name: {
      control: "text",
      description:
        "Optional name attribute for the toggle input, useful in forms.",
      table: {
        type: { summary: "string" },
      },
    },
    id: {
      control: "text",
      description:
        "Optional id for the toggle input. If not provided, one is auto-generated.",
      table: {
        type: { summary: "string" },
      },
    },
    required: {
      control: "boolean",
      description: "Marks the toggle as required when used in forms.",
      defaultValue: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    title: {
      control: "text",
      description:
        "Title displayed in the FieldLane wrapper (above the toggle).",
      table: {
        type: { summary: "string" },
      },
    },
    showError: {
      control: "boolean",
      description: "Show error state in FieldLane.",
      defaultValue: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    errorMessage: {
      control: "text",
      description: "Error message text to display when showError is true.",
      table: {
        type: { summary: "string" },
      },
    },
    actions: {
      description: "Custom action elements displayed in FieldLane.",
      table: {
        type: { summary: "ReactNode" },
      },
      control: { type: null },
    },
    helper: {
      description: "Helper text shown below the toggle in FieldLane.",
      table: {
        type: { summary: "string" },
      },
      control: "text",
    },
    labelGap: {
      description: "Gap between FieldLane label and control (px).",
      table: {
        type: { summary: "number" },
      },
      control: "number",
    },
    labelWidth: {
      description: "Width of the FieldLane label container (px).",
      table: {
        type: { summary: "number" },
      },
      control: "number",
    },
    labelPosition: {
      description:
        "Position of the label relative to the toggle: 'top' | 'left'.",
      table: {
        type: { summary: "'top' | 'left'" },
      },
      control: { type: "radio", options: ["top", "left"] },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Togglebox>;

export const Default: Story = {
  args: {
    checked: false,
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    return (
      <Togglebox
        {...args}
        onChange={(e) => setUpdateArgs({ checked: e.target.checked })}
      />
    );
  },
};

export const WithIcon: Story = {
  args: {
    checked: false,
    icon: { image: RemixIcons.RiLock2Fill },
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    return (
      <Togglebox
        {...args}
        onChange={(e) => setUpdateArgs({ checked: e.target.checked })}
      />
    );
  },
};

export const WithIconAndLoading: Story = {
  args: {
    checked: false,
    icon: { image: RemixIcons.RiLock2Fill },
    isLoading: false,
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    useEffect(() => {
      if (args.checked) {
        setUpdateArgs({ isLoading: true });
        setTimeout(() => {
          setUpdateArgs({ isLoading: "false" });
        }, 1200);
      }
    }, [args.checked]);

    return (
      <Togglebox
        {...args}
        onChange={(e) => setUpdateArgs({ checked: e.target.checked })}
      />
    );
  },
};

export const WithDescription: Story = {
  args: {
    checked: false,
    icon: { image: RemixIcons.RiLock2Fill },
    isLoading: false,
    label: "Click and load",
    description: "Click and you will see a loading icon",
    styles: {
      labelStyle: css`
        font-size: 14px;
      `,
    },
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    useEffect(() => {
      if (args.checked) {
        setUpdateArgs({ isLoading: true });
        setTimeout(() => {
          setUpdateArgs({ isLoading: "false" });
        }, 1200);
      }
    }, [args.checked]);

    return (
      <Togglebox
        {...args}
        onChange={(e) => setUpdateArgs({ checked: e.target.checked })}
      />
    );
  },
};

export const WithError: Story = {
  args: {
    checked: false,
    icon: { image: RemixIcons.RiLock2Fill },
    isLoading: false,
    showError: true,
    label: "With Error",
    errorMessage: "Must add value on togglebox",
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    useEffect(() => {
      if (args.checked) {
        setUpdateArgs({ isLoading: true });
        setTimeout(() => {
          setUpdateArgs({ isLoading: "false" });
        }, 1200);
      }
    }, [args.checked]);

    return (
      <Togglebox
        {...args}
        showError={!args.checked}
        onChange={(e) => setUpdateArgs({ checked: e.target.checked })}
      />
    );
  },
};
