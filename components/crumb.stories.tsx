import { Meta, StoryObj } from "@storybook/react";
import { Crumb } from "./crumb";

const meta: Meta<typeof Crumb> = {
  title: "Controls/Crumb",
  component: Crumb,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Crumb** is a breadcrumb navigation component that shows the user's location in a hierarchy.

---

### ✨ Features
- 🔗 Displays a sequence of items representing navigation hierarchy
- ⚡ Automatically collapses middle items into an ellipsis when exceeding \`maxShown\`
- 👆 Click ellipsis to expand hidden items
- 🎨 Customizable font size, text color, hover color, arrow color, and last item color
- 🖼 Custom icon separators (default: arrow)
- 🏃 Smooth animations for item transitions
- 🖱 Supports clickable or static items

---

### 📌 Usage Guidelines
- Use \`Crumb.Item\` for each item in the breadcrumb
- Set \`maxShown\` to control collapsing behavior
- Use \`arrowColor\` or \`iconSeparator\` for custom icons
- Customize styles with the \`styles\` prop for container overrides
      `,
      },
    },
  },
  argTypes: {
    maxShown: {
      control: { type: "number" },
      description:
        "Maximum number of items to display before collapsing into an ellipsis.",
      table: {
        defaultValue: { summary: "3" },
      },
    },
    iconSeparator: {
      control: false,
      description:
        "Icon used as a separator between breadcrumb items. Defaults to `RiArrowRightSLine`.",
    },
    fontSize: {
      control: { type: "number" },
      description: "Font size of breadcrumb items in pixels.",
      table: {
        defaultValue: { summary: "16" },
      },
    },
    textColor: {
      control: "color",
      description: "Text color of breadcrumb items.",
    },
    hoverColor: {
      control: "color",
      description: "Text color when hovering over items.",
    },
    lastTextColor: {
      control: "color",
      description: "Text color of the last (current) breadcrumb item.",
    },
    arrowColor: {
      control: "color",
      description: "Color of the separator icon between breadcrumb items.",
      table: {
        defaultValue: { summary: "#9ca3af" },
      },
    },
    children: {
      control: false,
      description: "Breadcrumb items, typically Crumb.Item components.",
    },
    styles: {
      control: false,
      description: `
Custom CSS overrides for the Crumb container:

- **self**: Style applied to the outer Crumb container.
      `,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Crumb>;

export const Default: Story = {
  render: () => {
    const CRUMB_ITEMS = [
      { label: "Item 1", path: "/" },
      { label: "Item 2", path: "/item2" },
      { label: "Item 3", path: "/item3" },
      { label: "Item 4", path: "/item4" },
      { label: "Item 5", path: "/item5" },
    ];

    return (
      <Crumb fontSize={14} maxShown={3}>
        {CRUMB_ITEMS.map((data, index) => (
          <Crumb.Item path={data.path} key={index}>
            {data.label}
          </Crumb.Item>
        ))}
      </Crumb>
    );
  },
};

export const Custom: Story = {
  render: () => {
    const CRUMB_ITEMS = [
      { label: "Item 1", path: "/" },
      { label: "Item 2", path: "/item2" },
      { label: "Item 3", path: "/item3" },
      { label: "Item 4", path: "/item4" },
      { label: "Item 5", path: "/item5" },
      { label: "Item 6", path: "/item6" },
    ];

    return (
      <Crumb
        fontSize={16}
        maxShown={4}
        arrowColor="#A78BFA"
        hoverColor="#EC4899"
        textColor="#6B7280"
        lastTextColor="#1E293B"
      >
        {CRUMB_ITEMS.map((data, index) => (
          <Crumb.Item path={data.path} key={index}>
            {data.label}
          </Crumb.Item>
        ))}
      </Crumb>
    );
  },
};

export const OneData: Story = {
  render: () => {
    const CRUMB_ITEMS = [
      { label: "Item 1", path: "/" },
      { label: "Item 2", path: "/item2" },
      { label: "Item 3", path: "/item3" },
      { label: "Item 4", path: "/item4" },
      { label: "Item 5", path: "/item5" },
      { label: "Item 6", path: "/item6" },
    ];

    return (
      <Crumb fontSize={14} maxShown={1}>
        {CRUMB_ITEMS.map((data, index) => (
          <Crumb.Item path={data.path} key={index}>
            {data.label}
          </Crumb.Item>
        ))}
      </Crumb>
    );
  },
};
