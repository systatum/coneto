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
  },
  tags: ["autodocs"],
  argTypes: {
    firstName: {
      control: "text",
      description: "First name of the profile. Used to generate initials.",
    },
    lastName: {
      control: "text",
      description:
        "Optional last name of the profile. Used for more accurate initials.",
    },
    profileImageUrl: {
      control: "text",
      description:
        "URL of the profile image. If not provided, initials are shown.",
    },
    changeable: {
      control: "boolean",
      description:
        "Allows the avatar to be clickable for uploading a new image.",
    },
    onChange: {
      action: "image changed",
      description: "Callback triggered when a new image is selected.",
    },
    onClick: {
      action: "avatar clicked",
      description: "Optional callback when the avatar is clicked.",
    },
    frameSize: {
      control: { type: "number", min: 30, max: 200, step: 1 },
      description: "Size (in px) of the avatar circle. Default is 70.",
    },
    fontSize: {
      control: { type: "number", min: 8, max: 60, step: 1 },
      description: "Font size (in px) of the initials. Default is 23.",
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
          subTitle="Are you sure you want to continue?"
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
