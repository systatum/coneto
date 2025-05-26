import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Toolbar } from "./toolbar";
import {
  Archive,
  Ban,
  CheckCircle,
  Download,
  Link,
  MessageCircleCode,
  OctagonMinus,
  Pencil,
  Send,
  ShieldOff,
} from "lucide-react";
import { TipMenu } from "./tip-menu";

const TIP_MENU_ITEMS = [
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

const meta: Meta<typeof Toolbar.Menu> = {
  title: "Controls/Toolbar",
  component: Toolbar.Menu,
  args: {
    subMenuList: TIP_MENU_ITEMS,
  },

  tags: ["autodocs"],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof TipMenu>;

export const ToolbarDefault: Story = {
  render: ({ subMenuList }) => {
    return (
      <Toolbar>
        <Toolbar.Menu
          className="min-w-[210px]"
          openOn="hover"
          caption="Toolbar Hover Mode"
          icon={MessageCircleCode}
          iconColor="red"
          subMenuList={subMenuList}
        />
        <Toolbar.Menu
          className="min-w-[210px]"
          caption="Toolbar Click Mode"
          icon={MessageCircleCode}
          iconColor="white"
          variant="primary"
          subMenuList={subMenuList}
        />
      </Toolbar>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const hoverMenuButton = await canvas
      .getByText("Toolbar Hover Mode")
      .closest("div");
    expect(hoverMenuButton).toBeTruthy();

    await userEvent.hover(hoverMenuButton);

    const clickMenuButton = await canvas
      .getByText("Toolbar Click Mode")
      .closest("div");
    expect(hoverMenuButton).toBeTruthy();

    await userEvent.click(clickMenuButton);
  },
};
