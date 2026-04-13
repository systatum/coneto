import { Meta, StoryObj } from "@storybook/react";
import { DrawerTab, DrawerTabTab } from "./drawer-tab";
import { Textbox } from "./textbox";
import { ChangeEvent, useState } from "react";
import { RiListCheck, RiNodeTree } from "@remixicon/react";
import { generateSentence } from "./../lib/text";

const meta: Meta<typeof DrawerTab> = {
  title: "Stage/DrawerTab",
  component: DrawerTab,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
DrawerTab is a flexible sidebar component that displays multiple tabbed panels which can slide in from the left or right. Each tab can contain custom content and icons, with full control over styling and animations. Ideal for dashboards, side menus, or context-sensitive panels.

---

### ✨ Features
- 🗂️ **Multiple tabs**: Define multiple tabs with unique content and icons.
- ➡️ **Slide-in drawer**: Supports left or right positioning via the \`position\` prop.
- 🖱️ **Interactive tab selection**: Click a tab button to open the drawer and display content.
- ❌ **Close button**: Close the drawer manually with a built-in close button.
- 🎨 **Customizable styles**: Control tab buttons and drawer container via \`styles\` prop.
- ⚡ **Smooth animations**: Built using Framer Motion for spring-based drawer transitions.
- 📐 **Responsive-ready**: Automatically adjusts on larger screens.

---

### 📌 Usage
- Provide a \`tabs\` array containing \`id\`, \`title\`, \`icon\`, and \`content\`.
- Set the \`position\` prop to either \`left\` or \`right\`.
- Optionally pass \`styles\` to customize drawer and tab button appearance.

\`\`\`tsx
<DrawerTab
  position="right"
  tabs={[
    {
      id: "tab1",
      title: "Notifications",
      icon: RiCloseLine,
      content: <div>Notification content here</div>,
    },
    {
      id: "tab2",
      title: "Settings",
      icon: RiCloseLine,
      content: <div>Settings content here</div>,
    },
  ]}
  styles={{
    drawerTabStyle: css\`
      background: #fff;
      border: 1px solid #ccc;
    \`,
    tabStyle: css\`
      background: #f9f9f9;
      border-radius: 0.5rem;
    \`,
  }}
/>
\`\`\`

- Tabs open the drawer on click. Clicking the selected tab again or the close button closes it.
- You can replace \`icon\` with any React component from Remix Icon or custom SVG.

`,
      },
    },
  },
  argTypes: {
    tabs: {
      description:
        "Array of tab objects, each with an `id`, `title`, `icon`, and `content`.",
      control: "object",
    },
    position: {
      description: "Position of the drawer: left or right.",
      control: { type: "radio" },
      options: ["left", "right"],
      defaultValue: "right",
    },
    styles: {
      description: "Custom styles for the drawer container and tab buttons.",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof DrawerTab>;

export const Default: Story = {
  render: () => {
    const WriteTabContent = () => {
      const [value, setValue] = useState({
        write: "",
      });

      const onChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValue((prev) => ({ ...prev, [name]: value }));
      };

      return (
        <div
          style={{
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h3 style={{ fontWeight: 500 }}>Write Tab</h3>
          <p>{generateSentence()}</p>
          <Textbox name="write" value={value.write} onChange={onChangeValue} />
        </div>
      );
    };

    const ReviewTabContent = () => {
      return (
        <div
          style={{
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h3 style={{ fontWeight: 500 }}>Review Tab</h3>
          <p>
            This tab is meant to review the content that has been submitted. It
            includes multiple paragraphs to simulate a longer layout.
          </p>
          <p>
            Vestibulum feugiat, libero a viverra consequat, lacus mi laoreet
            enim, at tristique velit quam a urna. Suspendisse potenti. In hac
            habitasse platea dictumst. Proin vel justo ac mauris laoreet
            sagittis.
          </p>
        </div>
      );
    };

    const tabs: DrawerTabTab[] = [
      {
        id: "1",
        title: "File Attributes",
        icon: RiListCheck,
        content: <WriteTabContent />,
      },
      {
        id: "2",
        title: "Page Structure",
        icon: RiNodeTree,
        content: <ReviewTabContent />,
      },
    ];

    return <DrawerTab position="left" tabs={tabs} />;
  },
};

export const FixedRight: Story = {
  render: () => {
    const WriteTabContent = () => {
      const [value, setValue] = useState({
        write: "",
      });

      const onChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValue((prev) => ({ ...prev, [name]: value }));
      };

      return (
        <div
          style={{
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h3 style={{ fontWeight: 500 }}>Write Tab</h3>
          <p>{generateSentence()}</p>
          <Textbox name="write" value={value.write} onChange={onChangeValue} />
        </div>
      );
    };

    const ReviewTabContent = () => {
      return (
        <div
          style={{
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h3 style={{ fontWeight: 500 }}>Review Tab</h3>
          <p>
            This tab is meant to review the content that has been submitted. It
            includes multiple paragraphs to simulate a longer layout.
          </p>
          <p>
            Vestibulum feugiat, libero a viverra consequat, lacus mi laoreet
            enim, at tristique velit quam a urna. Suspendisse potenti. In hac
            habitasse platea dictumst. Proin vel justo ac mauris laoreet
            sagittis.
          </p>
        </div>
      );
    };
    const tabs: DrawerTabTab[] = [
      {
        id: "1",
        title: "File Attributes",
        icon: RiListCheck,
        content: <WriteTabContent />,
      },
      {
        id: "2",
        title: "Page Structure",
        icon: RiNodeTree,
        content: <ReviewTabContent />,
      },
    ];

    return <DrawerTab tabs={tabs} />;
  },
};
