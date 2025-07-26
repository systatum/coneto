import { getIdContent } from "test/support/commands";

context("Boxbar Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-boxbar--default"));
    });

    it("Renders badges and toggles visibility", () => {
      cy.contains("Anime").should("exist");

      cy.get('[data-testid="boxbar-toggle"]').click();

      cy.wait(120);
    });
  });
});
