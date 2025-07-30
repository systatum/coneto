import { getIdContent } from "test/support/commands";

context("Crumb Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-crumb--default"));
    });

    it("Should show limited items and expand on ellipsis click", () => {
      cy.findAllByRole("link").should("have.length", 3);
      cy.findByText("Item 1").should("exist");
      cy.findByText("Item 4").should("exist");
      cy.findByText("Item 5").should("exist");

      cy.findByLabelText("ellipsis").click();

      const allLabels = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];

      allLabels.forEach((label) => {
        cy.findByText(label).should("exist");
      });
    });
  });
});
