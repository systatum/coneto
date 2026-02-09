import type { Meta, StoryObj } from "@storybook/react";
import { Timebox } from "./timebox";
import { ChangeEvent, useEffect, useState } from "react";
import { useArgs } from "@storybook/preview-api";
import { css } from "styled-components";
import { Calendar } from "./calendar";
import * as RemixIcons from "@remixicon/react";
import { DropdownOptionProps } from "./field-lane";

const meta: Meta<typeof Timebox> = {
  title: "Input Elements/Timebox",
  component: Timebox,
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "time changed" },
    withSeconds: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Timebox>;

export const Default: Story = {
  args: {
    label: "Timebox",
    withSeconds: false,
  },
  render: (args) => {
    const [, setValue] = useState({ timebox: "" });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setValue((prev) => ({ ...prev, [name]: value }));
    };

    return <Timebox {...args} name="timebox" onChange={onChangeValue} />;
  },
};

export const WithSeconds: Story = {
  args: {
    label: "Timebox With Seconds",
    withSeconds: true,
  },
  render: (args) => {
    const [, setValue] = useState({ timebox: "" });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setValue((prev) => ({ ...prev, [name]: value }));
    };

    return <Timebox {...args} onChange={onChangeValue} />;
  },
};

export const WithDropdown: Story = {
  render: () => {
    const [value, setValue] = useState({
      selectedText1: "11/12/2025",
      selectedOption1: "11/12/2025",
      selectedText2: "WFH",
      selectedOption2: "2",
      value: "",
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
      <Timebox
        label="With Dropdowns"
        value={value.value}
        onChange={(e) =>
          setValue((prev) => ({ ...prev, value: e.target.value }))
        }
        dropdowns={[
          {
            width: "100px",
            caption: value.selectedText1,
            render: ({ render }) =>
              render(
                <Calendar
                  selectedDates={[value.selectedOption1]}
                  monthNames={MONTH_NAMES}
                  setSelectedDates={(date: string[]) =>
                    setValue((prev) => ({
                      ...prev,
                      selectedText1: date[0],
                      selectedOption1: date[0],
                    }))
                  }
                />
              ),
          },
          {
            width: "120px",
            styles: {
              drawerStyle: css`
                width: 300px;
              `,
            },
            caption: value.selectedText2,
            options: ATTENDANCE_OPTIONS,
            onChange: (id) => {
              const selected = ATTENDANCE_OPTIONS.find(
                (item) => item.value === id
              );
              if (selected) {
                setValue((prev) => ({
                  ...prev,
                  selectedOption2: id,
                  selectedText2: selected.text,
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

export const WithLiveTime: Story = {
  args: {
    label: "Timebox Live Time",
    withSeconds: true,
    editable: false,
  },
  render: (args) => {
    function formatTime(date: Date): string {
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    }

    const now = new Date();
    const [time, setTime] = useState(formatTime(now));

    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        setTime(formatTime(now));
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    return <Timebox {...args} value={time} />;
  },
};

export const WithError: Story = {
  args: {
    withSeconds: true,
    label: "With Error",
    showError: true,
    name: "value",
    errorMessage: "This field is required",
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    function isValidTime(value: string): boolean {
      const validatorRegex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
      return validatorRegex.test(value);
    }

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      const isValidValue = isValidTime(value);
      setUpdateArgs({
        value: value,
        showError: !isValidValue,
        errorMessage: isValidValue ? "" : "This field is required",
      });
    };

    return <Timebox {...args} onChange={onChangeValue} />;
  },
};
