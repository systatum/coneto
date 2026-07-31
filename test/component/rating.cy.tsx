import { useState } from "react";
import {
  Rating,
  RatingProps,
  RatingScoreLabelPosition,
} from "./../../components/rating";
import { css } from "styled-components";

describe("Rating", () => {
  function ProductRating(props?: RatingProps) {
    const [value, setValue] = useState("4.5");

    return (
      <Rating
        rating={value}
        onChange={(e) => setValue(e.target.value)}
        scoreLabel={{
          text: "4.5",
        }}
        {...props}
      />
    );
  }

  context("scoreLabel", () => {
    context("with given empty object", () => {
      it("not render the label", () => {
        cy.mount(<ProductRating scoreLabel={{}} />);

        cy.findByLabelText("rating-label").should("not.exist");
      });
    });

    context("text", () => {
      context("with empty string", () => {
        it("not render label", () => {
          cy.mount(
            <ProductRating
              scoreLabel={{
                text: "",
              }}
            />
          );

          cy.findByLabelText("rating-label").should("not.exist");
        });
      });

      context("with string", () => {
        it("render the label", () => {
          cy.mount(
            <ProductRating
              scoreLabel={{
                text: "4.5 / 5",
              }}
            />
          );

          cy.findByLabelText("rating-label").should("have.text", "4.5 / 5");
        });
      });

      context("with reactnode", () => {
        it("render the label with element", () => {
          cy.mount(
            <ProductRating
              scoreLabel={{
                text: <span aria-label="test-label">4.5 / 5</span>,
              }}
            />
          );

          cy.findByLabelText("test-label")
            .should("exist")
            .should("have.text", "4.5 / 5");
        });
      });

      context("with function reactnode", () => {
        it("render the react element", () => {
          cy.mount(
            <ProductRating
              scoreLabel={{
                text: ({ value, maxValue }) => (
                  <span aria-label="test-label">
                    {value} out of {maxValue}
                  </span>
                ),
              }}
            />
          );

          cy.findByLabelText("test-label")
            .should("exist")
            .and("have.text", "4.5 out of 5");
        });
      });
    });

    context("position", () => {
      context("when given bottom", () => {
        it("render the label below the rating", () => {
          cy.mount(
            <ProductRating
              scoreLabel={{
                text: "4.5 / 5",
                position: RatingScoreLabelPosition.Bottom,
              }}
            />
          );

          cy.findByLabelText("rating-wrapper").should(
            "have.css",
            "flex-direction",
            "column"
          );
        });
      });

      context("when given top", () => {
        it("render the label above the rating", () => {
          cy.mount(
            <ProductRating
              scoreLabel={{
                text: "4.5 / 5",
                position: RatingScoreLabelPosition.Top,
              }}
            />
          );

          cy.findByLabelText("rating-wrapper").should(
            "have.css",
            "flex-direction",
            "column-reverse"
          );
        });
      });

      context("when given left", () => {
        it("render the label on the left of the rating", () => {
          cy.mount(
            <ProductRating
              scoreLabel={{
                text: "4.5 / 5",
                position: RatingScoreLabelPosition.Left,
              }}
            />
          );

          cy.findByLabelText("rating-wrapper").should(
            "have.css",
            "flex-direction",
            "row-reverse"
          );
        });
      });

      context("when given right", () => {
        it("render the label on the right of the rating", () => {
          cy.mount(
            <ProductRating
              scoreLabel={{
                text: "4.5 / 5",
                position: RatingScoreLabelPosition.Right,
              }}
            />
          );

          cy.findByLabelText("rating-wrapper").should(
            "have.css",
            "flex-direction",
            "row"
          );
        });
      });
    });
  });

  context("styles", () => {
    context("ratingWrapperStyle", () => {
      context("when given gap 10px", () => {
        it("renders gap 10px between stars and label", () => {
          cy.mount(
            <ProductRating
              styles={{
                ratingWrapperStyle: css`
                  gap: 10px;
                `,
              }}
            />
          );

          cy.findByLabelText("rating-wrapper").should(
            "have.css",
            "gap",
            "10px"
          );
        });
      });
    });

    context("starsWrapperStyle", () => {
      context("when given gap 10px", () => {
        it("renders gap 10px between stars", () => {
          cy.mount(
            <ProductRating
              styles={{
                starsWrapperStyle: css`
                  gap: 10px;
                `,
              }}
            />
          );

          cy.findByLabelText("rating-stars-wrapper").should(
            "have.css",
            "gap",
            "10px"
          );
        });
      });
    });

    context("ratingLabelStyle", () => {
      context("when given font-size 30px", () => {
        it("renders font-size with 30px", () => {
          cy.mount(
            <ProductRating
              styles={{
                ratingLabelStyle: css`
                  font-size: 30px;
                `,
              }}
            />
          );

          cy.findByLabelText("rating-label").should(
            "have.css",
            "font-size",
            "30px"
          );
        });
      });
    });
  });
});
