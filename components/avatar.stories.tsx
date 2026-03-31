import type { Meta, StoryObj } from "@storybook/react";
import { AvatarProps } from "./avatar";
import { ChangeEvent, useState } from "react";
import { ModalDialog, ModalButtonProps } from "./modal-dialog";
import { Avatar } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Content/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **Avatar** component displays a user profile representation using either an image or generated initials.

It automatically generates a background color and initials when no image is provided, and supports optional interaction such as uploading a new profile picture.

---

### ✨ Features
- 🧑 Displays **profile image** or **generated initials**
- 🎨 Automatic **background color generation**
- 🔤 Smart **initials generation** (first + last name)
- 📷 Optional **image upload (changeable mode)**
- 🖱️ Clickable interaction support
- 🧩 Customizable size and styles

---

### 🧱 Component Structure

\`\`\`tsx
<Avatar
  firstName="John"
  lastName="Doe"
  profileImageUrl="https://example.com/avatar.jpg"
/>
\`\`\`

---

### ⚙️ Core Behaviors

#### Image Rendering
- Uses \`profileImageUrl\` if provided
- Falls back to initials if image is missing

#### Initials Generation
- Uses first letter of \`firstName\` + \`lastName\`
- If no last name → uses first 2 letters of first name

#### Changeable Mode
- Enable with \`changeable\`
- Click avatar to trigger file input
- Calls \`onChange(e, file)\`

#### Click Handling
- Supports \`onClick\` when not in \`changeable\` mode
- Automatically becomes clickable if interaction is provided

---

### 🎯 Usage Guidelines
- Use for **user identity representation**
- Provide \`profileImageUrl\` when available
- Enable \`changeable\` for editable profile flows
- Adjust \`frameSize\` and \`fontSize\` for layout consistency
        `,
      },
    },
  },

  tags: ["autodocs"],

  args: {
    firstName: "John",
    lastName: "Doe",
    profileImageUrl: "",
    changeable: false,
    frameSize: 70,
    fontSize: 23,
  },

  argTypes: {
    firstName: {
      control: "text",
      description: `
First name of the user.

- Used to generate initials
- Required for fallback display
      `,
      table: {
        type: { summary: "string" },
      },
    },

    lastName: {
      control: "text",
      description: `
Optional last name of the user.

- Improves initials accuracy
- If omitted → uses first 2 letters of first name
      `,
      table: {
        type: { summary: "string" },
      },
    },

    profileImageUrl: {
      control: "text",
      description: `
URL of the profile image.

- If provided → image is displayed
- If empty → fallback to initials
      `,
      table: {
        type: { summary: "string" },
      },
    },

    changeable: {
      control: "boolean",
      description: `
Enables avatar to upload a new image.

- Clicking triggers hidden file input
- Shows overlay icon on hover
      `,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    onChange: {
      action: "image changed",
      description: `
Callback triggered when a new image is selected.

\`\`\`ts
(e: ChangeEvent<HTMLInputElement>, file?: File) => void
\`\`\`

- Only works when \`changeable\` is enabled
      `,
      table: {
        type: {
          summary: "(e: ChangeEvent<HTMLInputElement>, file?: File) => void",
        },
      },
    },

    onClick: {
      action: "avatar clicked",
      description: `
Optional click handler.

- Works when \`changeable\` is false
- Useful for custom interactions (e.g. open profile)
      `,
      table: {
        type: { summary: "() => void" },
      },
    },

    frameSize: {
      control: { type: "number", min: 30, max: 200, step: 1 },
      description: `
Size of the avatar (width & height in px).

- Controls overall component size
      `,
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "70" },
      },
    },

    fontSize: {
      control: { type: "number", min: 8, max: 60, step: 1 },
      description: `
Font size of the initials.

- Only applies when image is not present
      `,
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "23" },
      },
    },

    styles: {
      description: `
Custom styles override.

Available:
- \`self\`: root container styles

Accepts \`CSSProp\` (styled-components).
      `,
      control: false,
      table: {
        type: { summary: "AvatarStylesProps" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    firstName: "John",
    lastName: "",
    changeable: false,
    frameSize: 70,
  },
  render: (args: AvatarProps) => {
    return <Avatar {...args} />;
  },
};

export const WithActions: Story = {
  args: {
    firstName: "John",
    lastName: "",
    changeable: false,
    frameSize: 70,
  },
  render: (args: AvatarProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const BUTTONS: ModalButtonProps[] = [
      {
        id: "cancel",
        caption: "Cancel",
        variant: "default",
      },
      {
        id: "confirm",
        caption: "Confirm",
        variant: "primary",
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Avatar {...args} onClick={() => setIsOpen(!isOpen)} />
        <ModalDialog
          isOpen={isOpen}
          onVisibilityChange={setIsOpen}
          title="Confirm Action"
          subtitle="Are you sure you want to continue?"
          closable={true}
          buttons={BUTTONS}
          onClick={({ closeDialog }) => {
            closeDialog();
          }}
        >
          <p>Function was rendered</p>
        </ModalDialog>
      </div>
    );
  },
};

export const WithImage: Story = {
  args: {
    firstName: "John",
    lastName: "Doe",
    changeable: true,
    profileImageUrl: "/avatar-1.jpg",
    frameSize: 70,
  },
  render: (args: AvatarProps) => {
    const [selectedFileName, setSelectedFileName] = useState<string | null>(
      null
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>, file?: File) => {
      if (file) {
        setSelectedFileName(file.name);
      }
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar onChange={handleChange} {...args} />
        {selectedFileName && (
          <div
            style={{
              fontSize: "12px",
            }}
          >
            Selected: {selectedFileName}
          </div>
        )}
      </div>
    );
  },
};
