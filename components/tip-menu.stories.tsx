import type { Meta, StoryObj } from "@storybook/react";
import { TipMenu } from "./tip-menu";
import { useState } from "react";
import {
  RiSpam2Line,
  RiForbid2Line,
  RiShieldLine,
  RiCheckLine,
  RiInboxArchiveLine,
  RiDownloadLine,
  RiLink,
  RiShareLine,
  RiEditLine,
  RiDeleteBinLine,
} from "@remixicon/react";
import { ModalDialog, ModalButtonProps } from "./modal-dialog";

const TIP_MENU_ITEMS = [
  {
    caption: "Report Phishing",
    icon: RiSpam2Line,
    iconColor: "blue",
    onClick: () => console.log("Phishing reported"),
  },
  {
    caption: "Report Junk",
    icon: RiForbid2Line,
    iconColor: "red",
    onClick: () => console.log("Junk reported"),
  },
  {
    caption: "Block Sender",
    icon: RiShieldLine,
    iconColor: "orange",
    isDangerous: true,
    onClick: () => console.log("Sender blocked"),
  },
  {
    caption: "Mark as Read",
    icon: RiCheckLine,
    iconColor: "green",
    onClick: () => console.log("Marked as read"),
  },
  {
    caption: "Move to Spam",
    icon: RiInboxArchiveLine,
    iconColor: "purple",
    onClick: () => console.log("Moved to spam"),
  },
  {
    caption: "Download Attachment",
    icon: RiDownloadLine,
    iconColor: "teal",
    onClick: () => console.log("Downloading"),
  },
  {
    caption: "Copy Link",
    icon: RiLink,
    iconColor: "gray",
    onClick: () => console.log("Link copied"),
  },
  {
    caption: "Share",
    icon: RiShareLine,
    iconColor: "indigo",
    isDangerous: true,
    onClick: () => console.log("Shared"),
  },
  {
    caption: "Edit",
    icon: RiEditLine,
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
  title: "Controls/TipMenu",
  component: TipMenu,
  args: {
    subMenuList: TIP_MENU_ITEMS,
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      description: "Content of tip menu",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TipMenu>;

export const Default: Story = {
  render: ({ subMenuList }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <TipMenu subMenuList={subMenuList}>
          <TipMenu.Item
            caption="Delete"
            icon={RiDeleteBinLine}
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
};
