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
        renderLabel
        {...props}
      />
    );
  }

  context("renderLabel", () => {
    context("when given true", () => {
      it("render the label", () => {
        cy.mount(<ProductRating renderLabel />);

        cy.findByLabelText("rating-label").should("have.text", "4.5 / 5");
      });
    });

    context("when given false", () => {
      it("not render the label", () => {
        cy.mount(<ProductRating renderLabel={false} />);

        cy.findByLabelText("rating-label").should("not.exist");
      });
    });

    context("when given string function", () => {
      it("render the label", () => {
        cy.mount(
          <ProductRating
            renderLabel={({ value, maxValue }) => `${value} out of ${maxValue}`}
          />
        );

        cy.findByLabelText("rating-label").should("have.text", "4.5 out of 5");
      });
    });

    context("when given reactnode function", () => {
      it("render the react element", () => {
        cy.mount(
          <ProductRating
            renderLabel={({ value, maxValue }) => (
              <span aria-label="test-label">
                {value} out of {maxValue}
              </span>
            )}
          />
        );

        cy.findByLabelText("test-label")
          .should("exist")
          .and("have.text", "4.5 out of 5");
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
