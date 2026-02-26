import { getIdContent } from "test/support/commands";

describe("Dialog", () => {
  context("Default", () => {
    it("should open and show content", () => {
      cy.visit(getIdContent("stage-dialog--default"));

      cy.findByText("Open Dialog").click();
      cy.wait(200);

      cy.findByText(
        "The project will be moved to the archive section and will no longer appear in your active projects list."
      ).should("exist");
    });
  });
});
