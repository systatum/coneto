import { Meta, StoryObj } from "@storybook/react";
import { ChoiceGroup } from "./choice-group";
import { ChangeEvent, ComponentProps, useState } from "react";
import { Radio, RadioOptionsProps } from "./radio";
import { Checkbox } from "./checkbox";
import { useArgs } from "@storybook/preview-api";
import {
  RiAlignLeft,
  RiDatabase2Fill,
  RiChat3Fill,
  RiAtFill,
  RiUserFollowFill,
  RiNotificationOffFill,
} from "@remixicon/react";
import { css } from "styled-components";

const meta: Meta<typeof ChoiceGroup> = {
  title: "Content/ChoiceGroup",
  component: ChoiceGroup,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Content children on Choice Group",
    },
    containerStyle: {
      control: "text",
      description:
        "Style class with styled component on Choice Group Container",
    },
    dividerStyle: {
      control: "text",
      description: "Style class with styled component on Choice Group Divider",
    },
  },
};

export default meta;

type ChoiceGroupProps = ComponentProps<typeof ChoiceGroup>;
type StoryRadio = StoryObj<
  ChoiceGroupProps & Partial<{ radioSelected?: string }>
>;
type StoryCheckbox = StoryObj<
  ChoiceGroupProps & Partial<{ valueSelected?: string[] }>
>;

export const WithRadio: StoryRadio = {
  argTypes: {
    radioSelected: {
      control: "radio",
    },
  },
  args: {
    radioSelected: "comments",
  },

  render: (args) => {
    const RADIO_OPTIONS: RadioOptionsProps[] = [
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

    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setUpdateArgs({
        ...args,
        [name]: value,
      });
    };

    return (
      <ChoiceGroup>
        {RADIO_OPTIONS.map((option, index) => {
          return (
            <Radio
              key={index}
              name="radioSelected"
              value={option.value}
              label={option.label}
              description={option.description}
              checked={args.radioSelected === option.value}
              onChange={onChangeValue}
            />
          );
        })}
      </ChoiceGroup>
    );
  },
};

export const WithRadioAndIcon: StoryRadio = {
  argTypes: {
    radioSelected: {
      control: "radio",
    },
  },
  args: {
    radioSelected: "comments",
  },

  render: (args) => {
    const RADIO_OPTIONS: RadioOptionsProps[] = [
      {
        value: "comments",
        label: "Comments",
        description: "Get notified when someone posts a comment",
        icon: RiChat3Fill,
      },
      {
        value: "mentions",
        label: "Mentions",
        description: "Get notified when someone mentions you",
        icon: RiAtFill,
      },
      {
        value: "follows",
        label: "Follows",
        description: "Get notified when someone follows you",
        icon: RiUserFollowFill,
      },
      {
        value: "none",
        label: "None",
        description: "Don't notify me",
        icon: RiNotificationOffFill,
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
      <ChoiceGroup>
        {RADIO_OPTIONS.map((option, index) => {
          return (
            <Radio
              key={index}
              name="radioSelected"
              value={option.value}
              label={option.label}
              icon={option.icon}
              description={option.description}
              checked={args.radioSelected === option.value}
              onChange={onChangeValue}
            />
          );
        })}
      </ChoiceGroup>
    );
  },
};

export const WithRadioButton: StoryRadio = {
  argTypes: {
    radioSelected: {
      control: "radio",
    },
  },
  args: {
    radioSelected: "text",
  },

  render: (args) => {
    const [, setUpdateArgs] = useArgs();

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

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setUpdateArgs({
        ...args,
        [name]: value,
      });
    };

    return (
      <ChoiceGroup
        containerStyle={css`
          max-width: 400px;
        `}
        flexDirection="row"
      >
        {RADIO_OPTIONS_WITH_ICON.map((option, index) => {
          return (
            <Radio
              mode="button"
              key={index}
              name="radioSelected"
              value={option.value}
              label={option.label}
              icon={option.icon}
              checked={args.radioSelected === option.value}
              onChange={onChangeValue}
            />
          );
        })}
      </ChoiceGroup>
    );
  },
};

export const WithCheckbox: StoryCheckbox = {
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
      <ChoiceGroup>
        {CHECKBOX_OPTIONS.map((option, index) => (
          <Checkbox
            key={index}
            name="checked"
            value={JSON.stringify(option)}
            description={option.description}
            label={option.label}
            checked={selected.checked.some(
              (item) => item.value === option.value
            )}
            onChange={onChangeValue}
          />
        ))}
      </ChoiceGroup>
    );
  },
};
