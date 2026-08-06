import { css } from "styled-components";
import { Grid } from "./../../components/grid";
import { LoadingSkeleton } from "./../../components/loading-skeleton";

describe("Loading Skeleton", () => {
  function WrappedLoadingSkeleton() {
    return (
      <LoadingSkeleton
        flashDirection="left-to-right"
        flashRate="normal"
        styles={{
          self: css`
            border-radius: 12px;
            padding: 16px;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
          `,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <LoadingSkeleton.Item
              height={40}
              width={40}
              styles={{
                self: css`
                  border-radius: 50%;
                `,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <LoadingSkeleton.Item height={16} width={120} />
              <LoadingSkeleton.Item height={13} width={80} />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "flex-end",
            }}
          >
            <LoadingSkeleton.Item height={20} width={32} />
            <LoadingSkeleton.Item height={16} width={100} />
          </div>
        </div>

        <LoadingSkeleton.Item height={16} width="90%" />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <LoadingSkeleton.Item height={24} width={40} />
            <LoadingSkeleton.Item height={24} width={40} />
          </div>
          <LoadingSkeleton.Item height={24} width={70} />
        </div>
      </LoadingSkeleton>
    );
  }

  context("when wrapped by another element", () => {
    it("uses the same color for all skeleton items", () => {
      cy.mount(<WrappedLoadingSkeleton />);

      cy.findAllByLabelText("loading-skeleton-item")
        .should("have.length.greaterThan", 0)
        .then(($items) => {
          const firstColor = getComputedStyle($items[0]).backgroundColor;

          Cypress.$($items).each((_, item) => {
            expect(getComputedStyle(item).backgroundColor).to.equal(firstColor);
          });
        });
    });
  });

  context("when given", () => {
    it("renders content with loading", () => {
      function CardComponent() {
        return (
          <Grid>
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingSkeleton
                key={i}
                styles={{
                  self: css`
                    border: 1px solid #eee;
                    border-radius: 8px;
                    min-width: 300px;
                    max-width: 300px;
                  `,
                }}
              >
                <LoadingSkeleton.Item height={180} />
                <LoadingSkeleton.Item
                  height={21}
                  width="70%"
                  styles={{ self: { marginTop: 16 } }}
                />
                <LoadingSkeleton.Item
                  height={16}
                  styles={{ self: { marginTop: 8 } }}
                />
                <LoadingSkeleton.Item
                  height={16}
                  width="80%"
                  styles={{ self: { marginTop: 6 } }}
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
