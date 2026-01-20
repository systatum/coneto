import { Ri24HoursFill } from "@remixicon/react";
import { Radio } from "./../../components/radio";
import { css } from "styled-components";

describe("Radio", () => {
  context("with icon", () => {
    it("renders the radio with icon", () => {
      cy.mount(<Radio label="Radio with icon" value="" icon={Ri24HoursFill} />);
      cy.findByLabelText("radio-icon")
        .should("have.css", "width", "16px")
        .and("have.css", "height", "16px");
    });

    context("when given iconColor red", () => {
      it("renders the radio with icon red", () => {
        cy.mount(
          <Radio
            label="Radio with icon"
            value=""
            icon={Ri24HoursFill}
            iconColor="red"
          />
        );
        cy.findByLabelText("radio-icon").should(
          "have.css",
          "color",
          "rgb(255, 0, 0)"
        );
      });
    });

    context("when given iconSize 30px", () => {
      it("renders the radio with icon 30px", () => {
        cy.mount(
          <Radio
            label="Radio with icon"
            value=""
            icon={Ri24HoursFill}
            iconSize={30}
          />
        );
        cy.findByLabelText("radio-icon")
          .should("have.css", "width", "30px")
          .and("have.css", "height", "30px");
      });
    });
  });

  context("mode", () => {
    context("when given radio", () => {
      it("renders the radio as usual and direction to row", () => {
        cy.mount(<Radio label="Radio with icon" icon={Ri24HoursFill} />);
        cy.findByLabelText("radio-input-container")
          .should("have.css", "flex-direction", "row")
          .and("have.css", "align-items", "center");
      });

      context("when given icon", () => {
        it("renders the icon with default size (16px)", () => {
          cy.mount(<Radio label="Radio with icon" icon={Ri24HoursFill} />);
          cy.findByLabelText("radio-icon")
            .should("have.css", "width", "16px")
            .and("have.css", "height", "16px");
        });
      });
    });

    context("when given button", () => {
      it("renders the radio without circle and direction to column", () => {
        cy.mount(
          <Radio label="Radio with icon" mode="button" icon={Ri24HoursFill} />
        );
        cy.findByLabelText("radio-input-container")
          .should("have.css", "flex-direction", "column")
          .and("have.css", "align-items", "center");
      });

      context("when given icon", () => {
        it("renders the icon with default size (25px)", () => {
          cy.mount(
            <Radio label="Radio with icon" mode="button" icon={Ri24HoursFill} />
          );
          cy.findByLabelText("radio-icon")
            .should("have.css", "width", "25px")
            .and("have.css", "height", "25px");
        });
      });
    });
  });

  context("when adding a large label", () => {
    it("render the radio and label with center alignment", () => {
      cy.mount(
        <Radio
          label="This is radio with title"
          value=""
          styles={{
            labelStyle: css`
              font-size: 30px;
            `,
          }}
        />
      );
      cy.findByText("This is radio with title")
        .click()
        .should("have.css", "font-size", "30px");
      cy.findByLabelText("radio-input-container").should(
        "have.css",
        "align-items",
        "center"
      );
    });
  });

  context("with onChange", () => {
    context("when clicking", () => {
      it("render the callback with args onChange", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });
        cy.mount(
          <div>
            {RADIO_OPTIONS.map((props, index) => (
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
          </div>
        );

        RADIO_OPTIONS.map((props) => {
          cy.findByText(props.label).click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            `The name is radioSelected and the value is ${props.value}`
          );
        });
      });
    });
  });

  context("when disabled", () => {
    it("render the radio with not-allowed", () => {
      cy.mount(RADIO_OPTIONS.map((prop) => <Radio disabled {...prop} />));
      cy.wait(100);
      cy.get("label")
        .should("have.css", "cursor", "not-allowed")
        .and("have.css", "user-select", "none");

      RADIO_OPTIONS.map((prop) => {
        cy.findByText(prop.description)
          .should("have.css", "cursor", "not-allowed")
          .and("have.css", "user-select", "none");
      });
    });

    context("when clicking", () => {
      it("should not render the console", () => {
        cy.mount(
          RADIO_OPTIONS.map((prop) => (
            <Radio
              disabled
              {...prop}
              onChange={() => {
                console.log("Test the console");
              }}
            />
          ))
        );
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        RADIO_OPTIONS.map((prop) => {
          cy.findByText(prop.description).click();
        });

        cy.get("@consoleLog").should(
          "not.have.been.calledWith",
          "Test the console"
        );
      });
    });
  });
});

const RADIO_OPTIONS = [
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
