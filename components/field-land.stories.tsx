import { Meta, StoryObj } from "@storybook/react";
import { DropdownOptionProps, FieldLane } from "./field-lane";
import { useState } from "react";
import { css } from "styled-components";
import * as RemixIcons from "@remixicon/react";
import { Calendar } from "./calendar";

const meta: Meta<typeof FieldLane> = {
  title: "Stage/FieldLane",
  component: FieldLane,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FieldLane>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState({
      selectedText1: "11/12/2025",
      selectedOption1: "11/12/2025",
      selectedText2: "WFH",
      selectedOption2: "2",
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
      <FieldLane
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
            width: "200px",
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
