import { getIdContent } from "cypress/support/commands";

describe("Avatar Component", () => {
  it("should render Default avatar and be visible", () => {
    cy.visit(getIdContent("content-avatar--default"));

    cy.get('[data-testid="avatar-content"]', { timeout: 10000 }).should(
      "be.visible"
    );
  });

  it("should click avatar action in With Actions story", () => {
    cy.visit(getIdContent("content-avatar--with-actions"));

    cy.get('[data-testid="avatar-content"]', { timeout: 10000 })
      .should("be.visible")
      .click();
  });

  it("should render avatar image correctly in With Image story", () => {
    cy.visit(getIdContent("content-avatar--with-image"));

    cy.get('[data-testid="avatar-content"]', { timeout: 10000 })
      .then(cy.wrap)
      .find('img[alt="John Doe profile image on the Systatum superapp"]')
      .should("be.visible");
  });
});
