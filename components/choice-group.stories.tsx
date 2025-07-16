import { Meta, StoryObj } from "@storybook/react";
import { ChoiceGroup } from "./choice-group";
import { ChangeEvent, ComponentProps, useState } from "react";
import { Radio } from "./radio";
import { Checkbox } from "./checkbox";
import { useArgs } from "@storybook/preview-api";
import { userEvent, within } from "@storybook/test";

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

const meta: Meta<typeof ChoiceGroup> = {
  title: "Content/ChoiceGroup",
  component: ChoiceGroup,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Content children on Choice Group",
    },
    className: {
      control: "text",
      description: "Style class with tailwind on Choice Group",
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const radios = await canvas.findAllByRole("radio");
    await userEvent.click(radios[1]);
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

    console.log(selected);

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

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const radios = await canvas.findAllByRole("checkbox");
    await userEvent.click(radios[1]);
    await userEvent.click(radios[2]);
  },
};
