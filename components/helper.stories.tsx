import { Meta, StoryObj } from "@storybook/react";
import { Helper } from "./helper";

const meta: Meta<typeof Helper> = {
  title: "Content/Helper",
  component: Helper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Helper** is a lightweight tooltip trigger component used to display contextual help or additional information via an icon.

---

### ✨ Features
- 💡 **Tooltip display**: Shows contextual information when hovering over the helper icon.
- ⏱ **Delay support**: Includes a configurable delay before showing the tooltip (\`showDelayPeriod\`).
- 🎯 **Smart positioning**: Adjusts tooltip arrow alignment based on placement.
- 🧩 **Composable**: Built on top of the \`Tooltip\` component for flexibility and consistency.
- 🎨 **Customizable styles**: Supports style overrides for container and arrow via the \`styles\` prop.

---

### 📌 Usage

\`\`\`tsx
<Helper value="This field is required and must be unique." />
\`\`\`

- The \`value\` prop defines the content shown inside the tooltip.
- Displays an information icon that users can hover to reveal the message.
- Ideal for form fields, labels, or any UI that needs extra explanation without cluttering the layout.
- Uses a default hover delay of 400ms to improve user experience.
`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Helper>;

export const Default: Story = {
  render: () => {
    return <Helper value="Default Value" />;
  },
};

export const WithCustomDelay: Story = {
  render: () => {
    return <Helper value="Custom Delay Value 1500ms" showDelayPeriod={1500} />;
  },
};
