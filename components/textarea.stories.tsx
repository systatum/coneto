import * as RemixIcons from "@remixicon/react";
import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { css } from "styled-components";
import { FieldLaneDropdownsOption } from "./field-lane";
import { StatefulOnChangeType } from "./stateful-form";
import { Textarea, TextareaProps } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Input Elements/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Textarea** is a multi-line text input component with optional auto-growing height, among other things.

---

### ✨ Features
- 📝 **Multi-line input**: Accepts multiple lines with customizable rows.
- 📏 **Autogrow**: Automatically increases height as user types if \`autogrow\` is enabled.
- ⚠️ **Error handling**: Shows visual error indication and optional message with \`showError\` and \`errorMessage\`.
- 🎨 **Custom styles**: Fully styleable via the \`styles\` prop for both FieldLane and textarea itself.
- 🔘 **Actions**: Render action buttons inside the input for things like copy, paste, or custom icons.
- 🔒 **Disabled support**: Proper styling and interaction handling for disabled state.
- 🧩 First-class **stateful form integration**

---

### 📌 Usage

\`\`\`tsx
<Textarea
  name="description"
  label="Description"
  placeholder="Type something..."
  rows={4}
  autogrow
  showError={false}
  errorMessage="This field is required"
  actions={[
    { title: "Copy", icon: { name: "copy" }, onClick: () => console.log("Copy") }
  ]}
  onChange={(e) => console.log(e.target.value)}
  styles={{
    self: css\`border-color: blue;\`,
  }}
/>
\`\`\`

- Use \`autogrow\` to let the textarea expand automatically.
- Use \`actions\` to show buttons/icons inside the input.
- Use \`showError\` and \`errorMessage\` for validation feedback.
- Fully styleable via \`styles.self\`.
      `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Name attribute for the textarea input (used in forms).",
    },
    label: {
      control: "text",
      description: "Label text displayed above the textarea.",
    },
    value: {
      control: "text",
      description: "Current value of the textarea input.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text displayed when the textarea is empty.",
    },
    rows: {
      control: "number",
      description: "Initial number of visible rows for the textarea.",
    },
    showError: {
      control: "boolean",
      description: "If true, the textarea will display an error state.",
    },
    errorMessage: {
      control: "text",
      description: "Text message to display when \`showError\` is true.",
    },
    actions: {
      control: false,
      description:
        "Array of action buttons rendered inside the input. Each action can have an icon, tooltip title, click handler, and optional disabled state.",
      table: {
        type: {
          summary: "FieldLaneAction[]",
          detail: `{
  title?: string;
  icon?: FigureProps;
  iconColor?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  titleShowDelay?: number;
}`,
        },
      },
    },
    onChange: {
      action: "changed",
      description:
        "Callback triggered on input change. Receives the native event object.",
    },
    autogrow: {
      control: "boolean",
      description:
        "If true, the textarea will automatically expand vertically as the user types.",
    },
    styles: {
      control: false,
      description:
        "Custom styles for the textarea and container. Use \`self\` to style the textarea itself.",
    },
    disabled: {
      control: "boolean",
      description:
        "If true, the textarea will be non-editable and styled as disabled.",
    },
  },
  args: {
    value: "",
  },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    name: "textarea",
    label: "Textarea",
    placeholder: "Type your message...",
    value: "",
    rows: 3,
    styles: {
      self: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextareaProps) => {
    const [, setUpdateArgs] = useArgs();

    const handleChange = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const newValue = e.target.value;
        setUpdateArgs({ value: newValue });
      }
    };

    return <Textarea {...args} value={args.value} onChange={handleChange} />;
  },
};

export const Autogrow: Story = {
  args: {
    name: "textarea",
    label: "Textarea Autogrow",
    autogrow: true,
    placeholder: "Type your message...",
    value: "",
    rows: 3,
    styles: {
      self: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextareaProps) => {
    const [, setUpdateArgs] = useArgs();

    const handleChange = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const newValue = e.target.value;
        setUpdateArgs({ value: newValue });
      }
    };

    return <Textarea {...args} value={args.value} onChange={handleChange} />;
  },
};

export const WithDropdown: Story = {
  render: () => {
    const [value, setValue] = useState({
      selectedText: "WFH",
      selectedOption: "2",
      value: "",
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
      <Textarea
        value={value.value}
        autogrow
        onChange={(e) =>
          setValue((prev) => ({ ...prev, value: e.target.value }))
        }
        dropdowns={[
          {
            width: "150px",
            styles: {
              drawerStyle: css`
                width: 300px;
              `,
            },
            caption: value.selectedText,
            options: ATTENDANCE_OPTIONS,
            onChange: (id) => {
              const selected = ATTENDANCE_OPTIONS.find(
                (option) => option.value === id
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
        styles={{
          self: css`
            min-width: 300px;
          `,
        }}
      />
    );
  },
};

export const WithErrorMessage: Story = {
  args: {
    name: "error",
    label: "With Error",
    placeholder: "Type with error...",
    autogrow: true,
    value: "",
    showError: true,
    errorMessage: "This field is required",
    styles: {
      self: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextareaProps) => {
    const [, setUpdateArgs] = useArgs();

    const handleChange = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const newValue = e.target.value;
        setUpdateArgs({ value: newValue });
      }
    };

    return <Textarea {...args} value={args.value} onChange={handleChange} />;
  },
};
