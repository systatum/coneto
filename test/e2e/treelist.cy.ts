import { getIdContent } from "test/support/commands";

context("Treelist Component", () => {
  describe("Default", () => {
    it("Should highlight selected item", () => {
      cy.visit(getIdContent("content-treelist--default"));

      cy.contains("Adam Noto Hakarsa").click();
      cy.contains("Adam Noto Hakarsa")
        .parent()
        .should("have.css", "border-left-color", "rgb(59, 130, 246)");
    });
  });

  describe("With Actions", () => {
    it("Should click item and action button exists", () => {
      cy.visit(getIdContent("content-treelist--with-actions"));

      cy.findByText("Discover").should("exist").click();

      cy.contains("Mohamad Naufal Alim").click();
      cy.contains("Mohamad Naufal Alim")
        .parent()
        .should("have.css", "border-left-color", "rgb(59, 130, 246)");
    });
  });

  describe("Without Header", () => {
    it("Should click item and action button exists", () => {
      cy.visit(getIdContent("content-treelist--with-actions"));

      cy.findByText("Discover").should("exist").click();

      cy.contains("Mohamad Naufal Alim").click();
      cy.contains("Mohamad Naufal Alim")
        .parent()
        .should("have.css", "border-left-color", "rgb(59, 130, 246)");

      cy.contains("Adam Noto Hakarsa").click();

      cy.contains("Adam Noto Hakarsa")
        .parent()
        .should("have.css", "border-left-color", "rgb(59, 130, 246)");
    });
  });
});
