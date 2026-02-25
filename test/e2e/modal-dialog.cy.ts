import { getIdContent } from "test/support/commands";

context("ModalDialog Component", () => {
  describe("Default", () => {
    it("should open Default modal and display content", () => {
      cy.visit(getIdContent("stage-modaldialog--default"));

      cy.findByRole("button", { name: /Default Modal/i }).click();
      cy.findByText(/Here is the content of the modal dialog/i).should("exist");
      cy.findByRole("button", { name: /Confirm/i }).should("exist");
      cy.findByRole("button", { name: /Cancel/i }).should("exist");
    });
  });

  describe("No Close Button", () => {
    it("should open modal without close button", () => {
      cy.visit(getIdContent("stage-modaldialog--no-close-button"));

      cy.findByRole("button", { name: /Default With Closable/i }).click();
      cy.findByText(/Modal without the top-right close button./i).should(
        "exist"
      );
      cy.findByRole("button", { name: /OK/i }).should("exist");
      cy.findByRole("button", { name: /Cancel/i }).should("exist");
    });
  });
});
