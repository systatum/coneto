import { css } from "styled-components";
import { ThumbField } from "./../../components/thumb-field";

describe("ThumbField", () => {
  context("events", () => {
    context("onClick", () => {
      context("when clicking the thumb field", () => {
        it("should call the click handler", () => {
          const onClick = cy.stub().as("onClick");

          cy.mount(<ThumbField aria-label="thumb-field" onClick={onClick} />);

          cy.findByLabelText("thumb-field").click();

          cy.get("@onClick").should("have.been.calledOnce");
        });
      });
    });

    context("onMouseDown", () => {
      context("when pressing the mouse button on the thumb field", () => {
        it("should call the mouse down handler", () => {
          const onMouseDown = cy.stub().as("onMouseDown");

          cy.mount(
            <ThumbField aria-label="thumb-field" onMouseDown={onMouseDown} />
          );

          cy.findByLabelText("thumb-field").trigger("mousedown");
          cy.wait(200);

          cy.get("@onMouseDown").should("have.been.calledOnce");
        });
      });
    });

    context("onMouseUp", () => {
      context("when releasing the mouse button on the thumb field", () => {
        it("should call the mouse up handler", () => {
          const onMouseUp = cy.stub().as("onMouseUp");

          cy.mount(
            <ThumbField aria-label="thumb-field" onMouseUp={onMouseUp} />
          );

          cy.findByLabelText("thumb-field").trigger("mouseup");

          cy.get("@onMouseUp").should("have.been.calledOnce");
        });
      });
    });

    context("onMouseEnter", () => {
      context("when hovering over the thumb field", () => {
        it("should call the mouse enter handler", () => {
          const onMouseEnter = cy.stub().as("onMouseEnter");

          cy.mount(
            <ThumbField aria-label="thumb-field" onMouseEnter={onMouseEnter} />
          );

          cy.findByLabelText("thumb-field").realHover();

          cy.get("@onMouseEnter").should("have.been.calledOnce");
        });
      });
    });

    context("onMouseLeave", () => {
      context("when moving the cursor away from the thumb field", () => {
        it("should call the mouse leave handler", () => {
          const onMouseLeave = cy.stub().as("onMouseLeave");

          cy.mount(
            <ThumbField aria-label="thumb-field" onMouseLeave={onMouseLeave} />
          );

          cy.findByLabelText("thumb-field").realHover();
          cy.findByLabelText("thumb-field").trigger("mouseleave");

          cy.get("@onMouseLeave").should("have.been.calledOnce");
        });
      });
    });
  });

  context("thumbText", () => {
    context("when given text for both thumbs", () => {
      it("renders the up and down text", () => {
        cy.mount(
          <ThumbField
            thumbText={{
              up: "Like",
              down: "Dislike",
            }}
          />
        );

        cy.contains("Like").should("exist");
        cy.contains("Dislike").should("exist");
      });
    });

    context("when given only up text", () => {
      it("renders only the up text", () => {
        cy.mount(
          <ThumbField
            thumbText={{
              up: "Like",
            }}
          />
        );

        cy.contains("Like").should("exist");
        cy.contains("Dislike").should("not.exist");
      });
    });

    context("when given only down text", () => {
      it("renders only the down text", () => {
        cy.mount(
          <ThumbField
            thumbText={{
              down: "Dislike",
            }}
          />
        );

        cy.contains("Like").should("not.exist");
        cy.contains("Dislike").should("exist");
      });
    });

    context("when not given", () => {
      it("does not render any thumb text", () => {
        cy.mount(<ThumbField />);

        cy.contains("Like").should("not.exist");
        cy.contains("Dislike").should("not.exist");
      });
    });
  });

  context("styles", () => {
    context("triggerWrapperStyle", () => {
      context("when given red background color", () => {
        it("renders background with rgb(255, 0, 0)", () => {
          cy.mount(
            <ThumbField
              styles={{
                triggerWrapperStyle: css`
                  background: rgb(255, 0, 0);
                `,
              }}
            />
          );

          cy.findByLabelText("thumb-field").should(
            "have.css",
            "background-color",
            "rgb(255, 0, 0)"
          );
        });
      });
    });

    context("triggerUpStyle", () => {
      context("when given green background color", () => {
        it("renders background with rgb(0, 128, 0)", () => {
          cy.mount(
            <ThumbField
              styles={{
                triggerUpStyle: css`
                  background: rgb(0, 128, 0);
                `,
              }}
            />
          );

          cy.findByLabelText("thumb-up").should(
            "have.css",
            "background-color",
            "rgb(0, 128, 0)"
          );
        });
      });
    });

    context("triggerDownStyle", () => {
      context("when given blue background color", () => {
        it("renders background with rgb(0, 0, 255)", () => {
          cy.mount(
            <ThumbField
              styles={{
                triggerDownStyle: css`
                  background: rgb(0, 0, 255);
                `,
              }}
            />
          );

          cy.findByLabelText("thumb-down").should(
            "have.css",
            "background-color",
            "rgb(0, 0, 255)"
          );
        });
      });
    });

    context("thumbUpTextStyle", () => {
      context("when given red text color", () => {
        it("renders text with rgb(255, 0, 0)", () => {
          cy.mount(
            <ThumbField
              thumbText={{
                up: "Like",
              }}
              styles={{
                thumbUpTextStyle: css`
                  color: rgb(255, 0, 0);
                `,
              }}
            />
          );

          cy.findByLabelText("thumb-up-text").should(
            "have.css",
            "color",
            "rgb(255, 0, 0)"
          );
        });
      });
    });

    context("thumbDownTextStyle", () => {
      context("when given blue text color", () => {
        it("renders text with rgb(0, 0, 255)", () => {
          cy.mount(
            <ThumbField
              thumbText={{
                down: "Dislike",
              }}
              styles={{
                thumbDownTextStyle: css`
                  color: rgb(0, 0, 255);
                `,
              }}
            />
          );

          cy.findByLabelText("thumb-down-text").should(
            "have.css",
            "color",
            "rgb(0, 0, 255)"
          );
        });
      });
    });
  });
});
