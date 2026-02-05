import type { Meta, StoryObj } from "@storybook/react";
import { Textarea, TextareaProps } from "./textarea";
import { useArgs } from "@storybook/preview-api";
import * as RemixIcons from "@remixicon/react";
import { css } from "styled-components";
import { StatefulOnChangeType } from "./stateful-form";

const meta: Meta<typeof Textarea> = {
  title: "Input Elements/Textarea",
  component: Textarea,
  argTypes: {
    name: {
      control: "text",
      description: "Name attribute for the input",
    },
    label: {
      control: "text",
      description: "Label text for the Textarea",
    },
    value: {
      control: "text",
      description: "Input value",
    },
    placeholder: {
      control: "text",
    },
    rows: {
      control: "number",
      if: { arg: "type", eq: "textarea" },
    },
    showError: {
      control: "boolean",
    },
    errorMessage: {
      control: "text",
    },
    actions: {
      control: false,
      description:
        "Array of action buttons displayed inside the input. Each action can include an icon, title tooltip, and click handler.",
      table: {
        type: {
          summary: `TextareaActionsProps[]`,
          detail: `{
  title?: string;
  icon?: RemixiconComponentType;
  iconColor?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  titleShowDelay?: number;
}`,
        },
      },
    },
    icon: {
      control: {
        type: "select",
      },
      options: Object.keys(RemixIcons),
      mapping: RemixIcons,
    },
    onChange: { action: "changed" },
    styles: { self: { control: false }, containerStyle: { control: false } },
  },
  args: {
    value: "",
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    name: "textarea",
    label: "Textarea",
    placeholder: "Type your message...",
    value: "",
    rows: 3,
    styles: {
      self: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextareaProps) => {
    const [, setUpdateArgs] = useArgs();

    const handleChange = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const newValue = e.target.value;
        setUpdateArgs({ value: newValue });
      }
    };

    return <Textarea {...args} value={args.value} onChange={handleChange} />;
  },
};

export const Autogrow: Story = {
  args: {
    name: "textarea",
    label: "Textarea Autogrow",
    autogrow: true,
    placeholder: "Type your message...",
    value: "",
    rows: 3,
    styles: {
      self: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextareaProps) => {
    const [, setUpdateArgs] = useArgs();

    const handleChange = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const newValue = e.target.value;
        setUpdateArgs({ value: newValue });
      }
    };

    return <Textarea {...args} value={args.value} onChange={handleChange} />;
  },
};

export const WithErrorMessage: Story = {
  args: {
    name: "error",
    label: "With Error",
    placeholder: "Type with error...",
    autogrow: true,
    value: "",
    showError: true,
    errorMessage: "This field is required",
    styles: {
      self: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextareaProps) => {
    const [, setUpdateArgs] = useArgs();

    const handleChange = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const newValue = e.target.value;
        setUpdateArgs({ value: newValue });
      }
    };

    return <Textarea {...args} value={args.value} onChange={handleChange} />;
  },
};
