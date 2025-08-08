import { Meta, StoryObj } from "@storybook/react";
import { Moneybox } from "./moneybox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent } from "react";
import { css } from "styled-components";

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
    currency: "$",
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
        style={css`
          max-width: 300px;
        `}
        value={currentArgs.value}
        onChange={onChangeValue}
        separator="dot"
      />
    );
  },
};

export const Euro: Story = {
  args: {
    value: "2000",
    name: "value",
    currency: "€",
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
        style={css`
          max-width: 300px;
        `}
        value={currentArgs.value}
        onChange={onChangeValue}
      />
    );
  },
};

export const Yen: Story = {
  args: {
    value: "2000",
    name: "value",
    currency: "¥",
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
        style={css`
          max-width: 300px;
        `}
        value={currentArgs.value}
        onChange={onChangeValue}
      />
    );
  },
};

export const Pound: Story = {
  args: {
    value: "2000",
    name: "value",
    currency: "£",
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
        style={css`
          max-width: 300px;
        `}
        value={currentArgs.value}
        onChange={onChangeValue}
      />
    );
  },
};

export const Rupiah: Story = {
  args: {
    value: "2000",
    name: "value",
    currency: "Rp",
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
        style={css`
          max-width: 300px;
        `}
        value={currentArgs.value}
        onChange={onChangeValue}
      />
    );
  },
};

export const WithLabel: Story = {
  args: {
    value: "2000",
    name: "value",
    currency: "$",
    separator: "dot",
    label: "Money",
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
        style={css`
          max-width: 300px;
        `}
        value={currentArgs.value}
        onChange={onChangeValue}
      />
    );
  },
};

export const ErrorState: Story = {
  args: {
    name: "value",
    currency: "$",
    separator: "dot",
    label: "Money",
    value: "",
    showError: true,
    errorMessage: "Invalid amount",
  },

  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const cleanedValue = value.toString().replace(/[.,]/g, "");
      const isValid = cleanedValue.length >= 4;

      setUpdateArgs({
        ...currentArgs,
        [name]: value,
        showError: !isValid,
        errorMessage: !isValid ? "Minimum numbers 4 digit are allowed" : "",
      });
    };

    return (
      <Moneybox
        {...args}
        style={css`
          max-width: 300px;
        `}
        onChange={onChangeValue}
      />
    );
  },
};
