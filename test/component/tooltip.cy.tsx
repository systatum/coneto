import { DialogPlacement } from "@/lib/floating-placement";
import { Badge } from "./../../components/badge";
import { Tooltip, TooltipDialogPlacement } from "./../../components/tooltip";
import { css } from "styled-components";

describe("Tooltip", () => {
  context("dialogPlacement", () => {
    const ALL_PLACEMENTS: TooltipDialogPlacement[] = [
      "top-left",
      "top-center",
      "top-right",
      "right-top",
      "right-center",
      "right-bottom",
      "bottom-right",
      "bottom-center",
      "bottom-left",
      "left-bottom",
      "left-center",
      "left-top",
    ];

    ALL_PLACEMENTS.map((placement) => {
      context(`when given ${placement}`, () => {
        beforeEach(() => {
          cy.mount(
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
              }}
            >
              <Tooltip
                dialog="Tooltip content"
                showDialogOn="hover"
                dialogPlacement={placement}
              >
                Trigger
              </Tooltip>
            </div>
          );
        });

        it("should render the drawer on the correct side", () => {
          cy.findByLabelText("tooltip-trigger").trigger("mouseover");

          cy.findByLabelText("tooltip-trigger").then(($trigger) => {
            const triggerRect = $trigger[0].getBoundingClientRect();

            cy.findByLabelText("tooltip-drawer").then(($drawer) => {
              const drawerRect = $drawer[0].getBoundingClientRect();

              if (placement.startsWith("bottom")) {
                expect(drawerRect.top).to.be.greaterThan(triggerRect.bottom);
              } else if (placement.startsWith("top")) {
                expect(drawerRect.bottom).to.be.lessThan(triggerRect.top);
              } else if (placement.startsWith("left")) {
                expect(drawerRect.right).to.be.lessThan(triggerRect.left);
              } else if (placement.startsWith("right")) {
                expect(drawerRect.left).to.be.greaterThan(triggerRect.right);
              }
            });
          });
        });
      });
    });
  });

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
            styles={{
              self: css`
                cursor: pointer;
                transition: all ease-in-out 0.2s;
              `,
            }}
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
              styles={{
                self: css`
                  cursor: pointer;
                  transition: all ease-in-out 0.2s;
                `,
              }}
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

  context("dialog", () => {
    context("when empty string", () => {
      it("renders children without drawer", () => {
        cy.mount(
          <Tooltip
            showDialogOn="hover"
            hideDialogOn="hover"
            dialogPlacement="top-left"
            showDelayPeriod={2000}
            dialog={""}
          >
            <Badge
              styles={{
                self: css`
                  cursor: pointer;
                  transition: all ease-in-out 0.2s;
                `,
              }}
              caption="With Show Delay"
              withCircle
            />
          </Tooltip>
        );
        cy.findByLabelText("tooltip-content").should("not.exist");
        cy.findByText("With Show Delay").realHover();
        cy.findByLabelText("tooltip-drawer").should("not.exist");
        cy.findByLabelText("tooltip-arrow").should("not.exist");
        cy.findByText("").should("not.exist");
      });
    });
  });
});
