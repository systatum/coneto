import { css } from "styled-components";
import { Button } from "./../../components/button";
import {
  OverlayBlocker,
  OverlayBlockerProps,
  OverlayBlockerRef,
} from "./../../components/overlay-blocker";
import { useRef } from "react";

describe("Overlay Blocker", () => {
  function ProductOverlayBlocker(props: OverlayBlockerProps) {
    const ref = useRef<OverlayBlockerRef>(null);

    return (
      <>
        <Button onClick={() => ref?.current?.open()}>Open Overlay</Button>
        <OverlayBlocker {...props} ref={ref} />
      </>
    );
  }

  context("onClick", () => {
    context("when not provide", () => {
      context("when clicking the overlay", () => {
        it("renders to auto close", () => {
          cy.mount(<ProductOverlayBlocker show />);

          cy.findByLabelText("overlay-blocker").should("exist").click();
          cy.findByLabelText("overlay-blocker").should("not.exist");
        });
      });
    });

    context("when provide close", () => {
      context("when clicking the overlay", () => {
        it("renders to auto close", () => {
          cy.mount(<ProductOverlayBlocker onClick={"close"} show />);

          cy.findByLabelText("overlay-blocker").should("exist").click();
          cy.findByLabelText("overlay-blocker").should("not.exist");
        });
      });
    });

    context("when provide close", () => {
      context("when clicking the overlay", () => {
        it("renders overlay as usual (stay opened)", () => {
          cy.mount(<ProductOverlayBlocker onClick={"preventDefault"} show />);

          cy.findByLabelText("overlay-blocker").should("exist").click();
          cy.findByLabelText("overlay-blocker").should("exist");
        });
      });
    });
  });

  function ProductOverlayBlockerWithClose(props: OverlayBlockerProps) {
    const ref = useRef<OverlayBlockerRef>(null);

    return (
      <>
        <Button onClick={() => ref?.current?.open()}>Open Overlay</Button>
        <OverlayBlocker {...props} ref={ref}>
          <Button variant="primary" onClick={() => ref?.current?.close()}>
            Close Overlay
          </Button>
        </OverlayBlocker>
      </>
    );
  }

  context("Ref", () => {
    context("open()", () => {
      context("when clicking button ref", () => {
        it("should renders the overlay", () => {
          cy.mount(<ProductOverlayBlocker />);
          cy.findByLabelText("overlay-blocker").should("not.exist");
          cy.findByText("Open Overlay").should("exist").click();
          cy.findByLabelText("overlay-blocker").should("exist");
        });
      });
    });

    context("close()", () => {
      context("when overlay preventDefault", () => {
        it("still renders with overlay", () => {
          cy.mount(
            <ProductOverlayBlockerWithClose
              show
              onClick={"preventDefault"}
              styles={{
                self: css`
                  display: flex;
                  justify-content: center;
                  align-items: center;
                `,
              }}
            />
          );

          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");
          cy.findByLabelText("overlay-blocker").should("exist");
        });

        context("when clicking button with ref close()", () => {
          it("should close the overlay", () => {
            cy.mount(
              <ProductOverlayBlockerWithClose
                show
                onClick={"preventDefault"}
                styles={{
                  self: css`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  `,
                }}
              />
            );

            cy.findByLabelText("overlay-blocker")
              .should("exist")
              .click("topLeft");
            cy.findByLabelText("overlay-blocker").should("exist");

            cy.findByText("Close Overlay").should("exist").click();
            cy.findByLabelText("overlay-blocker").should("not.exist");
          });
        });
      });
    });
  });

  context("styles", () => {
    context("when not given (default)", () => {
      it("renders with default gray background and layout", () => {
        cy.mount(<ProductOverlayBlockerWithClose show />);

        cy.findByLabelText("overlay-blocker")
          .should("exist")
          .and("have.css", "display", "block")
          .and("have.css", "justify-content", "normal")
          .and("have.css", "align-items", "normal")
          .and("have.css", "background-color", "rgba(3, 3, 3, 0.2)");
      });
    });

    context("when custom styles are provided", () => {
      it("applies align, justify, and background color correctly", () => {
        cy.mount(
          <ProductOverlayBlockerWithClose
            show
            styles={{
              self: css`
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: aliceblue;
              `,
            }}
          />
        );

        cy.findByLabelText("overlay-blocker")
          .should("exist")
          .and("have.css", "display", "flex")
          .and("have.css", "justify-content", "center")
          .and("have.css", "align-items", "center")
          .and("have.css", "background-color", "rgb(240, 248, 255)");
      });
    });
  });
});
