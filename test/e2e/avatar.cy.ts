import { getIdContent } from "test/support/commands";

context("Avatar Component", () => {
  describe("Default", () => {
    it("Should render Default avatar and be visible", () => {
      cy.visit(getIdContent("content-avatar--default"));

      cy.get('[data-testid="avatar-content"]', { timeout: 10000 }).should(
        "be.visible"
      );
    });
  });

  describe("With Actions", () => {
    it("Should click avatar action in With Actions story", () => {
      cy.visit(getIdContent("content-avatar--with-actions"));

      cy.get('[data-testid="avatar-content"]', { timeout: 10000 })
        .should("be.visible")
        .click();
    });
  });

  describe("With Image", () => {
    it("Should render avatar image correctly in With Image story", () => {
      cy.visit(getIdContent("content-avatar--with-image"));

      cy.get('[data-testid="avatar-content"]', { timeout: 10000 })
        .then(cy.wrap)
        .find('img[alt="John Doe profile image on the Systatum superapp"]')
        .should("be.visible");
    });
  });
});
