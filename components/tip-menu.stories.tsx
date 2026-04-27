import type { Meta, StoryObj } from "@storybook/react";
import { TipMenu, TipMenuSubMenuList } from "./tip-menu";
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
  RiFlagLine,
  RiStarLine,
  RiMailUnreadLine,
  RiFolderLine,
  RiArchiveLine,
  RiSendPlaneLine,
  RiComputerLine,
  RiCloudLine,
  RiSmartphoneLine,
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
              id: "report_phishing",
              caption: "Report Phishing",
              icon: {
                image: RiSpam2Line,
                color: "blue",
              },
              variant: "primary",
              onClick: () => console.log("Phishing reported"),
            },
            {
              id: "report_junk",
              caption: "Report Junk",
              icon: {
                image: RiForbid2Line,
                color: "red",
              },
              onClick: () => console.log("Junk reported"),
            },
            {
              id: "block_sender",
              caption: "Block Sender",
              icon: {
                image: RiShieldLine,
              },
              variant: "danger",
              onClick: () => console.log("Sender blocked"),
            },
            {
              id: "mark_as_read",
              caption: "Mark as Read",
              icon: {
                image: RiCheckLine,
              },
              variant: "primary",
              onClick: () => console.log("Marked as read"),
            },
            {
              id: "move_to_spam",
              caption: "Move to Spam",
              icon: {
                image: RiInboxArchiveLine,
                color: "purple",
              },
              variant: "default",
              onClick: () => console.log("Moved to spam"),
            },
            {
              id: "download_attachment",
              caption: "Download Attachment",
              icon: {
                image: RiDownloadLine,
              },
              variant: "success",
              onClick: () => console.log("Downloading"),
            },
            {
              id: "copy_link",
              caption: "Copy Link",
              icon: {
                image: RiLink,
                color: "gray",
              },
              variant: "default",
              onClick: () => console.log("Link copied"),
            },
            {
              id: "share",
              caption: "Share",
              icon: {
                image: RiShareLine,
              },
              variant: "primary",
              onClick: () => console.log("Shared"),
            },
            {
              id: "edit",
              caption: "Edit",
              icon: {
                image: RiEditLine,
                color: "orange",
              },
              onClick: () => console.log("Edit mode"),
            },
            {
              id: "delete",
              caption: "Delete",
              icon: { image: RiDeleteBinLine },
              variant: "danger",
              onClick: () => setIsOpen(!isOpen),
            },
            {
              id: "quit",
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
          actions={BUTTONS}
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
    const NESTED_TIP_MENU_ITEMS: TipMenuSubMenuList[] = [
      {
        id: "report_message",
        caption: "Report Message",
        icon: { image: RiSpam2Line },
      },
      {
        id: "move_message",
        caption: "Move Message",
        icon: { image: RiInboxArchiveLine },
        subMenuList: [
          {
            id: "move_to_spam_folder",
            caption: "Move to Spam Folder",
            icon: { image: RiInboxArchiveLine },
            onClick: () => console.log("Moved to spam"),
          },
          {
            id: "move_to_trash",
            caption: "Move to Trash",
            icon: { image: RiDeleteBinLine },
            onClick: () => console.log("Moved to trash"),
          },
          {
            id: "move_to_specific_folder",
            caption: "Move to Specific Folder",
            icon: { image: RiFolderLine },
            onClick: () => console.log("Moved to folder"),
          },
          {
            id: "archive_message",
            caption: "Archive This Message",
            icon: { image: RiArchiveLine },
            onClick: () => console.log("Archived"),
          },
        ],
      },
      {
        id: "mark_status",
        caption: "Mark Status",
        icon: { image: RiCheckLine },
        subMenuList: [
          {
            id: "mark_as_read",
            caption: "Mark as Read",
            icon: { image: RiCheckLine },
            onClick: () => console.log("Marked as read"),
          },
          {
            id: "mark_as_unread",
            caption: "Mark as Unread",
            icon: { image: RiMailUnreadLine },
            onClick: () => console.log("Marked as unread"),
          },
          {
            id: "mark_as_important",
            caption: "Mark as Important",
            icon: { image: RiStarLine },
            onClick: () => console.log("Marked as important"),
          },
          {
            id: "flag_follow_up",
            caption: "Flag for Follow Up",
            icon: { image: RiFlagLine },
            onClick: () => console.log("Flagged"),
          },
        ],
      },
      {
        id: "edit_draft",
        caption: "Edit Draft",
        icon: { image: RiEditLine },
        disabled: true,
        subMenuList: [
          {
            id: "open_in_editor",
            caption: "Open in Editor",
            icon: { image: RiEditLine },
            onClick: () => console.log("Edit mode"),
          },
          {
            id: "save_as_draft",
            caption: "Save as Draft",
            icon: { image: RiSaveLine },
            onClick: () => console.log("Saved as draft"),
          },
          {
            id: "discard_draft",
            caption: "Discard This Draft",
            icon: { image: RiDeleteBinLine },
            onClick: () => console.log("Discarded"),
          },
        ],
      },
      {
        id: "send_to",
        caption: "Send to",
        icon: { image: RiSendPlaneLine },
        subMenuList: [
          {
            id: "my_computer",
            caption: "My computer",
            icon: { image: RiComputerLine },
            subMenuList: [
              {
                id: "c_my_documents",
                caption: "C:/My Documents",
                icon: { image: RiFolderLine },
                onClick: () => console.log("Open My Documents"),
              },
              {
                id: "c_my_pictures",
                caption: "C:/My Pictures",
                icon: { image: RiFolderLine },
                onClick: () => console.log("Open My Pictures"),
              },
            ],
          },
          {
            id: "cloud_storage",
            caption: "Cloud storage",
            icon: { image: RiCloudLine },
            onClick: () => console.log("Open Cloud Storage"),
          },
          {
            id: "smart_phone",
            caption: "Smart Phone",
            icon: { image: RiSmartphoneLine },
            subMenuList: [
              {
                id: "blackberry_bold",
                caption: "Blackberry Bold",
                icon: { image: RiSmartphoneLine },
                onClick: () => console.log("Blackberry Bold selected"),
              },
              {
                id: "nokia_n95",
                caption: "Nokia N95",
                onClick: () => console.log("Nokia N95 selected"),
              },
              {
                id: "palm_pre_3",
                caption: "Palm Pre 3",
                icon: { image: RiSmartphoneLine },
                onClick: () => console.log("Palm Pre 3 selected"),
              },
            ],
          },
        ],
      },
    ];

    return <TipMenu subMenuList={NESTED_TIP_MENU_ITEMS} />;
  },
};
