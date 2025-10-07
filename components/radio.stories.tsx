import { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./radio";
import { ChangeEvent, ComponentProps, Fragment, useState } from "react";
import { useArgs } from "@storybook/preview-api";
import { css } from "styled-components";

const meta: Meta<typeof Radio> = {
  title: "Input Elements/Radio",
  component: Radio,
  tags: ["autodocs"],
};

export default meta;

type RadioProps = ComponentProps<typeof Radio>;
type Story = StoryObj<RadioProps & Partial<{ radioSelected?: string }>>;

const RADIO_OPTIONS = [
  {
    value: "comments",
    label: "Comments",
    description: "Get notified when someone posts a comment",
  },
  {
    value: "mentions",
    label: "Mentions",
    description: "Get notified when someone mentions you",
  },
  {
    value: "follows",
    label: "Follows",
    description: "Get notified when someone follows you",
  },
  {
    value: "none",
    label: "None",
    description: "Don't notify me",
  },
];

export const Default: Story = {
  args: {
    radioSelected: "comments",
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
        {RADIO_OPTIONS.map((option, index) => (
          <Radio
            key={index}
            name="radioSelected"
            value={option.value}
            label={option.label}
            checked={args.radioSelected === option.value}
            onChange={onChangeValue}
          />
        ))}
      </div>
    );
  },
};

export const WithDescription: Story = {
  argTypes: {
    radioSelected: {
      control: "radio",
      options: RADIO_OPTIONS.map((val) => val.value),
    },
  },
  args: {
    radioSelected: "comments",
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
        {RADIO_OPTIONS.map((option, index) => (
          <Radio
            key={index}
            name="radioSelected"
            value={option.value}
            label={option.label}
            description={option.description}
            checked={args.radioSelected === option.value}
            onChange={onChangeValue}
          />
        ))}
      </div>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [checked, setChecked] = useState("");

    return (
      <Fragment>
        {RADIO_OPTIONS.map((option, index) => (
          <Radio
            key={index}
            label={option.label}
            description={option.description}
            value={option.value}
            name="radioSelected"
            onChange={(e) => setChecked(e.target.value)}
            showError={!checked && index === RADIO_OPTIONS.length - 1}
            inputStyle={
              !checked &&
              css`
                border-color: red;
              `
            }
            errorMessage="Please select an option before continuing."
            errorStyle={css`
              font-size: 14px;
            `}
          />
        ))}
      </Fragment>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [, setChecked] = useState("");

    return (
      <Fragment>
        {RADIO_OPTIONS.map((option, index) => (
          <Radio
            key={index}
            label={option.label}
            description={option.description}
            value={option.value}
            disabled
            name="radioSelected"
            onChange={(e) => setChecked(e.target.value)}
          />
        ))}
      </Fragment>
    );
  },
};
