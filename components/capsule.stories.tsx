import { Meta, StoryObj } from "@storybook/react";
import { Capsule, CapsuleContentProps } from "./capsule";
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
};

export default meta;

type Story = StoryObj<typeof Capsule>;

export const VIEW_ONLY_TITLE_MODES: CapsuleContentProps[] = [
  {
    id: "new",
    title: "New",
  },
  {
    id: "list",
    title: "List",
  },
];

export const Default: Story = {
  args: {
    tabs: VIEW_ONLY_TITLE_MODES,
    activeTab: "new",
  },
  render: (args) => {
    const [{ activeTab }, setUpdateArgs] = useArgs();

    return (
      <Capsule
        {...args}
        activeTab={activeTab}
        onTabChange={(prev: string) => setUpdateArgs({ activeTab: prev })}
      />
    );
  },
};

export const VIEW_WITH_ICON_MODES: CapsuleContentProps[] = [
  {
    id: "new",
    title: "New",
    icon: RiFile2Line,
  },
  {
    id: "list",
    title: "List",
    icon: RiNewspaperLine,
  },
];

export const WithIcon: Story = {
  args: {
    tabs: VIEW_WITH_ICON_MODES,
    activeTab: "new",
  },
  render: (args) => {
    const [{ activeTab }, setUpdateArgs] = useArgs();

    return (
      <Capsule
        {...args}
        activeTab={activeTab}
        onTabChange={(prev: string) => setUpdateArgs({ activeTab: prev })}
      />
    );
  },
};

export const VIEW_ONLY_ICON_MODES: CapsuleContentProps[] = [
  {
    id: "new",
    icon: RiFile2Line,
  },
  {
    id: "list",
    icon: RiNewspaperLine,
  },
];
