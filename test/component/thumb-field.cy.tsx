import { css } from "styled-components";
import { ThumbField } from "./../../components/thumb-field";

describe("ThumbField", () => {
  describe("thumbText", () => {
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
