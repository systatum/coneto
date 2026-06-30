import { Checkbox } from "./../../components/checkbox";
import { ChoiceGroup } from "../../components/choice-group";
import { Radio } from "../../components/radio";
import { css } from "styled-components";

describe("ChoiceGroup", () => {
  context("Radio", () => {
    context("when given disabled", () => {
      beforeEach(() => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(
          <ChoiceGroup disabled>
            {OPTIONS.map((props, index) => (
              <Radio
                key={index}
                name="radioSelected"
                label={props.label}
                value={props.value}
                onChange={(e) =>
                  console.log(
                    `The name is ${e.target.name} and the value is ${e.target.value}`
                  )
                }
                styles={{
                  labelStyle: css`
                    font-size: 30px;
                  `,
                }}
              />
            ))}
          </ChoiceGroup>
        );
      });

      it("renders with transparent background", () => {
        cy.findByLabelText("choice-group").should("have.css", "opacity", "0.9");
      });

      context("when clicking", () => {
        it("not render the callback on the console", () => {
          OPTIONS.map((props) => {
            cy.findByText(props.label).click();
            cy.get("@consoleLog").should(
              "not.have.been.calledWith",
              `The name is radioSelected and the value is ${props.value}`
            );
          });
        });
      });
    });

    context("when hovering", () => {
      it("renders still consistently coloring with same background", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(
          <ChoiceGroup>
            {OPTIONS.map((props, index) => (
              <Radio
                key={index}
                name="radioSelected"
                label={props.label}
                value={props.value}
                onChange={(e) =>
                  console.log(
                    `The name is ${e.target.name} and the value is ${e.target.value}`
                  )
                }
                styles={{
                  labelStyle: css`
                    font-size: 30px;
                  `,
                }}
              />
            ))}
          </ChoiceGroup>
        );

        cy.findAllByLabelText("radio-label")
          .eq(0)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");

        cy.findAllByLabelText("radio-circle")
          .eq(0)
          .should("have.css", "background-color", "rgb(255, 255, 255)");

        cy.findByText("Email").realHover();
        cy.wait(200);

        cy.findAllByLabelText("radio-label")
          .eq(0)
          .should("have.css", "background-color", "rgb(231, 242, 252)");

        cy.findAllByLabelText("radio-circle")
          .eq(0)
          .should("have.css", "background-color", "rgb(255, 255, 255)");
      });
    });

    context("with onChange", () => {
      context("when clicking", () => {
        it("render the callback on the console", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });
          cy.mount(
            <ChoiceGroup>
              {OPTIONS.map((props, index) => (
                <Radio
                  key={index}
                  name="radioSelected"
                  label={props.label}
                  value={props.value}
                  onChange={(e) =>
                    console.log(
                      `The name is ${e.target.name} and the value is ${e.target.value}`
                    )
                  }
                  styles={{
                    labelStyle: css`
                      font-size: 30px;
                    `,
                  }}
                />
              ))}
            </ChoiceGroup>
          );

          OPTIONS.map((props) => {
            cy.findByText(props.label).click();
            cy.get("@consoleLog").should(
              "have.been.calledWith",
              `The name is radioSelected and the value is ${props.value}`
            );
          });
        });
      });
    });
  });

  context("Checkbox", () => {
    context("when given disabled", () => {
      beforeEach(() => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(
          <ChoiceGroup disabled>
            {OPTIONS.map((option, index) => (
              <Checkbox
                key={index}
                value={option.value}
                description={option.description}
                name={option.label}
                label={option.label}
                onChange={(e) =>
                  console.log(
                    `The name is ${e.target.name} and the value is ${e.target.value}`
                  )
                }
              />
            ))}
          </ChoiceGroup>
        );
      });

      it("renders with transparent background", () => {
        cy.findByLabelText("choice-group").should("have.css", "opacity", "0.9");
      });

      context("when clicking", () => {
        it("not render the callback with args onChange", () => {
          OPTIONS.map((props) => {
            cy.findByText(props.label).click();
            cy.get("@consoleLog").should(
              "not.have.been.calledWith",
              `The name is ${props.label} and the value is ${props.value}`
            );
          });
        });
      });
    });

    context("when hovering", () => {
      it("renders still consistently coloring with same background", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(
          <ChoiceGroup>
            {OPTIONS.map((option, index) => (
              <Checkbox
                key={index}
                value={option.value}
                description={option.description}
                name={option.label}
                label={option.label}
                onChange={(e) =>
                  console.log(
                    `The name is ${e.target.name} and the value is ${e.target.value}`
                  )
                }
              />
            ))}
          </ChoiceGroup>
        );

        cy.findAllByLabelText("checkbox-label")
          .eq(0)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
        cy.findAllByLabelText("checkbox")
          .eq(0)
          .should("have.css", "background-color", "rgb(255, 255, 255)");
        cy.findByText("Email").realHover();
        cy.wait(200);

        cy.findAllByLabelText("checkbox-label")
          .eq(0)
          .should("have.css", "background-color", "rgb(231, 242, 252)");

        cy.findAllByLabelText("checkbox")
          .eq(0)
          .should("have.css", "background-color", "rgb(255, 255, 255)");
      });
    });

    context("with onChange", () => {
      context("when clicking", () => {
        it("render the callback with args onChange", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });
          cy.mount(
            <ChoiceGroup>
              {OPTIONS.map((option, index) => (
                <Checkbox
                  key={index}
                  value={option.value}
                  description={option.description}
                  name={option.label}
                  label={option.label}
                  onChange={(e) =>
                    console.log(
                      `The name is ${e.target.name} and the value is ${e.target.value}`
                    )
                  }
                />
              ))}
            </ChoiceGroup>
          );

          OPTIONS.map((props) => {
            cy.findByText(props.label).click();
            cy.get("@consoleLog").should(
              "have.been.calledWith",
              `The name is ${props.label} and the value is ${props.value}`
            );
          });
        });
      });
    });
  });
});

const OPTIONS = [
  {
    value: "email",
    label: "Email",
    description: "Receive notifications via email",
  },
  {
    value: "sms",
    label: "SMS",
    description: "Receive notifications via text message",
  },
  {
    value: "push",
    label: "Push Notification",
    description: "Receive notifications via app push",
  },
  {
    value: "none",
    label: "None",
    description: "Do not receive any notifications",
  },
];
