import type { Meta, StoryObj } from "@storybook/react";
import { Toolbar, ToolbarSubMenuProps } from "./toolbar";
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
  RiMessage2Line,
} from "@remixicon/react";
import { TipMenu } from "./tip-menu";

const meta: Meta<typeof Toolbar.Menu> = {
  title: "Controls/Toolbar",
  component: Toolbar.Menu,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TipMenu>;

export const Default: Story = {
  render: () => {
    const subMenuList: ToolbarSubMenuProps[] = [
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
    ];

    return (
      <Toolbar>
        <Toolbar.Menu
          caption="Default Mode"
          icon={{
            image: RiMessage2Line,
            color: "red",
          }}
          subMenuList={subMenuList}
        />
        <Toolbar.Menu
          caption="Primary Mode"
          icon={{
            image: RiMessage2Line,
            color: "white",
          }}
          variant="primary"
          subMenuList={subMenuList}
        />
        <Toolbar.Menu
          caption="Danger Mode"
          icon={{
            image: RiMessage2Line,
            color: "white",
          }}
          variant="danger"
          subMenuList={subMenuList}
        />
      </Toolbar>
    );
  },
};

export const Big: Story = {
  render: () => {
    const subMenuList: ToolbarSubMenuProps[] = [
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
    ];

    return (
      <Toolbar big>
        <Toolbar.Menu
          caption="Default"
          icon={{
            image: RiMessage2Line,
            color: "red",
          }}
          subMenuList={subMenuList}
        />
        <Toolbar.Menu
          caption="Primary Mode"
          icon={{
            image: RiMessage2Line,
            color: "white",
          }}
          variant="primary"
          subMenuList={subMenuList}
        />
        <Toolbar.Menu
          caption="Danger Mode"
          icon={{
            image: RiMessage2Line,
            color: "white",
          }}
          variant="danger"
          subMenuList={subMenuList}
        />
        <Toolbar.Menu
          caption="Default Mode"
          icon={{
            color: "black",
          }}
          subMenuList={subMenuList}
        />
        <Toolbar.Menu caption="Save" />
      </Toolbar>
    );
  },
};
