import { getIdContent } from "test/support/commands";

context("Combobox Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-combobox--default"));
    });

    it("Should filter and select option using keyboard", () => {
      cy.findByPlaceholderText("Select a fruit...").as("input").type("ap");

      cy.findByRole("option", { name: "Apple" }).should("be.visible");
      cy.findByRole("option", { name: "Grape" }).should("be.visible");

      cy.get("@input").type("{downarrow}{enter}");
      cy.get("@input").should("have.value", "Grape");
    });
  });

  describe("Clearable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-combobox--clearable"));
    });

    it("Should select and clear the input", () => {
      cy.findByPlaceholderText("Select a fruit...").as("input").type("gr");

      cy.findByRole("option", { name: "Grape" }).click();

      cy.get("@input").should("have.value", "Grape");

      cy.findByLabelText("clearable-content").click();
      cy.get("@input").should("have.value", "");
    });
  });

  describe("With Actions", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-combobox--with-actions"));
    });

    it("Should render action and trigger it", () => {
      cy.findByPlaceholderText("Select a fruit...").as("input").type("Pap");

      cy.findByText("Add Fruit").should("be.visible").click();
    });
  });

  describe("Strict Value", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-combobox--strict-value"));
    });

    it("Should not accept free text if not in options", () => {
      cy.findByPlaceholderText("Select a fruit...").type("Durian").blur();

      cy.findByDisplayValue("Durian").should("exist");
      cy.get("body").click("topLeft");
      cy.findByDisplayValue("Durian").should("not.exist");
    });
  });
});
