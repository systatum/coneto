import { Meta, StoryObj } from "@storybook/react";
import { FieldLaneDropdownsOption, FieldLane } from "./field-lane";
import { useState } from "react";
import { css } from "styled-components";
import * as RemixIcons from "@remixicon/react";
import { Calendar } from "./calendar";
import { Textbox, TextboxProps } from "./textbox";
import { Combobox, ComboboxProps } from "./combobox";
import { SelectboxOption } from "./selectbox";

const meta: Meta<typeof FieldLane> = {
  title: "Stage/FieldLane",
  component: FieldLane,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
FieldLane is a flexible form field wrapper that supports labels, helper text, error states, dropdowns, custom actions, and additional content. It’s designed for highly customizable forms where inputs need visual clarity, interactivity, and optional validation feedback.

---

### ✨ Features
- 🏷 **Label support**: Configurable position ("top" or "left"), width, gap, and required indicator.
- ⚠️ **Error mark**: Show inline error messages with optional error icons positioned absolutely or relatively.
- 🖱 **Actions buttons**: Attach multiple action buttons or icons with tooltips, click handlers, and visibility control.
- ⬇️ **Dropdowns**: Include one or multiple dropdowns with optional filtering, custom renderers, and styling.
- 🎨 **Customizable styles**: Override styles for the container, label, as well as the input/control area.
- 🧩 **Flexible children**: Embed any ReactNode (input, select, custom component) as field content.
- ⛔ **Disabled state**: Disable the entire field with visual feedback.

---

### 📌 Usage
\`\`\`tsx
<FieldLane
  label="Username"
  required
  helper="Enter your unique username"
  showError={true}
  errorMessage="This field is required"
  errorIconPosition="absolute"
  dropdowns={[
    {
      caption: "Options",
      options: [
        { text: "Option 1", value: "1" },
        { text: "Option 2", value: "2" },
      ],
      withFilter: true,
      onChange: (val) => console.log("Selected:", val),
    },
  ]}
  actions={[
    {
      title: "Check",
      icon: { image: RiCheckLine },
      onClick: () => console.log("Clicked"),
    },
  ]}
  styles={{
    containerStyle: css\`border: 1px solid #ccc;\`,
    labelStyle: css\`font-weight: bold;\`,
    controlStyle: css\`background: #f9fafb;\`,
    bodyStyle: css\`gap: 0.5rem;\`,
  }}
>
  <input type="text" placeholder="Enter username" />
</FieldLane>
\`\`\`

- Use \`label\` for field names and \`helper\` for guidance.
- \`showError\` and \`errorMessage\` handle validation display.
- Attach multiple dropdowns and actions with optional custom rendering.
- Fully styleable through the \`styles\` prop.
`,
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Field label text to display above or beside the input.",
    },
    showError: {
      control: "boolean",
      description: "Whether to show an error icon and/or error message.",
    },
    errorIconPosition: {
      control: { type: "select" },
      options: ["absolute", "relative", "none"],
      description: "Position of the error icon relative to the field.",
    },
    errorMessage: {
      control: "text",
      description: "Text to display when there is a validation error.",
    },
    helper: {
      control: "text",
      description: "Optional helper text displayed below the label.",
    },
    dropdowns: {
      control: false,
      description:
        "Optional array of dropdown configurations for additional field actions.",
    },
    actions: {
      control: false,
      description:
        "Optional array of action button configurations with icons and click handlers.",
    },
    children: {
      control: false,
      description:
        "ReactNode content rendered inside the field, typically input elements.",
    },
    disabled: {
      control: "boolean",
      description: "Whether the entire field is disabled.",
    },
    type: {
      control: "text",
      description: "Optional type of the field (e.g., 'text', 'password').",
    },
    labelPosition: {
      control: { type: "select" },
      options: ["top", "left"],
      description: "Position of the label relative to the input field.",
    },
    labelWidth: {
      control: "text",
      description: "Width of the label when positioned on the left.",
    },
    labelGap: {
      control: "number",
      description: "Gap between label and input field.",
    },
    required: {
      control: "boolean",
      description: "Whether the field is required.",
    },
    styles: {
      control: false,
      description: `
Custom styles for the FieldLane component:

- **containerStyle**: Outer wrapper for the field
- **labelStyle**: Style for the label
- **bodyStyle**: Wrapper around label and input/children
- **controlStyle**: Style for the input wrapper containing children, dropdowns, and action icons
`,
    },
  },
};

export default meta;

