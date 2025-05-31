import { Meta, StoryObj } from "@storybook/react";
import { Selectbox } from "./selectbox";
import { useState } from "react";
import ComboboxList from "./combobox-test";
import { RiCalendar2Line } from "@remixicon/react";
import { DateboxDraw } from "./datebox";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof Selectbox> = {
  title: "Input Elements/Selectbox",
  component: Selectbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Selectbox>;

export const Combobox: Story = {
  render: () => {
    const [value, setValue] = useState("");

    const FRUIT_OPTIONS = [
      "Apple",
      "Banana",
      "Orange",
      "Grape",
      "Pineapple",
      "Strawberry",
      "Watermelon",
    ];
    return (
      <div className="w-64">
        <Selectbox
          options={FRUIT_OPTIONS}
          inputValue={value}
          setInputValue={setValue}
          placeholder="Select a fruit..."
          drawer={(props) => <ComboboxList {...props} />}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText("Select a fruit...");

    await userEvent.type(input, "ap");

    const appleOption = await canvas.findByRole("option", { name: "Apple" });
    const grapeOption = await canvas.findByRole("option", {
      name: "Grape",
    });

    await expect(appleOption).toBeVisible();
    await expect(grapeOption).toBeVisible();

    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{enter}");

    await expect((input as HTMLInputElement).value).toBe("Grape");
  },
};

export const Datebox: Story = {
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
      <div className="w-64">
        <Selectbox
          inputValue={value}
          setInputValue={setValue}
          placeholder="mm/dd/yyyy"
          iconClosed={RiCalendar2Line}
          iconOpened={RiCalendar2Line}
          type="calendar"
          drawer={(props) => (
            <DateboxDraw
              dayNames={DAYS_NAME_ITEMS}
              monthNames={MONTHS_NAME_ITEMS}
              disableWeekend={true}
              format="mm/dd/yyyy"
              {...props}
            />
          )}
        />
      </div>
    );
  },
};
