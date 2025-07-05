import type { Meta, StoryObj } from "@storybook/react";
import { Timebox } from "./timebox";
import { ChangeEvent, useEffect, useState } from "react";
import rawDayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useArgs } from "@storybook/preview-api";

rawDayjs.extend(utc);
rawDayjs.extend(timezone);
const dayjs = rawDayjs;

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

    return <Timebox {...args} onChange={onChangeValue} />;
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

export const WithLiveTimeAndLocation: Story = {
  args: {
    withSeconds: true,
    editable: false,
    label: "Timezone Japan",
  },
  render: (args) => {
    const [time, setTime] = useState("");

    const syncTime = (tz: string) => {
      const now = dayjs().tz(tz).format("HH:mm:ss");
      setTime(now);
    };

    useEffect(() => {
      if (!args.editable) syncTime("Asia/Tokyo");

      const interval = setInterval(() => {
        syncTime("Asia/Tokyo");
      }, 100);

      return () => clearInterval(interval);
    }, [args.editable]);

    return <Timebox {...args} value={time} />;
  },
};

export const WithDisabled: Story = {
  args: {
    withSeconds: true,
    editable: false,
    disabled: true,
    label: "Can't edit",
    errorMessage: "This field is required",
  },
  render: (args) => {
    return <Timebox {...args} />;
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
