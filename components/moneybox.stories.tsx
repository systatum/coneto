import { Meta, StoryObj } from "@storybook/react";
import Moneybox from "./moneybox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent } from "react";
import { userEvent, within } from "@storybook/test";

const meta: Meta<typeof Moneybox> = {
  title: "Input Elements/Moneybox",
  component: Moneybox,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Moneybox>;

export const Dollar: Story = {
  args: {
    value: "2000",
    name: "value",
    type: "dollar",
  },
  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();
    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUpdateArgs({ ...currentArgs, [name]: value });
    };
    return (
      <Moneybox
        {...args}
        className="max-w-[300px]"
        value={currentArgs.value}
        onChange={onChangeValue}
        separator="dot"
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByRole("textbox");

    await userEvent.clear(input);
    await userEvent.type(input, "3500");
  },
};

export const Euro: Story = {
  args: {
    value: "2000",
    name: "value",
    type: "euro",
    separator: "comma",
  },
  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();
    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUpdateArgs({ ...currentArgs, [name]: value });
    };
    return (
      <Moneybox
        {...args}
        className="max-w-[300px]"
        value={currentArgs.value}
        onChange={onChangeValue}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByRole("textbox");

    await userEvent.clear(input);
    await userEvent.type(input, "3500");
  },
};

export const Yen: Story = {
  args: {
    value: "2000",
    name: "value",
    type: "yen",
    separator: "dot",
  },
  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();
    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUpdateArgs({ ...currentArgs, [name]: value });
    };
    return (
      <Moneybox
        {...args}
        className="max-w-[300px]"
        value={currentArgs.value}
        onChange={onChangeValue}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByRole("textbox");

    await userEvent.clear(input);
    await userEvent.type(input, "3500");
  },
};

export const Pound: Story = {
  args: {
    value: "2000",
    name: "value",
    type: "pound",
    separator: "comma",
  },
  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();
    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUpdateArgs({ ...currentArgs, [name]: value });
    };
    return (
      <Moneybox
        {...args}
        className="max-w-[300px]"
        value={currentArgs.value}
        onChange={onChangeValue}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByRole("textbox");

    await userEvent.clear(input);
    await userEvent.type(input, "3500");
  },
};

export const Rupiah: Story = {
  args: {
    value: "2000",
    name: "value",
    type: "rupiah",
    separator: "dot",
  },
  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();
    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUpdateArgs({ ...currentArgs, [name]: value });
    };
    return (
      <Moneybox
        {...args}
        className="max-w-[300px]"
        value={currentArgs.value}
        onChange={onChangeValue}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByRole("textbox");

    await userEvent.clear(input);
    await userEvent.type(input, "3500");
  },
};
