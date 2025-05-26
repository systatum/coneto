import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { TipMenu } from "./tip-menu";
import { useState } from "react";
import {
  Archive,
  Ban,
  CheckCircle,
  Download,
  Link,
  OctagonMinus,
  Pencil,
  Send,
  ShieldOff,
  Trash,
} from "lucide-react";
import ModalDialog, { ModalButtonProps } from "./modal-dialog";

const TOOLTIP_MENU_ITEMS = [
  {
    caption: "Report Phishing",
    icon: Ban,
    iconColor: "blue",
    onClick: () => console.log("Junk reported"),
  },
  {
    caption: "Report Junk",
    icon: OctagonMinus,
    iconColor: "red",
    onClick: () => console.log("Junk reported"),
  },
  {
    caption: "Block Sender",
    icon: ShieldOff,
    iconColor: "orange",
    isDangerous: true,
    onClick: () => console.log("Sender blocked"),
  },
  {
    caption: "Mark as Read",
    icon: CheckCircle,
    iconColor: "green",
    onClick: () => console.log("Marked as read"),
  },
  {
    caption: "Move to Spam",
    icon: Archive,
    iconColor: "purple",
    onClick: () => console.log("Moved to spam"),
  },
  {
    caption: "Download Attachment",
    icon: Download,
    iconColor: "teal",
    onClick: () => console.log("Downloading"),
  },
  {
    caption: "Copy Link",
    icon: Link,
    iconColor: "gray",
    onClick: () => console.log("Link copied"),
  },
  {
    caption: "Share",
    icon: Send,
    iconColor: "indigo",
    isDangerous: true,
    onClick: () => console.log("Shared"),
  },
  {
    caption: "Edit",
    icon: Pencil,
    iconColor: "yellow",
    onClick: () => console.log("Edit mode"),
  },
];

const BUTTONS: ModalButtonProps[] = [
  {
    id: "cancel",
    caption: "Cancel",
    variant: "default",
  },
  {
    id: "confirm",
    caption: "Confirm",
    variant: "danger",
  },
];

const meta: Meta<typeof TipMenu> = {
  title: "Controls/Tooltip Menu",
  component: TipMenu,
  args: {
    subMenuList: TOOLTIP_MENU_ITEMS,
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      description: "Content of tooltip menu",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TipMenu>;

export const TooltipDefault: Story = {
  render: ({ subMenuList }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <TipMenu subMenuList={subMenuList}>
          <TipMenu.Item
            caption="Delete"
            icon={Trash}
            iconColor="red"
            onClick={() => setIsOpen(!isOpen)}
          />
        </TipMenu>
        <ModalDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          title="Confirm Action"
          subTitle="Are you sure you want to delete?"
          hasCloseButton={true}
          buttons={BUTTONS}
          onClick={({ closeDialog }) => {
            closeDialog();
          }}
        >
          <p>that's confirm dialogue</p>
        </ModalDialog>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.findByText("Report Phishing")).resolves.toBeTruthy();
    await expect(canvas.findByText("Report Junk")).resolves.toBeTruthy();
    await expect(canvas.findByText("Block Sender")).resolves.toBeTruthy();
    await expect(canvas.findByText("Mark as Read")).resolves.toBeTruthy();
    await canvas.getByText("Report Phishing").click();

    const dialog = await within(document.body);

    await expect(dialog.findByText("Confirm"));
    await expect(dialog.findByText("Cancel"));
  },
};
