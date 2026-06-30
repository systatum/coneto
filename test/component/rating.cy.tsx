import { useState } from "react";
import { Rating, RatingProps } from "./../../components/rating";
import { css } from "styled-components";

describe("Rating", () => {
  function ProductRating(props?: RatingProps) {
    const [value, setValue] = useState("4.5");

    return (
      <Rating
        editable
        rating={value}
        onChange={(e) => setValue(e.target.value)}
        withLabel
        {...props}
      />
    );
  }

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
