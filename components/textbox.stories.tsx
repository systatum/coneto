import type { Meta, StoryObj } from "@storybook/react";
import { Textbox, TextboxProps } from "./textbox";
import { useArgs } from "@storybook/preview-api";
import { useEffect, useState, type ChangeEvent } from "react";
import * as RemixIcons from "@remixicon/react";
import { css } from "styled-components";
import { FieldLaneDropdownsOptionProps } from "./field-lane";

const meta: Meta<typeof Textbox> = {
  title: "Input Elements/Textbox",
  component: Textbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Textbox is a highly flexible input component for forms, login pages, or any interactive field. 
It supports labels, validation states, action icons, dropdowns, and custom styling.

---

### ✨ Features
- 🖊 **Labels and helper text**: Display a label above or beside the input, with optional helper text.
- ⚠️ **Validation states**: Show error states and messages with \`showError\` + \`errorMessage\`.
- 🖱 **Action icons**: Add buttons/icons inside the input for actions like toggling password visibility or clearing content.
- 🔐 **Password toggle**: Built-in support for showing/hiding password inputs.
- 📜 **Custom dropdowns**: Attach dropdowns with filtering and custom rendering for autocompletion or suggestions.
- 🎨 **Custom styling**: Full control over input, label, container, and dropdown styles via the \`styles\` prop.
- 🚫 **Disabled/readonly**: Prevent user interaction when needed.
- 📦 **Composable children**: Use nested dropdowns or actions seamlessly.

---

### 🔧 Textbox Props
- \`name\` (string): Name attribute for forms.
- \`label\` (string): Text displayed above the input.
- \`placeholder\` (string): Placeholder text when the input is empty.
- \`value\` (string): Current input value.
- \`type\` ('text' | 'password' | 'message' | 'hidden'): Input type.
- \`showError\` (boolean): Toggle the error state.
- \`errorMessage\` (string): Message shown when \`showError\` is true.
- \`actions\` (array): Array of action objects inside the input:
  - \`icon\` (FigureProps) – optional icon
  - \`title\` (string) – optional tooltip
  - \`onClick\` (function) – callback
  - \`disabled\` (boolean) – disables the action
- \`dropdowns\` (array): Array of dropdown configurations:
  - \`options\` (array) – list of selectable options
  - \`withFilter\` (boolean) – enable search/filter
  - \`render\` (function) – custom rendering for dropdown content
  - \`onChange\` (function) – called when an option is selected
- \`onChange\` (function): Triggered when input value changes.
- \`helper\` (string): Optional helper text under the input.
- \`disabled\` (boolean): Disables the input.
- \`required\` (boolean): Marks input as required.
- \`labelPosition\` ('top' | 'left' | 'right'): Position of label relative to input.
- \`labelWidth\` (string): Width of label in horizontal layout.
- \`labelGap\` (string): Gap between label and input.
- \`styles\` (object): Customize styles for input and container:
  - \`self\` – input element
  - \`containerStyle\` – outer container
  - \`bodyStyle\` – FieldLane body
  - \`controlStyle\` – input container
  - \`labelStyle\` – label text

---

### 📌 Usage

\`\`\`tsx
<Textbox
  label="Username"
  placeholder="Enter your username"
  type="text"
  showError={false}
  errorMessage="Invalid username"
  actions={[
    { icon: <RiEyeLine />, onClick: () => console.log('Clicked') },
  ]}
  dropdowns={[
    { options: [{ id: '1', label: 'Option 1' }], withFilter: true }
  ]}
  styles={{
    self: css\`border-color: blue;\`,
    containerStyle: css\`background: #f0f0f0;\`,
  }}
  onChange={(e) => console.log(e.target.value)}
/>
\`\`\`

- Use \`actions\` to add icons or buttons inside the input.
- Add \`dropdowns\` for suggestion lists or autocomplete.
- Mark errors with \`showError\` and \`errorMessage\`.
- Customize appearance with \`styles\`.
- Add helper text or custom label positioning as needed.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Name attribute for the input element (useful in forms).",
    },
    label: {
      control: "text",
      description: "Label text displayed above the input field.",
    },
    value: {
      control: "text",
      description: "Current value of the input field.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text displayed when input is empty.",
    },
    type: {
      control: { type: "select" },
      options: ["text", "password", "message", "hidden"],
      description: "Type of input (text, password, message, hidden).",
    },
    showError: {
      control: "boolean",
      description: "If true, shows error state around the input.",
    },
    errorMessage: {
      control: "text",
      description: "Error message displayed when showError is true.",
    },
    actions: {
      control: false,
      description:
        "Array of action buttons displayed inside the input. Each action can have icon, tooltip, click handler, and disabled state.",
      table: {
        type: {
          summary: "TextboxActionsProps[]",
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
    dropdowns: {
      control: false,
      description:
        "Dropdown configuration array supporting custom rendering, optional filtering, and selection options.",
      table: {
        type: {
          summary: "FieldLaneDropdownProps[]",
          detail: `{
  options?: FieldLaneDropdownsOptionProps[];
  caption?: string;
  onChange?: (id: string) => void;
  width?: string;
  drawerStyle?: CSSProp;
  containerStyle?: CSSProp;
  withFilter?: boolean;
  render?: (props: { render?: (children?: ReactNode) => ReactNode; setCaption?: (caption?: string) => void; }) => ReactNode;
}`,
        },
      },
    },
    onChange: {
      action: "changed",
      description:
        "Triggered when the input value changes. Returns event with target.value.",
    },
    styles: {
      control: false,
      description: "Custom styles for the input and container.",
      table: {
        type: {
          summary: "TextboxStylesProps & FieldLaneStylesProps",
          detail: `{
  self?: CSSProp;             // Styles applied to the input
  bodyStyle?: CSSProp;
  controlStyle?: CSSProp;
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
}`,
        },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disables the input when true.",
    },
    helper: {
      control: "text",
      description: "Helper text displayed below the input field.",
    },
    labelGap: {
      control: "text",
      description: "Custom spacing between label and input field.",
    },
    labelWidth: {
      control: "text",
      description: "Width of the label when using horizontal label layout.",
    },
    labelPosition: {
      control: { type: "select" },
      options: ["top", "left", "right"],
      description: "Position of the label relative to the input field.",
    },
    required: {
      control: "boolean",
      description: "Marks the input field as required.",
    },
  },
  args: {
    label: "Username",
    placeholder: "Enter your username",
    value: "",
    type: "text",
  },
};

export default meta;

type Story = StoryObj<typeof Textbox>;

export const Input: Story = {
  args: {
    name: "input",
    label: "Input",
    placeholder: "Type here...",
    value: "",
    type: "text",
    styles: {
      self: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextboxProps) => {
    const [, setUpdateArgs] = useArgs();

    useEffect(() => {
      const timer = setTimeout(() => {
        setUpdateArgs({ value: "" });
      }, 100);
      return () => clearTimeout(timer);
    }, [setUpdateArgs]);

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const newValue = e.target.value;
      setUpdateArgs({ value: newValue });
    };

    return <Textbox {...args} value={args.value} onChange={handleChange} />;
  },
};

export const WithDropdown: Story = {
  args: {
    placeholder: "Type here...",
    type: "text",
    styles: {
      containerStyle: css`
        min-width: 700px;
        max-width: 700px;
      `,
    },
  },
  parameters: {
    layout: "padded",
  },
  render: (args: TextboxProps) => {
    const [value, setValue] = useState({
      selectedText: "On-site",
      selectedOption: "1",
      value: "",
    });

    const ATTENDANCE_OPTIONS: FieldLaneDropdownsOptionProps[] = [
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
          {...args}
          name="with-list-dropdown"
          label="With list dropdown"
          value={value.value}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, value: e.target.value }))
          }
          dropdowns={[
            {
              width: "100px",
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
            },
          ]}
        />
      </div>
    );
  },
};

export const WithAction: Story = {
  args: {
    name: "message",
    label: "With Action",
    placeholder: "Type a message...",
    value: "",
    type: "text",
    styles: {
      self: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextboxProps) => {
    const [, setUpdateArgs] = useArgs();

    useEffect(() => {
      const timer = setTimeout(() => {
        setUpdateArgs({ value: "" });
      }, 100);
      return () => clearTimeout(timer);
    }, [setUpdateArgs]);

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const newValue = e.target.value;
      setUpdateArgs({ value: newValue });
    };

    return (
      <Textbox
        {...args}
        value={args.value}
        actions={[
          {
            icon: { image: RemixIcons.RiSendPlaneFill },
            onClick: () => console.log(`Send message has been successful.`),
            title: "Send message",
          },

          {
            icon: { image: RemixIcons.RiCloseLine },
            onClick: () => setUpdateArgs({ value: "" }),
            title: "Delete message",
          },
        ].filter(Boolean)}
        onChange={handleChange}
      />
    );
  },
};

export const Password: Story = {
  args: {
    name: "password",
    label: "Password",
    placeholder: "Enter password...",
    value: "",
    type: "password",
    styles: {
      self: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextboxProps) => {
    const [, setUpdateArgs] = useArgs();

    useEffect(() => {
      const timer = setTimeout(() => {
        setUpdateArgs({ value: "" });
      }, 100);
      return () => clearTimeout(timer);
    }, [setUpdateArgs]);

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const newValue = e.target.value;
      setUpdateArgs({ value: newValue });
    };

    return <Textbox {...args} value={args.value} onChange={handleChange} />;
  },
};

export const WithErrorMessage: Story = {
  args: {
    name: "error",
    label: "With Error",
    placeholder: "Type with error...",
    value: "",
    type: "text",
    showError: true,
    errorMessage: "This field is required",
    styles: {
      self: css`
        min-width: 400px;
        max-width: 400px;
      `,
    },
  },
  render: (args: TextboxProps) => {
    const [, setUpdateArgs] = useArgs();

    useEffect(() => {
      const timer = setTimeout(() => {
        setUpdateArgs({ value: "" });
      }, 100);
      return () => clearTimeout(timer);
    }, [setUpdateArgs]);

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const newValue = e.target.value;

      setUpdateArgs({
        value: newValue,
        showError: newValue.length < 10,
        errorMessage:
          newValue.length < 10 ? "This field is required" : undefined,
      });
    };

    return <Textbox {...args} value={args.value} onChange={handleChange} />;
  },
};
