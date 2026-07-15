import { css } from "styled-components";
import {
  Trackbar,
  TrackbarProps,
  TrackbarVariant,
} from "../../components/trackbar";

describe("Trackbar", () => {
  function ProductTrackbar(props: Partial<TrackbarProps>) {
    return <Trackbar {...props} />;
  }

  context("id", () => {
    context("when given id", () => {
      it("renders id in the trackbar", () => {
        cy.mount(<ProductTrackbar id="trackbar-coneto" indeterminate={true} />);
        cy.get("#trackbar-coneto").should("exist");
      });
    });
  });

  context("className", () => {
    it("renders the default className", () => {
      cy.mount(<ProductTrackbar indeterminate={true} />);
      cy.get(".coneto-trackbar").should("exist");
    });

    context("when given class test", () => {
      it("renders another class in the element", () => {
        cy.mount(<ProductTrackbar className="test" indeterminate={true} />);
        cy.get(".coneto-trackbar").should("exist");
        cy.get(".test").should("exist");
      });
    });
  });

  context("variant", () => {
    const variantCases: Array<{
      variant: TrackbarVariant;
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
          cy.mount(<ProductTrackbar variant={variant} value={50} />);
        });

        it(`should render the fill with the correct bar color`, () => {
          cy.findByLabelText("trackbar-fill").should(
            "have.css",
            "background-color",
            barColor
          );
        });

        it(`should render the track with the correct track color`, () => {
          cy.findByLabelText("trackbar-track").should(
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
        cy.mount(<ProductTrackbar indeterminate={true} />);
        cy.findByRole("trackbar").should("not.have.attr", "aria-valuenow");
      });

      it("should not render the label even when labeling is right", () => {
        cy.mount(
          <ProductTrackbar indeterminate={true} labeling="right" value={50} />
        );
        cy.findByRole("trackbar").should("not.contain.text", "%");
      });
    });

    context("when given false", () => {
      it("should expose aria-valuenow", () => {
        cy.mount(<ProductTrackbar indeterminate={false} value={60} />);
        cy.findByRole("trackbar").should("have.attr", "aria-valuenow", "60");
      });
    });
  });

  context("labelling", () => {
    context("when given none (by default)", () => {
      it("should not render the label", () => {
        cy.mount(<ProductTrackbar labeling="none" value={40} />);
        cy.findByRole("trackbar").should("not.contain.text", "%");
      });
    });

    context("when given right", () => {
      it("should render the label in the right side", () => {
        cy.mount(<ProductTrackbar labeling="right" value={40} />);
        cy.findByRole("trackbar").should("have.css", "flex-direction", "row");
        cy.findByRole("trackbar").should("contain.text", "40%");
      });
    });

    context("when given left", () => {
      it("should render the label", () => {
        cy.mount(<ProductTrackbar labeling="left" value={75} />);
        cy.findByRole("trackbar").should(
          "have.css",
          "flex-direction",
          "row-reverse"
        );
        cy.findByRole("trackbar").should("contain.text", "75%");
      });
    });
  });

  context("directionTo", () => {
    context("when given right", () => {
      it("should render the trackbar", () => {
        cy.mount(<ProductTrackbar directionTo="right" value={50} />);
        cy.findByRole("trackbar").should("exist");
      });
    });

    context("when given left", () => {
      it("should render the trackbar", () => {
        cy.mount(<ProductTrackbar directionTo="left" value={50} />);
        cy.findByRole("trackbar").should("exist");
      });
    });
  });

  context("value", () => {
    context("when given 50", () => {
      it("should set aria-valuenow to 50", () => {
        cy.mount(<ProductTrackbar value={50} />);
        cy.findByRole("trackbar").should("have.attr", "aria-valuenow", "50");
      });
    });

    context("when given 0", () => {
      it("should set aria-valuenow to 0", () => {
        cy.mount(<ProductTrackbar value={0} />);
        cy.findByRole("trackbar").should("have.attr", "aria-valuenow", "0");
      });
    });

    context("when given 100", () => {
      it("should set aria-valuenow to 100", () => {
        cy.mount(<ProductTrackbar value={100} />);
        cy.findByRole("trackbar").should("have.attr", "aria-valuenow", "100");
      });
    });

    context("when given value above 100", () => {
      it("should clamp aria-valuenow to 100", () => {
        cy.mount(<ProductTrackbar value={150} />);
        cy.findByRole("trackbar").should("have.attr", "aria-valuenow", "100");
      });
    });

    context("when given value below 0", () => {
      it("should clamp aria-valuenow to 0", () => {
        cy.mount(<ProductTrackbar value={-20} />);
        cy.findByRole("trackbar").should("have.attr", "aria-valuenow", "0");
      });
    });
  });

  context("styles", () => {
    context("containerStyle", () => {
      context("when given background-color red", () => {
        it("should render background color with rgb(255, 0, 0)", () => {
          cy.mount(
            <ProductTrackbar
              value={50}
              styles={{
                containerStyle: css`
                  background-color: red;
                `,
              }}
            />
          );
          cy.findByRole("trackbar").should(
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
            <ProductTrackbar
              value={50}
              styles={{
                valueBarStyle: css`
                  background-color: blue;
                `,
              }}
            />
          );
          cy.findByLabelText("trackbar-fill")

            .should("have.css", "background-color", "rgb(0, 0, 255)");
        });
      });
    });

    context("labelStyle", () => {
      context("when given color green", () => {
        it("should render the label with rgb(0, 128, 0)", () => {
          cy.mount(
            <ProductTrackbar
              value={50}
              labeling="right"
              styles={{
                labelStyle: css`
                  color: green;
                `,
              }}
            />
          );
          cy.findByLabelText("trackbar-label").should(
            "have.css",
            "color",
            "rgb(0, 128, 0)"
          );
        });
      });
    });
  });
});
