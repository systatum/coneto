import { Meta, StoryObj } from "@storybook/react";
import { Window } from "./window";
import { RiCloseFill } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import { css } from "styled-components";
import { Textarea } from "./textarea";
import { ColumnTableProps, Table } from "./table";

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
    styles: {
      self: {
        description: "Custom CSS style applied to the window container.",
        control: { type: "object" },
      },
      dividerself: {
        description:
          "Custom CSS style applied to the dividers between window cells.",
        control: { type: "object" },
      },
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
        styles={{
          self: css`
            height: 500px;
          `,
        }}
        {...args}
      >
        <Window.Cell
          styles={{
            self: css`
              background-color: #fee2e2;
              padding: 2.5rem;
            `,
          }}
        >
          Left
        </Window.Cell>
        <Window.Cell
          styles={{
            self: css`
              background-color: #dcfce7;
              padding: 2.5rem;
            `,
          }}
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
        styles={{
          self: css`
            height: 400px;
          `,
        }}
        {...args}
      >
        <Window.Cell
          styles={{
            self: css`
              background-color: #fee2e2;
              padding: 2.5rem;
            `,
          }}
        >
          Up
        </Window.Cell>
        <Window.Cell
          styles={{
            self: css`
              background-color: #dcfce7;
              padding: 2.5rem;
            `,
          }}
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
        styles={{
          self: css`
            height: 400px;
          `,
        }}
        {...args}
      >
        {value.map((data) => (
          <Window.Cell
            key={data.title}
            styles={{ self: data.style }}
            actions={data.actions ? WINDOW_ACTIONS(data.title) : undefined}
          >
            {data.title}
          </Window.Cell>
        ))}
      </Window>
    );
  },
};

export const WithCellRef: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const [textareaHeight, setTextareaHeight] = useState<number | null>(null);
    const [value, setValue] = useState("");

    const secondCellRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const interval = setInterval(() => {
        setValue((prev) =>
          prev ? `${prev}\nHello world from Coneto` : "Hello world from Coneto"
        );
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

    const sampleRows = Array.from({ length: 20 }, (_, i) => {
      const type = TYPES_DATA[i % TYPES_DATA.length];
      return (
        <Table.Row
          rowId={`${type}`}
          key={i}
          content={[`Load Balancer ${i + 1}`, type]}
        />
      );
    });

    const columns: ColumnTableProps[] = [
      {
        id: "name",
        caption: "Name",
        sortable: false,
      },
      {
        id: "type",
        caption: "Type",
        sortable: false,
      },
    ];

    return (
      <Window
        styles={{
          self: css`
            height: 100dvh;
          `,
          dividerStyle: css`
            border-width: 2px;
          `,
        }}
        orientation="horizontal"
        onResizeComplete={() => {
          if (secondCellRef.current) {
            const height = secondCellRef.current.clientHeight;
            setTextareaHeight(height);
          }
        }}
      >
        <Window.Cell>
          <Table columns={columns}>{sampleRows}</Table>
        </Window.Cell>
        <Window.Cell
          ref={secondCellRef}
          styles={{
            self: css`
              z-index: 10;
              background-color: white;
            `,
          }}
        >
          <Textarea
            value={value}
            styles={{
              self: css`
                height: ${textareaHeight ? `${textareaHeight}px` : "50dvh"};
                border-color: white;
              `,
            }}
            onChange={(e) => setValue(e.target.value)}
          />
        </Window.Cell>
      </Window>
    );
  },
};
