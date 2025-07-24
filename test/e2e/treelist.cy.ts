import { getIdContent } from "test/support/commands";

describe("Treelist Component", () => {
  it("TreeList - Default: should highlight selected item", () => {
    cy.visit(getIdContent("content-treelist--default"));

    cy.contains("Adam Noto Hakarsa").click();

    cy.get("[data-testid='tree-list-item']")
      .eq(0)
      .should("have.class", "border-blue-500");
  });

  it("TreeList - WithActions: should click item and action button exists", () => {
    cy.visit(getIdContent("content-treelist--with-actions"));

    cy.get('[aria-label="Discover"]').should("exist");

    cy.contains("Mohamad Naufal Alim").click();

    cy.get("[data-testid='tree-list-item']")
      .eq(1)
      .should("have.class", "border-blue-500");
  });
});
