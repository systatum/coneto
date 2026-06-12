import { css } from "styled-components";
import {
  Progressbar,
  ProgressbarProps,
  ProgressbarVariant,
} from "./../../components/progressbar";

describe("Progressbar", () => {
  function ProductProgressbar(props: Partial<ProgressbarProps>) {
    return <Progressbar {...props} />;
  }

  context("variant", () => {
    const variantCases: Array<{
      variant: ProgressbarVariant;
      barColor: string;
      trackColor: string;
    }> = [
      {
        variant: "neutral",
        barColor: "rgb(100, 116, 139)",
        trackColor: "rgb(203, 213, 225)",
      },
      {
        variant: "primary",
        barColor: "rgb(91, 99, 246)",
        trackColor: "rgb(199, 204, 255)",
      },
      {
        variant: "success",
        barColor: "rgb(34, 197, 94)",
        trackColor: "rgb(187, 247, 208)",
      },
      {
        variant: "danger",
        barColor: "rgb(244, 63, 94)",
        trackColor: "rgb(254, 205, 211)",
      },
      {
        variant: "warning",
        barColor: "rgb(245, 158, 11)",
        trackColor: "rgb(253, 230, 138)",
      },
    ];

    variantCases.forEach(({ variant, barColor, trackColor }) => {
      context(`when given variant ${variant}`, () => {
        beforeEach(() => {
          cy.mount(<ProductProgressbar variant={variant} value={50} />);
        });

        it(`should render the fill with the correct bar color`, () => {
          cy.findByLabelText("progressbar-fill").should(
            "have.css",
            "background-color",
            barColor
          );
        });

        it(`should render the track with the correct track color`, () => {
          cy.findByLabelText("progressbar-track").should(
            "have.css",
            "background-color",
            trackColor
          );
        });
      });
    });
  });

  context("indeterminate", () => {
    context("when given true", () => {
      it("should not expose aria-valuenow", () => {
        cy.mount(<ProductProgressbar indeterminate={true} />);
        cy.findByRole("progressbar").should("not.have.attr", "aria-valuenow");
      });

      it("should not render the label even when labeling is right", () => {
        cy.mount(
          <ProductProgressbar
            indeterminate={true}
            labeling="right"
            value={50}
          />
        );
        cy.findByRole("progressbar").should("not.contain.text", "%");
      });
    });

    context("when given false", () => {
      it("should expose aria-valuenow", () => {
        cy.mount(<ProductProgressbar indeterminate={false} value={60} />);
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "60");
      });
    });
  });

  context("labelling", () => {
    context("when given none (by default)", () => {
      it("should not render the label", () => {
        cy.mount(<ProductProgressbar labeling="none" value={40} />);
        cy.findByRole("progressbar").should("not.contain.text", "%");
      });
    });

    context("when given right", () => {
      it("should render the label in the right side", () => {
        cy.mount(<ProductProgressbar labeling="right" value={40} />);
        cy.findByRole("progressbar").should(
          "have.css",
          "flex-direction",
          "row"
        );
        cy.findByRole("progressbar").should("contain.text", "40%");
      });
    });

    context("when given left", () => {
      it("should render the label", () => {
        cy.mount(<ProductProgressbar labeling="left" value={75} />);
        cy.findByRole("progressbar").should(
          "have.css",
          "flex-direction",
          "row-reverse"
        );
        cy.findByRole("progressbar").should("contain.text", "75%");
      });
    });
  });

  context("directionTo", () => {
    context("when given right", () => {
      it("should render the progressbar", () => {
        cy.mount(<ProductProgressbar directionTo="right" value={50} />);
        cy.findByRole("progressbar").should("exist");
      });
    });

    context("when given left", () => {
      it("should render the progressbar", () => {
        cy.mount(<ProductProgressbar directionTo="left" value={50} />);
        cy.findByRole("progressbar").should("exist");
      });
    });
  });

  context("value", () => {
    context("when given 50", () => {
      it("should set aria-valuenow to 50", () => {
        cy.mount(<ProductProgressbar value={50} />);
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "50");
      });
    });

    context("when given 0", () => {
      it("should set aria-valuenow to 0", () => {
        cy.mount(<ProductProgressbar value={0} />);
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "0");
      });
    });

    context("when given 100", () => {
      it("should set aria-valuenow to 100", () => {
        cy.mount(<ProductProgressbar value={100} />);
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          "100"
        );
      });
    });

    context("when given value above 100", () => {
      it("should clamp aria-valuenow to 100", () => {
        cy.mount(<ProductProgressbar value={150} />);
        cy.findByRole("progressbar").should(
          "have.attr",
          "aria-valuenow",
          "100"
        );
      });
    });

    context("when given value below 0", () => {
      it("should clamp aria-valuenow to 0", () => {
        cy.mount(<ProductProgressbar value={-20} />);
        cy.findByRole("progressbar").should("have.attr", "aria-valuenow", "0");
      });
    });
  });

  context("styles", () => {
    context("containerStyle", () => {
      context("when given background-color red", () => {
        it("should render background color with rgb(255, 0, 0)", () => {
          cy.mount(
            <ProductProgressbar
              value={50}
              styles={{
                containerStyle: css`
                  background-color: red;
                `,
              }}
            />
          );
          cy.findByRole("progressbar").should(
            "have.css",
            "background-color",
            "rgb(255, 0, 0)"
          );
        });
      });
    });

    context("valueBarStyle", () => {
      context("when given background-color blue", () => {
        it("should render the fill with rgb(0, 0, 255)", () => {
          cy.mount(
            <ProductProgressbar
              value={50}
              styles={{
                valueBarStyle: css`
                  background-color: blue;
                `,
              }}
            />
          );
          cy.findByLabelText("progressbar-fill")

            .should("have.css", "background-color", "rgb(0, 0, 255)");
        });
      });
    });

    context("labelStyle", () => {
      context("when given color green", () => {
        it("should render the label with rgb(0, 128, 0)", () => {
          cy.mount(
            <ProductProgressbar
              value={50}
              labeling="right"
              styles={{
                labelStyle: css`
                  color: green;
                `,
              }}
            />
          );
          cy.findByLabelText("progressbar-label").should(
            "have.css",
            "color",
            "rgb(0, 128, 0)"
          );
        });
      });
    });
  });
});
