import { Meta, StoryObj } from "@storybook/react";
import { ReactElement, useState } from "react";
import { Datebox } from "./datebox";
import { Messagebox } from "./messagebox";
import * as RemixIcons from "@remixicon/react";
import { DropdownOptionProps } from "./field-lane";
import { css } from "styled-components";

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
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>([]);

    return (
      <div
        style={{
          width: "300px",
        }}
      >
        <Datebox
          options={DAY_NAMES}
          selectedDates={value}
          setSelectedDates={setValue}
          dayNames={DAY_NAMES}
          monthNames={MONTH_NAMES}
        />
      </div>
    );
  },
};

export const WithDropdown: Story = {
  render: () => {
    const [value, setValue] = useState({
      selectedText: "WFH",
      selectedOption: "2",
      value: ["1"],
    });

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const ATTENDANCE_OPTIONS: DropdownOptionProps[] = [
      { text: "On-site", value: "1", icon: RemixIcons.RiHome2Line },
      { text: "WFH", value: "2", icon: RemixIcons.RiUser2Line },
      {
        text: "Sick leave",
        value: "3",
        icon: RemixIcons.RiSettings2Line,
      },
      {
        text: "Annual leave",
        value: "4",
        icon: RemixIcons.RiLogoutBoxLine,
      },
    ];

    return (
      <Datebox
        selectedDates={value.value}
        setSelectedDates={(value) =>
          setValue((prev) => ({ ...prev, value: value }))
        }
        monthNames={MONTH_NAMES}
        label="With Dropdown"
        dropdowns={[
          {
            width: "150px",
            styles: {
              drawerStyle: css`
                width: 300px;
              `,
            },
            caption: value.selectedText,
            options: ATTENDANCE_OPTIONS,
            onChange: (id) => {
              const selected = ATTENDANCE_OPTIONS.find(
                (item) => item.value === id
              );
              if (selected) {
                setValue((prev) => ({
                  ...prev,
                  selectedOption: id,
                  selectedText: selected.text,
                }));
              }
            },
            withFilter: true,
          },
        ]}
      />
    );
  },
};

export const NoWeekends: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>([]);

    return (
      <div
        style={{
          width: "300px",
        }}
      >
        <Datebox
          options={DAY_NAMES}
          selectedDates={value}
          setSelectedDates={setValue}
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
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>([]);

    return (
      <div
        style={{
          width: "300px",
        }}
      >
        <Datebox
          options={DAY_NAMES}
          selectedDates={value}
          setSelectedDates={setValue}
          dayNames={DAY_NAMES}
          monthNames={MONTH_NAMES}
          calendarSelectabilityMode="multiple"
        />
      </div>
    );
  },
};

export const MultipleNoWeekends: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>([]);

    return (
      <div
        style={{
          width: "300px",
        }}
      >
        <Datebox
          options={DAY_NAMES}
          selectedDates={value}
          setSelectedDates={setValue}
          dayNames={DAY_NAMES}
          monthNames={MONTH_NAMES}
          calendarSelectabilityMode="multiple"
          disableWeekend
        />
      </div>
    );
  },
};

export const Ranged: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>([]);

    return (
      <div
        style={{
          width: "300px",
        }}
      >
        <Datebox
          options={DAY_NAMES}
          selectedDates={value}
          setSelectedDates={setValue}
          dayNames={DAY_NAMES}
          monthNames={MONTH_NAMES}
          calendarSelectabilityMode="ranged"
        />
      </div>
    );
  },
};

export const RangedNoWeekends: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>([]);

    return (
      <div
        style={{
          width: "300px",
        }}
      >
        <Datebox
          options={DAY_NAMES}
          selectedDates={value}
          setSelectedDates={setValue}
          dayNames={DAY_NAMES}
          monthNames={MONTH_NAMES}
          calendarSelectabilityMode="ranged"
          disableWeekend
        />
      </div>
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const DAY_NAMES = [
      { text: "Su", value: "1" },
      { text: "Mo", value: "2" },
      { text: "Tu", value: "3" },
      { text: "We", value: "4" },
      { text: "Th", value: "5" },
      { text: "Fr", value: "6" },
      { text: "Sa", value: "7" },
    ];

    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const [value, setValue] = useState<string[]>([]);

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
          width: "300px",
        }}
      >
        <Datebox
          options={DAY_NAMES}
          selectedDates={value}
          setSelectedDates={setValue}
          dayNames={DAY_NAMES}
          monthNames={MONTH_NAMES}
          disableWeekend
          calendarFooter={footerContent}
        />
      </div>
    );
  },
};
