import { getIdContent } from "test/support/commands";

describe("Card Component", () => {
  it("should render Default card with toolbar menus", () => {
    cy.visit(getIdContent("content-card--default"));

    cy.get('[data-testid="toolbar-menu-Default"]', { timeout: 10000 }).should(
      "be.visible"
    );
    cy.get('[data-testid="toolbar-menu-Primary"]', { timeout: 10000 }).should(
      "be.visible"
    );
    cy.get('[data-testid="toolbar-menu-Danger"]', { timeout: 10000 }).should(
      "be.visible"
    );
  });

  it("should filter and show 'Pho' dish in WithTitle story", () => {
    cy.visit(getIdContent("content-card--with-title"));

    cy.get('input[placeholder="Search..."]').type("pho");

    cy.contains("French Toast").should("not.exist");
  });

  it("should search and select item in WithTitleAndActions story", () => {
    cy.visit(getIdContent("content-card--with-title-and-actions"));

    cy.get('[data-testid="textbox-search"]', { timeout: 10000 })
      .should("exist")
      .type("Pizza");

    cy.contains("Margherita Pizza", { timeout: 10000 })
      .should("be.visible")
      .click();
  });
});
