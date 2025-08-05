import { getIdContent } from "test/support/commands";

context("Grid Component", () => {
  describe("With Selectable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-grid--with-selectable"));
    });

    it("should select and unselect a card", () => {
      cy.findAllByLabelText("grid-card").eq(0).as("card");

      cy.get("@card").should("have.attr", "data-selected", "false");

      cy.get("@card").click();
      cy.get("@card").should("have.attr", "data-selected", "true");

      cy.get("@card").click();
      cy.get("@card").should("have.attr", "data-selected", "false");
    });

    it("can select multiple cards", () => {
      cy.findAllByLabelText("grid-card").eq(0).click();
      cy.findAllByLabelText("grid-card")
        .eq(0)
        .should("have.attr", "data-selected", "true");

      cy.findAllByLabelText("grid-card").eq(2).click();
      cy.findAllByLabelText("grid-card")
        .eq(2)
        .should("have.attr", "data-selected", "true");

      cy.findAllByLabelText("grid-card").eq(3).click();
      cy.findAllByLabelText("grid-card")
        .eq(3)
        .should("have.attr", "data-selected", "true");
    });

    it("should unselect when clicked again", () => {
      cy.findAllByLabelText("grid-card").eq(4).click();
      cy.findAllByLabelText("grid-card")
        .eq(4)
        .should("have.attr", "data-selected", "true");
      cy.findAllByLabelText("grid-card").eq(4).click();
      cy.findAllByLabelText("grid-card")
        .eq(4)
        .should("have.attr", "data-selected", "false");
    });
  });
});
