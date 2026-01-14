import { Meta, StoryObj } from "@storybook/react";
import { Colorbox } from "./colorbox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent } from "react";
import { css } from "styled-components";

const meta: Meta<typeof Colorbox> = {
  title: "Input Elements/Colorbox",
  component: Colorbox,
  tags: ["autodocs"],
  argTypes: {
    value: {
      description: "Current color value in hex format (e.g. `#FF5733`).",
      control: "text",
    },
    onChange: {
      description: "Called when the color value changes.",
      action: "changed",
    },
    placeholder: {
      description: "Placeholder text for the hex input field.",
      control: "text",
    },
    disabled: {
      description: "Disables the Colorbox input and interaction.",
      control: "boolean",
    },
    name: {
      description: "Name attribute of the underlying input element.",
      control: "text",
    },
    label: {
      description: "Label displayed above the Colorbox.",
      control: "text",
    },
    showError: {
      description: "Displays the error state styling and error icon.",
      control: "boolean",
    },
    errorMessage: {
      description: "Message shown below the input when `showError` is true.",
      control: "text",
    },
    onClick: {
      description: "Called when the color input loses focus after interaction.",
      action: "clicked",
    },
    styles: {
      control: false,
      description: `
Custom styles for the Colorbox component. This object allows you to override styles for individual parts:

- **self**: Main input container wrapping the color preview and text input
- **containerStyle**: Outer wrapper of the Colorbox (controls spacing, width, and layout)
- **labelStyle**: Label text element

Each field accepts a \`CSSProp\` (styled-components compatible) and can be used to customize layout, spacing, borders, colors, and typography.
    `,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Colorbox>;

export const Default: Story = {
  args: {
    color: "#ffffff",
  },
  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();
    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUpdateArgs({ ...currentArgs, [name]: value });
    };

    return (
      <Colorbox
        styles={{
          containerStyle: css`
            max-width: 250px;
          `,
        }}
        {...args}
        label="Color"
        value={args.color}
        name="color"
        onChange={onChangeValue}
      />
    );
  },
};

export const WithError: Story = {
  args: {
    color: "#zzzzzz",
    showError: true,
    errorMessage: "Invalid color value.",
  },
  render: (args) => {
    const [currentArgs, setUpdateArgs] = useArgs();

    function isValidHexColor(value: string): boolean {
      const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
      return hexRegex.test(value);
    }

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      const isValidHex = isValidHexColor(value);
      setUpdateArgs({
        ...currentArgs,
        [name]: value,
        showError: !isValidHex,
        errorMessage: isValidHex ? "" : "Invalid color value.",
      });
    };

    return (
      <Colorbox
        styles={{
          containerStyle: css`
            max-width: 250px;
          `,
        }}
        {...args}
        label="Color"
        value={args.color}
        name="color"
        onChange={onChangeValue}
      />
    );
  },
};
