import type { Meta, StoryObj } from "@storybook/react";
import { Toolbar } from "./toolbar";
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
import { css } from "styled-components";

const meta: Meta<typeof Toolbar.Menu> = {
  title: "Controls/Toolbar",
  component: Toolbar.Menu,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TipMenu>;

export const Default: Story = {
  render: () => {
    const subMenuList = [
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
    return (
      <Toolbar>
        <Toolbar.Menu
          onClick={() => {
            console.log("test");
          }}
          caption="Default Mode"
          icon={RiMessage2Line}
          iconColor="red"
          subMenuList={subMenuList}
        />
        <Toolbar.Menu
          caption="Primary Mode"
          icon={RiMessage2Line}
          iconColor="white"
          variant="primary"
          subMenuList={subMenuList}
        />
        <Toolbar.Menu
          caption="Danger Mode"
          icon={RiMessage2Line}
          iconColor="white"
          variant="danger"
          subMenuList={subMenuList}
        />
      </Toolbar>
    );
  },
};
