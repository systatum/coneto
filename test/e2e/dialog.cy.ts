import { getIdContent } from "test/support/commands";

describe("Dialog", () => {
  context("Default", () => {
    it("should open and show content", () => {
      cy.visit(getIdContent("stage-dialog--default"));

      cy.findByText("Open Dialog").click();
      cy.wait(200);

      cy.findByText("This is the dialog body.").should("exist");
    });
  });

  context("Dialog With Button", () => {
    it("should open and show content", () => {
      cy.visit(getIdContent("stage-dialog--dialog-with-button"));

      cy.findByRole("button", { name: /Dialog With Button/i }).click();
      cy.contains(/Lorem ipsum dolor sit amet/i).should("exist");
    });
  });
});
