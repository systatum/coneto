import { getIdContent } from "test/support/commands";

describe("Launchpad Component", () => {
  it("should render section items like Sigma 2 and Alpha 2", () => {
    cy.visit(getIdContent("content-launchpad--default"));

    cy.findByText("Sigma 2").should("be.visible");
    cy.findByText("Alpha 2").should("be.visible");
  });

  it("should render all 12 sections with 8 items each", () => {
    cy.visit(getIdContent("content-launchpad--default"));

    cy.get("a").should("have.length.at.least", 96);
  });
});
