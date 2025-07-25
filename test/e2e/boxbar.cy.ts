import { getIdContent } from "test/support/commands";

describe("Boxbar Component", () => {
  beforeEach(() => {
    cy.visit(getIdContent("stage-boxbar--default"));
  });

  it("Default - renders badges and toggles visibility", () => {
    cy.contains("Anime").should("exist");

    cy.get('[data-testid="boxbar-toggle"]').click();

    cy.wait(120);
  });
});
