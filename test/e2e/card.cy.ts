import { getIdContent } from "test/support/commands";

context("Card Component", () => {
  describe("Default", () => {
    it("Renders card with toolbar menus", () => {
      cy.visit(getIdContent("content-card--default"));

      cy.findAllByLabelText("toolbar-menu", { timeout: 10000 })
        .eq(0)
        .should("be.visible");
      cy.findAllByLabelText("toolbar-menu", { timeout: 10000 })
        .eq(1)
        .should("be.visible");
      cy.findAllByLabelText("toolbar-menu", { timeout: 10000 })
        .eq(2)
        .should("be.visible");
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

      cy.findByLabelText("textbox-search", { timeout: 10000 })
        .should("exist")
        .type("Pizza");

      cy.contains("Margherita Pizza", { timeout: 10000 })
        .should("be.visible")
        .click();
    });
  });
});
