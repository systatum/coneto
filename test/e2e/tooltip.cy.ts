import { getIdContent } from "test/support/commands";

context("Tooltip Component", () => {
  describe("Hover Tooltip", () => {
    it("Should appear and disappear on hover", () => {
      cy.visit(getIdContent("content-tooltip--hover"));

      cy.contains("Hover Tooltip")
        .trigger("mouseover")
        .trigger("mousemove", { clientX: 10, clientY: 10 });

      cy.contains("This tooltip appears on hover").should("be.visible");

      cy.contains("Hover Tooltip").trigger("mouseout", { force: true });
      cy.contains("This tooltip appears on hover").should("not.exist");
    });
  });

  describe("Click Tooltip", () => {
    it("Should toggle visibility on click", () => {
      cy.visit(getIdContent("content-tooltip--click"));

      cy.contains("Click Tooltip").click();
      cy.contains("This tooltip appears on click").should("be.visible");

      cy.contains("Click Tooltip").click();
      cy.contains("This tooltip appears on click").should("not.exist");
    });
  });

  describe("Styled Tooltip", () => {
    it("Should show on hover and be visible", () => {
      cy.visit(getIdContent("content-tooltip--styled-tooltip"));

      cy.contains("Tooltip with custom styling").should("not.exist");

      cy.contains("Styled Tooltip")
        .trigger("mouseover")
        .trigger("mousemove", { clientX: 10, clientY: 10 });

      cy.contains("Tooltip with custom styling").should("be.visible");

      cy.contains("Styled Tooltip").trigger("mouseout", { force: true });
      cy.contains("Tooltip with custom styling").should("not.exist");
    });
  });

  describe("Dotted Underline Tooltip", () => {
    it("Should show on hover", () => {
      cy.visit(getIdContent("content-tooltip--dotted-underline-tooltip"));

      cy.contains("Dotted Underline Tooltip")
        .trigger("mouseover")
        .trigger("mousemove", { clientX: 10, clientY: 10 });

      cy.contains("Tooltip with dotted underline trigger").should("be.visible");

      cy.contains("Dotted Underline Tooltip").trigger("mouseout", {
        force: true,
      });
      cy.contains("Tooltip with dotted underline trigger").should("not.exist");
    });
  });

  describe("No Underline Tooltip", () => {
    it("Should show on hover without checking classes", () => {
      cy.visit(getIdContent("content-tooltip--no-underline-tooltip"));

      cy.contains("No Underline Tooltip")
        .trigger("mouseover")
        .trigger("mousemove", { clientX: 10, clientY: 10 });

      cy.contains("Trigger text without underline").should("be.visible");

      cy.contains("No Underline Tooltip").trigger("mouseout", { force: true });
      cy.contains("Trigger text without underline").should("not.exist");
    });
  });

  describe("Blue Underline Tooltip", () => {
    it("Should open on click and close again", () => {
      cy.visit(getIdContent("content-tooltip--blue-underline-tooltip"));

      cy.contains("Blue Underline Tooltip").click();
      cy.contains("Clicked tooltip with blue underline").should("be.visible");

      cy.contains("Blue Underline Tooltip").click();
      cy.contains("Clicked tooltip with blue underline").should("not.exist");
    });
  });

  describe("With Form Tooltip", () => {
    it("Should open on click and accept input", () => {
      cy.visit(getIdContent("content-tooltip--with-form"));

      cy.contains("New Division").click();

      cy.findByRole("textbox")
        .should("be.visible")
        .type("Hello there, this is custom tooltip");

      cy.findByDisplayValue("Hello there, this is custom tooltip").should(
        "exist"
      );
    });
  });
});