type Story = StoryObj<typeof FieldLane>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState({
      selectedText: "WFH",
      selectedOption: "2",
    });

    const ATTENDANCE_OPTIONS: FieldLaneDropdownsOption[] = [
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
      <FieldLane
        dropdowns={[
          {
            width: "200px",
            styles: {
              drawerStyle: css`
                width: 300px;
              `,
            },
            caption: value.selectedText,
            options: ATTENDANCE_OPTIONS,
            onChange: (id) => {
              const selected = ATTENDANCE_OPTIONS.find(
                (item) => item.value === id
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

export const CustomRenderer: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => {
    const [value1, setValue1] = useState({
      selectedText: "On-site",
      selectedOption: "1",
      value: "",
    });
    const [value2, setValue2] = useState({
      selectedText1: "11/12/2025",
      selectedOption1: "11/12/2025",
      selectedText2: "WFH",
      selectedOption2: "2",
      value: "",
    });

    const FRUIT_OPTIONS: SelectboxOption[] = [
      { text: "Apple", value: "1" },
      { text: "Banana", value: "2" },
      { text: "Orange", value: "3" },
      { text: "Grape", value: "4" },
      { text: "Pineapple", value: "5" },
      { text: "Strawberry", value: "6" },
      { text: "Watermelon", value: "7" },
    ];

    const MONTH_NAMES: SelectboxOption[] = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const argsTextbox: TextboxProps = {
      placeholder: "Type here...",
      type: "text",
      styles: {
        containerStyle: css`
          min-width: 700px;
          max-width: 700px;
        `,
      },
    };

    const argsCombobox: ComboboxProps = {
      options: FRUIT_OPTIONS,
      isLoading: true,
      styles: {
        containerStyle: css`
          min-width: 700px;
          max-width: 700px;
        `,
      },
    };

    const ATTENDANCE_OPTIONS: FieldLaneDropdownsOption[] = [
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Textbox
          {...argsTextbox}
          name="with-list-dropdown"
          label="With list dropdown"
          value={value1.value}
          onChange={(e) =>
            setValue1((prev) => ({ ...prev, value: e.target.value }))
          }
          dropdowns={[
            {
              width: "100px",
              caption: value1.selectedText,
              options: ATTENDANCE_OPTIONS,
              onChange: (id) => {
                const selected = ATTENDANCE_OPTIONS.find(
                  (option) => option.value === id
                );
                if (selected) {
                  setValue1((prev) => ({
                    ...prev,
                    selectedOption: id,
                    selectedText: selected.text,
                  }));
                }
              },
            },
          ]}
        />
        <Combobox
          {...argsCombobox}
          name="with-loading"
          label="With Loading"
          dropdowns={[
            {
              width: "100px",
              disabled: true,
              caption: value1.selectedText,
              options: ATTENDANCE_OPTIONS,
              onChange: (id) => {
                const selected = ATTENDANCE_OPTIONS.find(
                  (option) => option.value === id
                );
                if (selected) {
                  setValue1((prev) => ({
                    ...prev,
                    selectedOption: id,
                    selectedText: selected.text,
                  }));
                }
              },
            },
          ]}
        />
        <Textbox
          {...argsTextbox}
          name="with-list-dropdown-and-custom-renderer"
          label="With list dropdown and custom renderer and custom width"
          value={value2.value}
          onChange={(e) =>
            setValue2((prev) => ({ ...prev, value: e.target.value }))
          }
          dropdowns={[
            {
              width: "100px",
              caption: value2.selectedText1,
              render: ({ render }) =>
                render(
                  <Calendar
                    selectedDates={[value2.selectedOption1]}
                    monthNames={MONTH_NAMES}
                    onChange={(dates: string[]) =>
                      setValue2((prev) => ({
                        ...prev,
                        selectedText1: dates[0],
                        selectedOption1: dates[0],
                      }))
                    }
                  />
                ),
            },
            {
              width: "300px",
              styles: {
                drawerStyle: css`
                  width: 300px;
                `,
              },
              caption: value2.selectedText2,
              options: ATTENDANCE_OPTIONS,
              onChange: (id) => {
                const selected = ATTENDANCE_OPTIONS.find(
                  (option) => option.value === id
                );
                if (selected) {
                  setValue2((prev) => ({
                    ...prev,
                    selectedOption2: id,
                    selectedText2: selected.text,
                  }));
                }
              },
              withFilter: true,
            },
          ]}
        />
      </div>
    );
  },
};
