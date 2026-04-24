import type { Meta, StoryObj } from "@storybook/react";
import { TipMenu, TipMenuItemProps } from "./tip-menu";
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
  RiSaveLine,
  RiEyeLine,
  RiDriveLine,
  RiAttachmentLine,
  RiShareForwardLine,
  RiFlagLine,
  RiStarLine,
  RiMailUnreadLine,
  RiFolderLine,
  RiArchiveLine,
  RiMailCloseLine,
  RiShieldCrossLine,
  RiAlertLine,
  RiMailForbidLine,
} from "@remixicon/react";
import { ModalDialog, ModalDialogButton } from "./modal-dialog";

const BUTTONS: ModalDialogButton[] = [
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
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
TipMenu is a flexible dropdown menu component that supports optional filtering, icons, and different variants per item. 
It is commonly used for action menus, context menus, or inline tips.

---

### ✨ Features
- 🖱 **Clickable menu items**: Each item supports an onClick handler.
- 🔍 **Optional search/filter**: Automatically filter menu items with \`withFilter\`.
- 🎨 **Variants**: Supports multiple visual variants via variant prop (default, primary, success, danger) to represent different action types, including destructive actions.
- 📏 **Sizes**: Supports sm and md variants for spacing and sizing.
- 🖌 **Custom styles**: Full styling support via \`styles\` prop.
- 📦 **Composable children**: Render additional custom content inside the menu.
- 🎨 **Icon support**: Each menu item can have an optional icon rendered via the \`Figure\` component.

---

### 📌 Usage

\`\`\`tsx
<TipMenu
  subMenuList={[
    { caption: "Edit", onClick: () => console.log("Edit clicked") },
    { caption: "Delete", variant: "danger", onClick: () => console.log("Deleted") },
    { caption: "View", variant: "success" }
  ]}
  withFilter
  size="md"
  variant="default"
  setIsOpen={() => console.log("Menu closed")}
  styles={{
    self: css\`min-width: 200px;\`,
  }}
>
  <div>Custom content at the bottom</div>
</TipMenu>
\`\`\`

- Use \`subMenuList\` to define menu items.
- Use \`withFilter\` to enable the search box.
- Use \`variant\` to change the appearance for items.
- Use \`size\` to change spacing and sizing for items.
- Fully styleable via \`styles.self\`.
- You can still pass custom children if needed.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description:
        "Optional custom content rendered inside the TipMenu below all menu items.",
    },
    subMenuList: {
      control: false,
      description:
        "Array of menu items to display. Each item is an object with `caption`, optional `icon`, `onClick`, `size`, `variant`, `className`, and `hidden` properties.",
    },
    setIsOpen: {
      control: false,
      description:
        "Callback function to be executed when the menu is closed after a click. Typically used to update open state in parent.",
    },
    variant: {
      control: { type: "select" },
      options: ["sm", "md"],
      description:
        "Default size variant for menu items. Can be overridden per item with `TipMenuItem.variant`.",
    },
    withFilter: {
      control: "boolean",
      description:
        "Enable a search box to filter menu items based on their caption.",
    },
    styles: {
      control: false,
      description:
        "Custom styles for TipMenu component. Currently supports:\n- `self`: applied to the root menu container.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TipMenu>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <TipMenu
          subMenuList={[
            {
              caption: "Report Phishing",
              icon: {
                image: RiSpam2Line,
                color: "blue",
              },
              variant: "primary",
              onClick: () => console.log("Phishing reported"),
            },
            {
              caption: "Report Junk",
              icon: {
                image: RiForbid2Line,
                color: "red",
              },
              onClick: () => console.log("Junk reported"),
            },
            {
              caption: "Block Sender",
              icon: {
                image: RiShieldLine,
              },
              variant: "danger",
              onClick: () => console.log("Sender blocked"),
            },
            {
              caption: "Mark as Read",
              icon: {
                image: RiCheckLine,
              },
              variant: "primary",
              onClick: () => console.log("Marked as read"),
            },
            {
              caption: "Move to Spam",
              icon: {
                image: RiInboxArchiveLine,
                color: "purple",
              },
              variant: "default",
              onClick: () => console.log("Moved to spam"),
            },
            {
              caption: "Download Attachment",
              icon: {
                image: RiDownloadLine,
                color: "teal",
              },
              variant: "success",

              onClick: () => console.log("Downloading"),
            },
            {
              caption: "Copy Link",
              icon: {
                image: RiLink,
                color: "gray",
              },
              variant: "default",
              onClick: () => console.log("Link copied"),
            },
            {
              caption: "Share",
              icon: {
                image: RiShareLine,
              },
              variant: "primary",
              onClick: () => console.log("Shared"),
            },
            {
              caption: "Edit",
              icon: {
                image: RiEditLine,
                color: "yellow",
              },
              onClick: () => console.log("Edit mode"),
            },
            {
              caption: "Delete",
              icon: { image: RiDeleteBinLine, color: "red" },
              variant: "danger",
              onClick: () => setIsOpen(!isOpen),
            },
            {
              caption: "Quit",
              variant: "default",
            },
          ]}
        />
        <ModalDialog
          isOpen={isOpen}
          onVisibilityChange={setIsOpen}
          title="Confirm Action"
          subtitle="Are you sure you want to delete?"
          closable={true}
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

export const NestedSubmenu: Story = {
  render: () => {
    const TIP_MENU_LIST: TipMenuItemProps[] = [
      {
        caption: "Report Message",
        icon: { image: RiSpam2Line },
        variant: "primary",
        subMenuList: [
          {
            caption: "Report Phishing Attempt",
            icon: { image: RiSpam2Line },
            variant: "primary",
            onClick: () => console.log("Phishing reported"),
          },
          {
            caption: "Report as Junk",
            icon: { image: RiForbid2Line },
            onClick: () => console.log("Junk reported"),
          },
          {
            caption: "Report Suspicious Content",
            icon: { image: RiMailForbidLine },
            variant: "default",
            onClick: () => console.log("Spam reported"),
          },
          {
            caption: "Report Online Scam",
            icon: { image: RiAlertLine },
            onClick: () => console.log("Scam reported"),
          },
        ],
      },
      {
        caption: "Block Contact",
        icon: { image: RiShieldLine },
        subMenuList: [
          {
            caption: "Block This Sender",
            icon: { image: RiShieldLine },
            variant: "danger",
            onClick: () => console.log("Sender blocked"),
          },
          {
            caption: "Block Entire Domain",
            icon: { image: RiShieldCrossLine },
            onClick: () => console.log("Domain blocked"),
          },
          {
            caption: "Unsubscribe from Mailing List",
            icon: { image: RiMailCloseLine },
            variant: "default",
            onClick: () => console.log("Unsubscribed"),
          },
        ],
      },
      {
        caption: "Move Message",
        icon: { image: RiInboxArchiveLine },
        variant: "success",
        subMenuList: [
          {
            caption: "Move to Spam Folder",
            icon: { image: RiInboxArchiveLine },
            onClick: () => console.log("Moved to spam"),
          },
          {
            caption: "Move to Trash",
            icon: { image: RiDeleteBinLine },
            variant: "danger",
            onClick: () => console.log("Moved to trash"),
          },
          {
            caption: "Move to Specific Folder",
            icon: { image: RiFolderLine },
            onClick: () => console.log("Moved to folder"),
          },
          {
            caption: "Archive This Message",
            icon: { image: RiArchiveLine },
            variant: "primary",
            onClick: () => console.log("Archived"),
          },
        ],
      },
      {
        caption: "Mark Status",
        icon: { image: RiCheckLine },
        subMenuList: [
          {
            caption: "Mark as Read",
            icon: { image: RiCheckLine },
            variant: "primary",
            onClick: () => console.log("Marked as read"),
          },
          {
            caption: "Mark as Unread",
            icon: { image: RiMailUnreadLine },
            onClick: () => console.log("Marked as unread"),
          },
          {
            caption: "Mark as Important",
            icon: { image: RiStarLine },
            variant: "default",
            onClick: () => console.log("Marked as important"),
          },
          {
            caption: "Flag for Follow Up",
            icon: { image: RiFlagLine },
            onClick: () => console.log("Flagged"),
          },
        ],
      },
      {
        caption: "Share Message",
        icon: { image: RiShareLine },
        variant: "danger",
        subMenuList: [
          {
            caption: "Forward to Someone",
            icon: { image: RiShareForwardLine },
            onClick: () => console.log("Forwarded"),
          },
          {
            caption: "Copy Shareable Link",
            icon: { image: RiLink },
            variant: "default",
            onClick: () => console.log("Link copied"),
          },
          {
            caption: "Share via Other Apps",
            icon: { image: RiShareLine },
            onClick: () => console.log("Shared"),
          },
        ],
      },
      {
        caption: "Manage Attachments",
        icon: { image: RiAttachmentLine },
        subMenuList: [
          {
            caption: "Download All Attachments",
            icon: { image: RiDownloadLine },
            variant: "success",
            onClick: () => console.log("Downloading all"),
          },
          {
            caption: "Save to Google Drive",
            icon: { image: RiDriveLine },
            onClick: () => console.log("Saved to drive"),
          },
          {
            caption: "Preview Attachment Files",
            icon: { image: RiEyeLine },
            variant: "default",
            onClick: () => console.log("Previewing"),
          },
        ],
      },
      {
        caption: "Edit Draft",
        icon: { image: RiEditLine },
        variant: "default",
        subMenuList: [
          {
            caption: "Open in Editor",
            icon: { image: RiEditLine },
            onClick: () => console.log("Edit mode"),
          },
          {
            caption: "Save as Draft",
            icon: { image: RiSaveLine },
            variant: "primary",
            onClick: () => console.log("Saved as draft"),
          },
          {
            caption: "Discard This Draft",
            icon: { image: RiDeleteBinLine },
            onClick: () => console.log("Discarded"),
          },
        ],
      },
    ];

    return <TipMenu subMenuList={TIP_MENU_LIST} />;
  },
};
