import { Meta, StoryObj } from "@storybook/react";
import { ReactElement, useState } from "react";
import { Datebox } from "./datebox";
import { OptionsProps } from "./selectbox";
import { Messagebox } from "./messagebox";

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
    const DAY_NAMES = [
      { text: "Su", value: 1 },
      { text: "Mo", value: 2 },
      { text: "Tu", value: 3 },
      { text: "We", value: 4 },
      { text: "Th", value: 5 },
      { text: "Fr", value: 6 },
      { text: "Sa", value: 7 },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: 1 },
      { text: "FEB", value: 2 },
      { text: "MAR", value: 3 },
      { text: "APR", value: 4 },
      { text: "MAY", value: 5 },
      { text: "JUN", value: 6 },
      { text: "JUL", value: 7 },
      { text: "AUG", value: 8 },
      { text: "SEP", value: 9 },
      { text: "OCT", value: 10 },
      { text: "NOV", value: 11 },
      { text: "DEC", value: 12 },
    ];

    const [, setValue] = useState<OptionsProps>({
      text: "",
      value: 0,
    });

    return (
      <div
        style={{
          width: "295px",
        }}
      >
        <Datebox
          options={DAY_NAMES}
          setInputValue={setValue}
          dayNames={DAY_NAMES}
          monthNames={MONTH_NAMES}
        />
      </div>
    );
  },
};

export const NoWeekends: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: 1 },
      { text: "Mo", value: 2 },
      { text: "Tu", value: 3 },
      { text: "We", value: 4 },
      { text: "Th", value: 5 },
      { text: "Fr", value: 6 },
      { text: "Sa", value: 7 },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: 1 },
      { text: "FEB", value: 2 },
      { text: "MAR", value: 3 },
      { text: "APR", value: 4 },
      { text: "MAY", value: 5 },
      { text: "JUN", value: 6 },
      { text: "JUL", value: 7 },
      { text: "AUG", value: 8 },
      { text: "SEP", value: 9 },
      { text: "OCT", value: 10 },
      { text: "NOV", value: 11 },
      { text: "DEC", value: 12 },
    ];

    const [, setValue] = useState<OptionsProps>({
      text: "",
      value: 0,
    });

    return (
      <div
        style={{
          width: "295px",
        }}
      >
        <Datebox
          options={DAY_NAMES}
          setInputValue={setValue}
          dayNames={DAY_NAMES}
          monthNames={MONTH_NAMES}
          disableWeekend
        />
      </div>
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: 1 },
      { text: "Mo", value: 2 },
      { text: "Tu", value: 3 },
      { text: "We", value: 4 },
      { text: "Th", value: 5 },
      { text: "Fr", value: 6 },
      { text: "Sa", value: 7 },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: 1 },
      { text: "FEB", value: 2 },
      { text: "MAR", value: 3 },
      { text: "APR", value: 4 },
      { text: "MAY", value: 5 },
      { text: "JUN", value: 6 },
      { text: "JUL", value: 7 },
      { text: "AUG", value: 8 },
      { text: "SEP", value: 9 },
      { text: "OCT", value: 10 },
      { text: "NOV", value: 11 },
      { text: "DEC", value: 12 },
    ];

    const [, setValue] = useState<OptionsProps>({
      text: "",
      value: 0,
    });

    return (
      <div
        style={{
          width: "295px",
        }}
      >
        <Datebox
          options={DAY_NAMES}
          setInputValue={setValue}
          dayNames={DAY_NAMES}
          monthNames={MONTH_NAMES}
          disableWeekend
          selectabilityMode="multiple"
        />
      </div>
    );
  },
};

export const Ranged: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: 1 },
      { text: "Mo", value: 2 },
      { text: "Tu", value: 3 },
      { text: "We", value: 4 },
      { text: "Th", value: 5 },
      { text: "Fr", value: 6 },
      { text: "Sa", value: 7 },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: 1 },
      { text: "FEB", value: 2 },
      { text: "MAR", value: 3 },
      { text: "APR", value: 4 },
      { text: "MAY", value: 5 },
      { text: "JUN", value: 6 },
      { text: "JUL", value: 7 },
      { text: "AUG", value: 8 },
      { text: "SEP", value: 9 },
      { text: "OCT", value: 10 },
      { text: "NOV", value: 11 },
      { text: "DEC", value: 12 },
    ];

    const [, setValue] = useState<OptionsProps>({
      text: "",
      value: 0,
    });

    return (
      <div
        style={{
          width: "295px",
        }}
      >
        <Datebox
          options={DAY_NAMES}
          setInputValue={setValue}
          dayNames={DAY_NAMES}
          monthNames={MONTH_NAMES}
          selectabilityMode="ranged"
          disableWeekend
        />
      </div>
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: 1 },
      { text: "Mo", value: 2 },
      { text: "Tu", value: 3 },
      { text: "We", value: 4 },
      { text: "Th", value: 5 },
      { text: "Fr", value: 6 },
      { text: "Sa", value: 7 },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: 1 },
      { text: "FEB", value: 2 },
      { text: "MAR", value: 3 },
      { text: "APR", value: 4 },
      { text: "MAY", value: 5 },
      { text: "JUN", value: 6 },
      { text: "JUL", value: 7 },
      { text: "AUG", value: 8 },
      { text: "SEP", value: 9 },
      { text: "OCT", value: 10 },
      { text: "NOV", value: 11 },
      { text: "DEC", value: 12 },
    ];

    const [, setValue] = useState<OptionsProps>({
      text: "",
      value: 0,
    });

    const footerContent: ReactElement = (
      <Messagebox variant="primary" title="No weekends">
        <span
          style={{
            fontSize: "12px",
          }}
        >
          Unfortunately, due to a driver shortage, please choose delivery dates
          other than weekends. Thank you.
        </span>
      </Messagebox>
    );

    return (
      <div
        style={{
          width: "295px",
        }}
      >
        <Datebox
          options={DAY_NAMES}
          setInputValue={setValue}
          dayNames={DAY_NAMES}
          monthNames={MONTH_NAMES}
          disableWeekend
          calendarFooter={footerContent}
        />
      </div>
    );
  },
};
