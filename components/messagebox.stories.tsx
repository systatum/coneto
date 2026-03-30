import type { Meta, StoryObj } from "@storybook/react";
import { Messagebox } from "./messagebox";
import * as RemixIcons from "@remixicon/react";

const meta: Meta<typeof Messagebox> = {
  title: "Content/Messagebox",
  component: Messagebox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Messagebox is a flexible notification component for displaying information, alerts, warnings, or success messages in a structured, visually distinct box.

---

### ✨ Features
- 🏷️ **Variants**: Supports multiple visual styles (\`primary\`, \`success\`, \`danger\`, \`warning\`) for contextual messaging.
- 🖼️ **Icons**: Optional icon displayed alongside the message to indicate type or status.
- 📄 **Content**: Supports a main title and rich message content (children).
- 🔗 **Action links**: Buttons or links for user interaction, such as navigating or triggering actions.
- ❌ **Closable**: Can be dismissed by the user if \`closable\` is enabled.
- 🎨 **Custom styles**: Fully customizable via styled-components, including container, title, content, and action list.
- ♿ **Accessibility**: Proper ARIA roles and keyboard support for interactive elements.
      `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "success", "danger", "warning"],
      description: "Visual style variant of the message box.",
    },
    title: {
      control: "text",
      description: "Main title displayed at the top of the message box.",
    },
    children: {
      control: "text",
      description: "Main message content displayed below the title.",
    },
    icon: {
      control: {
        type: "select",
      },
      options: Object.keys(RemixIcons),
      mapping: RemixIcons,
      description: "Icon displayed next to the message content.",
    },
    actionLinks: {
      control: false,
      description: `
List of action links displayed below the message content.

Each action supports:
- **caption**: Label text
- **type**: \`"button"\` or \`"link"\`
- **onClick**: Click handler (for buttons)
- **href**: URL (for links)
    `,
    },
    closable: {
      control: "boolean",
      description: "Whether the message box can be closed by the user.",
    },
    onCloseRequest: {
      control: false,
      description: "Callback fired when the close (×) button is clicked.",
    },
    styles: {
      control: false,
      description: `
Custom styles for the **Messagebox** component using styled-components CSS.

- **containerStyle**: CSS applied to the root wrapper of the message box.
- **titleStyle**: CSS applied to the title text of the message box.
- **contentWrapperStyle**: CSS applied to the content wrapper that contains children and action links.
- **contentStyle**: CSS applied to the children content text inside the message box.

This allows complete customization of the message box layout, typography, colors, and spacing without modifying the component code.
  `,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Messagebox>;

export const Primary: Story = {
  args: {
    variant: "primary",
    title: "Information",
    children: "This is a primary message box.",
  },
  render: (args) => <Messagebox {...args} />,
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success",
    children: "This is a success message.",
  },
  render: (args) => <Messagebox {...args} />,
};

export const Danger: Story = {
  args: {
    variant: "danger",
    title: "Error",
    children: "This is a danger message.",
  },
  render: (args) => <Messagebox {...args} />,
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    children: "This is a warning message.",
  },
  render: (args) => <Messagebox {...args} />,
};

export const WithCustomIcon: Story = {
  args: {
    variant: "primary",
    title: "Custom Icon",
    children: "This message uses a custom RemixIcon.",
    icon: { image: RemixIcons.RiAlarmWarningFill },
  },
  render: (args) => <Messagebox {...args} />,
};

export const WithActions: Story = {
  args: {
    variant: "success",
    title: "Success with Actions",
    children: "This success message includes buttons and links.",
    actionLinks: [
      {
        caption: "Retry",
        type: "button",
        onClick: () => console.log("Test click"),
      },
      {
        caption: "View Website",
        type: "link",
        href: "https://systatum.com",
      },
    ],
  },
  render: (args) => <Messagebox {...args} />,
};

export const ClosableWithActions: Story = {
  args: {
    variant: "success",
    title: "Success with Actions",
    children: "This success message includes buttons and links.",
    actionLinks: [
      {
        caption: "Retry",
        type: "button",
        onClick: () => console.log("Retry Succeed"),
      },
      {
        caption: "View Website",
        type: "link",
        href: "https://systatum.com",
      },
    ],
    closable: true,
    onCloseRequest: () => console.log("Close Request Succeed"),
  },
  render: (args) => <Messagebox {...args} />,
};
