import { Meta, StoryObj } from "@storybook/react/";
import { useEffect, useState } from "react";
import { FileInputBox } from "./file-input-box";

const meta: Meta<typeof FileInputBox> = {
  title: "Input Elements/FileInputBox",
  component: FileInputBox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **FileInputBox** component provides an intuitive file upload interface, better suited for a single file upload not using AJAX.

---

### ✨ Features
- 📂 Supports **single and multiple file uploads**
- 🧲 **Drag-and-drop** file upload interaction
- 📎 Click to **browse files manually**
- ❌ Remove selected files individually
- 🎯 Callback via \`onFilesSelected(files: File[])\`
- ⚠️ Built-in **error state handling**
- 🧩 Fully customizable styles

---

### 🧱 Component Structure

\`\`\`tsx
<FileInputBox
  label="Upload File"
  multiple
  onFilesSelected={(files) => console.log(files)}
/>
\`\`\`

---

### ⚙️ Core Behaviors

#### File Selection
- Click area to open file picker
- Supports \`multiple\` file selection

#### Drag & Drop
- Drag files over the input area
- Drop to upload instantly

#### File Removal
- Each file has a delete button
- Updates state and triggers callback

---

### 🎯 Usage Guidelines
- Use for **file uploads in forms**
- Enable \`multiple\` for batch uploads
- Use \`accept\` to restrict file types
- Handle \`onFilesSelected\` for processing files
        `,
      },
    },
  },

  args: {
    multiple: false,
    accept: "*",
    placeholder: "Drop files here or browse",
    disabled: false,
    showError: false,
    helper: "",
  },

  argTypes: {
    placeholder: {
      description: `
Text displayed when no file is selected.

- Appears inside the drop area
- Guides user interaction
      `,
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '"Drop files here or browse"' },
      },
    },

    accept: {
      description: `
Defines accepted file types.

- Example: \`image/*\`, \`.pdf\`, \`.docx\`
- Uses native HTML file input behavior
      `,
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '"*"' },
      },
    },

    multiple: {
      description: `
Enables multiple file selection.

- If false → only one file allowed
- If true → allows multiple uploads
      `,
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    onFilesSelected: {
      description: `
Callback triggered when files are selected or updated.

\`\`\`ts
(files: File[]) => void
\`\`\`

- Fires on file selection, drop, or removal
- Provides updated file list
      `,
      action: "files-selected",
      table: {
        type: { summary: "(files: File[]) => void" },
      },
    },

    disabled: {
      description: `
Disables the input interaction.

- Prevents click and drag events
- Changes visual state to disabled
      `,
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    showError: {
      description: `
Displays error state styling.

- Highlights border with error color
- Used with \`errorMessage\`
      `,
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    errorMessage: {
      description: `
Error message displayed below the input.

- Works with \`showError\`
- Provides validation feedback
      `,
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },

    helper: {
      description: `
Helper text displayed below the input.

- Provides additional guidance
- Visible when no error is shown
      `,
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },

    label: {
      description: `
Label displayed alongside the input.

- Managed by \`FieldLane\`
- Supports positioning and spacing
      `,
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },

    styles: {
      description: `
Custom styles override.

Available fields:
- \`containerStyle\`
- \`labelStyle\`
- \`self\`

All accept \`CSSProp\` (styled-components).
      `,
      control: false,
      table: {
        type: { summary: "FileInputBoxStylesProps" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FileInputBox>;

export const Default: Story = {
  render: () => {
    const [, setValue] = useState();
    const onFilesSelected = (e) => {
      setValue(e);
    };
    return <FileInputBox multiple onFilesSelected={onFilesSelected} />;
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState<File[]>([]);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
      if (value.length > 0) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }, [value]);

    const onFilesSelected = (e) => {
      setValue(e);
    };
    return (
      <FileInputBox
        multiple
        showError={isValid}
        errorMessage="At least one file is required"
        onFilesSelected={onFilesSelected}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return <FileInputBox label="Disabled" disabled />;
  },
};
