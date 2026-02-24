import type { Meta, StoryObj } from "@storybook/react";
import { Timebox } from "./timebox";
import { ChangeEvent, useEffect, useState } from "react";
import { useArgs } from "@storybook/preview-api";
import { css } from "styled-components";
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
      selectedText: "WFH",
      selectedOption: "2",
      value: "",
    });

    const ATTENDANCE_OPTIONS: DropdownOptionProps[] = [
      {
        text: "On-site",
        value: "1",
        icon: { image: RemixIcons.RiHome2Line },
      },
      {
        text: "WFH",
        value: "2",
        icon: { image: RemixIcons.RiUser2Line },
      },
      {
        text: "Sick leave",
        value: "3",
        icon: { image: RemixIcons.RiSettings2Line },
      },
      {
        text: "Annual leave",
        value: "4",
        icon: { image: RemixIcons.RiLogoutBoxLine },
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
            width: "120px",
            styles: {
              drawerStyle: css`
                width: 300px;
              `,
            },
            caption: value.selectedText,
            options: ATTENDANCE_OPTIONS,
            onChange: (id) => {
              const selected = ATTENDANCE_OPTIONS.find(
                (option) => option.value === id
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
