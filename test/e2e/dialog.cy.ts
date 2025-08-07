import { getIdContent } from "test/support/commands";

describe("Dialog Component", () => {
  describe("Default", () => {
    it("Should open and show content", () => {
      cy.visit(getIdContent("stage-dialog--default"));

      cy.findByText("Open Dialog").click();
      cy.wait(200);

      cy.findByText("This is the dialog body.").should("exist");
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
    });
  });
});
