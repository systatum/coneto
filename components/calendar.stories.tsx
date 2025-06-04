import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Calendar } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "Input Elements/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const CalendarComponent: Story = {
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
      <Calendar
        dayNames={DAYS_NAME_ITEMS}
        monthNames={MONTHS_NAME_ITEMS}
        inputValue={value}
        setInputValue={setValue}
        disableWeekend={true}
        format="mm/dd/yyyy"
      />
    );
  },
};
