import { Meta, StoryObj } from "@storybook/react";
import { Capsule } from "./capsule";
import { useArgs } from "@storybook/preview-api";
import { expect, userEvent, within } from "@storybook/test";

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const firstTabElement = await canvas.findByText("New");
    const secondTabElement = await canvas.findByText("List");
    await expect(firstTabElement).toBeVisible();
    await expect(secondTabElement).toBeVisible();

    await userEvent.click(secondTabElement, { delay: 300 });
    await userEvent.click(firstTabElement, { delay: 300 });
  },
};
