import { Checkbox } from "./../../components/checkbox";
import { ChoiceGroup } from "../../components/choice-group";
import { Radio } from "../../components/radio";
import { css } from "styled-components";

describe("ChoiceGroup", () => {
  context("Radio", () => {
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
                  labelStyle={css`
                    font-size: 30px;
                  `}
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
    context("with onChange", () => {
      context("when clicking", () => {
        it("render the callback with args onChange", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });
          cy.mount(
            <ChoiceGroup>
              {OPTIONS.map((props, index) => (
                <Checkbox
                  key={index}
                  name="checked"
                  value={props.value}
                  description={props.description}
                  label={props.label}
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
              `The name is checked and the value is ${props.value}`
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
