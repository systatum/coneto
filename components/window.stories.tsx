import { Meta, StoryObj } from "@storybook/react";
import { Window } from "./window";
import { RiCloseFill } from "@remixicon/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { css } from "styled-components";
import { Textarea } from "./textarea";
import { ColumnTableProps, Table } from "./table";
import { useTheme } from "./../theme/provider";

const meta: Meta<typeof Window> = {
  title: "Content/Window",
  component: Window,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Window is a flexible container component that allows splitting content into resizable cells. It supports horizontal or vertical layouts, custom styles, draggable dividers, and cell-level actions such as buttons or icons. It’s ideal for dashboards, editors, or any UI requiring adjustable panels.

---

### ✨ Features
- ↔️ **Resizable cells**: Drag dividers to adjust the size of adjacent cells.
- 🖥 **Orientation support**: Configure layout as "horizontal" (row) or "vertical" (column).
- 🧩 **Flexible children**: Embed any ReactNode inside cells, including forms, tables, or custom components.
- 🎨 **Customizable styles**: Override container styles (\`self\`) and divider styles (\`dividerStyle\`).
- 🖱 **Cell actions**: Add buttons or icons in each cell with click handlers and optional visibility.
- 📐 **Initial sizing**: Provide an initial size ratio array (e.g., \`[0.3, 0.7]\`) for each cell.
- ⚡ **Performance-optimized**: Resize operations are throttled using \`requestAnimationFrame\` to ensure smooth dragging.
- ⛔ **Disabled dragging**: Cells can ignore pointer events during dragging to prevent interaction conflicts.

---

### 📌 Usage
\`\`\`tsx
<Window
  orientation="horizontal"
  initialSizeRatio={[0.4, 0.6]}
  styles={{
    self: css\`border: 1px solid #ccc; height: 300px;\`,
    dividerStyle: css\`background-color: #e5e7eb;\`,
  }}
  onResize={() => console.log("Resizing...")}
  onResizeComplete={() => console.log("Resize complete")}
>
  <Window.Cell
    styles={{ self: css\`background: #f9fafb;\` }}
    actions={[
      {
        icon: { image: RiCloseLine },
        onClick: () => console.log("Cell 1 close clicked"),
      },
    ]}
  >
    <div>Left content</div>
  </Window.Cell>
  <Window.Cell
    styles={{ self: css\`background: #fff;\` }}
    actions={[
      {
        icon: { image: RiCloseLine },
        onClick: () => console.log("Cell 2 close clicked"),
      },
    ]}
  >
    <div>Right content</div>
  </Window.Cell>
</Window>
\`\`\`

- Use \`orientation\` to control layout direction.
- Provide \`initialSizeRatio\` to control starting sizes of cells.
- Add any ReactNode as content for each \`Window.Cell\`.
- Use \`actions\` to attach buttons or icons inside a cell.
- Fully styleable via the \`styles\` prop for both container and dividers.
- Listen to \`onResize\` and \`onResizeComplete\` for drag events.
`,
      },
    },
  },
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
    const { mode } = useTheme();

    return (
      <Window
        orientation="vertical"
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
              background-color: ${getWindowBg("Left", mode)};
              padding: 2.5rem;
            `,
          }}
        >
          Left
        </Window.Cell>
        <Window.Cell
          styles={{
            self: css`
              background-color: ${getWindowBg("Right", mode)};
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
    const { mode } = useTheme();

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
              background-color: ${getWindowBg("Left", mode)};
              padding: 2.5rem;
            `,
          }}
        >
          Up
        </Window.Cell>
        <Window.Cell
          styles={{
            self: css`
              background-color: ${getWindowBg("Right", mode)};
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
    const { mode } = useTheme();

    const baseWindows = useMemo(
      () => [
        { title: "Left", actions: false },
        { title: "Right", actions: true },
      ],
      []
    );

    const [windows, setWindows] = useState(baseWindows);

    const styledWindows = useMemo(
      () =>
        windows.map((w) => ({
          ...w,
          style: css`
            background-color: ${getWindowBg(w.title, mode)};
            padding: 2.5rem;
          `,
        })),
      [windows, mode]
    );

    const WINDOW_ACTIONS = (title: string) => [
      {
        onClick: () =>
          setWindows((prev) => prev.filter((item) => item.title !== title)),
        icon: { image: RiCloseFill },
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
        {styledWindows.map((window) => (
          <Window.Cell
            key={window.title}
            styles={{ self: window.style }}
            actions={window.actions ? WINDOW_ACTIONS(window.title) : undefined}
          >
            {window.title}
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
        onResize={() => {
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
              `,
            }}
            onChange={(e) => setValue(e.target.value)}
          />
        </Window.Cell>
      </Window>
    );
  },
};

const getWindowBg = (title: string, mode: "light" | "dark") => {
  if (title === "Left") {
    return mode === "dark" ? "#7f1d1d" : "#fee2e2";
  } else if (title === "Right") {
    return mode === "dark" ? "#4338ca" : "#e0e7ff";
  }
  return mode === "dark" ? "#2a2b2f" : "#f9fafb";
};
