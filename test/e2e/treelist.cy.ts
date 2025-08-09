import { getIdContent } from "test/support/commands";

context("Treelist Component", () => {
  describe("Default", () => {
    it("Should highlight selected item", () => {
      cy.visit(getIdContent("content-treelist--default"));

      cy.contains("Adam Noto Hakarsa").click();
    });
  });

  describe("With Actions", () => {
    it("Should click item and action button exists", () => {
      cy.visit(getIdContent("content-treelist--with-actions"));

      cy.findByText("Discover").should("exist").click();

      cy.contains("Mohamad Naufal Alim").click();
    });
  });
});
