import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Imagebox } from "./imagebox";

const meta: Meta<typeof Imagebox> = {
  title: "Input Elements/Imagebox",
  component: Imagebox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Imagebox is a user-friendly file input component specifically designed for images. 
It supports drag-and-drop, file browsing, previewing selected files, optional initial image URLs, and full styling customization. 
It can be embedded inside forms using FieldLane for labels, helper text, errors, and actions.

---

### ✨ Features
- 🖼 **Image preview**: Automatically displays a preview of the selected image file or an initial \`url\`.
- 📂 **File selection**: Supports both drag & drop and browse file selection.
- ⚡ **Sizes**: Four predefined sizes (\`xs\`, \`sm\`, \`md\`, \`lg\`) controlling the box and icon dimensions.
- ⚠️ **Error handling**: Show inline error messages via FieldLane with optional icons.
- 🎨 **Customizable styles**: Override container, label, and input styles via \`styles.self\`, \`styles.labelStyle\`, and \`styles.containerStyle\`.
- ⛔ **Disabled state**: Disable interaction and provide visual feedback.
- ✏️ **Editable toggle**: Control whether the input is editable.
- ➕ **Add icon overlay**: Optional add icon that changes on drag-over.

---

### 📌 Usage

\`\`\`tsx
<Imagebox
  label="Upload Profile Picture"
  name="profileImage"
  size="md"
  url="/images/default-avatar.png"
  showError={false}
  errorMessage="Invalid file"
  onFileSelected={(file) => console.log("Selected file:", file)}
  styles={{
    containerStyle: css\`padding: 8px; border-radius: 4px;\`,
    labelStyle: css\`font-weight: bold;\`,
    self: css\`border: 1px dashed #d1d5db;\`,
  }}
/>
\`\`\`

- Use \`onFileSelected\` to handle file uploads.
- The \`url\` prop sets an initial image, used if no file is selected.
- Drag & drop and clicking the box both allow file selection.
- Fully styleable using the \`styles\` prop for container, label, and input box.
- Use \`size\` to control the dimensions and icon size.
- Integrates with FieldLane for label, helper text, errors, and actions.
`,
      },
    },
  },
  argTypes: {
    onFileSelected: {
      description:
        "Callback fired when a file is selected via browse or drag & drop. Receives the selected File or undefined.",
      control: false,
    },
    size: {
      description:
        "Controls the size of the image box and the add/placeholder icons.",
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg"],
    },
    label: {
      description: "Optional label displayed above the image box.",
      control: "text",
    },
    showError: {
      description: "When true, displays the error message below the input.",
      control: "boolean",
    },
    errorMessage: {
      description: "Text shown when `showError` is enabled.",
      control: "text",
    },
    name: {
      description: "Name attribute for the hidden file input.",
      control: "text",
    },
    url: {
      description: `
Initial image to display inside the box.

**Render priority:**
1. Selected file preview
2. \`url\` prop
3. Placeholder icon

Accepts absolute URLs or relative paths (e.g., \`/images/product.png\`).
`,
      control: "text",
    },
    styles: {
      description: `
Custom styles for the Imagebox component parts:

- \`containerStyle\`: wrapper around label + input
- \`labelStyle\`: label styling
- \`self\`: image input box styling (border, background, sizing)

Accepts a \`CSSProp\` (styled-components compatible).
`,
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Imagebox>;

export const NonEditable: Story = {
  render: () => {
    return (
      <Imagebox
        editable={false}
        size="xs"
        url="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
        borderless
      />
    );
  },
};

export const Size: Story = {
  render: () => {
    const [value, setValue] = useState<string | File | undefined>(undefined);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          justifyContent: "start",
        }}
      >
        <Imagebox value={value} size="xs" onFileSelected={setValue} />
        <Imagebox value={value} size="sm" onFileSelected={setValue} />
        <Imagebox value={value} size="md" onFileSelected={setValue} />
        <Imagebox value={value} size="lg" onFileSelected={setValue} />
      </div>
    );
  },
};

export const Borderless: Story = {
  render: () => {
    const [value, setValue] = useState<string | File | undefined>(undefined);

    return (
      <Imagebox value={value} size="md" borderless onFileSelected={setValue} />
    );
  },
};
