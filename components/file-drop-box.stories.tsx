import { RiDeleteBin2Fill } from "@remixicon/react";
import { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";
import { css } from "styled-components";
import {
  FileDropBox,
  OnCompleteFunctionProps,
  OnFileDroppedFunctionProps,
} from "./file-drop-box";
import { Table } from "./table";

const meta: Meta<typeof FileDropBox> = {
  title: "Input Elements/FileDropBox",
  component: FileDropBox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**FileDropBox** is a versatile drag-and-drop file uploader that supports multiple files,
progress tracking, success and error states, custom labels, helper text, and flexible styling.
It's ideal for forms or components where users need to upload especially files (especially multiple
files) through AJAX and visually track their progress.

---

### ✨ Features
- 📂 **Drag & Drop**: Drag files directly into the drop area.
- 🖱 **Browse support**: Click to open file dialog for selecting files manually.
- ⬆️ **Multiple file uploads**: Supports uploading multiple files at once.
- 📊 **Progress tracking**: Shows progress bar and label for each uploading file.
- ✅ **Success state**: Display a success message when files are uploaded successfully.
- ⚠️ **Error handling**: Display error messages for failed uploads.
- 🎨 **Customizable styles**: Override container, drag-over, success, label, and content styles.
- 🏷 **Labels & helpers**: Show optional label, helper text, and required indicator.
- ⛔ **Disabled state**: Disable the drop area with visual feedback.
- 🧩 **Flexible children**: Embed any ReactNode inside the drop area.
- 🧩 First-class **stateful form integration**

---

### 📌 Usage
\`\`\`tsx
<FileDropBox
  label="Upload Documents"
  placeholder="Drag files here or browse"
  accept=".jpg,.png,.pdf"
  required
  helper="Maximum 5 files, each up to 5MB"
  onFileDropped={({ files, succeed, error, setProgressLabel }) => {
    files.forEach((file) => {
      setProgressLabel(\`Uploading \${file.name}...\`);
      // simulate async upload
      setTimeout(() => {
        if (file.size > 5000000) {
          error(file, "File is too large");
        } else {
          succeed(file);
        }
      }, 1000);
    });
  }}
  onComplete={({ succeedFiles, failedFiles, setProgressLabel }) => {
    console.log("Succeeded:", succeedFiles);
    console.log("Failed:", failedFiles);
    setProgressLabel("Upload complete!");
  }}
  styles={{
    containerStyle: css\`border: 1px solid #ccc; padding: 1rem;\`,
    dragOverStyle: css\`background-color: #eef6ff;\`,
    successStyle: css\`border-color: #10b981;\`,
    labelStyle: css\`font-weight: bold;\`,
    contentStyle: css\`gap: 0.5rem;\`,
  }}
>
  <p>Optional additional content inside drop area</p>
</FileDropBox>
\`\`\`

- Use \`label\` and \`helper\` for guidance and clarity.
- Customize accepted file types with \`accept\`.
- Track upload progress via \`onFileDropped\` and mark success or error.
- React to completion with \`onComplete\`.
- Fully styleable using the \`styles\` prop.
- Supports embedding any ReactNode inside the drop area for additional content.
`,
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Optional label for the file drop area",
    },
    placeholder: {
      control: "text",
      description: "Text displayed when no file is selected or dragging",
    },
    accept: {
      control: "text",
      description: "Accepted file types (e.g., '.jpg,.png')",
    },
    onFileDropped: {
      action: "fileDropped",
      description: `Callback triggered when a file is dropped or selected. Receives:
- files: File[]
- succeed(file)
- error(file, errorMessage)
- setProgressLabel(label)
- progressPercentage (optional)`,
    },
    onComplete: {
      action: "uploadComplete",
      description: `Callback triggered when all files are processed. Receives:
- succeedFiles?: File[]
- failedFiles?: File[]
- setProgressLabel?: (label: string) => void
- hideProgressLabel?: () => void
- showUploaderForm?: () => void`,
    },
    progressPercentage: {
      control: "number",
      description: "Progress bar percentage (0-100) when uploading",
    },
    helper: {
      control: "text",
      description: "Optional helper text below the label",
    },
    children: {
      control: false,
      description: "Optional additional content inside the drop box",
    },
    styles: {
      control: false,
      description:
        "Custom styles for container, dragOver, success, label, and content",
    },
    name: {
      control: "text",
      description: "Input name for form handling",
    },
    id: {
      control: "text",
      description: "Custom ID for the file input element",
    },
    labelPosition: {
      control: { type: "select", options: ["top", "left"] },
      description: "Position of the label relative to the drop box",
    },
    labelGap: {
      control: "number",
      description: "Gap between label and drop box",
    },
    labelWidth: {
      control: "text",
      description: "Custom width for the label",
    },
    required: {
      control: "boolean",
      description: "Marks the field as required",
    },
    disabled: {
      control: "boolean",
      description: "Disables the drop box and prevents interaction",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FileDropBox>;

export const Default: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);

    const onFileDropped = async ({
      error,
      files,
      setProgressLabel,
      succeed,
    }: OnFileDroppedFunctionProps) => {
      const file = files[0];
      setFiles((prev) => [...prev, file]);
      setProgressLabel(`Uploading ${file.name}`);

      return new Promise<void>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;

          if (progress >= 100) {
            clearInterval(interval);
            if (file === null) {
              error(file, `file ${file.name} is not uploaded`);
            } else {
              succeed(file);
            }
            setProgressLabel(`Uploaded ${files[0].name}`);
            resolve();
          }
        }, 300);
      });
    };

    const onComplete = async ({
      failedFiles,
      setProgressLabel,
      succeedFiles,
      hideProgressLabel,
      showUploaderForm,
    }: OnCompleteFunctionProps) => {
      console.log(succeedFiles, "This is succeedFiles");
      console.log(failedFiles, "This is failedFiles");
      await setProgressLabel(
        `Upload complete! Success: ${succeedFiles.length}, Failed: ${failedFiles.length}`
      );
      await hideProgressLabel();
      await showUploaderForm();
    };

    return (
      <FileDropBox onFileDropped={onFileDropped} onComplete={onComplete}>
        <Table
          styles={{
            containerStyle: css`
              ${files.length === 0 &&
              css`
                display: none;
              `}
            `,
          }}
          columns={[
            {
              id: "file_name",
              caption: "File Name",
            },
            {
              id: "date",
              caption: "Date",
            },
          ]}
        >
          {files.map((props) => (
            <Table.Row
              actions={(id) => [
                {
                  caption: "Delete",
                  icon: { image: RiDeleteBin2Fill },
                  onClick: () => {
                    if (id) {
                      setFiles((prev) => prev.filter((val) => val.name !== id));
                    }
                  },
                },
              ]}
              rowId={props.name}
              content={[
                props.name,
                new Date(props.lastModified).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                }),
              ]}
            />
          ))}
        </Table>
      </FileDropBox>
    );
  },
};

