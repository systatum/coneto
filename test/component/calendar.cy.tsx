import { Calendar } from "./../../components/calendar";

describe("Calendar ", () => {
  const value = { text: "", value: "" };

  const MONTH_NAMES = [
    { text: "JAN", value: 1 },
    { text: "FEB", value: 2 },
    { text: "MAR", value: 3 },
    { text: "APR", value: 4 },
    { text: "MAY", value: 5 },
    { text: "JUN", value: 6 },
    { text: "JUL", value: 7 },
    { text: "AUG", value: 8 },
    { text: "SEP", value: 9 },
    { text: "OCT", value: 10 },
    { text: "NOV", value: 11 },
    { text: "DEC", value: 12 },
  ];

  context("disable weekend", () => {
    context("when given", () => {
      it("renders weekend dates gray", () => {
        cy.mount(
          <Calendar
            inputValue={value}
            monthNames={MONTH_NAMES}
            disableWeekend
          />
        );
        cy.findAllByLabelText("calendar-select-date").eq(0).click();
        cy.get("li span")
          .filter(
            (_, el) => getComputedStyle(el).color === "rgb(209, 213, 219)"
          )
          .should("have.length.greaterThan", 0);
      });
    });
    context("when clicked", () => {
      it("not clickable", () => {
        cy.mount(
          <Calendar
            inputValue={value}
            monthNames={MONTH_NAMES}
            disableWeekend
          />
        );
        cy.findAllByLabelText("calendar-select-date").eq(0).click();
        cy.get("li span")
          .filter(
            (_, el) => getComputedStyle(el).color === "rgb(209, 213, 219)"
          )
          .should("have.length.greaterThan", 0)
          .eq(0)
          .click();
      });
    });
  });

  context("highlight today", () => {
    context("when given", () => {
      it("renders date with blue dot and color", () => {
        cy.mount(<Calendar inputValue={value} monthNames={MONTH_NAMES} />);
        cy.findAllByLabelText("calendar-select-date").eq(0).click();
        const today = new Date().getDate();
        cy.get("li")
          .contains(today.toString())
          .within(() => {
            cy.get("div").should("exist");
          });
      });
    });
  });

  context("month/year", () => {
    context("when selecting", () => {
      it("renders changing month and year", () => {
        cy.mount(<Calendar inputValue={value} monthNames={MONTH_NAMES} />);
        cy.findByLabelText("calendar-select-date").eq(0).click();
        cy.findByLabelText("combobox-month").click();
        cy.findByText("JAN").should("exist").click();
        cy.findByLabelText("combobox-year").click();
        cy.findByText("2024").should("exist").click();
      });
    });
  });

  context("todayButtonCaption", () => {
    context("when given", () => {
      it("renders text", () => {
        cy.mount(
          <Calendar
            todayButtonCaption="Present"
            inputValue={value}
            monthNames={MONTH_NAMES}
          />
        );
        cy.findByText("Present").should("be.visible");
      });
    });
  });
});
