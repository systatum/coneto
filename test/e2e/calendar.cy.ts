import { getIdContent } from "test/support/commands";

describe("Calendar", () => {
  context("default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-calendar--default"));
    });

    it("should render click on all day", () => {
      cy.findByLabelText("next-month").click();
      cy.findByLabelText("previous-month").click();
      cy.findByText("13").click();
    });

    it("should select date", () => {
      cy.findByLabelText("calendar-select-date").click();
      cy.findByLabelText("combobox-month").click();
      cy.findByText("JAN").click();
      cy.findByLabelText("combobox-year").click();
      cy.findByText("2024").click();
      cy.findByText("3").click();
    });
  });

  context("no weekends", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-calendar--no-weekends"));
    });
    it("Value still on the today after click day in the weekend", () => {
      cy.findByLabelText("next-month").click();
      cy.findByLabelText("previous-month").click();
      cy.findByText("13").click();
    });
  });

  context("with footer", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-calendar--with-footer"));
    });

    it("should clear the value when Clear button is clicked", () => {
      cy.findByLabelText("calendar-select-date").click();
      cy.findByLabelText("combobox-month").click();
      cy.findByText("JAN").click();
      cy.findByLabelText("combobox-year").click();
      cy.findByText("2024").click();

      cy.findAllByText("10 January, 2024");
    });
  });
});
