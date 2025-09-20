import { getIdContent } from "test/support/commands";

describe("Datebox", () => {
  context("default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-datebox--default"));
    });

    context("when click next, previous and date", () => {
      it("should show render date", () => {
        cy.get('[data-type="selectbox"]').click();

        cy.findByLabelText("next-month").click();
        cy.findByLabelText("previous-month").click();
        cy.findByText("13").click();

        cy.get('[data-type="selectbox"]')
          .invoke("val")
          .then((value) => {
            const today = new Date();
            const selectedDate = new Date(
              today.getFullYear(),
              today.getMonth(),
              13
            );

            const formatted =
              String(selectedDate.getMonth() + 1).padStart(2, "0") +
              "/" +
              String(selectedDate.getDate()).padStart(2, "0") +
              "/" +
              selectedDate.getFullYear();

            expect(value).to.eq(formatted);
          });
      });
    });

    context("when click month and year", () => {
      it("should select date", () => {
        cy.get('[data-type="selectbox"]').click();
        cy.findByLabelText("calendar-select-date").click();
        cy.findByLabelText("combobox-month").click();
        cy.findByText("JAN").click();
        cy.findByLabelText("combobox-year").click();
        cy.findByText("2024").click();
        cy.findByText("3").click();
        const expectedContent = "01/03/2024";

        cy.findByPlaceholderText("mm/dd/yyyy").as("input");
        cy.get("@input").should("have.value", expectedContent);
      });
    });
  });

  context("no weekends", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-datebox--no-weekends"));
    });

    context("when click on the weekend", () => {
      it("value doesn't change ", () => {
        cy.get('[data-type="selectbox"]').click();
        cy.findByLabelText("calendar-select-date").click();
        cy.findByLabelText("combobox-month").click();
        cy.findByText("JUN").click();
        cy.findByLabelText("combobox-year").click();
        cy.findByText("2025").click();
        cy.findByText("23").click();
        cy.get('[data-type="selectbox"]').click();

        cy.findByText("22").click();
        const expectedContent = "06/23/2025";

        cy.findByPlaceholderText("mm/dd/yyyy").as("input");
        cy.get("@input").should("have.value", expectedContent);
      });
    });
  });

  context("multiple", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-datebox--multiple"));
    });

    const contentClick = ["1", "3", "5", "8"];

    context("when click", () => {
      it("should show multiple date", () => {
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
    });

    context("when keydown shift and click", () => {
      it("should show selected date", () => {
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
  });

  context("multiple no weekends", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-datebox--multiple-no-weekends"));
    });

    const contentClick = ["1", "3", "5", "8"];
    const contentClickWeekend = ["7"];

    context("when click", () => {
      it("should show multiple date but weekend not selected", () => {
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
        contentClickWeekend.map((data) => {
          cy.findByText("7").click();
          cy.findByText(data).should(
            "have.css",
            "background-color",
            "rgb(255, 255, 255)"
          );
        });
        const expectedContent = "09/01/2025,09/03/2025,09/05/2025,09/08/2025";

        cy.findByPlaceholderText("mm/dd/yyyy").as("input");
        cy.get("@input").should("have.value", expectedContent);
      });
    });

    context("when keydown shift and click", () => {
      it("should show selected date without weekend", () => {
        cy.get('[data-type="selectbox"]').click();
        cy.findByLabelText("calendar-select-date").click();
        cy.findByLabelText("combobox-month").click();
        cy.findByText("SEP").click();
        cy.findByLabelText("combobox-year").click();
        cy.findByText("2025").click();
        cy.findByText("5").click();
        cy.findByText("10").click({ shiftKey: true });
        cy.findByText("1").click({ shiftKey: true });

        [1, 2, 3, 4, 5, 8, 9, 10].forEach((day) => {
          cy.findByText(String(day)).should(
            "have.css",
            "background-color",
            "rgb(97, 169, 249)"
          );
        });

        const expectedContent =
          "09/01/2025,09/02/2025,09/03/2025,09/04/2025,09/05/2025,09/08/2025,09/09/2025,09/10/2025";

        cy.findByPlaceholderText("mm/dd/yyyy").as("input");
        cy.get("@input").should("have.value", expectedContent);
      });
    });
  });

  context("ranged", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-datebox--ranged"));
    });

    context("when clicked", () => {
      it("should show range date", () => {
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
  });

  context("ranged no weekends", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-datebox--ranged-no-weekends"));
    });

    context("when clicked", () => {
      it("should show range date, without weekend", () => {
        cy.get('[data-type="selectbox"]').click();
        cy.findByLabelText("calendar-select-date").click();
        cy.findByLabelText("combobox-month").click();
        cy.findByText("SEP").click();
        cy.findByLabelText("combobox-year").click();
        cy.findByText("2025").click();
        cy.findByText("1").click();
        cy.findByText("19").click();
        cy.findByText("1").should(
          "have.css",
          "background-color",
          "rgb(97, 169, 249)"
        );

        cy.findByText("19").should(
          "have.css",
          "background-color",
          "rgb(97, 169, 249)"
        );

        const expectedContentNoWeekend =
          "09/01/2025,09/02/2025,09/03/2025,09/04/2025,09/05/2025,09/08/2025,09/09/2025,09/10/2025,09/11/2025,09/12/2025,09/15/2025,09/16/2025,09/17/2025,09/18/2025,09/19/2025";

        cy.findByPlaceholderText("mm/dd/yyyy").as("input");
        cy.get("@input").should("have.value", expectedContentNoWeekend);
      });
    });
  });

  context("with footer", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-datebox--with-footer"));
    });

    context("when given", () => {
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
});
