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

  context("big", () => {
    it("renders flex direction column and big icon", () => {
      cy.viewport(1200, 700);
      cy.mount(
        <Toolbar big>
          <Toolbar.Menu
            styles={{
              dropdownStyle: css`
                min-width: 235px;
              `,
            }}
            caption="Default Mode"
            icon={RiMessage2Line}
            subMenuList={TIP_MENU_ITEMS}
          />
        </Toolbar>
      );

      cy.findByLabelText("toolbar-menu-button").should(
        "have.css",
        "flex-direction",
        "column"
      );
      cy.findByLabelText("toolbar-icon")
        .should("have.css", "width", "33px")
        .and("have.css", "height", "33px");
    });

    context("when have multiple menu", () => {
      it("applied to all toolbar item for style big", () => {
        cy.viewport(1200, 700);
        cy.mount(
          <Toolbar big>
            <Toolbar.Menu
              caption="Default Mode"
              icon={RiMessage2Line}
              subMenuList={TIP_MENU_ITEMS}
            />
            <Toolbar.Menu
              caption="Danger Mode"
              variant="danger"
              icon={RiMessage2Line}
              subMenuList={TIP_MENU_ITEMS}
            />
          </Toolbar>
        );

        cy.findAllByLabelText("toolbar-menu-button")
          .eq(0)
          .should("have.css", "flex-direction", "column");
        cy.findAllByLabelText("toolbar-menu-button")
          .eq(1)
          .should("have.css", "flex-direction", "column");
        cy.findAllByLabelText("toolbar-menu-button")
          .eq(0)
          .should("have.css", "flex-direction", "column");
        cy.findAllByLabelText("toolbar-icon")
          .eq(0)
          .should("have.css", "width", "33px")
          .and("have.css", "height", "33px");
        cy.findAllByLabelText("toolbar-icon")
          .eq(1)
          .should("have.css", "width", "33px")
          .and("have.css", "height", "33px");
      });
    });
  });

  context("tipMenu", () => {
    context("when click", () => {
      it("renders background color active by variant", () => {
        cy.viewport(800, 700);
        cy.mount(
          <Toolbar>
            <Toolbar.Menu
              styles={{
                dropdownStyle: css`
                  min-width: 235px;
                `,
              }}
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
              styles={{
                dropdownStyle: css`
                  min-width: 235px;
                `,
              }}
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
              styles={{
                dropdownStyle: css`
                  min-width: 240px;
                `,
              }}
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
