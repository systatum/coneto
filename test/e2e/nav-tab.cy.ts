import { getIdContent } from "test/support/commands";

context("NavTab Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-navtab--default"));
    });

    it("Switches to Write tab and types in the textbox", () => {
      cy.contains("Review").should("exist");

      cy.findByRole("tab", { name: /Write/i }).click();

      cy.contains("Write").should("exist");

      cy.findByRole("textbox").type("This is a test comment");

      cy.findByRole("textbox").should("have.value", "This is a test comment");
    });
  });
});
