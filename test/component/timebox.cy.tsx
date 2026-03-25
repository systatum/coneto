import { Timebox, TimeboxProps } from "./../../components/timebox";
import { Button } from "./../../components/button";
import {
  RiHome2Line,
  RiLogoutBoxLine,
  RiSettings2Line,
  RiUser2Line,
} from "@remixicon/react";
import { useState } from "react";

describe("Timebox", () => {
  function ProductTimebox(
    props: TimeboxProps & {
      withOnChange?: boolean;
    }
  ) {
    const [value, setValue] = useState("");
    return (
      <Timebox
        value={value}
        onChange={
          props?.withOnChange
            ? (e) => {
                setValue(e.target.value);
                console.log(e.target.value);
              }
            : undefined
        }
        {...props}
      />
    );
  }

  context("onChange", () => {
    context("when given", () => {
      it("should change the value", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });
        cy.mount(<ProductTimebox withOnChange />);

        cy.findAllByRole("textbox").eq(0).click().type("1234", { force: true });
        cy.wait(200);

        ["01:00:00", "12:00:00", "12:03:00", "12:34:00"].map((clock) => {
          cy.get("@consoleLog").should("have.been.calledWith", clock);
        });
      });
    });

    context("when not given", () => {
      it("should not changes the value", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });
        cy.mount(<ProductTimebox />);

        cy.findAllByRole("textbox").eq(0).type("1234", { force: true });

        ["01:00:00", "12:00:00", "12:03:00", "12:34:00"].map((clock) => {
          cy.get("@consoleLog").should("not.have.been.calledWith", clock);
        });
      });
    });
  });

  context("with dropdowns", () => {
    it("renders initialize drawer with min-width 200px", () => {
      cy.mount(
        <Timebox
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

    it("renders with similar height", () => {
      cy.mount(
        <Timebox
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

      cy.findByRole("button").should("have.css", "height", "30px");
      cy.findAllByLabelText("field-lane-wrapper")
        .eq(0)
        .should("have.css", "height", "34px");
    });

    context("width", () => {
      context("when given", () => {
        it("should render the width", () => {
          cy.mount(
            <Timebox
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
            .parent()
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
          <Timebox
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
});
