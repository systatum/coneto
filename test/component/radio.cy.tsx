import { Radio } from "./../../components/radio";
import { css } from "styled-components";

describe("Radio", () => {
  context("when adding a large label", () => {
    it("render the radio and label with center alignment", () => {
      cy.mount(
        <Radio
          label="This is radio with title"
          value=""
          labelStyle={css`
            font-size: 30px;
          `}
        />
      );
      cy.findByText("This is radio with title")
        .click()
        .should("have.css", "font-size", "30px");
      cy.findByLabelText("input-container-radio").should(
        "have.css",
        "align-items",
        "center"
      );
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
