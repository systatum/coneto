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
});
