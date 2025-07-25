import type { Meta, StoryObj } from "@storybook/react";
import { Timebox } from "./timebox";
import { ChangeEvent, useEffect, useState } from "react";
import { useArgs } from "@storybook/preview-api";
import { expect, userEvent, within } from "@storybook/test";

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const hourInput = canvas.getByPlaceholderText("HH") as HTMLInputElement;
    const minuteInput = canvas.getByPlaceholderText("MM") as HTMLInputElement;

    await userEvent.clear(hourInput);
    await userEvent.type(hourInput, "13");

    await userEvent.clear(minuteInput);
    await userEvent.type(minuteInput, "45");

    expect(hourInput.value).toBe("13");
    expect(minuteInput.value).toBe("45");
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const hourInput = canvas.getByPlaceholderText("HH") as HTMLInputElement;
    const minuteInput = canvas.getByPlaceholderText("MM") as HTMLInputElement;
    const secondInput = canvas.getByPlaceholderText("SS") as HTMLInputElement;

    await userEvent.clear(hourInput);
    await userEvent.type(hourInput, "13");

    await userEvent.clear(minuteInput);
    await userEvent.type(minuteInput, "45");

    await userEvent.clear(secondInput);
    await userEvent.type(secondInput, "45");

    expect(hourInput.value).toBe("13");
    expect(minuteInput.value).toBe("45");
    expect(secondInput.value).toBe("45");
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const errorMessage = canvas.getByText("This field is required");
    await expect(errorMessage).toBeInTheDocument();

    const hourInput = canvas.getByPlaceholderText("HH") as HTMLInputElement;

    await userEvent.clear(hourInput);
    await userEvent.type(hourInput, "13");

    await expect(errorMessage).not.toBeInTheDocument();
  },
};
