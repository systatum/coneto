import type { Meta, StoryObj } from "@storybook/react";
import { Frame } from "./frame";
import { css } from "styled-components";

const meta: Meta<typeof Frame> = {
  title: "Stage/Frame",
  component: Frame,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      description:
        "Optional title displayed as an overlay at the top border of the frame.",
      control: "text",
    },
    styles: {
      description: `
Custom styles for the Frame component. This object allows you to override styles for specific parts of the frame:

- **containerStyle**: Styles applied to the outer frame container, including border, padding, background, and layout.
- **titleStyle**: Styles applied to the title container, which controls the positioning, spacing, and typography of the title overlay.

Each field accepts a \`CSSProp\` (styled-components compatible), enabling advanced customization such as spacing, colors, borders, and typography without modifying the component itself.
      `,
      control: "object",
    },
    children: {
      description:
        "Content rendered inside the frame. This is typically used to wrap form sections, grouped inputs, or any structured layout.",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Frame>;

export const Default: Story = {
  args: {
    styles: {
      containerStyle: css`
        font-size: 14px;
      `,
    },
    children: <>This is inside the frame.</>,
  },
  render: (args) => {
    return <Frame {...args} />;
  },
};

export const WithTitle: Story = {
  args: {
    title: "Frame Title",
    styles: {
      containerStyle: css`
        font-size: 14px;
      `,
    },
    children: <>This frame has a title.</>,
  },
  render: (args) => {
    return <Frame {...args} />;
  },
};

export const Custom: Story = {
  args: {
    title: "Frame w/ Class",
    styles: {
      containerStyle: css`
        font-size: 14px;
        background-color: #f5f5f5;
      `,
      titleStyle: css`
        background-color: #f5f5f5;
      `,
    },
    children: <>This frame has a custom background color.</>,
  },
  render: (args) => {
    return <Frame {...args} />;
  },
};
