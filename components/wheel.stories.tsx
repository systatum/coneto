import { Meta, StoryObj } from "@storybook/react/*";
import { Wheel } from "./wheel";
import { useState } from "react";

const meta: Meta<typeof Wheel> = {
  title: "Input Elements/Wheel",
  component: Wheel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `

`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Wheel>;

export const Default: Story = {
  render: () => {
    const [values, setValues] = useState({
      hour: "10",
      minute: "30",
      second: "30",
      ampm: "am",
    });

    const hours = Array.from({ length: 12 }, (_, i) => {
      const h = i + 1;
      return { value: h.toString(), text: h.toString() };
    });

    const minutes = Array.from({ length: 60 }, (_, i) => ({
      value: i.toString(),
      text: i.toString().padStart(2, "0"),
    }));

    const seconds = minutes;

    const ampm = [
      { value: "am", text: "AM" },
      { value: "pm", text: "PM" },
    ];

    return (
      <Wheel
        onChange={(values) => {
          setValues({
            ampm: values.ampm,
            hour: values.hour,
            minute: values.minute,
            second: values.second,
          });
        }}
        parts={[
          { id: "hour", values: hours, width: "64px" },
          { id: "minute", values: minutes, width: "72px" },
          { id: "second", values: seconds, width: "72px" },
          { id: "ampm", values: ampm, width: "64px" },
        ]}
        values={values}
      />
    );
  },
};
