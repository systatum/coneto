import { getIdContent } from "test/support/commands";

describe("PaperDialog Component", () => {
  it("Default - should open the dialog and show the form", () => {
    cy.visit(getIdContent("stage-paperdialog--default"));

    cy.findByRole("button", { name: /open/i }).click();

    cy.findByText("Add New Employee").should("exist");
    cy.findByRole("button", { name: /save/i }).should("exist");
  });

  it("Default - should minimize the dialog", () => {
    cy.visit(getIdContent("stage-paperdialog--default"));

    cy.findByRole("button", { name: /open/i }).click();
    cy.findByRole("button", { name: /minimize here/i }).click();
  });

  it("Closable - should open and close the dialog using the close icon", () => {
    cy.visit(getIdContent("stage-paperdialog--closable"));

    cy.findByRole("button", { name: /trigger/i }).click();

    cy.findByText("Add New Employee").should("exist");

    cy.findByLabelText("button-close").click();
  });

  it("FixedLeft - should open and close the left-positioned dialog", () => {
    cy.visit(getIdContent("stage-paperdialog--fixed-left"));

    cy.findByRole("button", { name: /trigger/i }).click();

    cy.findByText("Add New Employee").should("exist");

    cy.findByLabelText("button-close").click();
  });
});
