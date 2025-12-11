import { DormantText } from "./../../components/dormant-text";
import { Textbox } from "./../../components/textbox";
import { css } from "styled-components";

describe("DormantText", () => {
  context("when given dormantedStyle", () => {
    it("renders customize style for dormanted mode", () => {
      const value = "Test";
      cy.mount(
        <DormantText
          fullWidth
          cancelable
          content={value}
          dormantedStyle={css`
            max-height: 24px;
          `}
          acceptChangeOn="all"
          dormantedFontSize={14}
        >
          <Textbox autoComplete="off" value={value} />
        </DormantText>
      );

      cy.findByLabelText("dormant-wrapper")
        .should("have.css", "height", "24px")
        .click();
      cy.findByLabelText("active-wrapper").should("have.css", "height", "34px");
    });
  });

  context("when given activeStyle", () => {
    it("renders customize style for dormanted mode", () => {
      const value = "Test";
      cy.mount(
        <DormantText
          fullWidth
          cancelable
          content={value}
          activeStyle={css`
            min-height: 24px;
          `}
          actionStyle={css`
            height: 24px;
          `}
          acceptChangeOn="all"
          dormantedFontSize={14}
        >
          <Textbox
            containerStyle={css`
              height: 24px;
            `}
            style={css`
              height: 24px;
            `}
            autoComplete="off"
            value={value}
          />
        </DormantText>
      );

      cy.findByLabelText("dormant-wrapper")
        .should("have.css", "height", "39px")
        .click();
      cy.findByLabelText("active-wrapper").should("have.css", "height", "24px");
    });
  });
});
