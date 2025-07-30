import { getIdContent } from "test/support/commands";

context("LoadingSpinner Component", () => {
  describe("Default", () => {
    it("should render the loading spinner", () => {
      cy.visit(getIdContent("content-loadingspinner--default"));
      cy.findByLabelText("circle").should("exist");
    });
  });

  describe("With Label", () => {
    it("should render the spinner with label text", () => {
      cy.visit(getIdContent("content-loadingspinner--with-label"));
      cy.findByLabelText("circle").should("exist");
      cy.contains("Loading...").should("exist");
    });
  });
});
