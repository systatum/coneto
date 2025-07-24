import { getIdContent } from "test/support/commands";

describe("Tooltip Component", () => {
  it("Hover tooltip should appear and disappear on hover", () => {
    cy.visit(getIdContent("content-tooltip--hover"));

    cy.contains("Hover Tooltip")
      .trigger("mouseover")
      .trigger("mousemove", { clientX: 10, clientY: 10 });

    cy.contains("This tooltip appears on hover").should("be.visible");
  });

  it("Click tooltip should toggle visibility on click", () => {
    cy.visit(getIdContent("content-tooltip--click"));

    cy.contains("Click Tooltip").click();

    cy.contains("This tooltip appears on click").should("be.visible");

    cy.contains("Click Tooltip").click();

    cy.contains("This tooltip appears on click").should("not.exist");
  });

  it("Styled tooltip should show on hover with correct class", () => {
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

  it("Dotted underline tooltip shows on hover", () => {
    cy.visit(getIdContent("content-tooltip--dotted-underline-tooltip"));

    cy.contains("Dotted Underline Tooltip")
      .should("have.class", "underline")
      .trigger("mouseover")
      .trigger("mousemove", { clientX: 10, clientY: 10 });

    cy.contains("Tooltip with dotted underline trigger").should("be.visible");

    cy.contains("Dotted Underline Tooltip").trigger("mouseleave");
  });

  it("No underline tooltip shows on hover with no underline class", () => {
    cy.visit(getIdContent("content-tooltip--no-underline-tooltip"));

    cy.contains("No Underline Tooltip")
      .should("have.class", "text-red-500")
      .should("have.class", "font-semibold")
      .trigger("mouseover")
      .trigger("mousemove", { clientX: 10, clientY: 10 });

    cy.contains("Trigger text without underline").should("be.visible");

    cy.contains("No Underline Tooltip").trigger("mouseleave");
  });

  it("Blue underline tooltip opens on click with correct underline", () => {
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
