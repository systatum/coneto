import { RiFile2Line, RiNewspaperLine } from "@remixicon/react";
import { useArgs } from "@storybook/preview-api";
import { Meta, StoryObj } from "@storybook/react";
import { Capsule } from "./capsule";

const meta: Meta<typeof Capsule> = {
  title: "Input Elements/Capsule",
  component: Capsule,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **Capsule** component is designed for switching between generally two options.

---

### ✨ Features
- 🧭 **Switch selection** with smooth animated indicator
- 🎨 Customizable **active background & colors**
- 🧩 Supports **icons and labels**
- 📏 Flexible **layout modes** (default / full width)
- ⚠️ Built-in **error handling & validation**
- 🎯 Fully customizable **styles**
- 🧩 First-class **stateful form integration**

---

### ⚙️ Behavior

- If \`activeTab\` is not provided, the **first tab is selected automatically**
- Clicking a tab triggers \`onTabChange\`
- Hover state shows a preview border animation
- Disabled state prevents interaction

---

### 📌 Usage Guidelines
- Use for **switching between related views or filters**
- Keep tab labels **short and clear**
- Use **icons** for better visual recognition
- Use \`full\` mode when integrating into layouts like headers or forms
        `,
      },
    },
  },
  excludeStories: [
    "VIEW_ONLY_TITLE_MODES",
    "VIEW_WITH_ICON_MODES",
    "VIEW_ONLY_ICON_MODES",
  ],
  argTypes: {
    tabs: {
      description: `
List of tabs.

\`\`\`ts
{
  id: string;
  title?: string;
  icon?: FigureProps;
  content?: ReactNode;
}[]
\`\`\`

- \`id\`: unique identifier
- \`title\`: tab label
- \`icon\`: optional icon
- \`content\`: optional content (used externally)
      `,
      control: false,
      table: {
        type: { summary: "CapsuleContentProps[]" },
      },
    },

    activeTab: {
      description: `
Currently active tab ID.

- Defaults to first tab if not provided
- Can be controlled externally
      `,
      control: "text",
      table: {
        type: { summary: "string | null" },
      },
    },

    onTabChange: {
      description: `
Triggered when a tab is selected.

\`\`\`ts
(id: string) => void
\`\`\`
      `,
      action: "tabChanged",
      table: {
        type: { summary: "(id: string) => void" },
      },
    },

    label: {
      description: `
Label displayed above the capsule.

Integrated via \`FieldLane\`.
      `,
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },

    full: {
      description: `
Expands capsule to full width.

- Removes rounded container
- Adds bottom border instead
- Ideal for header/tab layouts
      `,
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    activeBackgroundColor: {
      description: `
Background color of active tab indicator.
      `,
      control: "color",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: `"oklch(...)"` },
      },
    },

    fontSize: {
      description: `
Font size for tab labels (in px).
      `,
      control: "number",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "12" },
      },
    },

    disabled: {
      description: `
Disables all tab interactions.
      `,
      control: "boolean",
      table: {
        type: { summary: "boolean" },
      },
    },

    showError: {
      description: `
Displays error state and message.

Handled via \`FieldLane\`.
      `,
      control: "boolean",
      table: {
        type: { summary: "boolean" },
      },
    },

    errorMessage: {
      description: `
Error message displayed when \`showError\` is true.
      `,
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },

    styles: {
      control: false,
      description: `
Custom styles for Capsule.

Available fields:

- **containerStyle** → Outer wrapper (FieldLane container)
- **labelStyle** → Label text
- **bodyStyle / controlStyle** → Layout wrappers
- **capsuleWrapperStyle** → Capsule container
- **tabStyle** → Individual tab & indicator styling

All fields accept \`CSSProp\`.
      `,
      table: {
        type: { summary: "CapsuleStylesProps" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Capsule>;

export const Default: Story = {
  args: {
    tabs: [
      {
        id: "new",
        title: "New",
      },
      {
        id: "list",
        title: "List",
      },
    ],
    activeTab: "new",
  },
  render: (args) => {
    const [{ activeTab }, setUpdateArgs] = useArgs();

    return (
      <Capsule
        {...args}
        activeTab={activeTab}
        onTabChange={(id: string) => setUpdateArgs({ activeTab: id })}
      />
    );
  },
};

export const WithIcon: Story = {
  args: {
    tabs: [
      {
        id: "new",
        title: "New",
        icon: { image: RiFile2Line },
      },
      {
        id: "list",
        title: "List",
        icon: { image: RiNewspaperLine },
      },
    ],
    activeTab: "new",
  },
  render: (args) => {
    const [{ activeTab }, setUpdateArgs] = useArgs();

    return (
      <Capsule
        {...args}
        activeTab={activeTab}
        onTabChange={(id: string) => setUpdateArgs({ activeTab: id })}
      />
    );
  },
};
