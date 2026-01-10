import { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioOptionsProps } from "./radio";
import { ChangeEvent, ComponentProps, Fragment, useState } from "react";
import { useArgs } from "@storybook/preview-api";
import { css } from "styled-components";
import { RiAlignLeft, RiDatabase2Fill } from "@remixicon/react";

const meta: Meta<typeof Radio> = {
  title: "Input Elements/Radio",
  component: Radio,
  tags: ["autodocs"],
};

export default meta;

type RadioProps = ComponentProps<typeof Radio>;
type Story = StoryObj<RadioProps>;

export const Default: Story = {
  args: {
    value: "comments",
  },
  render: (args) => {
    const RADIO_OPTIONS: RadioOptionsProps[] = [
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
    const RADIO_OPTIONS_WITH_ICON: RadioOptionsProps[] = [
      {
        value: "text",
        label: "Text",
        icon: RiAlignLeft,
      },
      {
        value: "database",
        label: "Database",
        icon: RiDatabase2Fill,
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
            icon={option.icon}
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

const DAILY_RADIO_OPTIONS: RadioOptionsProps[] = [
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
              inputStyle: css`
                ${!checked &&
                css`
                  border-color: red;
                `}
              `,
              errorStyle: css`
                font-size: 14px;
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
    const RADIO_OPTIONS: RadioOptionsProps[] = [
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
