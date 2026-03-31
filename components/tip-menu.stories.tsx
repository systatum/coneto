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
- 🎨 **Item variants**: Supports \`sm\` and \`md\` variants for spacing and size.
- ⚠️ **Dangerous actions**: Items can be styled to indicate dangerous actions (e.g., delete).
- 🖌 **Custom styles**: Full styling support via \`styles\` prop.
- 📦 **Composable children**: Render additional custom content inside the menu.
- 🎨 **Icon support**: Each menu item can have an optional icon rendered via the \`Figure\` component.

---

### 📌 Usage

\`\`\`tsx
<TipMenu
  subMenuList={[
    { caption: "Edit", onClick: () => console.log("Edit clicked") },
    { caption: "Delete", isDangerous: true, onClick: () => console.log("Deleted") },
    { caption: "View", variant: "sm" }
  ]}
  withFilter
  variant="md"
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
- Use \`variant\` to change spacing and sizing for items.
- Use \`isDangerous\` to highlight critical actions.
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
        "Array of menu items to display. Each item is an object with `caption`, optional `icon`, `onClick`, `isDangerous`, `variant`, `className`, and `hidden` properties.",
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
                color: "orange",
              },
              isDangerous: true,
              onClick: () => console.log("Sender blocked"),
            },
            {
              caption: "Mark as Read",
              icon: {
                image: RiCheckLine,
                color: "green",
              },
              onClick: () => console.log("Marked as read"),
            },
            {
              caption: "Move to Spam",
              icon: {
                image: RiInboxArchiveLine,
                color: "purple",
              },
              onClick: () => console.log("Moved to spam"),
            },
            {
              caption: "Download Attachment",
              icon: {
                image: RiDownloadLine,
                color: "teal",
              },
              onClick: () => console.log("Downloading"),
            },
            {
              caption: "Copy Link",
              icon: {
                image: RiLink,
                color: "gray",
              },
              onClick: () => console.log("Link copied"),
            },
            {
              caption: "Share",
              icon: {
                image: RiShareLine,
                color: "indigo",
              },
              isDangerous: true,
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
              onClick: () => setIsOpen(!isOpen),
            },
            {
              caption: "Quit",
            },
          ]}
        ></TipMenu>
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
