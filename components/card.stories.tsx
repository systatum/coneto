import Card from "./card";
import { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
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
import { Toolbar } from "./toolbar";

const meta: Meta<typeof Card> = {
  title: "Content/Card",
  component: Card,
  argTypes: {
    shadow: {
      control: {
        type: "select",
        options: ["none", "sm", "md", "lg", "xl", "2xl"],
      },
      description: "Shadow size",
      defaultValue: "sm",
    },
    radius: {
      control: {
        type: "select",
        options: ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "full"],
      },
      description: "Border radius",
      defaultValue: "xs",
    },
    padding: {
      control: {
        type: "select",
        options: [
          "none",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
        ],
      },
      description: "Padding size",
      defaultValue: "sm",
    },
    className: {
      control: "text",
      description: "Additional custom classes",
    },
    children: {
      control: "text",
      description: "Card content",
    },
  },
};

export default meta;

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

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    shadow: "sm",
    padding: "sm",
  },
  render: () => {
    return (
      <Card>
        <Toolbar>
          <Toolbar.Menu
            className="min-w-[210px]"
            openOn="hover"
            caption="Toolbar Hover Mode"
            icon={MessageCircleCode}
            iconColor="red"
            subMenuList={TIP_MENU_ITEMS}
          />
          <Toolbar.Menu
            className="min-w-[210px]"
            caption="Toolbar Click Mode"
            icon={MessageCircleCode}
            iconColor="white"
            variant="primary"
            subMenuList={TIP_MENU_ITEMS}
          />
        </Toolbar>
      </Card>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cardContent = await canvas.getByText(
      "Card with full rounded corners"
    );
    await expect(cardContent).toBeVisible();
  },
};
