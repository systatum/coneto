import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Imagebox } from "./imagebox";

const meta: Meta<typeof Imagebox> = {
  title: "Input Elements/Imagebox",
  component: Imagebox,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Imagebox>;

export const ExtraSmall: Story = {
  render: () => {
    const [, setValue] = useState();
    const onChangeValue = (e) => {
      setValue(e);
    };

    return <Imagebox size="xs" onFileSelected={onChangeValue} />;
  },
};

export const Small: Story = {
  render: () => {
    const [, setValue] = useState();
    const onChangeValue = (e) => {
      setValue(e);
    };

    return <Imagebox size="sm" onFileSelected={onChangeValue} />;
  },
};

export const Medium: Story = {
  render: () => {
    const [, setValue] = useState();
    const onChangeValue = (e) => {
      setValue(e);
    };

    return <Imagebox size="md" onFileSelected={onChangeValue} />;
  },
};

export const Large: Story = {
  render: () => {
    const [, setValue] = useState();
    const onChangeValue = (e) => {
      setValue(e);
    };

    return <Imagebox size="lg" onFileSelected={onChangeValue} />;
  },
};
