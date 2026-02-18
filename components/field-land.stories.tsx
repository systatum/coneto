import { Meta, StoryObj } from "@storybook/react";
import { DropdownOptionProps, FieldLane } from "./field-lane";
import { useState } from "react";
import { css } from "styled-components";
import * as RemixIcons from "@remixicon/react";
import { Calendar } from "./calendar";
import { Textbox, TextboxProps } from "./textbox";

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
      selectedText: "WFH",
      selectedOption: "2",
    });

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
            width: "200px",
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

export const CustomRenderer: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => {
    const [value1, setValue1] = useState({
      selectedText: "On-site",
      selectedOption: "1",
      value: "",
    });
    const [value2, setValue2] = useState({
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

    const argsTextbox: TextboxProps = {
      placeholder: "Type here...",
      type: "text",
      styles: {
        containerStyle: css`
          min-width: 700px;
          max-width: 700px;
        `,
      },
    };

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Textbox
          {...argsTextbox}
          name="with-list-dropdown"
          label="With list dropdown"
          value={value1.value}
          onChange={(e) =>
            setValue1((prev) => ({ ...prev, value: e.target.value }))
          }
          dropdowns={[
            {
              width: "100px",
              caption: value1.selectedText,
              options: ATTENDANCE_OPTIONS,
              onChange: (id) => {
                const selected = ATTENDANCE_OPTIONS.find(
                  (option) => option.value === id
                );
                if (selected) {
                  setValue1((prev) => ({
                    ...prev,
                    selectedOption: id,
                    selectedText: selected.text,
                  }));
                }
              },
            },
          ]}
        />
        <Textbox
          {...argsTextbox}
          name="with-list-dropdown-and-custom-renderer"
          label="With list dropdown and custom renderer and custom width"
          value={value2.value}
          onChange={(e) =>
            setValue2((prev) => ({ ...prev, value: e.target.value }))
          }
          dropdowns={[
            {
              width: "100px",
              caption: value2.selectedText1,
              render: ({ render }) =>
                render(
                  <Calendar
                    selectedDates={[value2.selectedOption1]}
                    monthNames={MONTH_NAMES}
                    setSelectedDates={(date: string[]) =>
                      setValue2((prev) => ({
                        ...prev,
                        selectedText1: date[0],
                        selectedOption1: date[0],
                      }))
                    }
                  />
                ),
            },
            {
              width: "300px",
              styles: {
                drawerStyle: css`
                  width: 300px;
                `,
              },
              caption: value2.selectedText2,
              options: ATTENDANCE_OPTIONS,
              onChange: (id) => {
                const selected = ATTENDANCE_OPTIONS.find(
                  (option) => option.value === id
                );
                if (selected) {
                  setValue2((prev) => ({
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
      </div>
    );
  },
};
