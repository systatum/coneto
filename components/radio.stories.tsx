import { Meta, StoryObj } from "@storybook/react";
import Radio from "./radio";
import { ChangeEvent, useState } from "react";

const meta: Meta<typeof Radio> = {
  title: "Input Elements/Radio",
  component: Radio,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
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
      <div className="flex flex-col">
        {RADIO_OPTIONS.map((option) => (
          <Radio
            key={option.value}
            name="radioSelected"
            value={option.value}
            label={option.label}
            description={option.description}
            checked={selected.radioSelected === option.value}
            onChange={onChangeValue}
          />
        ))}
      </div>
    );
  },
};
