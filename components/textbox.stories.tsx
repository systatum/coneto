import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";
import { Textbox, TextboxProps } from "./textbox";
import { useArgs } from "@storybook/preview-api";
import { useEffect, type ChangeEvent } from "react";
import * as RemixIcons from "@remixicon/react";

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
    onActionClick: { action: "sendClicked" },
    icon: {
      control: {
        type: "select",
      },
      options: Object.keys(RemixIcons),
      mapping: RemixIcons,
    },
    onChange: { action: "changed" },
    className: { control: false },
    containerClassName: { control: false },
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
    className: "min-w-[400px]",
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
      args.onChange?.(e);
    };

    return <Textbox {...args} value={args.value} onChange={handleChange} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.getByRole("textbox");
    await userEvent.type(input, "This is input text", { delay: 50 });
    await expect(input).toHaveValue("This is input text");
  },
};

export const Textarea: Story = {
  args: {
    name: "textarea",
    label: "Textarea",
    placeholder: "Type your message...",
    value: "",
    type: "textarea",
    rows: 3,
    className: "min-w-[400px]",
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
      args.onChange?.(e);
    };

    return <Textbox {...args} value={args.value} onChange={handleChange} />;
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = await canvas.getByRole("textbox");
    await userEvent.type(textarea, "This is Textarea", {
      delay: 50,
    });
    await expect(textarea).toHaveValue("This is Textarea");
  },
};

export const InputMessage: Story = {
  args: {
    name: "message",
    label: "Message",
    placeholder: "Type a message...",
    value: "",
    type: "text",
    className: "min-w-[400px]",
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
      args.onChange?.(e);
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const message = await canvas.getByRole("textbox");
    await userEvent.type(message, "This is a Input message", { delay: 50 });
    await expect(message).toHaveValue("This is a Input message");
  },
};

export const Password: Story = {
  args: {
    name: "password",
    label: "Password",
    placeholder: "Enter password...",
    value: "",
    type: "password",
    className: "min-w-[400px]",
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
      args.onChange?.(e);
    };

    return <Textbox {...args} value={args.value} onChange={handleChange} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const password = await canvas.getByPlaceholderText("Enter password...");
    await userEvent.type(password, "mypassword123", { delay: 50 });
    await expect(password).toHaveValue("mypassword123");
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
    className: "min-w-[400px]",
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
      args.onChange?.(e);
    };

    return <Textbox {...args} value={args.value} onChange={handleChange} />;
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.getByRole("textbox");
    await userEvent.type(input, "Error triggered", { delay: 50 });
    await expect(input).toHaveValue("Error triggered");
    await expect(
      await canvas.findByText("This field is required")
    ).toBeVisible();
  },
};
