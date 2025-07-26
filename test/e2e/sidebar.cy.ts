import { getIdContent } from "test/support/commands";

context("Sidebar Component", () => {
  describe("Default", () => {
    it("Should allow typing in the searchbox and filter TreeList", () => {
      cy.visit(getIdContent("stage-sidebar--default"));

      cy.findByRole("textbox").should("exist").clear().type("adam");

      cy.contains("Adam Noto Hakarsa").should("exist");
      cy.contains("Mohamad Naufal Alim").should("not.exist");
    });
  });

  describe("Fixed Right", () => {
    it("Should allow typing in the searchbox and filter TreeList", () => {
      cy.visit(getIdContent("stage-sidebar--fixed-right"));

      cy.findByRole("textbox").should("exist").clear().type("alim");

      cy.contains("Mohamad Naufal Alim").should("exist");
      cy.contains("Adam Noto Hakarsa").should("not.exist");
    });
  });
});
