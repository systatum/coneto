import { Meta, StoryObj } from "@storybook/react";
import { Selectbox } from "./selectbox";
import { useState } from "react";
import { RiCalendar2Line } from "@remixicon/react";
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
      <div className="w-64">
        <Selectbox
          inputValue={value}
          setInputValue={setValue}
          placeholder="mm/dd/yyyy"
          iconClosed={RiCalendar2Line}
          iconOpened={RiCalendar2Line}
          type="calendar"
        >
          {(props) => (
            <Datebox
              dayNames={DAYS_NAME_ITEMS}
              monthNames={MONTHS_NAME_ITEMS}
              disableWeekend={true}
              format="mm/dd/yyyy"
              {...props}
            />
          )}
        </Selectbox>
      </div>
    );
  },
};
