import { getIdContent } from "test/support/commands";

describe("PaperDialog", () => {
  context("default", () => {
    it("should open the dialog and show the form", () => {
      cy.visit(getIdContent("stage-paperdialog--default"));

      cy.findByRole("button", { name: /open/i }).click();

      cy.findByText("Add New Employee").should("exist");
      cy.findByRole("button", { name: /save/i }).should("exist");
    });

    it("should minimize the dialog", () => {
      cy.visit(getIdContent("stage-paperdialog--default"));

      cy.findByRole("button", { name: /open/i }).click();
      cy.findByRole("button", { name: /minimize here/i }).click();
    });
  });

  context("with closable", () => {
    it("should open and close the dialog using the close icon", () => {
      cy.visit(getIdContent("stage-paperdialog--closable"));

      cy.findByRole("button", { name: /trigger/i }).click();

      cy.findByText("Add New Employee").should("exist");

      cy.findByLabelText("button-close").click();
      cy.findByText("Add New Employee").should("not.exist");
    });
  });

  context("with left position", () => {
    it("should open and close the left-positioned dialog", () => {
      cy.visit(getIdContent("stage-paperdialog--fixed-left"));

      cy.findByRole("button", { name: /trigger/i }).click();

      cy.findByText("Add New Employee").should("exist");

      cy.findByLabelText("button-close").click();
      cy.findByText("Add New Employee").should("not.exist");
    });
  });

  context("with left position", () => {
    it("should open and close the left-positioned dialog", () => {
      cy.visit(getIdContent("stage-paperdialog--fixed-left"));

      cy.findByRole("button", { name: /trigger/i }).click();

      cy.findByText("Add New Employee").should("exist");

      cy.findByLabelText("button-close").click();
      cy.findByText("Add New Employee").should("not.exist");
    });
  });

  context("when nested", () => {
    it("should render nested dialog", () => {
      cy.visit(getIdContent("stage-paperdialog--nested"));

      cy.findAllByLabelText("table-row")
        .eq(0)
        .trigger("mouseover")
        .then(() => {
          cy.wait(100);
          cy.findAllByRole("button").eq(0).click();
        });

      cy.wait(100);
      cy.findByText("Family Registry").should("exist");
      cy.findByText(
        "Detailed view of employees and their family registry records"
      ).should("exist");
      cy.findByText("Add Family").should("exist").click({ force: true });
      cy.findByText("Nested").should("exist");
    });
  });
});
