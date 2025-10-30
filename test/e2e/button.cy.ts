import { getIdContent } from "test/support/commands";

describe("Button", () => {
  context("Default", () => {
    it("should click and have correct styles", () => {
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

  context("Default Large", () => {
    it("should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--default-large"));

      cy.findByRole("button", { name: /Button/i }).click();

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "height", "40px")
        .and("have.css", "padding-left", "24px")
        .and("have.css", "padding-right", "24px");
    });
  });

  context("Default Small", () => {
    it("should click and have correct styles", () => {
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

  context("Default Icon", () => {
    it("should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--default-icon"));

      cy.findByRole("button", { name: /Movie/i }).click();

      cy.findByRole("button", { name: /Movie/i })
        .should("have.css", "height", "36px")
        .and("have.css", "width", "36px")
        .and("have.css", "padding-left", "0px")
        .and("have.css", "padding-right", "0px");
    });
  });

  context("Primary", () => {
    it("should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--primary"));

      cy.findByRole("button", { name: /Button/i }).click();

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "background-color", "rgb(86, 154, 236)")
        .and("have.css", "color", "rgb(255, 255, 255)");
    });
  });

  context("Secondary", () => {
    it("should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--secondary"));

      cy.findByRole("button", { name: /Button/i }).click();

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "background-color", "rgb(221, 221, 221)")
        .and("have.css", "color", "rgb(17, 17, 17)");
    });
  });

  context("Danger", () => {
    it("should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--danger"));

      cy.findByRole("button", { name: /Button/i }).click();

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "background-color", "rgb(206, 55, 93)")
        .and("have.css", "color", "rgb(255, 255, 255)");
    });
  });

  context("Outline", () => {
    it("should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--outline"));

      cy.findByRole("button", { name: /Button/i }).click();

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "background-color", "rgb(255, 255, 255)")
        .and("have.css", "border-color", "rgb(0, 0, 0)")
        .and("have.css", "color", "rgb(0, 0, 0)");
    });
  });

  context("With Loading", () => {
    it("should be disabled and have correct styles", () => {
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
});
