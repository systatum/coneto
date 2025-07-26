import { getIdContent } from "test/support/commands";

context("Chips Component", () => {
  describe("Test case on chips at general", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-chips--default"));
    });

    it("Should filter and select a chip", () => {
      cy.findByRole("button").click();
      cy.findByRole("textbox").type("Anime");
      cy.findByText("Anime").click();
    });

    it("Should deselect a chip", () => {
      cy.findByRole("button").click();
      cy.findByRole("textbox").type("Anime");
      cy.findByText("Anime").click();

      cy.findByRole("button").click();
      cy.findByText("Anime").click();
    });

    it("Should trigger tag creation flow", () => {
      cy.findByRole("button").click();
      cy.findByRole("textbox").type("MyCustomTag");
      cy.findByText(/Create a new label/i).click();

      cy.findByPlaceholderText(/Create a new label/i)
        .clear()
        .type("MyCustomTag");

      cy.findByRole("button", { name: /Add/i }).click();
    });

    it("Should cancel new tag creation", () => {
      cy.findByRole("button").click();
      cy.findByRole("textbox").type("TemporaryTag");
      cy.findByText(/Create a new label/i).click();

      cy.findByRole("button", { name: /Cancel/i }).click();
      cy.findByRole("textbox").should("exist").clear().type("TemporaryTag");

      cy.findByText(/Create a new label/i).should("exist");
    });
  });

  describe("Deletable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-chips--deletable"));
    });

    it("should show delete icon on hover and trigger delete", () => {
      cy.findByRole("button").click();
      cy.findByText("Anime").trigger("mouseover");
      cy.get('[aria-label="Delete requested data"]')
        .eq(0)
        .click({ force: true });
    });
  });
});
