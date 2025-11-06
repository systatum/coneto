import { getIdContent } from "test/support/commands";

describe("Card", () => {
  context("Default", () => {
    it("renders card with toolbar menus", () => {
      cy.visit(getIdContent("content-card--default"));

      cy.findAllByLabelText("toolbar-menu", { timeout: 10000 })
        .eq(0)
        .should("exist");
      cy.findAllByLabelText("toolbar-menu", { timeout: 10000 })
        .eq(1)
        .should("exist");
      cy.findAllByLabelText("toolbar-menu", { timeout: 10000 })
        .eq(2)
        .should("exist");
    });
  });

  context("WithHeader", () => {
    it("filters and hides unrelated dishes", () => {
      cy.visit(getIdContent("content-card--with-header"));

      cy.get('input[placeholder="Search..."]').type("pho");

      cy.contains("French Toast").should("not.exist");
    });
  });

  context("WithHeaderAndFooter", () => {
    it("searches and selects an item", () => {
      cy.visit(getIdContent("content-card--with-header-and-footer"));

      cy.findByLabelText("textbox-search", { timeout: 10000 })
        .should("exist")
        .type("Pizza");

      cy.contains("Margherita Pizza", { timeout: 10000 })
        .should("be.visible")
        .click();
    });
  });
});
