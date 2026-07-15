import { css } from "styled-components";
import {
  Trackbar,
  TrackbarProps,
  TrackbarVariant,
} from "../../components/trackbar";
import { useState } from "react";

describe("Trackbar", () => {
  function ProductTrackbar(props: Partial<TrackbarProps>) {
    const [value, setValue] = useState(0);
    const onChange = cy.stub().as("onChange");

    return (
      <Trackbar
        value={value}
        onChange={(value) => {
          setValue(value);
          onChange(value);
        }}
        {...props}
      />
    );
  }

  context("labels", () => {
    context("renderLabel()", () => {
      context("when given percentage, value, and maxValue", () => {
        it("renders the label with ", () => {
          cy.mount(
            <ProductTrackbar
              value={40}
              maxValue={80}
              valueLabelPosition="right"
              labels={{
                renderLabel: ({ percentage, value, maxValue }) =>
                  `${value}/${maxValue} = ${percentage}%`,
              }}
            />
          );

          cy.findByLabelText("trackbar-label").should(
            "have.text",
            "40/80 = 50%"
          );
        });
      });
    });
  });

  context("containerColor", () => {
    context("when given red color", () => {
      it("renders the track with rgb(255, 0, 0)", () => {
        cy.mount(<ProductTrackbar containerColor="red" />);
        cy.findByLabelText("trackbar-track").should(
          "have.css",
          "background-color",
          "rgb(255, 0, 0)"
        );
      });

      context("when given editable", () => {
        it("renders the thumb with box-shadow rgb(255, 0, 0)", () => {
          cy.mount(<ProductTrackbar containerColor="red" editable />);
          cy.findByLabelText("trackbar-thumb").should(
            "have.css",
            "box-shadow",
            "rgb(255, 0, 0) 0px 0px 0px 2px, rgba(0, 0, 0, 0.3) 0px 1px 3px 0px"
          );
        });
      });
    });
  });

  context("fillColor", () => {
    context("when given red color", () => {
      it("renders the fill with rgb(255, 0, 0)", () => {
        cy.mount(<ProductTrackbar fillColor="red" />);
        cy.findByLabelText("trackbar-fill").should(
          "have.css",
          "background-color",
          "rgb(255, 0, 0)"
        );
      });

      context("when given editable", () => {
        it("renders the thumb with rgb(255, 0, 0)", () => {
          cy.mount(<ProductTrackbar fillColor="red" editable />);
          cy.findByLabelText("trackbar-thumb").should(
            "have.css",
            "background-color",
            "rgb(255, 0, 0)"
          );
        });
      });
    });
  });

  context("maxValue", () => {
    context("when given 200", () => {
      it("should render aria-valuemax with 200", () => {
        cy.mount(
          <ProductTrackbar valueLabelPosition="right" maxValue={200} editable />
        );
        cy.findByLabelText("trackbar-thumb").should("exist");

        cy.findByRole("trackbar").should("have.attr", "aria-valuemax", "200");
      });

      context("when given value 100", () => {
        it("should render with 50% if label is provided", () => {
          cy.mount(
            <ProductTrackbar
              valueLabelPosition="right"
              value={100}
              maxValue={200}
              editable
            />
          );
          cy.findByLabelText("trackbar-thumb").should("exist");

          cy.findByRole("trackbar")
            .should("have.attr", "aria-valuemax", "200")
            .and("have.attr", "aria-valuenow", "100");

          cy.findByText("50%");
        });
      });
    });

    context("when given minus value", () => {
      it("should render with 1 for maximize", () => {
        cy.mount(
          <ProductTrackbar valueLabelPosition="right" maxValue={-1} editable />
        );
        cy.findByLabelText("trackbar-thumb").should("exist");

        cy.findByRole("trackbar").should("have.attr", "aria-valuemax", "1");
      });
    });
  });

  context("editable", () => {
    context("when given true", () => {
      it("shows the drag indicator (thumb)", () => {
        cy.mount(<ProductTrackbar editable />);
        cy.findByLabelText("trackbar-thumb").should("exist");
      });

      it("renders the thumb with touch-action: none", () => {
        cy.mount(<ProductTrackbar editable />);
        cy.findByLabelText("trackbar-thumb").should(
          "have.css",
          "touch-action",
          "none"
        );
      });

      context("when given indeterminate", () => {
        it("still not broke the editable", () => {
          cy.mount(<ProductTrackbar editable indeterminate />);
          cy.findByLabelText("trackbar-thumb").should("exist");
        });
      });

      context("when drag the indicator", () => {
        it("give the callback for onChanges", () => {
          cy.mount(<ProductTrackbar editable />);
          cy.findByLabelText("trackbar-thumb").trigger("pointerdown", {
            clientX: 50,
            clientY: 10,
          });

          cy.window().trigger("pointermove", {
            clientX: 120,
            clientY: 10,
          });

          cy.window().trigger("pointerup");

          cy.get("@onChange").should((stub: any) => {
            expect(stub.callCount).to.be.greaterThan(0);
          });
        });
      });
    });
  });

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

      it("should not render the label even when valueLabelPosition is right", () => {
        cy.mount(
          <ProductTrackbar
            indeterminate={true}
            valueLabelPosition="right"
            value={50}
          />
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

  context("valueLabelPosition", () => {
    context("when given none (by default)", () => {
      it("should not render the label", () => {
        cy.mount(<ProductTrackbar valueLabelPosition="none" value={40} />);
        cy.findByRole("trackbar").should("not.contain.text", "%");
      });
    });

    context("when given right", () => {
      it("should render the label in the right side", () => {
        cy.mount(<ProductTrackbar valueLabelPosition="right" value={40} />);
        cy.findByRole("trackbar").should("have.css", "flex-direction", "row");
        cy.findByRole("trackbar").should("contain.text", "40%");
      });
    });

    context("when given left", () => {
      it("should render the label", () => {
        cy.mount(<ProductTrackbar valueLabelPosition="left" value={75} />);
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
              valueLabelPosition="right"
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
