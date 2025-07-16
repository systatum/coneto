import { Meta, StoryObj } from "@storybook/react";
import { Togglebox } from "./togglebox";
import { useEffect } from "react";
import * as RemixIcons from "@remixicon/react";
import { useArgs } from "@storybook/preview-api";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof Togglebox> = {
  title: "Input Elements/Togglebox",
  component: Togglebox,
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the toggle is on",
      defaultValue: false,
    },
    isLoading: {
      control: "boolean",
      description: "Whether the toggle is in a loading state",
      defaultValue: false,
    },
    onChange: {
      action: "changed",
      description: "Callback when toggle is changed",
    },
    icon: {
      control: {
        type: "select",
      },
      options: Object.keys(RemixIcons),
      mapping: RemixIcons,
    },
    name: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Togglebox>;

export const Default: Story = {
  args: {
    checked: false,
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    return (
      <Togglebox
        {...args}
        onChange={(e) => setUpdateArgs({ checked: e.target.checked })}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const toggle = await canvas.getByRole("checkbox");

    await userEvent.click(toggle);
  },
};

export const WithIcon: Story = {
  args: {
    checked: false,
    icon: RemixIcons.RiLock2Fill,
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    return (
      <Togglebox
        {...args}
        onChange={(e) => setUpdateArgs({ checked: e.target.checked })}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const toggle = await canvas.getByRole("checkbox");

    await userEvent.click(toggle);
  },
};

export const WithIconAndLoading: Story = {
  args: {
    checked: false,
    icon: RemixIcons.RiLock2Fill,
    isLoading: false,
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    useEffect(() => {
      if (args.checked) {
        setUpdateArgs({ isLoading: true });
        setTimeout(() => {
          setUpdateArgs({ isLoading: false });
        }, 1200);
      }
    }, [args.checked]);

    return (
      <Togglebox
        {...args}
        onChange={(e) => setUpdateArgs({ checked: e.target.checked })}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const toggle = await canvas.getByRole("checkbox");

    await userEvent.click(toggle);
    const spinnerCircle = await canvas.findByTestId(
      "circle",
      {},
      { timeout: 1500 }
    );
    await expect(spinnerCircle).toBeInTheDocument();
  },
};
