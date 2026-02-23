import type { Meta, StoryObj } from "@storybook/react";
import { Textbox, TextboxProps } from "./textbox";
import { useArgs } from "@storybook/preview-api";
import { useEffect, useState, type ChangeEvent } from "react";
import * as RemixIcons from "@remixicon/react";
import { css } from "styled-components";
import { DropdownOptionProps } from "./field-lane";

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
          summary: `TextboxActionsProps[]`,
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
      self: {
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
      self: css`
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
    const [value, setValue] = useState({
      selectedText: "On-site",
      selectedOption: "1",
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
          value={value.value}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, value: e.target.value }))
          }
          dropdowns={[
            {
              width: "100px",
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
      self: css`
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
            icon: { image: RemixIcons.RiSendPlaneFill },
            onClick: () => console.log(`Send message has been successful.`),
            title: "Send message",
          },

          {
            icon: { image: RemixIcons.RiCloseLine },
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
      self: css`
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
      self: css`
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
