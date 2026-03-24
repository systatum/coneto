import { getIdContent } from "test/support/commands";

describe("ModalDialog", () => {
  context("default", () => {
    it("should open Default modal and display content", () => {
      cy.visit(getIdContent("stage-modaldialog--default"));

      cy.findByText("Default Modal").click();
      cy.findByText(/Here is the content of the modal dialog/i).should("exist");
      cy.findByText(/Confirm/i).should("exist");
      cy.findByText(/Cancel/i).should("exist");
    });
  });
});
