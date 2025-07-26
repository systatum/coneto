import { getIdContent } from "test/support/commands";

context("Grid Component", () => {
  describe("With Selectable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-grid--with-selectable"));
    });

    it("should select and unselect a card", () => {
      const card = () => cy.get('[data-testid="card-1"]');

      card().click().should("have.attr", "data-selected", "true");
      card().click().should("have.attr", "data-selected", "false");
    });

    it("can select multiple cards", () => {
      cy.get('[data-testid="card-1"]')
        .click()
        .should("have.attr", "data-selected", "true");
      cy.get('[data-testid="card-2"]')
        .click()
        .should("have.attr", "data-selected", "true");
      cy.get('[data-testid="card-3"]')
        .click()
        .should("have.attr", "data-selected", "true");
    });

    it("should unselect when clicked again", () => {
      cy.get('[data-testid="card-5"]')
        .click()
        .should("have.attr", "data-selected", "true");
      cy.get('[data-testid="card-5"]')
        .click()
        .should("have.attr", "data-selected", "false");
    });
  });
});
