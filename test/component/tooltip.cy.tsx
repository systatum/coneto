import { Badge } from "./../../components/badge";
import { Tooltip } from "./../../components/tooltip";
import { css } from "styled-components";

describe("Tooltip", () => {
  context("With ShowDelayPeriod", () => {
    it("renders drawer with period after hover", () => {
      cy.mount(
        <Tooltip
          showDialogOn="hover"
          hideDialogOn="hover"
          dialogPlacement="top-left"
          showDelayPeriod={2000}
          dialog={
            <div aria-label="tooltip-content">
              This is a delay tooltip with 2 second.
            </div>
          }
        >
          <Badge
            badgeStyle={css`
              cursor: pointer;
              transition: all ease-in-out 0.2s;
            `}
            caption="With Show Delay"
            withCircle
          />
        </Tooltip>
      );
      cy.findByLabelText("tooltip-content").should("not.exist");
      cy.findByText("With Show Delay").realHover();
      cy.findByLabelText("tooltip-content").should("be.visible");
      cy.findByText("With Show Delay").trigger("mouseleave");
      cy.wait(2000);
      cy.findByLabelText("tooltip-content").should("not.exist");
    });
  });
});
