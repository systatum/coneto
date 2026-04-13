import { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioOption } from "./radio";
import { ChangeEvent, ComponentProps, Fragment, useState } from "react";
import { useArgs } from "@storybook/preview-api";
import { css } from "styled-components";
import { RiAlignLeft, RiDatabase2Fill } from "@remixicon/react";

const meta: Meta<typeof Radio> = {
  title: "Input Elements/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Radio is a form input component used to select a single option from a group. It supports multiple rendering modes (classic radio or button style), icons, descriptions, error states, and highlight-on-checked behavior.

---

### ✨ Features
- ⚪ **Classic radio / button style**: Choose between traditional radio circles or interactive button style.
- 🖼 **Optional icons**: Display an icon next to the label (supports images or custom icons).
- 📝 **Descriptions**: Add secondary text under the label for extra context.
- 🖌 **Highlighting**: Highlight container when selected.
- 🚫 **Disabled / error states**: Supports fully disabled or error visuals.
- 🔧 **Custom styles**: Customize almost every element using a \`styles\` object.

        `,
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
      description: "The value associated with this radio option.",
    },
    label: {
      control: "text",
      description: "Primary label text displayed next to the radio.",
    },
    description: {
      control: "text",
      description: "Secondary text shown below the label.",
    },
    checked: {
      control: "boolean",
      description: "Controls whether the radio is selected.",
    },
    name: { control: "text", description: "Name of the radio group." },
    onChange: {
      action: "changed",
      description: "Callback fired when the radio value changes.",
    },
    highlightOnChecked: {
      control: "boolean",
      description: "Highlights the radio container when checked.",
    },
    showError: {
      control: "boolean",
      description: "Displays the error state for the radio.",
    },
    errorMessage: {
      control: "text",
      description: "Text displayed when the radio is in an error state.",
    },
    mode: {
      control: "radio",
      options: ["radio", "button"],
      description: "Rendering mode of the radio.",
    },
    icon: {
      control: false,
      description: "Optional icon displayed inside the radio (button mode).",
    },
    disabled: {
      control: "boolean",
      description: "Disables user interaction with the radio.",
    },
    styles: {
      control: false,
      description:
        "Custom styles object for container, label, circle, and description.",
    },
  },
};

export default meta;

type RadioProps = ComponentProps<typeof Radio>;
type Story = StoryObj<RadioProps>;

export const Default: Story = {
  args: {
    value: "comments",
  },
  render: (args) => {
    const RADIO_OPTIONS: RadioOption[] = [
      {
        value: "comments",
        label: "Comments",
      },
      {
        value: "mentions",
        label: "Mentions",
      },
      {
        value: "follows",
        label: "Follows",
      },
      {
        value: "none",
        label: "None",
      },
    ];

    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setUpdateArgs({
        ...args,
        [name]: value,
      });
    };

    return (
      <div>
        {RADIO_OPTIONS.map((option, index) => (
          <Radio
            key={index}
            name="value"
            value={option.value}
            label={option.label}
            checked={args.value === option.value}
            onChange={onChangeValue}
          />
        ))}
      </div>
    );
  },
};

export const WithButton: Story = {
  args: {
    value: "comments",
  },
  render: (args) => {
    const RADIO_OPTIONS_WITH_ICON: RadioOption[] = [
      {
        value: "text",
        label: "Text",
        icon: { image: RiAlignLeft },
      },
      {
        value: "database",
        label: "Database",
        icon: { image: RiDatabase2Fill },
      },
    ];

    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setUpdateArgs({
        ...args,
        [name]: value,
      });
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "fit-content",
          justifyContent: "start",
          gap: "4px",
        }}
      >
        {RADIO_OPTIONS_WITH_ICON.map((option, index) => (
          <Radio
            key={index}
            name="value"
            value={option.value}
            label={option.label}
            mode="button"
            icon={{
              image: option.icon.image as string,
            }}
            checked={args.value === option.value}
            onChange={onChangeValue}
          />
        ))}
        <a
          style={{
            textDecoration: "underline",
            color: "blue",
            fontSize: 13,
            paddingTop: "10px",
          }}
          href="/?path=/story/content-choicegroup--with-radio-button"
        >
          Also check out choice group with radio buttons
        </a>
      </div>
    );
  },
};

const DAILY_RADIO_OPTIONS: RadioOption[] = [
  {
    value: "daily",
    label: "Daily",
    description: "Receive a daily summary of your activity",
  },
  {
    value: "weekly",
    label: "Weekly",
    description: "Receive a weekly summary of your activity",
  },
  {
    value: "monthly",
    label: "Monthly",
    description: "Receive a monthly summary of your activity",
  },
  {
    value: "never",
    label: "Never",
    description: "Do not receive any notifications",
  },
];

export const WithDescription: Story = {
  argTypes: {
    value: {
      control: "radio",
      options: DAILY_RADIO_OPTIONS.map((val) => val.value),
    },
  },
  args: {
    value: "comments",
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setUpdateArgs({
        ...args,
        [name]: value,
      });
    };

    return (
      <div>
        {DAILY_RADIO_OPTIONS.map((option, index) => (
          <Radio
            key={index}
            name="value"
            value={option.value}
            label={option.label}
            description={option.description}
            checked={args.value === option.value}
            onChange={onChangeValue}
          />
        ))}
      </div>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const RADIO_OPTIONS = [
      {
        value: "high",
        label: "High Priority",
        description: "Only get notified for high priority updates",
      },
      {
        value: "medium",
        label: "Medium Priority",
        description: "Get notified for important updates",
      },
      {
        value: "low",
        label: "Low Priority",
        description: "Receive notifications for all updates",
      },
      {
        value: "off",
        label: "Turn Off",
        description: "Disable all notifications",
      },
    ];

    const [checked, setChecked] = useState("");

    return (
      <Fragment>
        {RADIO_OPTIONS.map((option, index) => (
          <Radio
            key={index}
            label={option.label}
            description={option.description}
            value={option.value}
            name="value"
            onChange={(e) => setChecked(e.target.value)}
            showError={!checked && index === RADIO_OPTIONS.length - 1}
            styles={{
              self: css`
                ${!checked &&
                css`
                  border-color: red;
                `}
              `,
            }}
            errorMessage="Please select an option before continuing."
          />
        ))}
      </Fragment>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const RADIO_OPTIONS: RadioOption[] = [
      {
        value: "email",
        label: "Email",
        description: "Receive notifications via email",
      },
      {
        value: "sms",
        label: "SMS",
        description: "Receive notifications via text message",
      },
      {
        value: "push",
        label: "Push Notification",
        description: "Receive notifications via app push",
      },
      {
        value: "none",
        label: "None",
        description: "Do not receive any notifications",
      },
    ];

    const [, setChecked] = useState("");

    return (
      <Fragment>
        {RADIO_OPTIONS.map((option, index) => (
          <Radio
            key={index}
            label={option.label}
            description={option.description}
            value={option.value}
            checked={option.value === "none"}
            disabled
            name="value"
            onChange={(e) => setChecked(e.target.value)}
          />
        ))}
      </Fragment>
    );
  },
};
