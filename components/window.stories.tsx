import { Meta, StoryObj } from "@storybook/react";
import { Window } from "./window";
import { RiCloseFill } from "@remixicon/react";
import { useState } from "react";

const meta: Meta<typeof Window> = {
  title: "Content/Window",
  component: Window,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <Window orientation="vertical" className="h-[500px]">
        <Window.Cell className="bg-red-100 p-10">left</Window.Cell>
        <Window.Cell className="bg-green-100 p-10">Right</Window.Cell>
      </Window>
    );
  },
};

export const WithHorizontal: Story = {
  render: () => {
    return (
      <Window orientation="horizontal" className="h-[400px]">
        <Window.Cell className="bg-red-100 p-10">left</Window.Cell>
        <Window.Cell className="bg-green-100 p-10">Right</Window.Cell>
      </Window>
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const stateValue = [
      {
        title: "left",
        className: "bg-red-100 p-10 w-full",
        actions: false,
      },
      {
        title: "right",
        className: "bg-green-100 p-10 w-full",
        actions: true,
      },
    ];

    const [value, setValue] = useState(stateValue);

    const WINDOW_ACTIONS = (e: string) => {
      return [
        {
          onClick: () => {
            setValue((prev) => prev.filter((item) => item.title !== e));
          },
          icon: RiCloseFill,
        },
      ];
    };

    return (
      <Window className="h-[400px]">
        {value.map((data) => (
          <Window.Cell
            className={data.className}
            actions={data.actions ? WINDOW_ACTIONS(data.title) : null}
          >
            {data.title}
          </Window.Cell>
        ))}
      </Window>
    );
  },
};
