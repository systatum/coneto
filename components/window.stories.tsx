import { Meta, StoryObj } from "@storybook/react";
import { Window } from "./window";
import { RiCloseFill } from "@remixicon/react";
import { useState } from "react";
import { css } from "styled-components";

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
      <Window
        orientation="vertical"
        style={css`
          height: 500px;
        `}
      >
        <Window.Cell
          style={css`
            background-color: #fee2e2;
            padding: 2.5rem;
          `}
        >
          Left
        </Window.Cell>
        <Window.Cell
          style={css`
            background-color: #dcfce7;
            padding: 2.5rem;
          `}
        >
          Right
        </Window.Cell>
      </Window>
    );
  },
};

export const Horizontal: Story = {
  render: () => {
    return (
      <Window
        orientation="horizontal"
        style={css`
          height: 400px;
        `}
      >
        <Window.Cell
          style={css`
            background-color: #fee2e2;
            padding: 2.5rem;
          `}
        >
          Up
        </Window.Cell>
        <Window.Cell
          style={css`
            background-color: #dcfce7;
            padding: 2.5rem;
          `}
        >
          Down
        </Window.Cell>
      </Window>
    );
  },
};

export const Closable: Story = {
  render: () => {
    const stateValue = [
      {
        title: "Left",
        style: css`
          background-color: #fee2e2;
          padding: 2.5rem;
          width: 100%;
        `,
        actions: false,
      },
      {
        title: "Right",
        style: css`
          background-color: #dcfce7;
          padding: 2.5rem;
          width: 100%;
        `,
        actions: true,
      },
    ];

    const [value, setValue] = useState(stateValue);

    const WINDOW_ACTIONS = (title: string) => [
      {
        onClick: () =>
          setValue((prev) => prev.filter((item) => item.title !== title)),
        icon: RiCloseFill,
      },
    ];

    return (
      <Window
        style={css`
          height: 400px;
        `}
      >
        {value.map((data) => (
          <Window.Cell
            key={data.title}
            style={data.style}
            actions={data.actions ? WINDOW_ACTIONS(data.title) : undefined}
          >
            {data.title}
          </Window.Cell>
        ))}
      </Window>
    );
  },
};
