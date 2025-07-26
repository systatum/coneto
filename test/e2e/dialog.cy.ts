import { getIdContent } from "test/support/commands";

describe("Dialog Component", () => {
  describe("Default", () => {
    it("Should open and show content", () => {
      cy.visit(getIdContent("stage-dialog--default"));

      cy.findByRole("button", { name: /Basic Dialog/i }).click();
      cy.wait(200);

      cy.findByText(/This is the dialog content/i).should("exist");
    });
  });

  describe("Dialog With Button", () => {
    it("Should open and show content", () => {
      cy.visit(getIdContent("stage-dialog--dialog-with-button"));

      cy.findByRole("button", { name: /Dialog With Button/i }).click();
      cy.contains(/Lorem ipsum dolor sit amet/i).should("exist");
    });
  });

  describe("Hide Close Button", () => {
    it("Should open dialog and not render close button", () => {
      cy.visit(getIdContent("stage-dialog--hide-close-button"));

      cy.findByRole("button", { name: /Dialog \(HideClose\)/i }).click();
      cy.contains(/does not include the close button/i).should("exist");

      cy.findByRole("button", { name: /close/i }).should("not.exist");
    });
  });
});
