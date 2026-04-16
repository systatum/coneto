import { TipMenu, TipMenuItemProps } from "../../components/tip-menu";
import {
  RiForbid2Line,
  RiShieldLine,
  RiCheckLine,
  RiDownloadLine,
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
          .wait(200)
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
