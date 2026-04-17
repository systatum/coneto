import { Button } from "./../../components/button";

describe("ThemeProvider", () => {
  context("when using cy.mount (with provider)", () => {
    it("should apply with theme", () => {
      cy.mount(<Button aria-label="test-button">Test Button</Button>);
      cy.findByLabelText("test-button").should(
        "have.css",
        "background-color",
        "rgb(221, 221, 221)"
      );
    });

    context("when given dark mode", () => {
      it("renders default button in dark mode (rgb(47, 47, 47))", () => {
        cy.mount(<Button aria-label="test-button">Test Button</Button>, {
          mode: "dark",
        });
        cy.findByLabelText("test-button").should(
          "have.css",
          "background-color",
          "rgb(47, 47, 47)"
        );
      });
    });
  });

  context("when using cy.mountWithoutTheme", () => {
    it("still renders element with light theme", () => {
      cy.mountWithoutTheme(
        <Button aria-label="test-button">Test Button</Button>
      );
      cy.findByLabelText("test-button").should(
        "have.css",
        "background-color",
        "rgb(221, 221, 221)"
      );
    });
  });
});
