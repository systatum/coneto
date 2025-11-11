import { Badge } from "./../../components/badge";
import { Tooltip } from "./../../components/tooltip";
import { css } from "styled-components";

describe("Tooltip", () => {
  context("With ShowDelayPeriod", () => {
    it("renders drawer with period after hover", () => {
      cy.clock();
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
      cy.tick(1900);
      cy.findByLabelText("tooltip-content").should("not.exist");
      cy.tick(100);
      cy.findByLabelText("tooltip-content").should("exist");

      cy.findByText("With Show Delay").trigger("mouseleave");
      cy.findByLabelText("tooltip-content").should("not.exist");
    });

    context("when hover period is not completed", () => {
      it("should not render the tooltip", () => {
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
        cy.findByLabelText("tooltip-content").should("not.exist");
      });
    });
  });
});
