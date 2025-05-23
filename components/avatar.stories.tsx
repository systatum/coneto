import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { AvatarProps } from "../type/avatar";
import { ChangeEvent, useState } from "react";
import ModalDialog, { ModalButtonProps } from "./modal-dialog";
import Avatar from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components Reusable/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    firstName: {
      control: "text",
      description: "First name of the profile",
    },
    lastName: {
      control: "text",
      description: "Last name of the profile",
    },
    profileImageUrl: {
      control: "text",
      description: "Image of the profile",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const ProfileDefault: Story = {
  args: {
    firstName: "John",
    lastName: "",
    changeable: false,
    frameSize: 70,
    fontSize: 16,
  },
  render: (args: AvatarProps) => {
    return <Avatar {...args} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nameElement = await canvas.findByText("JO");
    await expect(nameElement).toBeVisible();
  },
};
export const ProfileWithFunction: Story = {
  args: {
    firstName: "John",
    lastName: "",
    changeable: false,
    frameSize: 70,
    fontSize: 16,
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
      <div className="flex flex-col items-center gap-4">
        <Avatar {...args} onClick={() => setIsOpen(!isOpen)} />
        <ModalDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          title="Confirm Action"
          subTitle="Are you sure you want to continue?"
          hasCloseButton={true}
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nameElement = await canvas.findByText("JO");
    await expect(nameElement).toBeVisible();
  },
};

export const ProfileWithImage: Story = {
  args: {
    firstName: "John",
    lastName: "Doe",
    changeable: true,
    profileImageUrl: "/avatar-1.jpg",
    frameSize: 70,
    fontSize: 16,
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
      <div className="flex flex-col items-center">
        <Avatar onChange={handleChange} {...args} />
        {selectedFileName && (
          <div className="text-xs" data-testid="selected-file-name">
            Selected: {selectedFileName}
          </div>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const image = await canvas.findByRole("img", {
      name: /John Doe profile image on the Systatum superapp/i,
    });
    await expect(image).toBeVisible();
  },
};
