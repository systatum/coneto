import { Meta, StoryObj } from "@storybook/react";
import { CapsuleTab, CapsuleTabTab } from "./capsule-tab";
import { Button } from "./button";
import { ChangeEvent, useState } from "react";
import { Textbox } from "./textbox";
import { generateSentence } from "./../lib/text";

const meta: Meta<typeof CapsuleTab> = {
  title: "Stage/CapsuleTab",
  component: CapsuleTab,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **CapsuleTab** component is a tab-based layout built on top of the \`Capsule\` component, providing a clean and modern way to switch between multiple content sections.

It supports both **controlled** and **uncontrolled** modes, allowing flexible state management depending on your use case.

---

### ✨ Features
- 🧭 **Tab navigation** using capsule-style UI
- 🔁 Supports **controlled & uncontrolled state**
- 🎨 Customizable **active tab background**
- 🧩 Flexible **content rendering per tab**
- 🎯 Fully customizable **styles per section**

---

### ⚙️ Behavior

#### Uncontrolled Mode
- Uses internal state
- Default tab is based on \`activeTab\`

#### Controlled Mode
- Controlled via \`activeTab\` + \`onTabChange\`
- Parent manages selected tab state

---

### 📌 Usage Guidelines
- Use for **section switching** inside a single page
- Keep tab titles **short and clear**
- Use controlled mode when syncing with URL / global state
        `,
      },
    },
  },
  argTypes: {
    tabs: {
      description: `
List of tab items.

\`\`\`ts
{
  id: string;
  title: string;
  content: ReactNode;
}[]
\`\`\`

- \`id\`: unique identifier
- \`title\`: label shown in tab
- \`content\`: rendered when active
      `,
      control: false,
      table: {
        type: { summary: "CapsuleTabTab[]" },
      },
    },

    activeTab: {
      description: `
Currently active tab ID.

- Used as default in uncontrolled mode
- Fully controlled when paired with \`onTabChange\`
      `,
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: `"1"` },
      },
    },

    onTabChange: {
      description: `
Callback triggered when tab changes.

\`\`\`ts
(id: string) => void
\`\`\`

- Enables controlled mode
- Fires on tab click
      `,
      control: false,
      table: {
        type: { summary: "(id: string) => void" },
      },
    },

    activeBackgroundColor: {
      description: `
Background color for the active tab indicator.
      `,
      control: "color",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: `"black"` },
      },
    },

    children: {
      description: `
Additional content rendered below active tab content.

Useful for:
- Actions
- Footer
- Extra UI elements
      `,
      control: false,
      table: {
        type: { summary: "ReactNode" },
      },
    },

    styles: {
      control: false,
      description: `
Custom styles for CapsuleTab.

Available fields:

- **self** → Wrapper container (border, layout, shadow)
- **contentStyle** → Content section styling
- **capsuleWrapperStyle** → Capsule container wrapper
- **tabStyle** → Individual tab styling

All fields accept \`CSSProp\` (styled-components).
      `,
      table: {
        type: { summary: "CapsuleTabStyles" },
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof CapsuleTab>;

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
            padding: "0.8rem",
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h3
            style={{
              fontWeight: 500,
            }}
          >
            Write Tab
          </h3>
          <p>{generateSentence()}</p>

          <Textbox name="write" value={value.write} onChange={onChangeValue} />
        </div>
      );
    };

    const ReviewTabContent = () => {
      return (
        <div
          style={{
            padding: "0.8rem",
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h3
            style={{
              fontWeight: 500,
            }}
          >
            Review Tab
          </h3>
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

    const TABS_ITEMS: CapsuleTabTab[] = [
      {
        id: "1",
        title: "Write",
        content: <WriteTabContent key={"write-tab"} />,
      },
      {
        id: "2",
        title: "Review",
        content: <ReviewTabContent key={"review-tab"} />,
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          width: "100%",
        }}
      >
        <CapsuleTab tabs={TABS_ITEMS} activeTab={"2"} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "4px",
            width: "100%",
            justifyContent: "end",
          }}
        >
          <Button>Close</Button>
          <Button disabled variant="primary">
            Comment
          </Button>
        </div>
      </div>
    );
  },
};
