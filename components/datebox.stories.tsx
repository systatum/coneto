import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Datebox from "./datebox";
import { expect, userEvent, within } from "@storybook/test";

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

export const Default: Story = {
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText("mm/dd/yyyy");
    await expect(input).toBeInTheDocument();
    await userEvent.click(input);

    const rightChevron = await canvas.findByLabelText("Next Month");
    await userEvent.click(rightChevron);
    const leftChevron = await canvas.findByLabelText("Previous Month");
    await userEvent.click(leftChevron);

    const dayButton = await canvas.findByText("13");
    await userEvent.click(dayButton);
  },
};

export const WithDisableWeekend: Story = {
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
          disableWeekend
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText("mm/dd/yyyy");
    await expect(input).toBeInTheDocument();
    await userEvent.click(input);
    await userEvent.type(input, "12212002");
    await expect(input).toHaveValue("12/20/2002");
  },
};
