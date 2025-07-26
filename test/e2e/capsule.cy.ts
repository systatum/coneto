import { getIdContent } from "test/support/commands";

context("Capsule Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-capsule--default"));
    });

    it("should allow clicking and changing active state", () => {
      cy.findByText("List").should("be.visible").click();
      cy.wait(400);
      cy.findByText("New").should("be.visible").click();
    });
  });
});
