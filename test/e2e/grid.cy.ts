import { getIdContent } from "test/support/commands";

context("Grid Component", () => {
  describe("With Selectable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-grid--with-selectable"));
    });

    it("should select and unselect a card", () => {
      const card = () => cy.findAllByLabelText("grid-card").eq(0);

      card().click().should("have.attr", "data-selected", "true");
      card().click().should("have.attr", "data-selected", "false");
    });

    it("can select multiple cards", () => {
      cy.findAllByLabelText("grid-card")
        .eq(0)
        .click()
        .should("have.attr", "data-selected", "true");
      cy.findAllByLabelText("grid-card")
        .eq(2)
        .click()
        .should("have.attr", "data-selected", "true");
      cy.findAllByLabelText("grid-card")
        .eq(3)
        .click()
        .should("have.attr", "data-selected", "true");
    });

    it("should unselect when clicked again", () => {
      cy.findAllByLabelText("grid-card")
        .eq(4)
        .click()
        .should("have.attr", "data-selected", "true");
      cy.findAllByLabelText("grid-card")
        .eq(4)
        .click()
        .should("have.attr", "data-selected", "false");
    });
  });
});
