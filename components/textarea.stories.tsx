import type { Meta, StoryObj } from "@storybook/react";
import { Textarea, TextareaProps } from "./textarea";
import { useArgs } from "@storybook/preview-api";
import * as RemixIcons from "@remixicon/react";
import { css } from "styled-components";
import { StatefulOnChangeType } from "./stateful-form";
import { useState } from "react";
import { DropdownOptionProps } from "./field-lane";

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

export const WithDropdown: Story = {
  render: () => {
    const [value, setValue] = useState({
      selectedText: "WFH",
      selectedOption: "2",
      value: "",
    });

    const ATTENDANCE_OPTIONS: DropdownOptionProps[] = [
      {
        text: "On-site",
        value: "1",
        icon: { image: RemixIcons.RiHome2Line },
      },
      {
        text: "WFH",
        value: "2",
        icon: { image: RemixIcons.RiUser2Line },
      },
      {
        text: "Sick leave",
        value: "3",
        icon: { image: RemixIcons.RiSettings2Line },
      },
      {
        text: "Annual leave",
        value: "4",
        icon: { image: RemixIcons.RiLogoutBoxLine },
      },
    ];

    return (
      <Textarea
        value={value.value}
        autogrow
        onChange={(e) =>
          setValue((prev) => ({ ...prev, value: e.target.value }))
        }
        dropdowns={[
          {
            width: "150px",
            styles: {
              drawerStyle: css`
                width: 300px;
              `,
            },
            caption: value.selectedText,
            options: ATTENDANCE_OPTIONS,
            onChange: (id) => {
              const selected = ATTENDANCE_OPTIONS.find(
                (option) => option.value === id
              );
              if (selected) {
                setValue((prev) => ({
                  ...prev,
                  selectedOption: id,
                  selectedText: selected.text,
                }));
              }
            },
            withFilter: true,
          },
        ]}
        styles={{
          self: css`
            min-width: 300px;
          `,
        }}
      />
    );
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
