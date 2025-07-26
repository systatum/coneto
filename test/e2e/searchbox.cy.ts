import { getIdContent } from "test/support/commands";

context("Searchbox Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-searchbox--default"));
    });

    it("should type and clear input correctly", () => {
      cy.findByPlaceholderText("Search here...")
        .should("exist")
        .type("Hello world")
        .should("have.value", "Hello world");

      cy.wait(200);

      cy.findByRole("button", { name: /clear search input/i })
        .should("exist")
        .click();

      cy.findByPlaceholderText("Search here...").should("have.value", "");
    });
  });
});
