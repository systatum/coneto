import type { Meta, StoryObj } from "@storybook/react";
import { Textbox, TextboxProps } from "./textbox";
import { useArgs } from "@storybook/preview-api";
import { useEffect, useState, type ChangeEvent } from "react";
import * as RemixIcons from "@remixicon/react";
import { css } from "styled-components";

const meta: Meta<typeof Textbox> = {
  title: "Input Elements/Textbox",
  component: Textbox,
  argTypes: {
    name: {
      control: "text",
      description: "Name attribute for the input",
    },
    label: {
      control: "text",
      description: "Label text for the textbox",
    },
    value: {
      control: "text",
      description: "Input value",
    },
    placeholder: {
      control: "text",
    },
    type: {
      control: {
        type: "select",
        options: ["text", "password", "message"],
      },
    },
    showError: {
      control: "boolean",
    },
    errorMessage: {
      control: "text",
    },
    onActionClick: { action: "sendClicked" },
    icon: {
      control: {
        type: "select",
      },
      options: Object.keys(RemixIcons),
      mapping: RemixIcons,
    },
    onChange: { action: "changed" },
    style: { control: false },
    containerStyle: { control: false },
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

type Story = StoryObj<typeof Textbox>;

export const Input: Story = {
  args: {
    name: "input",
    label: "Input",
    placeholder: "Type here...",
    value: "",
    type: "text",
    style: css`
      min-width: 400px;
      max-width: 400px;
    `,
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
    value: "",
    type: "text",
    style: css`
      min-width: 400px;
      max-width: 400px;
    `,
  },
  render: (args: TextboxProps) => {
    const [value1, setValue1] = useState({
      selectionOption: "1",
      search: "",
    });
    const [value2, setValue2] = useState({
      selectionOption: "1",
      search: "",
    });

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
          name="clock-in"
          label="Clock In"
          value={value1.search}
          onChange={(e) =>
            setValue1((prev) => ({ ...prev, search: e.target.value }))
          }
          dropdownToggleStyle={css`
            min-width: 106px;
          `}
          dropdown={{
            selectedOption: value1.selectionOption,
            options: [
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
            ],
            onChange: (id) =>
              setValue1((prev) => ({ ...prev, selectionOption: id })),
          }}
        />
        <Textbox
          {...args}
          name="clock-in-with-filter"
          label="Clock In With Filter"
          value={value2.search}
          onChange={(e) =>
            setValue2((prev) => ({ ...prev, search: e.target.value }))
          }
          dropdownToggleStyle={css`
            min-width: 106px;
          `}
          dropdown={{
            selectedOption: value2.selectionOption,
            options: [
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
            ],
            onChange: (id) =>
              setValue2((prev) => ({ ...prev, selectionOption: id })),
            withFilter: true,
          }}
        />
      </div>
    );
  },
};

export const WithAction: Story = {
  args: {
    name: "message",
    label: "Message",
    placeholder: "Type a message...",
    value: "",
    type: "text",
    style: css`
      min-width: 400px;
      max-width: 400px;
    `,
    actionIcon: true,
    icon: RemixIcons.RiSendPlaneFill,
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
        onChange={handleChange}
        onActionClick={() => {
          console.log("Send message has been successful.");
        }}
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
    style: css`
      min-width: 400px;
      max-width: 400px;
    `,
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
    style: css`
      min-width: 400px;
      max-width: 400px;
    `,
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
