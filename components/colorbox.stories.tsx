import { Meta, StoryObj } from "@storybook/react";
import { Colorbox } from "./colorbox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent } from "react";
import { css } from "styled-components";

const meta: Meta<typeof Colorbox> = {
  title: "Input Elements/Colorbox",
  component: Colorbox,
  tags: ["autodocs"],
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
