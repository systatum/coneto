import { getIdContent } from "test/support/commands";

context("Card Component", () => {
  describe("Default", () => {
    it("Renders card with toolbar menus", () => {
      cy.visit(getIdContent("content-card--default"));

      cy.findByTestId("toolbar-menu-Default", { timeout: 10000 }).should(
        "be.visible"
      );
      cy.findByTestId("toolbar-menu-Primary", { timeout: 10000 }).should(
        "be.visible"
      );
      cy.findByTestId("toolbar-menu-Danger", { timeout: 10000 }).should(
        "be.visible"
      );
    });
  });

  describe("WithTitle", () => {
    it("Filters and hides unrelated dishes", () => {
      cy.visit(getIdContent("content-card--with-title"));

      cy.get('input[placeholder="Search..."]').type("pho");

      cy.contains("French Toast").should("not.exist");
    });
  });

  describe("WithTitleAndActions", () => {
    it("searches and selects an item", () => {
      cy.visit(getIdContent("content-card--with-title-and-actions"));

      cy.findByTestId("textbox-search", { timeout: 10000 })
        .should("exist")
        .type("Pizza");

      cy.contains("Margherita Pizza", { timeout: 10000 })
        .should("be.visible")
        .click();
    });
  });
});
