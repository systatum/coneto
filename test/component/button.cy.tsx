import { Button } from "./../../components/button";
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
} from "@remixicon/react";

describe("Button", () => {
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

  context("tipMenu", () => {
    context("when click", () => {
      it("renders background color active by variant", () => {
        cy.mount(
          <Button
            variant="default"
            dropdownStyle={{
              minWidth: "240px",
            }}
            subMenuList={TIP_MENU_ITEMS}
          >
            Test
          </Button>
        );
        cy.findByLabelText("button-toggle")
          .click()
          .then(($button) => {
            cy.wrap($button).should(
              "have.css",
              "background-color",
              "rgb(207, 207, 207)"
            );
          });
      });
      it("renders content menu", () => {
        cy.viewport(800, 700);
        cy.mount(
          <Button
            variant="default"
            dropdownStyle={{
              minWidth: "240px",
            }}
            subMenuList={TIP_MENU_ITEMS}
          >
            Test
          </Button>
        );

        cy.findByLabelText("button-toggle").click();
        TIP_MENU_ITEMS.forEach((item) => {
          cy.contains(item.caption).should("exist");
        });
      });
    });
    context("when hover", () => {
      it("renders background color hover by variant", () => {
        cy.mount(
          <Button
            variant="default"
            dropdownStyle={{
              minWidth: "240px",
            }}
            subMenuList={TIP_MENU_ITEMS}
          >
            Test
          </Button>
        );
        cy.findByLabelText("button-toggle")
          .realHover()
          .wait(300)
          .should("have.css", "background-color", "rgb(226, 226, 226)");
      });
    });
  });
});
