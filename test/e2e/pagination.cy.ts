import { getIdContent } from "test/support/commands";

context("Pagination Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-pagination--default"));
    });
    it("Should be click for move page", () => {
      cy.findByLabelText("next-page").should("be.visible").click();
      cy.wait(400);
      cy.findByLabelText("previous-page").should("be.visible").click();
    });
  });

  describe("Over Five Pages", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-pagination--over-five-page"));
    });
    it("Should be select page for ", () => {
      cy.findByLabelText("next-page").should("be.visible").click();
      cy.wait(400);
      cy.findByLabelText("previous-page").should("be.visible").click();

      cy.findByPlaceholderText("1").click();
      cy.findByRole("listbox").scrollTo("bottom", {
        duration: 1000,
      });
      cy.findByText("46").click();
    });
  });
});
