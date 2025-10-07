import { css } from "styled-components";
import { Checkbox } from "./../../components/checkbox";

describe("Checkbox", () => {
  context("when adding a large label", () => {
    it("render the checkbox and label with center alignment", () => {
      cy.mount(
        <Checkbox
          label="This is checkbox with title"
          labelStyle={css`
            font-size: 30px;
          `}
        />
      );
      cy.findByRole("checkbox").click();
      cy.findByText("This is checkbox with title").should(
        "have.css",
        "font-size",
        "30px"
      );
      cy.findByRole("checkbox").should("be.checked");
      cy.findByLabelText("input-container-checkbox").should(
        "have.css",
        "align-items",
        "center"
      );
    });
  });
});
