import { getIdContent } from "test/support/commands";

context("Datebox Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-datebox--default"));
    });

    it("Should render click on all day", () => {
      cy.get('[data-type="selectbox"]').click();
      cy.findByLabelText("next-month").click();
      cy.findByLabelText("previous-month").click();
      cy.findByText("13").click();
    });

    it("Should select date", () => {
      cy.get('[data-type="selectbox"]').click();
      cy.findByLabelText("calendar-select-date").click();
      cy.findByLabelText("combobox-month").click();
      cy.findByText("JAN").click();
      cy.findByLabelText("combobox-year").click();
      cy.findByText("2024").click();
      cy.findByText("3").click();
    });
  });

  describe("No Weekends", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-datebox--no-weekends"));
    });

    it("Value doesn't change when clicking a weekend date (weekends are not clickable).", () => {
      cy.get('[data-type="selectbox"]').click();
      cy.findByLabelText("next-month").click();
      cy.findByLabelText("previous-month").click();
      cy.findByLabelText("calendar-select-date").click();
      cy.findByLabelText("combobox-month").click();
      cy.findByText("JUN").click();
      cy.findByLabelText("combobox-year").click();
      cy.findByText("2025").click();
      cy.findByText("22").click();
    });
  });
});
