import { getIdContent } from "test/support/commands";

context("Searchbox Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-searchbox--default"));
    });

    it("Should type and clear input correctly", () => {
      cy.findByPlaceholderText("Search here...")
        .should("exist")
        .type("Hello world", { delay: 50 })
        .should("have.value", "Hello world");

      cy.findByLabelText("delete-input").should("exist").click();

      cy.findByPlaceholderText("Search here...").should("have.value", "");
    });
  });
});
