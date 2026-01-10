import type { Meta, StoryObj } from "@storybook/react";
import { DropdownOptionProps, Textbox, TextboxProps } from "./textbox";
import { useArgs } from "@storybook/preview-api";
import { useEffect, useState, type ChangeEvent } from "react";
import * as RemixIcons from "@remixicon/react";
import { css } from "styled-components";
import { Calendar } from "./calendar";

const meta: Meta<typeof Textbox> = {
  title: "Input Elements/Textbox",
  component: Textbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible input component with support for labels, validation states, action icons, and customizable dropdowns with filtering and custom rendering.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Name attribute for the input element.",
    },
    label: {
      control: "text",
      description: "Label text displayed above the input.",
    },
    value: {
      control: "text",
      description: "The current value of the input field.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when input is empty.",
    },
    type: {
      control: { type: "select" },
      options: ["text", "password", "message", "hidden"],
      description: "Input type (text, password, message, hidden).",
    },
    showError: {
      control: "boolean",
      description: "Whether to show an error state.",
    },
    errorMessage: {
      control: "text",
      description: "Error message displayed when showError is true.",
    },
    actions: {
      control: false,
      description:
        "Array of action buttons displayed inside the input. Each action can include an icon, title tooltip, and click handler.",
      table: {
        type: {
          summary: `ActionsProps[]`,
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
    dropdowns: {
      control: false,
      description:
        "Dropdown configuration array supporting custom rendering or list-based selection with optional filtering.",
      table: {
        type: {
          summary: `DropdownProps[]`,
          detail: `{
  options?: DropdownOptionProps[];
  caption?: string;
  onChange?: (id: string) => void;
  width?: string;
  drawerStyle?: CSSProp;
  containerStyle?: CSSProp;
  withFilter?: boolean;
  render?: (props: { render?: (children?: ReactNode) => ReactNode; setCaption?: (caption?: string) => void; }) => ReactNode;
}`,
        },
      },
    },
    onChange: {
      action: "changed",
      description: "Triggered when the input value changes.",
    },
    styles: {
      containerStyle: {
        control: false,
        description: "Custom style applied to the outer container.",
      },
      labelStyle: {
        control: false,
        description: "Custom style applied to the label.",
      },
      style: {
        control: false,
        description: "Custom style applied directly to the input element.",
      },
    },
  },

  args: {
    label: "Username",
    placeholder: "Enter your username",
    value: "",
  },
};

export default meta;

type Story = StoryObj<typeof Textbox>;

export const Input: Story = {
  args: {
    name: "input",
    label: "Input",
    placeholder: "Type here...",
    value: "",
    type: "text",
    styles: {
      style: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextboxProps) => {
    const [, setUpdateArgs] = useArgs();

    useEffect(() => {
      const timer = setTimeout(() => {
        setUpdateArgs({ value: "" });
      }, 100);
      return () => clearTimeout(timer);
    }, [setUpdateArgs]);

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const newValue = e.target.value;
      setUpdateArgs({ value: newValue });
    };

    return <Textbox {...args} value={args.value} onChange={handleChange} />;
  },
};

export const WithDropdown: Story = {
  args: {
    placeholder: "Type here...",
    type: "text",
    styles: {
      containerStyle: css`
        min-width: 700px;
        max-width: 700px;
      `,
    },
  },
  parameters: {
    layout: "padded",
  },
  render: (args: TextboxProps) => {
    const [value1, setValue1] = useState({
      selectedText: "On-site",
      selectedOption: "1",
      value: "",
    });
    const [value2, setValue2] = useState({
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Textbox
          {...args}
          name="with-list-dropdown"
          label="With list dropdown"
          value={value1.value}
          onChange={(e) =>
            setValue1((prev) => ({ ...prev, value: e.target.value }))
          }
          dropdowns={[
            {
              width: "100px",
              caption: value1.selectedText,
              options: ATTENDANCE_OPTIONS,
              onChange: (id) => {
                const selected = ATTENDANCE_OPTIONS.find(
                  (item) => item.value === id
                );
                if (selected) {
                  setValue1((prev) => ({
                    ...prev,
                    selectedOption: id,
                    selectedText: selected.text,
                  }));
                }
              },
            },
          ]}
        />
        <Textbox
          {...args}
          name="with-list-dropdown-and-custom-renderer"
          label="With list dropdown and custom renderer and custom width"
          value={value2.value}
          onChange={(e) =>
            setValue2((prev) => ({ ...prev, value: e.target.value }))
          }
          dropdowns={[
            {
              width: "100px",
              caption: value2.selectedText1,
              render: ({ render }) =>
                render(
                  <Calendar
                    selectedDates={[value2.selectedOption1]}
                    monthNames={MONTH_NAMES}
                    setSelectedDates={(date: string[]) =>
                      setValue2((prev) => ({
                        ...prev,
                        selectedText1: date[0],
                        selectedOption1: date[0],
                      }))
                    }
                  />
                ),
            },
            {
              width: "300px",
              styles: {
                drawerStyle: css`
                  width: 300px;
                `,
              },
              caption: value2.selectedText2,
              options: ATTENDANCE_OPTIONS,
              onChange: (id) => {
                const selected = ATTENDANCE_OPTIONS.find(
                  (item) => item.value === id
                );
                if (selected) {
                  setValue2((prev) => ({
                    ...prev,
                    selectedOption2: id,
                    selectedText2: selected.text,
                  }));
                }
              },
              withFilter: true,
            },
          ]}
        />
      </div>
    );
  },
};

export const WithAction: Story = {
  args: {
    name: "message",
    label: "With Action",
    placeholder: "Type a message...",
    value: "",
    type: "text",
    styles: {
      style: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextboxProps) => {
    const [, setUpdateArgs] = useArgs();

    useEffect(() => {
      const timer = setTimeout(() => {
        setUpdateArgs({ value: "" });
      }, 100);
      return () => clearTimeout(timer);
    }, [setUpdateArgs]);

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const newValue = e.target.value;
      setUpdateArgs({ value: newValue });
    };

    return (
      <Textbox
        {...args}
        value={args.value}
        actions={[
          {
            icon: RemixIcons.RiSendPlaneFill,
            onClick: () => console.log(`Send message has been successful.`),
            title: "Send message",
          },

          {
            icon: RemixIcons.RiCloseLine,
            onClick: () => setUpdateArgs({ value: "" }),
            title: "Delete message",
          },
        ].filter(Boolean)}
        onChange={handleChange}
      />
    );
  },
};

export const Password: Story = {
  args: {
    name: "password",
    label: "Password",
    placeholder: "Enter password...",
    value: "",
    type: "password",
    styles: {
      style: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextboxProps) => {
    const [, setUpdateArgs] = useArgs();

    useEffect(() => {
      const timer = setTimeout(() => {
        setUpdateArgs({ value: "" });
      }, 100);
      return () => clearTimeout(timer);
    }, [setUpdateArgs]);

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const newValue = e.target.value;
      setUpdateArgs({ value: newValue });
    };

    return <Textbox {...args} value={args.value} onChange={handleChange} />;
  },
};

export const WithErrorMessage: Story = {
  args: {
    name: "error",
    label: "With Error",
    placeholder: "Type with error...",
    value: "",
    type: "text",
    showError: true,
    errorMessage: "This field is required",
    styles: {
      style: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextboxProps) => {
    const [, setUpdateArgs] = useArgs();

    useEffect(() => {
      const timer = setTimeout(() => {
        setUpdateArgs({ value: "" });
      }, 100);
      return () => clearTimeout(timer);
    }, [setUpdateArgs]);

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const newValue = e.target.value;

      setUpdateArgs({
        value: newValue,
        showError: newValue.length < 10,
        errorMessage:
          newValue.length < 10 ? "This field is required" : undefined,
      });
    };

    return <Textbox {...args} value={args.value} onChange={handleChange} />;
  },
};
