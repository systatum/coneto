import type { Meta, StoryObj } from "@storybook/react";
import { Textarea, TextareaProps } from "./textarea";
import { useArgs } from "@storybook/preview-api";
import * as RemixIcons from "@remixicon/react";
import { css } from "styled-components";
import { StatefulOnChangeType } from "./stateful-form";
import { useState } from "react";
import { DropdownOptionProps } from "./field-lane";
import { Calendar } from "./calendar";

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

export const WithDropdown: Story = {
  render: () => {
    const [value, setValue] = useState({
      selectedText1: "11/12/2025",
      selectedOption1: "11/12/2025",
      selectedText2: "WFH",
      selectedOption2: "2",
      value: "",
    });

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const ATTENDANCE_OPTIONS: DropdownOptionProps[] = [
      { text: "On-site", value: "1", icon: RemixIcons.RiHome2Line },
      { text: "WFH", value: "2", icon: RemixIcons.RiUser2Line },
      {
        text: "Sick leave",
        value: "3",
        icon: RemixIcons.RiSettings2Line,
      },
      {
        text: "Annual leave",
        value: "4",
        icon: RemixIcons.RiLogoutBoxLine,
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
            width: "100px",
            caption: value.selectedText1,
            render: ({ render }) =>
              render(
                <Calendar
                  selectedDates={[value.selectedOption1]}
                  monthNames={MONTH_NAMES}
                  setSelectedDates={(date: string[]) =>
                    setValue((prev) => ({
                      ...prev,
                      selectedText1: date[0],
                      selectedOption1: date[0],
                    }))
                  }
                />
              ),
          },
          {
            width: "150px",
            styles: {
              drawerStyle: css`
                width: 300px;
              `,
            },
            caption: value.selectedText2,
            options: ATTENDANCE_OPTIONS,
            onChange: (id) => {
              const selected = ATTENDANCE_OPTIONS.find(
                (item) => item.value === id
              );
              if (selected) {
                setValue((prev) => ({
                  ...prev,
                  selectedOption2: id,
                  selectedText2: selected.text,
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
