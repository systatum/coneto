import { getIdContent } from "test/support/commands";

describe("ModalDialog", () => {
  context("default", () => {
    it("should open Default modal and display content", () => {
      cy.visit(getIdContent("stage-modaldialog--default"));

      cy.findByRole("button", { name: /Default Modal/i }).click();
      cy.findByText(/Here is the content of the modal dialog/i).should("exist");
      cy.findByRole("button", { name: /Confirm/i }).should("exist");
      cy.findByRole("button", { name: /Cancel/i }).should("exist");
    });
  });
});
