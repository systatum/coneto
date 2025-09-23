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
      const valueWeekend = { text: "09/21/2025", value: "09/21/2025" };
      it("renders weekend dates gray", () => {
        cy.mount(
          <Calendar
            inputValue={valueWeekend}
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

      context("when value in the weekend", () => {
        it("renders selected previous/next day", () => {
          cy.mount(
            <Calendar
              inputValue={valueWeekend}
              monthNames={MONTH_NAMES}
              disableWeekend
            />
          );
          cy.findAllByLabelText("calendar-select-date").eq(0).click();
          cy.findByLabelText("combobox-month").click();
          cy.findByText("SEP").should("exist").click();
          cy.findByLabelText("combobox-year").click();
          cy.findByText("2025").should("exist").click();
          cy.findByText("21").should("have.css", "color", "rgb(209, 213, 219)");
          cy.findByText("22")
            .should("have.css", "color", "rgb(255, 255, 255)")
            .and("have.css", "background-color", "rgb(97, 169, 249)");
        });
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

  context("today", () => {
    context("when clicked", () => {
      it("renders date with blue dot and color", () => {
        cy.mount(<Calendar inputValue={value} monthNames={MONTH_NAMES} />);
        cy.findAllByLabelText("today-button").eq(0).click();
        const today = new Date().getDate();
        cy.get("li")
          .contains(today.toString())
          .within(() => {
            cy.get("div").should("exist");
          });
      });

      it("renders today dot centered even after selecting another date", () => {
        cy.mount(<Calendar inputValue={value} monthNames={MONTH_NAMES} />);

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        cy.findAllByText(String(tomorrow.getDate())).eq(0).click();

        cy.findByLabelText("today-dot").should("exist");

        // Verify the element is translated by -50% horizontally.
        // We can’t check percentages directly, since the browser converts them to pixel values.
        cy.findByLabelText("today-dot")
          .should("have.css", "position", "absolute")
          .and("have.css", "left", "12.5px");

        cy.findByLabelText("today-dot")
          .invoke("css", "transform")
          .then((val) => {
            const str = String(val);

            const parts = str
              .replace("matrix(", "")
              .replace(")", "")
              .split(", ")
              .map(parseFloat);

            const translateX = parts[4];
            expect(translateX).to.be.below(0);
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

  context("onCalendarPeriodChanged", () => {
    context("when selecting", () => {
      it("renders changing month and year", () => {
        const initialDate = new Date();
        const onCalendarPeriodChanged = cy.spy().as("onCalendarPeriodChanged");

        cy.mount(
          <Calendar
            inputValue={value}
            monthNames={MONTH_NAMES}
            onCalendarPeriodChanged={onCalendarPeriodChanged}
          />
        );
        cy.findByLabelText("next-month").click();

        cy.get("@onCalendarPeriodChanged").should(
          "have.been.calledWithMatch",
          (date: Date) => {
            const expectedMonth = (initialDate.getMonth() + 1) % 12;
            const expectedYear =
              initialDate.getFullYear() +
              (initialDate.getMonth() === 11 ? 1 : 0);

            expect(date.getMonth()).to.equal(expectedMonth);
            expect(date.getFullYear()).to.equal(expectedYear);

            return true;
          }
        );
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
