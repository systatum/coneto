import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Calendar } from "./calendar";
import { userEvent, within } from "@storybook/test";

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

export const CalendarDefault: Story = {
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
        format="mm/dd/yyyy"
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rightChevron = await canvas.findByLabelText("Next Month");
    await userEvent.click(rightChevron);
    const leftChevron = await canvas.findByLabelText("Previous Month");
    await userEvent.click(leftChevron);

    const dayButton = await canvas.findByText("13");
    await userEvent.click(dayButton);
  },
};
export const CalendarWithDisableWeekend: Story = {
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
        format="mm/dd/yyyy"
        disableWeekend
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rightChevron = await canvas.findByLabelText("Next Month");
    await userEvent.click(rightChevron);
    const leftChevron = await canvas.findByLabelText("Previous Month");
    await userEvent.click(leftChevron);

    const dayButton = await canvas.findByText("13");
    await userEvent.click(dayButton);
  },
};
