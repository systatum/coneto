import { Button } from "./../../components/button";
import {
  createTheme,
  createBodyTheme,
  createButtonTheme,
  darkButton,
  getRegistry,
} from "./../../theme";

const bodyTheme = {
  backgroundColor: "#fdebce",
  textColor: "#1a1008",
  borderColor: "#6b4c2a",
};

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

  context("createTheme", () => {
    context("when registering a custom theme", () => {
      beforeEach(() => {
        createTheme("parchment", "dark", {
          body: createBodyTheme(bodyTheme),
          button: createButtonTheme(bodyTheme, darkButton, {
            default: {
              backgroundColor: "red",
            },
          }),
        });
        cy.wait(400);
      });

      it("should render the newly registered theme", () => {
        cy.mount(<Button>Test</Button>, { mode: "parchment" });

        cy.wait(400);

        cy.get("body").should(
          "have.css",
          "background-color",
          "rgb(253, 235, 206)"
        );
      });

      context("when inheriting from the dark base theme", () => {
        it("should preserve the base variant styles", () => {
          cy.mount(<Button variant="primary">Test</Button>, {
            mode: "parchment",
          });

          cy.wait(400);

          cy.findByRole("button").should(
            "have.css",
            "background-color",
            "rgb(60, 49, 110)"
          );
        });

        context("when overriding a specific variant", () => {
          it("should apply the override only to the targeted variant", () => {
            cy.mount(
              <>
                <Button variant="primary">Primary</Button>
                <Button variant="default">Default</Button>
              </>,
              { mode: "parchment" }
            );

            cy.wait(400);

            cy.findAllByRole("button")
              .eq(0)
              .should("have.css", "background-color", "rgb(60, 49, 110)");
            cy.findAllByRole("button")
              .eq(1)
              .should("have.css", "background-color", "rgb(255, 0, 0)");
          });
        });
      });
    });
  });
});
