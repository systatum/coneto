import { getIdContent } from "test/support/commands";

describe("LoadingSpinner Component", () => {
  it("renders Default story", () => {
    cy.visit(getIdContent("content-loadingspinner--default"));

    cy.get('[data-testid="circle"]').should("exist");
  });

  it("renders WithLabel story and label text", () => {
    cy.visit(getIdContent("content-loadingspinner--with-label"));

    cy.get('[data-testid="circle"]').should("exist");
    cy.contains("Loading...").should("exist");
  });
});
