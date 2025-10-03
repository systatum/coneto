import { getIdContent } from "test/support/commands";

describe("Pagination", () => {
  context("default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-pagination--default"));
    });

    context("arrow button", () => {
      context("when pressing arrow right", () => {
        it("should be move to the next page", () => {
          cy.findAllByLabelText("pagination-button")
            .eq(6)
            .should("be.visible")
            .click();
          cy.findAllByLabelText("pagination-button")
            .eq(1)
            .should("have.css", "border", "1px solid rgb(243, 244, 246)");
          cy.findAllByLabelText("pagination-button")
            .eq(2)
            .should("have.css", "border", "1px solid rgb(97, 169, 249)");
        });
      });

      context("when disabled", () => {
        it("shouldn't pressing ", () => {
          cy.findAllByLabelText("pagination-button")
            .eq(0)
            .should("be.visible")
            .click({ force: true });
          cy.findAllByLabelText("pagination-button")
            .eq(0)
            .should("have.css", "border", "1px solid rgb(243, 244, 246)")
            .and("have.css", "opacity", "0.3");
          cy.findAllByLabelText("pagination-button")
            .eq(1)
            .should("have.css", "border", "1px solid rgb(97, 169, 249)");
        });
      });
    });

    context("when active", () => {
      it("should have blue border color", () => {
        cy.findAllByLabelText("pagination-button")
          .eq(1)
          .should("have.css", "border", "1px solid rgb(97, 169, 249)");
        cy.findAllByLabelText("pagination-button")
          .eq(2)
          .should("have.css", "border", "1px solid rgb(243, 244, 246)");

        cy.findAllByLabelText("pagination-button")
          .eq(6)
          .should("be.visible")
          .click();

        cy.findAllByLabelText("pagination-button")
          .eq(1)
          .should("have.css", "border", "1px solid rgb(243, 244, 246)");
        cy.findAllByLabelText("pagination-button")
          .eq(2)
          .should("have.css", "border", "1px solid rgb(97, 169, 249)");
      });
    });
  });

  context("over five pages", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-pagination--over-five-page"));
    });
    context("combobox", () => {
      context("when selected", () => {
        it("should be select page", () => {
          cy.findByPlaceholderText("1").click();
          cy.findByRole("listbox").scrollTo("bottom", {
            duration: 1000,
          });
          cy.findByText("46").click();
          cy.findByPlaceholderText("1").should(
            "have.css",
            "border",
            "1px solid rgb(97, 169, 249)"
          );
        });
      });

      context("when pressing not include number", () => {
        it("shouldn't have active style", () => {
          cy.findByPlaceholderText("1").click();
          cy.findByRole("listbox").scrollTo("bottom", {
            duration: 1000,
          });
          cy.findByText("46").click();
          cy.findByPlaceholderText("1").should(
            "have.css",
            "border",
            "1px solid rgb(97, 169, 249)"
          );
          cy.findByText("49").click();
          cy.findByPlaceholderText("1").should(
            "have.css",
            "border",
            "1px solid rgb(243, 244, 246)"
          );
        });
      });
    });

    context("when pressing button", () => {
      it("should be select page", () => {
        cy.findByText("49").click();
        cy.findByText("50").click();
        cy.findAllByLabelText("pagination-button")
          .eq(3)
          .should("have.css", "border", "1px solid rgb(97, 169, 249)");
      });
    });
  });
});
