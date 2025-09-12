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

  context("multiple", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-calendar--multiple"));
    });

    const contentClick = ["1", "3", "5", "8"];

    it("should click multiple date", () => {
      cy.findByLabelText("calendar-select-date").click();
      cy.findByLabelText("combobox-month").click();
      cy.findByText("SEP").click();
      cy.findByLabelText("combobox-year").click();
      cy.findByText("2025").click();
      contentClick.map((data) => {
        cy.findByText(data).click();
        cy.findByText(data).should(
          "have.css",
          "background-color",
          "rgb(97, 169, 249)"
        );
      });
    });

    it("should select a range using shift+click", () => {
      cy.findByLabelText("calendar-select-date").click();
      cy.findByLabelText("combobox-month").click();
      cy.findByText("SEP").click();
      cy.findByLabelText("combobox-year").click();
      cy.findByText("2025").click();
      cy.findByText("5").click();
      cy.findByText("10").click({ shiftKey: true });
      cy.findByText("1").click({ shiftKey: true });

      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((day) => {
        cy.findByText(String(day)).should(
          "have.css",
          "background-color",
          "rgb(97, 169, 249)"
        );
      });
    });
  });

  context("ranged", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-calendar--ranged"));
    });

    it("should click range date", () => {
      cy.findByLabelText("calendar-select-date").click();
      cy.findByLabelText("combobox-month").click();
      cy.findByText("SEP").click();
      cy.findByLabelText("combobox-year").click();
      cy.findByText("2025").click();
      cy.findByText("1").click();
      cy.findByText("30").click();
      cy.findByText("1").should(
        "have.css",
        "background-color",
        "rgb(97, 169, 249)"
      );
      cy.findByText("30").should(
        "have.css",
        "background-color",
        "rgb(97, 169, 249)"
      );
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
