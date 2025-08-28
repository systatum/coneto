import { getIdContent } from "test/support/commands";

context("Button Component", () => {
  describe("Default", () => {
    it("Should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--default"));

      cy.findByRole("button", { name: /Button/i }).click();

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "height", "36px")
        .and("have.css", "padding-left", "16px")
        .and("have.css", "padding-right", "16px")
        .and("have.css", "background-color", "rgb(243, 243, 243)")
        .and("have.css", "color", "rgb(0, 0, 0)");
    });
  });

  describe("Default Large", () => {
    it("Should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--default-large"));

      cy.findByRole("button", { name: /Button/i }).click();

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "height", "40px")
        .and("have.css", "padding-left", "24px")
        .and("have.css", "padding-right", "24px");
    });
  });

  describe("Default Small", () => {
    it("Should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--default-small"));

      cy.findByRole("button", { name: /Button/i }).click();

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "height", "32px")
        .and("have.css", "padding-left", "12px")
        .and("have.css", "padding-right", "12px")
        .and("have.css", "background-color", "rgb(243, 243, 243)")
        .and("have.css", "color", "rgb(0, 0, 0)");
    });
  });

  describe("Default Icon", () => {
    it("Should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--default-icon"));

      cy.findByRole("button", { name: /Movie/i }).click();

      cy.findByRole("button", { name: /Movie/i })
        .should("have.css", "height", "36px")
        .and("have.css", "width", "36px")
        .and("have.css", "padding-left", "0px")
        .and("have.css", "padding-right", "0px");
    });
  });

  describe("Primary", () => {
    it("Should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--primary"));

      cy.findByRole("button", { name: /Button/i }).click();

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "background-color", "rgb(86, 154, 236)")
        .and("have.css", "color", "rgb(255, 255, 255)");
    });
  });

  describe("Secondary", () => {
    it("Should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--secondary"));

      cy.findByRole("button", { name: /Button/i }).click();

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "background-color", "rgb(221, 221, 221)")
        .and("have.css", "color", "rgb(17, 17, 17)");
    });
  });

  describe("Danger", () => {
    it("Should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--danger"));

      cy.findByRole("button", { name: /Button/i }).click();

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "background-color", "rgb(206, 55, 93)")
        .and("have.css", "color", "rgb(255, 255, 255)");
    });
  });

  describe("Outline", () => {
    it("Should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--outline"));

      cy.findByRole("button", { name: /Button/i }).click();

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "background-color", "rgb(255, 255, 255)")
        .and("have.css", "border-color", "rgb(0, 0, 0)")
        .and("have.css", "color", "rgb(0, 0, 0)");
    });
  });

  describe("With Loading", () => {
    it("Should be disabled and have correct styles", () => {
      cy.visit(getIdContent("controls-button--with-loading"));

      cy.findByRole("button", { name: /Button/i }).should(
        "have.attr",
        "disabled"
      );
      cy.findByRole("button", { name: /Button/i }).should(
        "have.css",
        "cursor",
        "not-allowed"
      );

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "background-color", "rgb(243, 243, 243)")
        .and("have.css", "opacity", "0.6")
        .and("have.css", "pointer-events", "none");
    });
  });

  describe("Default Tip Menu", () => {
    it("Should render main button and toggle", () => {
      cy.visit(getIdContent("controls-button--with-tip-menu"));

      cy.findAllByRole("button").eq(0).should("exist");
      cy.findAllByRole("button").eq(1).should("exist");

      cy.findByLabelText("divider").should("exist");
    });

    it("Should open and close dropdown when toggle clicked", () => {
      cy.visit(getIdContent("controls-button--with-tip-menu"));

      cy.findByLabelText("tip-menu").should("not.exist");

      cy.findByLabelText("button-toggle").last().click();

      cy.findByLabelText("tip-menu").should("exist");

      cy.findByLabelText("button-toggle").last().click();

      cy.findByLabelText("tip-menu").should("not.exist");
    });

    it("Should close dropdown when clicking outside", () => {
      cy.visit(getIdContent("controls-button--with-tip-menu"));

      cy.findByLabelText("button-toggle").last().click();
      cy.findByLabelText("tip-menu").should("exist");

      cy.get("body").click(0, 0);

      cy.findByLabelText("tip-menu").should("not.exist");
    });

    it("Should apply correct styles for divider", () => {
      cy.visit(getIdContent("controls-button--with-tip-menu"));

      cy.findByLabelText("divider")
        .should("have.css", "border-right-width", "1px")
        .and("have.css", "position", "absolute")
        .and("have.css", "border-right-style", "solid");
    });

    it("Should allow selecting submenu item and close menu", () => {
      cy.visit(getIdContent("controls-button--with-tip-menu"));

      cy.findByLabelText("button-toggle").last().click();
      cy.findByLabelText("tip-menu").should("exist");

      cy.findAllByLabelText("tip-menu-item").eq(0).click();

      cy.findByLabelText("tip-menu").should("not.exist");
    });
  });
});
