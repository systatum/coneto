import { Datebox } from "./../../components/datebox";
import { Button } from "./../../components/button";
import {
  RiHome2Line,
  RiLogoutBoxLine,
  RiSettings2Line,
  RiUser2Line,
} from "@remixicon/react";

describe("Datebox", () => {
  context("with dropdowns", () => {
    it("renders initialize drawer with min-width 200px", () => {
      cy.mount(
        <Datebox
          dropdowns={[
            {
              caption: "Button",
              options: [
                {
                  text: "On-site",
                  value: "1",
                  icon: { image: RiHome2Line },
                },
                {
                  text: "WFH",
                  value: "2",
                  icon: { image: RiUser2Line },
                },
                {
                  text: "Sick leave",
                  value: "3",
                  icon: { image: RiSettings2Line },
                },
                {
                  text: "Annual leave",
                  value: "4",
                  icon: { image: RiLogoutBoxLine },
                },
              ],
            },
          ]}
        />
      );

      cy.findByText("Button").click();

      cy.findByLabelText("button-tip-menu-container").should(
        "have.css",
        "width",
        "200px"
      );
    });

    context("width", () => {
      context("when given", () => {
        it("should render the width", () => {
          cy.mount(
            <Datebox
              dropdowns={[
                {
                  caption: "Width",
                  width: "100px",
                  render: ({ render }) =>
                    render(
                      <Button.TipMenuContainer>
                        Buttton with Width
                      </Button.TipMenuContainer>
                    ),
                },
              ]}
            />
          );

          cy.findByText("Width")
            .then(($el) => {
              const width = $el.css("width");

              expect(parseFloat(width)).to.be.closeTo(100, 1);
            })
            .should("have.css", "align-items", "center")
            .and("have.css", "justify-content", "center");
        });
      });
    });

    context("when given multiple", () => {
      it("renders more than one dropdown", () => {
        cy.mount(
          <Datebox
            dropdowns={[
              {
                caption: "Dropdown 1",
                width: "100px",
                render: ({ render }) =>
                  render(
                    <Button.TipMenuContainer>
                      Drawer on Dropdown 1
                    </Button.TipMenuContainer>
                  ),
              },
              {
                caption: "Dropdown 2",
                width: "100px",
                render: ({ render }) =>
                  render(
                    <Button.TipMenuContainer>
                      Drawer on Dropdown 2
                    </Button.TipMenuContainer>
                  ),
              },
            ]}
          />
        );

        cy.findByText("Drawer on Dropdown 1").should("not.exist");
        cy.findByText("Dropdown 1").click();
        cy.findByText("Drawer on Dropdown 1").should("exist");

        cy.findByText("Drawer on Dropdown 2").should("not.exist");
        cy.findByText("Dropdown 2").click();
        cy.findByText("Drawer on Dropdown 2").should("exist");
      });
    });
  });

  context("when initialized with selected date", () => {
    it("renders the value on input", () => {
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

    context("when given invalid date", () => {
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
    context("when initialized with selected date", () => {
      it("renders the value on input", () => {
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

      context("when given invalid date", () => {
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
    context("when initialized with selected date", () => {
      it("renders the value on input", () => {
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

      context("when given invalid date", () => {
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
