import { getIdContent } from "test/support/commands";

describe("Tooltip", () => {
  context("link", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-tooltip--link"));
    });

    context("hover tooltip", () => {
      it("should appear and have underline on hover", () => {
        cy.contains("Hover Tooltip")
          .trigger("mouseover")
          .trigger("mousemove", { clientX: 10, clientY: 10 });

        cy.contains("Hover Tooltip")
          .parent()
          .should("have.css", "text-decoration-line", "underline");
        cy.contains("This tooltip appears on hover").should("be.visible");

        cy.contains("Hover Tooltip").trigger("mouseout", { force: true });
        cy.contains("This tooltip appears on hover").should("not.exist");
      });
    });

    context("click tooltip", () => {
      it("should toggle visibility and have correct colors", () => {
        cy.contains("Click Tooltip")
          .click()
          .should("have.css", "color", "rgb(37, 99, 235)");

        cy.contains("This tooltip appears on click")
          .should("be.visible")
          .and("have.css", "background-color", "rgb(37, 99, 235)");

        cy.contains("Click Tooltip").click();
        cy.contains("This tooltip appears on click").should("not.exist");
      });
    });

    context("styled tooltip", () => {
      it("should show on hover with custom styling", () => {
        cy.contains("Styled Tooltip")
          .trigger("mouseover")
          .trigger("mousemove", { clientX: 10, clientY: 10 })
          .parent()
          .should("have.css", "text-decoration-line", "underline");

        cy.contains("Tooltip with custom styling")
          .should("be.visible")
          .and("have.css", "background-color", "rgb(21, 128, 61)")
          .and("have.css", "color", "rgb(255, 255, 255)");

        cy.contains("Styled Tooltip").trigger("mouseout", { force: true });
        cy.contains("Tooltip with custom styling").should("not.exist");
      });
    });

    context("dotted underline tooltip", () => {
      it("should show on hover with dotted underline", () => {
        cy.contains("Dotted Underline Tooltip")
          .trigger("mouseover")
          .trigger("mousemove", { clientX: 10, clientY: 10 });

        cy.contains("Tooltip with dotted underline trigger")
          .should("be.visible")
          .and("have.css", "background-color", "rgb(31, 41, 55)")
          .and("have.css", "color", "rgb(255, 255, 255)");

        cy.contains("Dotted Underline Tooltip").trigger("mouseout", {
          force: true,
        });
        cy.contains("Tooltip with dotted underline trigger").should(
          "not.exist"
        );
      });
    });

    context("no underline tooltip", () => {
      it("should show on hover with correct background", () => {
        cy.contains("No Underline Tooltip")
          .trigger("mouseover")
          .trigger("mousemove", { clientX: 10, clientY: 10 });

        cy.contains("Trigger text without underline")
          .should("be.visible")
          .and("have.css", "background-color", "rgb(220, 38, 38)")
          .and("have.css", "color", "rgb(255, 255, 255)");

        cy.contains("No Underline Tooltip").trigger("mouseout", {
          force: true,
        });
        cy.contains("Trigger text without underline").should("not.exist");
      });
    });

    context("blue underline tooltip", () => {
      it("should open on click with blue background", () => {
        cy.contains("Blue Underline Tooltip").click();

        cy.contains("Clicked tooltip with blue underline")
          .should("be.visible")
          .and("have.css", "background-color", "rgb(29, 78, 216)")
          .and("have.css", "color", "rgb(255, 255, 255)");

        cy.contains("Blue Underline Tooltip").click();
        cy.contains("Clicked tooltip with blue underline").should("not.exist");
      });
    });
  });

  context("with form tooltip", () => {
    it("should open on click and accept input", () => {
      cy.visit(getIdContent("content-tooltip--with-form"));

      cy.contains("New Division").click();

      cy.findByRole("textbox")
        .should("be.visible")
        .type("Hello there, this is custom tooltip");

      cy.findByDisplayValue("Hello there, this is custom tooltip").should(
        "exist"
      );
    });
  });
});
