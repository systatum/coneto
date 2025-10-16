import { Meta, StoryObj } from "@storybook/react";
import { Capsule, CapsuleContentProps } from "./capsule";
import { useArgs } from "@storybook/preview-api";

const meta: Meta<typeof Capsule> = {
  title: "Input Elements/Capsule",
  component: Capsule,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Capsule>;

const VIEW_MODES: CapsuleContentProps[] = [
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
    tabs: VIEW_MODES,
    activeTab: "new",
  },
  render: (args) => {
    const [{ activeTab }, setUpdateArgs] = useArgs();

    return (
      <Capsule
        {...args}
        activeTab={activeTab}
        setActiveTab={(prev: string) => setUpdateArgs({ activeTab: prev })}
      />
    );
  },
};
