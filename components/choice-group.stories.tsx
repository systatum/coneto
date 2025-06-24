import { Meta, StoryObj } from "@storybook/react";
import ChoiceGroup from "./choice-group";
import { ChangeEvent, useState } from "react";
import Radio from "./radio";
import Checkbox from "./checkbox";

const meta: Meta<typeof ChoiceGroup> = {
  title: "Content/ChoiceGroup",
  component: ChoiceGroup,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ChoiceGroup>;

export const ChoiceRadioMode: Story = {
  render: () => {
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
    const [selected, setSelected] = useState({ radioSelected: "comments" });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setSelected((prev) => ({
        ...prev,
        [name]: value,
      }));
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
              checked={selected.radioSelected === option.value}
              onChange={onChangeValue}
            />
          );
        })}
      </ChoiceGroup>
    );
  },
};

export const ChoiceGroupWithCheckboxes: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);

    const CHECKBOX_OPTIONS = [
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;

      setSelected((prev) =>
        checked ? [...prev, value] : prev.filter((val) => val !== value)
      );
    };

    return (
      <ChoiceGroup>
        {CHECKBOX_OPTIONS.map((option, index) => (
          <Checkbox
            key={index}
            name="notifications"
            value={option.value}
            description={option.description}
            label={option.label}
            checked={selected.includes(option.value)}
            onChange={handleChange}
          />
        ))}
      </ChoiceGroup>
    );
  },
};
