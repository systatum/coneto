import { getIdContent } from "test/support/commands";

context("Treelist Component", () => {
  describe("Default", () => {
    it("Should highlight selected item", () => {
      cy.visit(getIdContent("content-treelist--default"));

      cy.contains("Adam Noto Hakarsa").click();

      cy.findAllByLabelText("tree-list-item")
        .eq(0)
        .should("have.class", "border-blue-500");
    });
  });

  describe("With Actions", () => {
    it("Should click item and action button exists", () => {
      cy.visit(getIdContent("content-treelist--with-actions"));

      cy.get('[aria-label="Discover"]').should("exist");

      cy.contains("Mohamad Naufal Alim").click();

      cy.findAllByLabelText("tree-list-item")
        .eq(1)
        .should("have.class", "border-blue-500");
    });
  });
});
