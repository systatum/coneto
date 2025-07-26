import { getIdContent } from "test/support/commands";

context("Calendar Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-calendar--default"));
    });

    it("Should render click on all day", () => {
      cy.findByLabelText("next-month").click();
      cy.findByLabelText("previous-month").click();
      cy.findByText("13").click();
    });

    it("Should select date", () => {
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
      cy.visit(getIdContent("input-elements-calendar--no-weekends"));
    });
    it("Value still on the today after click day in the weekend", () => {
      cy.findByLabelText("next-month").click();
      cy.findByLabelText("previous-month").click();
      cy.findByText("13").click();
    });
  });
});
