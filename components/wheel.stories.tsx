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
Wheel provides a smooth picker interface for selecting values through drag, swipe, and scroll interactions. It supports multiple columns such as hours, minutes, seconds, and AM/PM, while remaining fully customizable for different layouts and experiences.

---

### ✨ Features
- 🎡 **Smooth wheel interactions**: Select values naturally using drag, swipe, or mouse wheel gestures.
- ⏱ **Multi-column support**: Combine multiple wheel columns such as hour, minute, second, and AM/PM.
- 🎨 **Fully customizable styles**: Override overlays, fades, separators, columns, items, and wrappers.
- 🌗 **Theme integration**: Works seamlessly with the Coneto theme system.

---

### 📌 Usage

\`\`\`tsx
const [values, setValues] = useState({
  hour: "10",
  minute: "30",
  period: "am",
});

<Wheel
  values={values}
  onChange={setValues}
  parts={[
    {
      id: "hour",
      values: Wheel.hourOptions,
    },
    {
      id: "minute",
      values: Wheel.minuteOptions,
    },
    {
      id: "period",
      values: Wheel.ampmOptions,
      width: "80px",
    },
  ]}
/>
\`\`\`

- Use the \`parts\` prop to define each wheel column and its available values.
- Use \`values\` and \`onChange\` for controlled state management.
`,
      },
    },
  },
  argTypes: {
    parts: {
      control: false,
      description: `
Array of wheel column configurations.

Each part defines:
- **id**: Unique identifier for the wheel column.
- **values**: Array of selectable options.
- **width**: Optional custom width for the column.
`,
    },
    values: {
      control: "object",
      description:
        "Controlled values object where each key corresponds to a wheel part id.",
    },
    onChange: {
      control: false,
      description: "Callback triggered whenever a wheel value changes.",
    },
    styles: {
      control: false,
      description: `
Custom styles for the Wheel component.

Available style overrides:
- **containerStyle**: Root wheel wrapper.
- **fadeTopStyle**: Top fade overlay.
- **fadeBottomStyle**: Bottom fade overlay.
- **selectionOverlayStyle**: Selected item overlay.
- **separatorStyle**: Separator between wheel columns.
- **columnWrapperStyle**: Individual column wrapper.
- **columnListStyle**: Inner scrollable column list.
- **itemStyle**: Individual wheel item styles.

Each field accepts a \`CSSProp\` for full styled-components customization.
`,
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

    const hours = Array.from({ length: 24 }, (_, i) => {
      const h = i;
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
