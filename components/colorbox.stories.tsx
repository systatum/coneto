import { Meta, StoryObj } from "@storybook/react";
import Colorbox, { ColorPickProps } from "./colorbox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent } from "react";
import { expect, userEvent, within } from "@storybook/test";

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
    const onChangeValue = (
      e: ChangeEvent<HTMLInputElement>,
      data: ColorPickProps
    ) => {
      const { name, value } = e.target;
      if (data === "color-pick") {
        setUpdateArgs({ ...currentArgs, [name]: value });
      } else if (data === "text") {
        let val = value;
        if (!val.startsWith("#")) {
          val = "#" + val;
        }
        setUpdateArgs({ ...currentArgs, [e.target.name]: val });
      }
    };

    return (
      <Colorbox
        containerClassName="max-w-[250px]"
        {...args}
        label="Color"
        value={args.color}
        name="color"
        onChange={onChangeValue}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Color")).toBeInTheDocument();

    const input = canvas.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "gggggg");

    await userEvent.clear(input);
    await userEvent.type(input, "00ff00");
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

    const onChangeValue = (
      e: ChangeEvent<HTMLInputElement>,
      data: ColorPickProps
    ) => {
      const { name, value } = e.target;

      if (data === "color-pick") {
        const isValidHex = isValidHexColor(value);
        setUpdateArgs({
          ...currentArgs,
          [name]: value,
          showError: !isValidHex,
          errorMessage: isValidHex ? "" : "Invalid color value.",
        });
      } else if (data === "text") {
        let val = value;
        if (!val.startsWith("#")) {
          val = "#" + val;
        }
        const isValidHex = isValidHexColor(val);
        setUpdateArgs({
          ...currentArgs,
          [name]: val,
          showError: !isValidHex,
          errorMessage: isValidHex ? "" : "Invalid color value.",
        });
      }
    };

    return (
      <Colorbox
        containerClassName="max-w-[250px]"
        {...args}
        label="Color"
        value={args.color}
        name="color"
        onChange={onChangeValue}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Invalid color value.")).toBeInTheDocument();
    await expect(canvas.getByText("Color")).toBeInTheDocument();

    const input = canvas.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "gggggg");

    await userEvent.clear(input);
    await userEvent.type(input, "00ff00");
  },
};
