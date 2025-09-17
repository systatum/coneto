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

  context("multiple", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-datebox--multiple"));
    });

    const contentClick = ["1", "3", "5", "8"];

    it("should click multiple date", () => {
      cy.get('[data-type="selectbox"]').click();
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

      const expectedContent = "09/01/2025,09/03/2025,09/05/2025,09/08/2025";

      cy.findByPlaceholderText("mm/dd/yyyy").as("input");
      cy.get("@input").should("have.value", expectedContent);
    });

    it("should select a range using shift+click", () => {
      cy.get('[data-type="selectbox"]').click();
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

      const expectedContent =
        "09/01/2025,09/02/2025,09/03/2025,09/04/2025,09/05/2025,09/06/2025,09/07/2025,09/08/2025,09/09/2025,09/10/2025";

      cy.findByPlaceholderText("mm/dd/yyyy").as("input");
      cy.get("@input").should("have.value", expectedContent);
    });
  });

  context("ranged", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-datebox--ranged"));
    });

    it("should click range date", () => {
      cy.get('[data-type="selectbox"]').click();
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

      const expectedContent = "09/01/2025-09/30/2025";

      cy.findByPlaceholderText("mm/dd/yyyy").as("input");
      cy.get("@input").should("have.value", expectedContent);
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
