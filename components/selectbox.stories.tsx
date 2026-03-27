import { Meta, StoryObj } from "@storybook/react";
import { OptionProps, Selectbox, SelectboxSelectedOptions } from "./selectbox";
import { useState } from "react";

const meta: Meta<typeof Selectbox> = {
  title: "Input Elements/Selectbox",
  component: Selectbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **Selectbox** is a flexible and customizable input component that supports searchable dropdowns, single and multiple selection, keyboard navigation, and both controlled and uncontrolled usage.

It is designed to handle complex interaction patterns such as filtering, strict validation, async loading states, and fully custom dropdown rendering via render props.

---

### ✨ Features
- Searchable options with filtering
- Single and multiple selection modes
- Full keyboard navigation support
- Controlled and uncontrolled behavior
- Strict mode validation (enforces valid options)
- Clearable input support
- Loading state with customizable label
- Fully customizable styles
- Render prop support for custom dropdown UI

---

### 🧱 Basic Usage
\`\`\`tsx
<Selectbox
  options={[
    { text: "Apple", value: "apple" },
    { text: "Banana", value: "banana" },
  ]}
  placeholder="Select a fruit"
/>
\`\`\`

---

### 🔁 Controlled Mode
Use controlled mode when you need to **synchronize and manage the value from the parent state**.

\`\`\`tsx
const [value, setValue] = useState("apple");

<Selectbox
  options={options}
  selectedOptions={value}
  onChange={setValue}
  controlled
/>
\`\`\`

---

### 🎯 Multiple Selection
\`\`\`tsx
<Selectbox
  options={options}
  selectedOptions={["apple", "banana"]}
  multiple
  onChange={(values) => console.log(values)}
/>
\`\`\`

---

### ⚙️ Strict Mode
When \`strict\` is enabled:
- Only values from \`options\` are allowed  
- Invalid input will be reverted or cleared  

\`\`\`tsx
<Selectbox
  options={options}
  strict
/>
\`\`\`

---

### 🧩 Custom Dropdown (Render Props)
\`\`\`tsx
<Selectbox options={options}>
  {({ options, highlightedIndex }) => (
    <ul>
      {options.map((opt, index) => (
        <li key={opt.value}>
          {opt.text}
        </li>
      ))}
    </ul>
  )}
</Selectbox>
\`\`\`

---

### ⏳ Loading State
\`\`\`tsx
<Selectbox
  options={[]}
  isLoading
  labels={{ loadingText: "Fetching data..." }}
/>
\`\`\`

---

### 🎨 Styling
\`\`\`tsx
<Selectbox
  styles={{
    self: css\`
      border-radius: 8px;
    \`,
  }}
/>

        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    options: {
      control: "object",
      description: "List of selectable options in the format { text, value }.",
    },
    selectedOptions: {
      control: "object",
      description:
        "The selected value(s). Supports string, number, or array depending on selection mode.",
    },
    onChange: {
      control: false,
      description: "Callback triggered when the selected value changes.",
    },
    multiple: {
      control: "boolean",
      description: "Enables multiple selection mode.",
    },
    clearable: {
      control: "boolean",
      description: "Allows the selected value to be cleared.",
    },
    isLoading: {
      control: "boolean",
      description: "Displays a loading state and disables interactions.",
    },
    actions: {
      control: "object",
      description:
        "Array of actions displayed at the top of the dropdown. Each action includes { title, icon, onClick, style }.",
    },
    showError: {
      control: "boolean",
      description: "Whether to display an error state.",
    },
    errorMessage: {
      control: "text",
      description:
        "Text content displayed when the component is in an error state.",
    },
    onKeyDown: {
      control: false,
      description: "Keyboard event handler for the input field.",
    },
    onClick: {
      control: false,
      description: "Callback triggered when the input or dropdown is clicked.",
    },
    name: {
      control: "text",
      description: "Name or identifier used for accessibility (aria-label).",
    },
    controlled: {
      control: "boolean",
      description:
        "Enables controlled mode, allowing the parent component to manage and synchronize the selected value.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Selectbox>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<SelectboxSelectedOptions>([]);

    const SELECTBOX_DATA: OptionProps[] = [
      {
        text: "Selectbox content default.",
        value: "1",
      },
    ];
    return (
      <div
        style={{
          width: "256px",
        }}
      >
        <Selectbox
          options={SELECTBOX_DATA}
          selectedOptions={value}
          onChange={setValue}
          placeholder="click this place holder"
        >
          {(props) =>
            props.options.map((option, index) => {
              return (
                <ul
                  key={index}
                  {...(props.getFloatingProps?.() ?? {})}
                  ref={props.refs.setFloating}
                  style={{
                    textAlign: "center",
                    width: "100%",
                    border: "1px solid #d1d5db",
                    cursor: "pointer",
                    marginTop: "0.25rem",
                    padding: "2.5rem",
                    ...(props.floatingStyles ?? {}),
                  }}
                  tabIndex={-1}
                  role="listbox"
                  aria-label="Calendar"
                  onMouseDown={() => {
                    setValue([String(option.value)]);
                    props.setSelectedOptionsLocal(option);
                    props.setIsOpen(false);
                  }}
                >
                  {option.text}
                </ul>
              );
            })
          }
        </Selectbox>
      </div>
    );
  },
};

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState<SelectboxSelectedOptions>([]);

    const SELECTBOX_DATA: OptionProps[] = [
      {
        text: "Selectbox content with clearable.",
        value: "1",
      },
    ];

    return (
      <div style={{ width: "256px" }}>
        <Selectbox
          options={SELECTBOX_DATA}
          selectedOptions={value}
          onChange={setValue}
          placeholder="click this place holder"
          clearable
        >
          {(props) =>
            props.options.map((option, index) => {
              return (
                <ul
                  key={index}
                  {...(props.getFloatingProps?.() ?? {})}
                  ref={props.refs.setFloating ?? null}
                  style={{
                    textAlign: "center",
                    width: "100%",
                    border: "1px solid #d1d5db",
                    cursor: "pointer",
                    marginTop: "0.25rem",
                    padding: "2.5rem",
                    ...(props.floatingStyles ?? {}),
                  }}
                  tabIndex={-1}
                  role="listbox"
                  aria-label="Calendar"
                  onMouseDown={() => {
                    setValue([String(option.value)]);
                    props.setSelectedOptionsLocal(option);
                    props.setIsOpen(false);
                  }}
                >
                  {option.text}
                </ul>
              );
            })
          }
        </Selectbox>
      </div>
    );
  },
};
