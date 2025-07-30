import { getIdContent } from "test/support/commands";

context("Launchpad Component", () => {
  beforeEach(() => {
    cy.visit(getIdContent("content-launchpad--default"));
  });
  it("should render section items like Sigma 2 and Alpha 2", () => {
    cy.findByText("Sigma 2").should("be.visible");
    cy.findByText("Alpha 2").should("be.visible");
  });

  it("should render all 12 sections with 8 items each", () => {
    cy.get("a").should("have.length.at.least", 96);
  });
});
