import { getIdContent } from "test/support/commands";

context("Tooltip Component", () => {
  describe("Hover Tooltip", () => {
    it("Should appear and disappear on hover", () => {
      cy.visit(getIdContent("content-tooltip--hover"));

      cy.contains("Hover Tooltip")
        .trigger("mouseover")
        .trigger("mousemove", { clientX: 10, clientY: 10 });

      cy.contains("This tooltip appears on hover").should("be.visible");
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
    it("Should show on hover with correct class", () => {
      cy.visit(getIdContent("content-tooltip--styled-tooltip"));

      cy.contains("Styled Tooltip")
        .should("have.class", "underline")
        .trigger("mouseover")
        .trigger("mousemove", { clientX: 10, clientY: 10 });

      cy.contains("Tooltip with custom styling")
        .should("be.visible")
        .should("have.class", "text-sm");

      cy.contains("Styled Tooltip").trigger("mouseleave");
    });
  });

  describe("Dotted Underline Tooltip", () => {
    it("Should show on hover", () => {
      cy.visit(getIdContent("content-tooltip--dotted-underline-tooltip"));

      cy.contains("Dotted Underline Tooltip")
        .should("have.class", "underline")
        .trigger("mouseover")
        .trigger("mousemove", { clientX: 10, clientY: 10 });

      cy.contains("Tooltip with dotted underline trigger").should("be.visible");

      cy.contains("Dotted Underline Tooltip").trigger("mouseleave");
    });
  });

  describe("No Underline Tooltip", () => {
    it("Should show on hover with no underline class", () => {
      cy.visit(getIdContent("content-tooltip--no-underline-tooltip"));

      cy.contains("No Underline Tooltip")
        .should("have.class", "text-red-500")
        .should("have.class", "font-semibold")
        .trigger("mouseover")
        .trigger("mousemove", { clientX: 10, clientY: 10 });

      cy.contains("Trigger text without underline").should("be.visible");

      cy.contains("No Underline Tooltip").trigger("mouseleave");
    });
  });

  describe("Blue Underline Tooltip", () => {
    it("Should open on click with correct underline", () => {
      cy.visit(getIdContent("content-tooltip--blue-underline-tooltip"));

      cy.contains("Blue Underline Tooltip")
        .should("have.class", "underline")
        .should("have.class", "decoration-blue-500")
        .click();

      cy.contains("Clicked tooltip with blue underline").should("be.visible");

      cy.contains("Blue Underline Tooltip").click();

      cy.contains("Clicked tooltip with blue underline").should("not.exist");
    });
  });

  describe("With Form Tooltip", () => {
    it("Should open by pressing click, and then we input content ", () => {
      cy.visit(getIdContent("content-tooltip--with-form"));

      cy.contains("New Division").click();

      cy.findAllByRole("textbox")
        .should("be.visible")
        .click()
        .type("Hello there, this is custom tooltip");

      cy.findAllByDisplayValue("Hello there, this is custom tooltip").should(
        "exist"
      );
    });
  });
});