export const Error: Story = {
  render: () => {
    const allFilesRef = useRef<File[]>([]);

    const onFileDropped = async ({
      error,
      files,
      setProgressLabel,
      succeed,
    }: OnFileDroppedFunctionProps) => {
      const file = files[0];

      if (allFilesRef.current.length === 0) {
        allFilesRef.current = [...files];
      }

      setProgressLabel(`Uploading ${file.name}`);

      return new Promise<void>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;

          if (progress >= 100) {
            clearInterval(interval);

            const isLastFile =
              file === allFilesRef.current[allFilesRef.current.length - 1];

            if (isLastFile) {
              error(file, `file ${file.name} is not uploaded`);
            } else {
              succeed(file);
            }

            resolve();
          }
        }, 300);
      });
    };

    const onComplete = ({
      failedFiles,
      setProgressLabel,
      succeedFiles,
    }: OnCompleteFunctionProps) => {
      console.log(succeedFiles, "This is succeedFiles");
      console.log(failedFiles, "This is failedFiles");

      setProgressLabel(
        `Upload complete! Succeed: ${succeedFiles.length}, Failed: ${failedFiles.length}`
      );

      allFilesRef.current = [];
    };

    return (
      <FileDropBox onComplete={onComplete} onFileDropped={onFileDropped} />
    );
  },
};
