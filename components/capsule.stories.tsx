import { Meta, StoryObj } from "@storybook/react";
import { Capsule } from "./capsule";
import { useArgs } from "@storybook/preview-api";

const meta: Meta<typeof Capsule> = {
  title: "Controls/Capsule",
  component: Capsule,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Capsule>;

const VIEW_MODES = [
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
    fields: VIEW_MODES,
    view: "new",
  },
  render: (args) => {
    const [{ view }, setUpdateArgs] = useArgs();

    return (
      <Capsule
        {...args}
        view={view}
        setView={(prev: string) => setUpdateArgs({ view: prev })}
      />
    );
  },
};
