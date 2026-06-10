import { Button } from "./../../components/button";
import {
  Flippable,
  FlippableProps,
  FlippableRef,
} from "./../../components/flippable";
import { useRef } from "react";

describe("Flippable", () => {
  function ProductFlippable(props?: FlippableProps) {
    const ref = useRef<FlippableRef>(null);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Flippable back="back" {...props} ref={ref}>
          {props?.children ?? "front"}
        </Flippable>
        <div style={{ display: "flex", gap: "4px" }}>
          <Button onClick={() => ref.current?.flip()}>Show back</Button>
          <Button onClick={() => ref.current?.unFlip()}>Show front</Button>
          <Button onClick={() => ref.current?.toggle()}>Toggle</Button>
        </div>
      </div>
    );
  }

  context("id", () => {
    context("when given with systatum-will-success", () => {
      it("should renders id with name systatum-will-success", () => {
        cy.mount(<ProductFlippable id="systatum-will-success" />);

        cy.get("#systatum-will-success").should("exist");
      });
    });
  });

  context("flipDuration", () => {
    it("should apply transition duration", () => {
      cy.mount(<ProductFlippable flipDuration={2} />);

      cy.findByLabelText("flippable").should(
        "have.css",
        "transition-duration",
        "2s"
      );
    });
  });

  context("width", () => {
    context("when given string", () => {
      it("should render with width 500px", () => {
        cy.mount(<ProductFlippable width="500px" />);

        cy.findByLabelText("flippable").should("have.css", "width", "500px");
      });
    });

    context("when given number", () => {
      it("should render with width 500px", () => {
        cy.mount(<ProductFlippable width={500} />);

        cy.findByLabelText("flippable").should("have.css", "width", "500px");
      });
    });
  });

  context("height", () => {
    context("when given string", () => {
      it("should render with height 500px", () => {
        cy.mount(<ProductFlippable height="500px" />);

        cy.findByLabelText("flippable").should("have.css", "height", "500px");
      });
    });

    context("when given number", () => {
      it("should render withht 500px", () => {
        cy.mount(<ProductFlippable height={500} />);

        cy.findByLabelText("flippable").should("have.css", "height", "500px");
      });
    });
  });

  context("children", () => {
    it("should render the front content", () => {
      cy.mount(<ProductFlippable>front-content</ProductFlippable>);

      cy.contains("front-content").should("exist");
    });
  });

  context("back", () => {
    it("should render the back content", () => {
      cy.mount(<ProductFlippable back="back-content" />);

      cy.contains("back-content").should("exist");
    });
  });

  context("onFlip", () => {
    it("should call onFlip(true) when opened", () => {
      const onFlip = cy.stub().as("onFlip");

      cy.mount(<ProductFlippable onFlip={onFlip} />);

      cy.findByText("Show back").click();

      cy.get("@onFlip").should("have.been.calledWith", true);
    });

    it("should call onFlip(false) when closed", () => {
      const onFlip = cy.stub().as("onFlip");

      cy.mount(<ProductFlippable onFlip={onFlip} />);

      cy.findByText("Show back").click();
      cy.findByText("Show front").click();

      cy.get("@onFlip").should("have.been.calledWith", false);
    });
  });

  context("ref", () => {
    context("flip()", () => {
      context("when clicking", () => {
        it("should show the back face", () => {
          cy.mount(<ProductFlippable />);

          cy.findByText("Show back").click();

          cy.findByLabelText("flippable").should("have.css", "transform");
        });
      });
    });

    context("unFlip()", () => {
      context("when clicking after opened the back", () => {
        it("should return to the front face", () => {
          cy.mount(<ProductFlippable />);

          cy.findByText("Show back").click();
          cy.findByText("Show front").click();

          cy.findByLabelText("flippable").should(
            "have.attr",
            "aria-label",
            "flippable"
          );
        });
      });
    });

    context("toggle()", () => {
      it("should toggle between front and back", () => {
        cy.mount(<ProductFlippable />);

        cy.findByText("Toggle").click();

        cy.findByLabelText("flippable")
          .invoke("css", "transform")
          .should("not.equal", "none");
      });
    });
  });

  context("styles", () => {
    context("self", () => {
      context("when given height and width 500x500", () => {
        it("should render custom styles", () => {
          cy.mount(
            <ProductFlippable
              styles={{
                self: {
                  width: "500px",
                  height: "500px",
                },
              }}
            />
          );

          cy.findByLabelText("flippable")
            .should("have.css", "width", "500px")
            .and("have.css", "height", "500px");
        });
      });
    });

    context("backStyle", () => {
      context("when given backgroundColor red", () => {
        it("should render with rgb(255, 0, 0)", () => {
          cy.mount(
            <ProductFlippable
              styles={{
                backStyle: {
                  backgroundColor: "red",
                },
              }}
            />
          );

          cy.findByText("Toggle").click();

          cy.findByLabelText("flippable-back-face").should(
            "have.css",
            "background-color",
            "rgb(255, 0, 0)"
          );
        });
      });
    });

    context("frontStyle", () => {
      context("when given backgroundColor red", () => {
        it("should render with rgb(255, 0, 0)", () => {
          cy.mount(
            <ProductFlippable
              styles={{
                frontStyle: {
                  backgroundColor: "red",
                },
              }}
            />
          );

          cy.findByLabelText("flippable-front-face").should(
            "have.css",
            "background-color",
            "rgb(255, 0, 0)"
          );
        });
      });
    });
  });
});
