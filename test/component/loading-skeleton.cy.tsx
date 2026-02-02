import { css } from "styled-components";
import { Grid } from "./../../components/grid";
import { LoadingSkeleton } from "./../../components/loading-skeleton";

describe("Loading Skeleton", () => {
  context("when given", () => {
    it("renders content with loading", () => {
      function CardComponent() {
        return (
          <Grid>
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingSkeleton
                key={i}
                style={css`
                  border: 1px solid #eee;
                  border-radius: 8px;
                  min-width: 300px;
                  max-width: 300px;
                `}
              >
                <LoadingSkeleton.Item height={180} />
                <LoadingSkeleton.Item
                  height={21}
                  width="70%"
                  style={{ marginTop: 16 }}
                />
                <LoadingSkeleton.Item height={16} style={{ marginTop: 8 }} />
                <LoadingSkeleton.Item
                  height={16}
                  width="80%"
                  style={{ marginTop: 6 }}
                />
              </LoadingSkeleton>
            ))}
          </Grid>
        );
      }

      cy.mount(<CardComponent />);

      cy.findAllByLabelText("loading-skeleton-wrapper")
        .eq(0)
        .should("have.css", "border", "1px solid rgb(238, 238, 238)")
        .and("have.css", "border-radius", "8px")
        .and("have.css", "padding", "16px");
      cy.findAllByLabelText("loading-skeleton-item")
        .eq(0)
        .should("have.css", "height", "180px");
      cy.findAllByLabelText("loading-skeleton-item")
        .eq(1)
        .should("have.css", "height", "21px")
        .invoke("css", "width")
        .then((width) => {
          expect(parseFloat(String(width))).to.be.closeTo(186, 1);
        });
      cy.findAllByLabelText("loading-skeleton-item")
        .eq(2)
        .should("have.css", "height", "16px")
        .invoke("css", "width")
        .then((width) => {
          expect(parseFloat(String(width))).to.be.closeTo(266, 1);
        });
      cy.findAllByLabelText("loading-skeleton-item")
        .eq(3)
        .should("have.css", "height", "16px")
        .invoke("css", "width")
        .then((width) => {
          expect(parseFloat(String(width))).to.be.closeTo(212, 1);
        });
    });
  });

  context("flashRate", () => {
    const rates: Array<{
      label: string;
      flashRate: "slow" | "normal" | "fast" | number;
      expected: string;
    }> = [
      { label: "slow", flashRate: "slow", expected: "2s" },
      { label: "normal", flashRate: "normal", expected: "1.4s" },
      { label: "fast", flashRate: "fast", expected: "0.8s" },
      { label: "custom", flashRate: 1.2, expected: "1.2s" },
    ];

    rates.forEach(({ label, flashRate, expected }) => {
      context(`when given ${label}`, () => {
        it(`renders with ${expected} flashRate`, () => {
          cy.mount(
            <LoadingSkeleton flashRate={flashRate}>
              <LoadingSkeleton.Item height={16} />
            </LoadingSkeleton>
          );

          cy.findByLabelText("loading-skeleton-item").should(
            "have.css",
            "animation-duration",
            expected
          );
        });
      });
    });
  });

  context("flashDirection", () => {
    const directions: Array<{
      label: string;
      flashDirection:
        | "left-to-right"
        | "right-to-left"
        | "top-to-bottom"
        | "bottom-to-top";
      backgroundSize: string;
    }> = [
      {
        label: "left-to-right",
        flashDirection: "left-to-right",
        backgroundSize: "400px 100%",
      },
      {
        label: "right-to-left",
        flashDirection: "right-to-left",
        backgroundSize: "400px 100%",
      },
      {
        label: "top-to-bottom",
        flashDirection: "top-to-bottom",
        backgroundSize: "100% 400px",
      },
      {
        label: "bottom-to-top",
        flashDirection: "bottom-to-top",
        backgroundSize: "100% 400px",
      },
    ];

    directions.forEach(({ label, flashDirection, backgroundSize }) => {
      context(`when given ${label}`, () => {
        it(`renders with ${label} flashDirection`, () => {
          cy.mount(
            <LoadingSkeleton flashDirection={flashDirection}>
              <LoadingSkeleton.Item height={16} />
            </LoadingSkeleton>
          );

          cy.findByLabelText("loading-skeleton-item")
            .should("have.css", "background-size", backgroundSize)
            .and("have.css", "animation-name")
            .and("not.eq", "none");
        });
      });
    });
  });
});
