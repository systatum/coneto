import type { Meta, StoryObj } from "@storybook/react";
import { Toolbar, ToolbarSubMenuProps } from "./toolbar";
import {
  RiSpam2Line,
  RiForbid2Line,
  RiShieldLine,
  RiCheckLine,
  RiInboxArchiveLine,
  RiDownloadLine,
  RiLink,
  RiShareLine,
  RiEditLine,
  RiMessage2Line,
} from "@remixicon/react";
import { TipMenu } from "./tip-menu";

const meta: Meta<typeof Toolbar> = {
  title: "Controls/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Toolbar is a flexible control bar component for React, designed to display multiple interactive buttons with optional dropdown menus, icons, and custom styles. 
It is suitable for building rich action bars, tool panels, or context menus in applications.

---

### ✨ Features
- 🛠 **Toolbar container**: Organizes multiple \`Toolbar.Menu\` items horizontally by default.
- 🏷 **Toolbar.Menu**: Each menu can have a caption, an icon, and an optional dropdown sub-menu.
- 🔀 **Variants**: Supports \`default\`, \`primary\`, and \`danger\` modes for visual emphasis.
- 🔄 **Interactive states**: Hover, active, focus-visible, and open states are styled out-of-the-box.
- ⬆️⬇️ **Dropdown menus**: Sub-menu lists can be fully customized with \`ToolbarSubMenuProps\`.
- ⚡ **Dynamic sizing**: Supports a \`big\` mode for larger icons and vertically-aligned content.
- 🎨 **Styling flexibility**: Customize the container, trigger, toggle button, and dropdown via the \`styles\` prop.
- 🧩 **Composable children**: Place any custom JSX or multiple \`Toolbar.Menu\` items inside a toolbar.

---

### 📌 Usage

\`\`\`tsx
const subMenuList: ToolbarSubMenuProps[] = [
  { caption: "Edit", icon: { image: RiEditLine, color: "yellow" }, onClick: () => console.log("Edit mode") },
  { caption: "Delete", icon: { image: RiForbid2Line, color: "red" }, isDangerous: true, onClick: () => console.log("Deleted") },
];

<Toolbar big>
  <Toolbar.Menu
    caption="Default Mode"
    icon={{ image: RiMessage2Line, color: "red" }}
    subMenuList={subMenuList}
  />
  <Toolbar.Menu
    caption="Primary Mode"
    icon={{ image: RiMessage2Line, color: "white" }}
    variant="primary"
    subMenuList={subMenuList}
  />
  <Toolbar.Menu
    caption="Danger Mode"
    icon={{ image: RiMessage2Line, color: "white" }}
    variant="danger"
    subMenuList={subMenuList}
  />
</Toolbar>
\`\`\`

- **Toolbar** arranges multiple menus horizontally.
- **Toolbar.Menu** can display a caption, icon, and optional dropdown.
- Dropdown menus are defined with \`subMenuList\`, each item supporting:
  - \`caption\`
  - \`icon\` (image + color)
  - \`onClick\` callback
  - \`isDangerous\` for destructive actions.
- **Variants** apply predefined colors and hover/active/focus states:
  - \`default\` — standard gray/white styles.
  - \`primary\` — emphasized with blue background and white text.
  - \`danger\` — red background for destructive actions.
- **big** prop enlarges icons and vertically centers content for toolbars that require higher visibility.
- **styles** prop allows CSS overrides for:
  - \`self\` — toolbar wrapper
  - \`containerStyle\` — individual menu container
  - \`triggerStyle\` — menu button
  - \`toggleActiveStyle\` — dropdown toggle
  - \`dropdownStyle\` — dropdown menu container

---

### 💡 Notes
- Clicking outside an open menu automatically closes it.
- Each menu manages its own open/close state but can also be controlled externally via \`isOpen\` and \`setIsOpen\`.
- Hover and active states are handled automatically, including special styles for dangerous actions.
- Supports responsive behavior — captions are hidden for smaller screens if \`icon\` is provided.
- Fully compatible with any React project using Styled Components.
      `,
      },
    },
  },
  argTypes: {
    big: {
      description:
        "If true, renders the toolbar in a larger layout with bigger icons.",
      control: { type: "boolean" },
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    styles: {
      description: "Custom styles for the toolbar container (CSSProp).",
      control: { type: "object" },
    },
    children: {
      description: "Toolbar.Menu or custom elements inside the toolbar.",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof TipMenu>;

export const Default: Story = {
  render: () => {
    const subMenuList: ToolbarSubMenuProps[] = [
      {
        caption: "Report Phishing",
        icon: {
          image: RiSpam2Line,
          color: "blue",
        },
        onClick: () => console.log("Phishing reported"),
      },
      {
        caption: "Report Junk",
        icon: {
          image: RiForbid2Line,
          color: "red",
        },
        onClick: () => console.log("Junk reported"),
      },
      {
        caption: "Block Sender",
        icon: {
          image: RiShieldLine,
          color: "orange",
        },
        isDangerous: true,
        onClick: () => console.log("Sender blocked"),
      },
      {
        caption: "Mark as Read",
        icon: {
          image: RiCheckLine,
          color: "green",
        },
        onClick: () => console.log("Marked as read"),
      },
      {
        caption: "Move to Spam",
        icon: {
          image: RiInboxArchiveLine,
          color: "purple",
        },
        onClick: () => console.log("Moved to spam"),
      },
      {
        caption: "Download Attachment",
        icon: {
          image: RiDownloadLine,
          color: "teal",
        },
        onClick: () => console.log("Downloading"),
      },
      {
        caption: "Copy Link",
        icon: {
          image: RiLink,
          color: "gray",
        },
        onClick: () => console.log("Link copied"),
      },
      {
        caption: "Share",
        icon: {
          image: RiShareLine,
          color: "indigo",
        },
        isDangerous: true,
        onClick: () => console.log("Shared"),
      },
      {
        caption: "Edit",
        icon: {
          image: RiEditLine,
          color: "yellow",
        },
        onClick: () => console.log("Edit mode"),
      },
    ];

    return (
      <Toolbar>
        <Toolbar.Menu
          caption="Default Mode"
          icon={{
            image: RiMessage2Line,
            color: "red",
          }}
          subMenuList={subMenuList}
        />
        <Toolbar.Menu
          caption="Primary Mode"
          icon={{
            image: RiMessage2Line,
            color: "white",
          }}
          variant="primary"
          subMenuList={subMenuList}
        />
        <Toolbar.Menu
          caption="Danger Mode"
          icon={{
            image: RiMessage2Line,
            color: "white",
          }}
          variant="danger"
          subMenuList={subMenuList}
        />
      </Toolbar>
    );
  },
};

export const Big: Story = {
  render: () => {
    const subMenuList: ToolbarSubMenuProps[] = [
      {
        caption: "Report Phishing",
        icon: {
          image: RiSpam2Line,
          color: "blue",
        },
        onClick: () => console.log("Phishing reported"),
      },
      {
        caption: "Report Junk",
        icon: {
          image: RiForbid2Line,
          color: "red",
        },
        onClick: () => console.log("Junk reported"),
      },
      {
        caption: "Block Sender",
        icon: {
          image: RiShieldLine,
          color: "orange",
        },
        isDangerous: true,
        onClick: () => console.log("Sender blocked"),
      },
      {
        caption: "Mark as Read",
        icon: {
          image: RiCheckLine,
          color: "green",
        },
        onClick: () => console.log("Marked as read"),
      },
      {
        caption: "Move to Spam",
        icon: {
          image: RiInboxArchiveLine,
          color: "purple",
        },
        onClick: () => console.log("Moved to spam"),
      },
      {
        caption: "Download Attachment",
        icon: {
          image: RiDownloadLine,
          color: "teal",
        },
        onClick: () => console.log("Downloading"),
      },
      {
        caption: "Copy Link",
        icon: {
          image: RiLink,
          color: "gray",
        },
        onClick: () => console.log("Link copied"),
      },
      {
        caption: "Share",
        icon: {
          image: RiShareLine,
          color: "indigo",
        },
        isDangerous: true,
        onClick: () => console.log("Shared"),
      },
      {
        caption: "Edit",
        icon: {
          image: RiEditLine,
          color: "yellow",
        },
        onClick: () => console.log("Edit mode"),
      },
    ];

    return (
      <Toolbar big>
        <Toolbar.Menu
          caption="Default"
          icon={{
            image: RiMessage2Line,
            color: "red",
          }}
          subMenuList={subMenuList}
        />
        <Toolbar.Menu
          caption="Primary Mode"
          icon={{
            image: RiMessage2Line,
            color: "white",
          }}
          variant="primary"
          subMenuList={subMenuList}
        />
        <Toolbar.Menu
          caption="Danger Mode"
          icon={{
            image: RiMessage2Line,
            color: "white",
          }}
          variant="danger"
          subMenuList={subMenuList}
        />
        <Toolbar.Menu
          caption="Default Mode"
          icon={{
            color: "black",
          }}
          subMenuList={subMenuList}
        />
        <Toolbar.Menu caption="Save" />
      </Toolbar>
    );
  },
};
