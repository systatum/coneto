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

    return <Imagebox size="xs" onFilesSelected={onChangeValue} />;
  },
};

export const Small: Story = {
  render: () => {
    const [, setValue] = useState();
    const onChangeValue = (e) => {
      setValue(e);
    };

    return <Imagebox size="sm" onFilesSelected={onChangeValue} />;
  },
};

export const Medium: Story = {
  render: () => {
    const [, setValue] = useState();
    const onChangeValue = (e) => {
      setValue(e);
    };

    return <Imagebox size="md" onFilesSelected={onChangeValue} />;
  },
};

export const Large: Story = {
  render: () => {
    const [, setValue] = useState();
    const onChangeValue = (e) => {
      setValue(e);
    };

    return <Imagebox size="lg" onFilesSelected={onChangeValue} />;
  },
};
