import { Meta, StoryObj } from "@storybook/react";
import { Window } from "./window";
import { RiCloseFill } from "@remixicon/react";
import { useState } from "react";
import { css } from "styled-components";

const meta: Meta<typeof Window> = {
  title: "Content/Window",
  component: Window,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      description: "Defines the layout orientation of the window cells.",
      control: { type: "radio" },
      options: ["horizontal", "vertical"],
    },
    children: {
      description:
        "The content of the window. Can include one or more `Window.Cell` components.",
      control: { type: "object" },
    },
    style: {
      description: "Custom CSS style applied to the window container.",
      control: { type: "object" },
    },
    onResize: {
      description:
        "Callback fired continuously during a resize drag operation.",
      action: "onResize",
    },
    onResizeComplete: {
      description: "Callback fired when a resize drag operation is completed.",
      action: "onResizeComplete",
    },
    dividerStyle: {
      description:
        "Custom CSS style applied to the dividers between window cells.",
      control: { type: "object" },
    },
    initialSizeRatio: {
      description:
        "Initial size ratio for each window cell, e.g., `[0.3, 0.7]`. If not provided, sizes are automatically calculated for all children.",
      control: { type: "object" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <Window
        orientation="vertical"
        style={css`
          height: 500px;
        `}
        {...args}
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
  render: (args) => {
    return (
      <Window
        orientation="horizontal"
        style={css`
          height: 400px;
        `}
        {...args}
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
  render: (args) => {
    const stateValue = [
      {
        title: "Left",
        style: css`
          background-color: #fee2e2;
          padding: 2.5rem;
        `,
        actions: false,
      },
      {
        title: "Right",
        style: css`
          background-color: #dcfce7;
          padding: 2.5rem;
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
        {...args}
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
