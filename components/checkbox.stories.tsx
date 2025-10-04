import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, CheckboxProps } from "./checkbox";
import { ChangeEvent, useState } from "react";
import { css } from "styled-components";

const meta: Meta<typeof Checkbox> = {
  title: "Input Elements/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    label: "I agree to the terms",
    name: "agreement",
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
    interface CheckboxOptionsProps {
      value: string;
      label: string;
      description: string;
    }

    const CHECKBOX_OPTIONS: CheckboxOptionsProps[] = [
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

    const [selected, setSelected] = useState({
      checked: [] as CheckboxOptionsProps[],
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
                (val: CheckboxOptionsProps) => val.value !== parsed.value
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
            name="checked"
            value={JSON.stringify(option)}
            description={option.description}
            label={option.label}
            labelStyle={css`
              font-size: 16px;
            `}
            inputStyle={css`
              margin-top: 2px;
            `}
            iconStyle={css`
              margin-top: 2px;
            `}
            checked={selected.checked.some(
              (item) => item.value === option.value
            )}
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
        errorMessage="You must agree before continuing"
      />
    );
  },
};
