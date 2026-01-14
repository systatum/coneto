import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Imagebox } from "./imagebox";

const meta: Meta<typeof Imagebox> = {
  title: "Input Elements/Imagebox",
  component: Imagebox,
  tags: ["autodocs"],
  argTypes: {
    onFileSelected: {
      control: false,
      description:
        "Callback fired when a file is selected via browse or drag & drop. Receives the selected File or undefined.",
    },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg"],
      description:
        "Controls the dimensions of the image box and the icon size.",
    },
    label: {
      control: "text",
      description: "Optional label displayed above the image box.",
    },
    showError: {
      control: "boolean",
      description: "When true, displays the error message below the input.",
    },
    errorMessage: {
      control: "text",
      description: "Text shown when `showError` is enabled.",
    },
    name: {
      control: "text",
      description: "Name attribute passed to the hidden file input element.",
    },
    styles: {
      control: false,
      description: `
Custom styles for the Imagebox component.

This object allows you to override styles for individual parts:

- **containerStyle**: Wrapper around the entire Imagebox (label + input)
- **labelStyle**: Styles applied to the label element
- **self**: Styles applied to the image input box itself (border, background, sizing, etc)

Each field accepts a \`CSSProp\` (styled-components compatible) and can be used to control layout, spacing, borders, colors, and visual appearance.
    `,
    },
  },
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
