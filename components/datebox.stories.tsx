import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Datebox from "./datebox";

const meta: Meta<typeof Datebox> = {
  title: "Input Elements/Datebox",
  component: Datebox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Datebox>;

export const DateboxDefault: Story = {
  render: () => {
    const DAYS_NAME_ITEMS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const MONTHS_NAME_ITEMS = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const [value, setValue] = useState("");

    return (
      <div className="w-[295px]">
        <Datebox
          options={DAYS_NAME_ITEMS}
          inputValue={value}
          setInputValue={setValue}
          dayNames={DAYS_NAME_ITEMS}
          monthNames={MONTHS_NAME_ITEMS}
        />
      </div>
    );
  },
};
