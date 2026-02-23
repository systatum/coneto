import { Meta, StoryObj } from "@storybook/react";
import { Capsule } from "./capsule";
import { useArgs } from "@storybook/preview-api";
import { RiFile2Line, RiNewspaperLine } from "@remixicon/react";

const meta: Meta<typeof Capsule> = {
  title: "Input Elements/Capsule",
  component: Capsule,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  excludeStories: [
    "VIEW_ONLY_TITLE_MODES",
    "VIEW_WITH_ICON_MODES",
    "VIEW_ONLY_ICON_MODES",
  ],
  argTypes: {
    tabs: {
      description:
        "List of tabs to render. Each tab can have an id, title, optional icon, and optional content.",
      control: false,
    },
    activeTab: {
      description:
        "ID of the currently active tab. If not provided, the first tab will be selected automatically.",
      control: "text",
    },
    onTabChange: {
      description:
        "Called when a tab is clicked or when the active tab changes.",
      action: "tabChanged",
    },
    label: {
      description: "Label displayed above the capsule group.",
      control: "text",
    },
    full: {
      description:
        "When true, the capsule stretches to full width and uses a bottom border instead of a rounded container.",
      control: "boolean",
    },
    activeBackgroundColor: {
      description:
        "Background color of the active tab indicator and hover border.",
      control: "color",
    },
    fontSize: {
      description: "Font size (in pixels) applied to the capsule container.",
      control: "number",
    },
    iconSize: {
      description: "Size of the tab icons (in pixels).",
      control: "number",
    },
    showError: {
      description:
        "Displays the error state and shows the error message below the capsule.",
      control: "boolean",
    },
    errorMessage: {
      description: "Error message shown when `showError` is true.",
      control: "text",
    },
    styles: {
      control: false,
      description: `
Custom styles for the Capsule component. This object allows you to override styles for individual parts:

- **containerStyle**: Outer container wrapping the label and capsule group
- **labelStyle**: Label text element
- **tabStyle**: Applied to each tab, active background, and hover border

Each field accepts a \`CSSProp\` (styled-components compatible) and can be used to customize spacing, colors, borders, typography, and layout.
      `,
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
