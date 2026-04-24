import { TipMenu, TipMenuItemProps } from "../../components/tip-menu";
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

describe("TipMenu", () => {
  const TIP_MENU_HOVER_THEME = {
    default: {
      background: "rgb(243, 243, 243)",
      color: "rgb(17, 17, 17)",
    },
    primary: {
      background: "rgb(62, 125, 211)",
      color: "rgb(255, 255, 255)",
    },
    danger: {
      background: "rgb(161, 47, 75)",
      color: "rgb(255, 255, 255)",
    },
    success: {
      background: "rgb(43, 140, 41)",
      color: "rgb(255, 255, 255)",
    },
  } as const;

  const TIP_MENU_ITEMS: TipMenuItemProps[] = [
    {
      caption: "Ignore Message",
      icon: { image: RiForbid2Line, color: "gray" },
      variant: "default",
      onClick: () => console.log("Ignore message clicked"),
    },
    {
      caption: "Download Attachment",
      icon: { image: RiDownloadLine, color: "teal" },
      variant: "primary",
      onClick: () => console.log("Download attachment clicked"),
    },
    {
      caption: "Block Sender",
      icon: { image: RiShieldLine, color: "orange" },
      variant: "danger",
      onClick: () => console.log("Block sender clicked"),
    },
    {
      caption: "Mark as Read",
      icon: { image: RiCheckLine, color: "green" },
      variant: "success",
      onClick: () => console.log("Mark as read clicked"),
    },
  ];

  const NESTED_TIP_MENU_ITEMS: TipMenuItemProps[] = [
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
      disabled: true,
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

  context("nested", () => {
    it("should be render with arrow right", () => {
      cy.mount(<TipMenu subMenuList={NESTED_TIP_MENU_ITEMS} />);
      cy.findAllByLabelText("tip-menu-item")
        .eq(0)
        .then(($element) => {
          cy.wrap($element)
            .findByLabelText("tip-menu-item-arrow")
            .should("exist");
        });
      cy.findAllByLabelText("tip-menu-item")
        .eq(1)
        .then(($element) => {
          cy.wrap($element)
            .findByLabelText("tip-menu-item-arrow")
            .should("not.exist");
        });
    });

    context("when hovering", () => {
      it("should shows the items", () => {
        cy.mount(<TipMenu subMenuList={NESTED_TIP_MENU_ITEMS} />);
        NESTED_TIP_MENU_ITEMS[0]?.subMenuList?.map((menu) => {
          cy.findByText(menu.caption).should("not.exist");
        });

        cy.findAllByLabelText("tip-menu-item").eq(0).realHover().wait(300);
        NESTED_TIP_MENU_ITEMS[0]?.subMenuList?.map((menu) => {
          cy.findByText(menu.caption).should("exist");
        });
      });
    });
    context("when disabled", () => {
      context("when hovering", () => {
        it("should not shows the items", () => {
          cy.mount(<TipMenu subMenuList={NESTED_TIP_MENU_ITEMS} />);
          NESTED_TIP_MENU_ITEMS[6]?.subMenuList?.map((menu) => {
            cy.findByText(menu.caption).should("not.exist");
          });

          cy.findAllByLabelText("tip-menu-item").eq(6).realHover().wait(300);

          NESTED_TIP_MENU_ITEMS[6]?.subMenuList?.map((menu) => {
            cy.findByText(menu.caption).should("not.exist");
          });
        });
      });
    });
  });

  context("disabled", () => {
    it("renders with grayscale and opacity 0.6", () => {
      cy.mount(<TipMenu subMenuList={NESTED_TIP_MENU_ITEMS} />);
      cy.findAllByLabelText("tip-menu-item")
        .eq(6)
        .should("have.css", "opacity", "0.6")
        .and(
          "have.css",
          "filter",
          "grayscale(0.8) brightness(1.1) contrast(1)"
        );
    });
  });

  context("when given hidden action", () => {
    it("should render without hidden action", () => {
      cy.mount(
        <TipMenu
          subMenuList={[
            {
              caption: "Sender",
              icon: { image: RiShieldLine, color: "orange" },
              variant: "danger",
            },
            {
              caption: "Read",
              hidden: true,
            },
          ]}
        />
      );
      cy.findAllByLabelText("tip-menu-icon").should("have.length", 1);
      cy.findAllByLabelText("tip-menu-item").should("have.length", 1);
    });
  });

  context("when given item without icon", () => {
    it("should be renders the tip menu and only display caption", () => {
      cy.mount(
        <TipMenu
          subMenuList={[
            {
              caption: "Sender",
              icon: { image: RiShieldLine, color: "orange" },
              variant: "danger",
            },
            {
              caption: "Read",
            },
          ]}
        />
      );
      cy.findAllByLabelText("tip-menu-item").should("have.length", 2);
      cy.findAllByLabelText("tip-menu-icon").should("have.length", 1);
    });
  });

  context("when render", () => {
    it("renders all variants", () => {
      cy.mount(<TipMenu subMenuList={TIP_MENU_ITEMS} />);
      cy.findAllByLabelText("tip-menu-item").should(
        "have.length",
        TIP_MENU_ITEMS.length
      );
    });
  });

  context("when hover", () => {
    it("applies correct hover styles per variant (Button theme)", () => {
      cy.mount(<TipMenu subMenuList={TIP_MENU_ITEMS} />);

      TIP_MENU_ITEMS.forEach((item, index) => {
        const theme = TIP_MENU_HOVER_THEME[item.variant || "default"];
        cy.findAllByLabelText("tip-menu-item")
          .eq(index)
          .realHover()
          .wait(400)
          .should("have.css", "background-color", theme.background)
          .and("have.css", "color", theme.color);
      });
    });
  });

  context("when click", () => {
    it("renders call onClick handler for junk item", () => {
      cy.window().then((win) => {
        cy.spy(win.console, "log").as("log");
      });

      cy.mount(<TipMenu subMenuList={TIP_MENU_ITEMS} />);
      cy.findAllByLabelText("tip-menu-item").eq(1).click();
      cy.get("@log").should(
        "have.been.calledWith",
        "Download attachment clicked"
      );
    });
  });
});
