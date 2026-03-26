import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, CheckboxOptionProps, CheckboxProps } from "./checkbox";
import { ChangeEvent, useState } from "react";
import { css } from "styled-components";

const meta: Meta<typeof Checkbox> = {
  title: "Input Elements/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "The main label text displayed next to the checkbox.",
    },
    description: {
      control: "text",
      description: "Optional secondary text below the label.",
    },
    checked: {
      control: "boolean",
      description: "Checkbox checked state.",
    },
    indeterminate: {
      control: "boolean",
      description: "Shows a horizontal line instead of a checkmark.",
    },
    highlightOnChecked: {
      control: "boolean",
      description: "If true, highlights background when checkbox is checked.",
    },
    disabled: {
      control: "boolean",
      description: "Disable the checkbox input.",
    },
    showError: {
      control: "boolean",
      description: "Shows the checkbox in an error state.",
    },
    errorMessage: {
      control: "text",
      description: "Error message to display when `showError` is true.",
    },
    helper: {
      control: "text",
      description: "Optional helper text for forms.",
    },
    name: {
      control: "text",
      description: "Name attribute for form submission.",
    },
    id: {
      control: "text",
      description: "Unique ID for associating label with input.",
    },
    styles: {
      control: "object",
      description:
        "Override default styles for different elements of the checkbox using CSSProp.",
    },
    onChange: {
      action: "changed",
      description: "Handler function called on checkbox change.",
    },
  },
};

export default meta;
type Story = StoryObj<CheckboxProps>;
type StoryWithDescription = StoryObj<
  CheckboxProps & Partial<{ valueSelected?: string[] }>
>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <Checkbox
        label="I agree to the terms"
        name="agreement"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
    );
  },
};

export const WithDescription: StoryWithDescription = {
  args: {
    valueSelected: [],
  },
  render: () => {
    const CHECKBOX_OPTIONS: CheckboxOptionProps[] = [
      {
        value: "email",
        label: "Email",
        description: "Receive updates via email",
      },
      {
        value: "push",
        label: "Push Notifications",
        description: "Receive updates via push notifications",
      },
      {
        value: "sms",
        label: "SMS",
        description: "Receive updates via text messages",
      },
    ];

    const [selected, setSelected] = useState<string[]>([]);

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((val) => val !== value)
          : [...prev, value]
      );
    };

    return (
      <>
        {CHECKBOX_OPTIONS.map((option, index) => (
          <Checkbox
            key={index}
            name={option.label}
            styles={{
              containerStyle: css`
                font-size: 14px;
              `,
            }}
            value={option.value}
            description={option.description}
            label={option.label}
            checked={selected.some((item) => item === option.value)}
            onChange={onChangeValue}
          />
        ))}
      </>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <Checkbox
        label="I agree to the terms"
        name="agreement"
        checked={checked}
        onChange={() => setChecked(!checked)}
        showError={!checked}
        errorMessage="Please select an option before continuing."
      />
    );
  },
};

export const Disabled: StoryWithDescription = {
  args: {
    valueSelected: [],
  },
  render: () => {
    const CHECKBOX_OPTIONS: CheckboxOptionProps[] = [
      {
        value: "email",
        label: "Email",
        description: "Receive updates via email",
      },
      {
        value: "push",
        label: "Push Notifications",
        description: "Receive updates via push notifications",
      },
    ];

    const [, setSelected] = useState({
      checked: [] as CheckboxOptionProps[],
    });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value: inputValue, checked, type } = e.target;

      if (type === "checkbox") {
        const parsed = JSON.parse(inputValue);
        setSelected((prev) => ({
          ...prev,
          [name]: checked
            ? [...prev[name], parsed]
            : prev[name].filter(
                (val: CheckboxOptionProps) => val.value !== parsed.value
              ),
        }));
      } else {
        setSelected((prev) => ({ ...prev, [name]: inputValue }));
      }
    };

    return (
      <>
        {CHECKBOX_OPTIONS.map((option, index) => (
          <Checkbox
            key={index}
            name={option.label}
            styles={{
              containerStyle: css`
                font-size: 14px;
              `,
            }}
            disabled
            value={JSON.stringify(option)}
            description={option.description}
            label={option.label}
            checked={"push" === option.value}
            onChange={onChangeValue}
          />
        ))}
      </>
    );
  },
};
