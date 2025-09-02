import { css } from "styled-components";
import { Toolbar } from "./../../components/toolbar";
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

describe("Toolbar", () => {
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
        cy.viewport(800, 700);
        cy.mount(
          <Toolbar>
            <Toolbar.Menu
              dropdownStyle={css`
                min-width: 235px;
              `}
              onClick={() => {
                console.log("test");
              }}
              caption="Default Mode"
              icon={RiMessage2Line}
              iconColor="red"
              subMenuList={TIP_MENU_ITEMS}
            />
          </Toolbar>
        );

        cy.findByLabelText("toolbar-menu-toggle")
          .click()
          .then(($button) => {
            cy.wrap($button).should(
              "have.css",
              "background-color",
              "rgb(232, 232, 232)"
            );
          });
      });
      it("renders content menu", () => {
        cy.viewport(800, 700);
        cy.mount(
          <Toolbar>
            <Toolbar.Menu
              dropdownStyle={css`
                min-width: 235px;
              `}
              onClick={() => {
                console.log("test");
              }}
              caption="Default Mode"
              icon={RiMessage2Line}
              iconColor="red"
              subMenuList={TIP_MENU_ITEMS}
            />
          </Toolbar>
        );

        cy.findByLabelText("toolbar-menu-toggle").click();
        TIP_MENU_ITEMS.forEach((item) => {
          cy.contains(item.caption).should("exist");
        });
      });
    });
    context("when hover", () => {
      it("renders background color hover by variant", () => {
        cy.viewport(1280, 800);
        cy.mount(
          <Toolbar>
            <Toolbar.Menu
              caption="Test"
              variant="default"
              subMenuList={TIP_MENU_ITEMS}
              dropdownStyle={{ minWidth: "240px" }}
            />
          </Toolbar>
        );

        cy.findByLabelText("toolbar-menu-toggle")
          .realHover()
          .wait(300)
          .should("have.css", "background-color", "rgb(245, 245, 245)");
      });
    });
  });
});
