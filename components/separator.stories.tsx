import { Meta, StoryObj } from "@storybook/react";
import {
  Separator,
  SeparatorAction,
  SeparatorActionSubMenuList,
} from "./separator";
import {
  RiCalendar2Fill,
  RiDeleteBinLine,
  RiFileCopyLine,
  RiGitBranchLine,
  RiInboxArchiveLine,
  RiUserAddLine,
} from "@remixicon/react";
import { Calendar } from "./calendar";
import { css } from "styled-components";

const meta: Meta<typeof Separator> = {
  title: "Stage/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Separator is a visual divider component that separates content into sections with an optional title.

---

### ✨ Features
- ➖ **Divider line**: Adds a horizontal line across the container.
- 🔤 **Optional title**: Can display a floating text over the line.
- ↔️ **Text float**: Title can float left or right.
- 🧱 **Custom depth**: Adjust distance of the title from the container edge.
- 🎨 **Customizable styles**: Supports container, line, and title styling via CSS props.

### ⚡ Actions

The \`actions\` prop allows you to attach interactive elements (such as icon buttons) to the separator.

These actions are typically displayed on the opposite side of the title and can be used for quick operations like edit, copy, or open menus.

Each item in \`actions\` follows this shape:

- \`icon\` (**required**) → Icon configuration (FigureProps)
- \`caption\` → Tooltip text
- \`onClick\` → Click handler
- \`alwaysShow\` → Control visibility behavior (default: true)
- \`hidden\` → Hide action completely
- \`styles\` → Custom styles for button, tooltip, and positioning

---

#### 📌 Example
\`\`\`tsx
const actions = [
  {
    icon: { image: RiEditLine },
    caption: "Edit",
    onClick: () => console.log("Edit clicked"),
  },
  {
    icon: { image: RiDeleteBinLine },
    caption: "Delete",
    alwaysShow: false,
  },
];
\`\`\`

---

#### 🎯 Behavior Notes
- Actions are automatically positioned with spacing.
- Position adjusts based on \`textFloat\` (left or right).
- Hovering the separator reveals actions when \`alwaysShow\` is false.
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Optional title to display over the separator line.",
    },
    textFloat: {
      control: "radio",
      options: ["left", "right"],
      description: "Determines the side on which the title floats.",
    },
    depth: {
      control: "text",
      description: "Distance of the title from the container edge.",
    },
    styles: {
      control: false,
      description:
        "Custom styles object for container, line, and title. Not editable via controls.",
    },
    actions: {
      control: false,
      description: `
List of action items displayed on the separator.

Each action can include an icon, tooltip (caption), click handler, visibility control, and custom styles.

- Supports hover-based visibility using \`alwaysShow\`
- Automatically positioned based on \`textFloat\`
- Can be hidden using \`hidden\`
- Fully customizable via \`styles\` inside each action
  `,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  args: {},
  render: (args) => {
    return <Separator {...args} />;
  },
};

export const LeftSide: Story = {
  args: {
    textFloat: "left",
    title: "systatum.com",
  },
  render: (args) => {
    return <Separator {...args} />;
  },
};

export const RightSide: Story = {
  args: {
    textFloat: "right",
    title: "systatum.com",
  },
  render: (args) => {
    return <Separator {...args} />;
  },
};

export const WithActions: Story = {
  args: {
    title: "Antrikan App Redesign",
  },
  render: (args) => {
    const ACTIONS: SeparatorAction[] = [
      {
        icon: { image: RiUserAddLine },
        caption: "Invite",
        subMenu: ({ list }) => list(TIP_MENU_PROJECT),
      },
      {
        icon: { image: RiGitBranchLine },
        caption: "Branch",
        subMenu: ({ show }) =>
          show(
            <>
              <span>
                <strong>Branch:</strong>{" "}
                mobile/introduces-the-antrikan-mobile-app-design
              </span>
              <span>Last updated 2 hours ago.</span>
            </>,
            {
              drawerStyle: css`
                padding: 10px;
                display: flex;
                flex-direction: column;
              `,
            }
          ),
      },
      {
        icon: { image: RiCalendar2Fill },
        alwaysShow: false,
        subMenu: ({ render }) => render(<Calendar />),
      },
    ];

    const TIP_MENU_PROJECT: SeparatorActionSubMenuList[] = [
      {
        caption: "Duplicate Project",
        icon: {
          image: RiFileCopyLine,
        },
        onClick: () => console.log("Duplicate project"),
      },
      {
        caption: "Archive Project",
        icon: {
          image: RiInboxArchiveLine,
        },
        onClick: () => console.log("Archive project"),
      },
      {
        caption: "Delete Project",
        icon: {
          image: RiDeleteBinLine,
        },
        variant: "danger",
        onClick: () => console.log("Delete project"),
      },
    ];

    return <Separator {...args} actions={ACTIONS} />;
  },
};
