import Card from "./card";
import { Meta, StoryObj } from "@storybook/react";
import {
  RiSpam2Line,
  RiErrorWarningLine,
  RiShieldLine,
  RiCheckDoubleLine,
  RiInboxArchiveLine,
  RiDownload2Line,
  RiLinkM,
  RiSendPlane2Line,
  RiEdit2Line,
} from "@remixicon/react";
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
    icon: RiSpam2Line,
    iconColor: "blue",
    onClick: () => console.log("Phishing reported"),
  },
  {
    caption: "Report Junk",
    icon: RiErrorWarningLine,
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
    icon: RiCheckDoubleLine,
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
    icon: RiDownload2Line,
    iconColor: "teal",
    onClick: () => console.log("Downloading"),
  },
  {
    caption: "Copy Link",
    icon: RiLinkM,
    iconColor: "gray",
    onClick: () => console.log("Link copied"),
  },
  {
    caption: "Share",
    icon: RiSendPlane2Line,
    iconColor: "indigo",
    isDangerous: true,
    onClick: () => console.log("Shared"),
  },
  {
    caption: "Edit",
    icon: RiEdit2Line,
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
            className="min-w-[235px]"
            onClick={() => {
              console.log("test");
            }}
            caption="Toolbar Default Mode"
            icon={RiSpam2Line}
            iconColor="red"
            subMenuList={TIP_MENU_ITEMS}
          />
          <Toolbar.Menu
            className="min-w-[235px]"
            caption="Toolbar Primary Mode"
            icon={RiSpam2Line}
            iconColor="white"
            variant="primary"
            subMenuList={TIP_MENU_ITEMS}
          />
          <Toolbar.Menu
            className="min-w-[235px]"
            caption="Toolbar Danger Mode"
            icon={RiSpam2Line}
            iconColor="white"
            variant="danger"
            subMenuList={TIP_MENU_ITEMS}
          />
        </Toolbar>
      </Card>
    );
  },
};
