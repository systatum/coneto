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
});
