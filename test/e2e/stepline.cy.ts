import { getIdContent } from "test/support/commands";

context("Stepline Component", () => {
  describe("Default", () => {
    it("Should render 5 steps with todo variant", () => {
      cy.visit(getIdContent("controls-stepline--default"));

      cy.findAllByLabelText("inner-circle").should("have.length", 5);
      cy.findAllByLabelText("outer-circle").should("have.length", 5);

      Array.from({ length: 5 }, (_, i) => {
        const id = i + 1;
        cy.get(`#${id}`).should("exist");
        cy.get(`#${id}`).should("contain.text", id);
      });
    });
  });

  describe("Reversable", () => {
    it("Should be click for move page", () => {
      cy.visit(getIdContent("controls-stepline--reversable"));

      const allTitles = [
        "Application Submitted",
        "Initial Screening",
        "Technical Interview",
        "Final Interview",
      ];

      allTitles.forEach((data) => {
        cy.contains(data, { timeout: 10000 });
        cy.contains(data).should("be.visible");
      });
    });
  });
});
