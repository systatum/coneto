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
        .and("have.css", "border-color", "rgb(204, 204, 204)")
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

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "background-color", "rgb(243, 243, 243)")
        .and("have.css", "opacity", "0.6")
        .and("have.css", "pointer-events", "none");
    });
  });
});
