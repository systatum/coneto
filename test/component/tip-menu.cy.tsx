import { TipMenu, TipMenuItemProps } from "../../components/tip-menu";
import {
  RiSpam2Line,
  RiForbid2Line,
  RiShieldLine,
  RiCheckLine,
} from "@remixicon/react";

describe("TipMenu", () => {
  let TIP_MENU_ITEMS: TipMenuItemProps[];

  beforeEach(() => {
    TIP_MENU_ITEMS = [
      {
        caption: "Report Phishing",
        icon: { image: RiSpam2Line, color: "blue" },
        onClick: cy.stub().as("phishingClick"),
      },
      {
        caption: "Report Junk",
        icon: { image: RiForbid2Line, color: "red" },
        onClick: cy.stub().as("junkClick"),
      },
      {
        caption: "Block Sender",
        icon: { image: RiShieldLine, color: "orange" },
        isDangerous: true,
        onClick: cy.stub().as("blockClick"),
      },
      {
        caption: "Mark as Read",
        icon: { image: RiCheckLine, color: "green" },
        onClick: cy.stub().as("readClick"),
      },
    ];
  });

  context("when render", () => {
    it("renders all items", () => {
      cy.mount(<TipMenu subMenuList={TIP_MENU_ITEMS} />);
      cy.findAllByLabelText("tip-menu-item").should(
        "have.length",
        TIP_MENU_ITEMS.length
      );
    });

    it("renders dangerous item with red background", () => {
      cy.mount(<TipMenu subMenuList={TIP_MENU_ITEMS} />);
      cy.findAllByLabelText("tip-menu-item")
        .eq(2)
        .should("have.css", "background-color", "rgb(239, 68, 68)");
    });
  });

  context("when hover", () => {
    it("renders background color change on normal item", () => {
      cy.mount(<TipMenu subMenuList={TIP_MENU_ITEMS} />);
      cy.findAllByLabelText("tip-menu-item")
        .eq(0)
        .realHover()
        .wait(200)
        .should("have.css", "background-color", "rgb(242, 242, 242)");
    });

    it("renders background color change on dangerous item", () => {
      cy.mount(<TipMenu subMenuList={TIP_MENU_ITEMS} />);
      cy.findAllByLabelText("tip-menu-item")
        .eq(2)
        .realHover()
        .wait(200)
        .should("have.css", "background-color", "rgb(231, 31, 41)");
    });
  });

  context("when click", () => {
    it("renders call onClick handler for junk item", () => {
      cy.mount(<TipMenu subMenuList={TIP_MENU_ITEMS} />);
      cy.findAllByLabelText("tip-menu-item").eq(1).click();
      cy.get("@junkClick").should("have.been.called");
    });
  });
});
