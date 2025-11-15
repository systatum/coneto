import { Datebox } from "./../../components/datebox";

describe("Datebox", () => {
  context("when initialize first", () => {
    it("render the value on input", () => {
      cy.mount(<Datebox selectedDates={["11/30/2025"]} />);
      cy.findByPlaceholderText("mm/dd/yyyy")
        .should("be.visible")
        .and("have.value", "11/30/2025")
        .click();
      cy.findByText("30").should(
        "have.css",
        "background-color",
        "rgb(97, 169, 249)"
      );
      cy.findByText("29").should(
        "have.css",
        "background-color",
        "rgba(0, 0, 0, 0)"
      );
    });

    context("when wrong date", () => {
      it("renders an empty input and shows today's date in the calendar", () => {
        cy.mount(<Datebox selectedDates={["2025/11/300"]} />);
        const today = new Date();
        cy.findByPlaceholderText("mm/dd/yyyy")
          .should("be.visible")
          .and("have.value", "")
          .click();

        cy.findByText(String(today.getDate())).should(
          "have.css",
          "background-color",
          "rgb(97, 169, 249)"
        );
      });
    });
  });

  context("multiple", () => {
    context("when initialize first", () => {
      it("render the value on input", () => {
        cy.mount(
          <Datebox
            calendarSelectabilityMode="multiple"
            selectedDates={[
              "11/03/2025, 11/04/2025, 11/05/2025, 11/06/2025, 11/07/2025, 11/10/2025, 11/11/2025, 11/12/2025, 11/13/2025, 11/14/2025, 11/17/2025, 11/18/2025, 11/19/2025, 11/20/2025, 11/21/2025, 11/24/2025, 11/25/2025, 11/26/2025, 11/27/2025, 11/28/2025",
            ]}
          />
        );
        cy.findByPlaceholderText("mm/dd/yyyy")
          .should("be.visible")
          .and(
            "have.value",
            "11/03/2025, 11/04/2025, 11/05/2025, 11/06/2025, 11/07/2025, 11/10/2025, 11/11/2025, 11/12/2025, 11/13/2025, 11/14/2025, 11/17/2025, 11/18/2025, 11/19/2025, 11/20/2025, 11/21/2025, 11/24/2025, 11/25/2025, 11/26/2025, 11/27/2025, 11/28/2025"
          )
          .click();
        [
          "3",
          "4",
          "5",
          "6",
          "7",
          "10",
          "11",
          "12",
          "13",
          "14",
          "17",
          "18",
          "19",
          "20",
          "21",
          "24",
          "25",
          "26",
          "27",
          "28",
        ].map((day) => {
          cy.findByText(day).should(
            "have.css",
            "background-color",
            "rgb(97, 169, 249)"
          );
        });
      });

      context("when wrong date", () => {
        it("renders an empty input and shows today's date in the calendar", () => {
          cy.mount(<Datebox selectedDates={["11/01/2025, 11/300/2025"]} />);
          const today = new Date();
          cy.findByPlaceholderText("mm/dd/yyyy")
            .should("be.visible")
            .and("have.value", "")
            .click();

          cy.findByText(String(today.getDate())).should(
            "have.css",
            "background-color",
            "rgb(97, 169, 249)"
          );
        });
      });
    });
  });

  context("ranged", () => {
    context("when initialize first", () => {
      it("render the value on input", () => {
        cy.mount(
          <Datebox
            calendarSelectabilityMode="ranged"
            selectedDates={["11/01/2025-11/30/2025"]}
          />
        );
        cy.findByPlaceholderText("mm/dd/yyyy")
          .should("be.visible")
          .and("have.value", "11/01/2025-11/30/2025")
          .click();
        cy.findByText("1").should(
          "have.css",
          "background-color",
          "rgb(97, 169, 249)"
        );
        cy.findByText("2").should(
          "have.css",
          "background-color",
          "rgba(0, 0, 0, 0)"
        );
        cy.findByText("29").should(
          "have.css",
          "background-color",
          "rgba(0, 0, 0, 0)"
        );
        cy.findByText("30").should(
          "have.css",
          "background-color",
          "rgb(97, 169, 249)"
        );
      });

      context("when wrong date", () => {
        it("renders an empty input and shows today's date in the calendar", () => {
          cy.mount(<Datebox selectedDates={["11/01/2025-11/300/2025"]} />);
          const today = new Date();
          cy.findByPlaceholderText("mm/dd/yyyy")
            .should("be.visible")
            .and("have.value", "")
            .click();

          cy.findByText(String(today.getDate())).should(
            "have.css",
            "background-color",
            "rgb(97, 169, 249)"
          );
        });
      });
    });
  });
});
