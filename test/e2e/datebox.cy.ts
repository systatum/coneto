import { getIdContent } from "test/support/commands";

describe("Datebox", () => {
  context("default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-datebox--default"));
    });

    it("should render click on all day", () => {
      cy.get('[data-type="selectbox"]').click();
      cy.findByLabelText("next-month").click();
      cy.findByLabelText("previous-month").click();
      cy.findByText("13").click();
    });

    it("should select date", () => {
      cy.get('[data-type="selectbox"]').click();
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
      cy.visit(getIdContent("input-elements-datebox--no-weekends"));
    });

    it("value doesn't change when clicking a weekend date (weekends are not clickable).", () => {
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

  context("with footer", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-datebox--with-footer"));
    });

    it("should show footer", () => {
      cy.get('[data-type="selectbox"]').click();
      cy.contains("span", "No weekends");
      cy.contains(
        "span",
        "Unfortunately, due to a driver shortage, please choose delivery dates other than weekends. Thank you."
      );
    });
  });
});
