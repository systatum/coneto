import { getIdContent } from "test/support/commands";

describe("Moneybox", () => {
  context("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-moneybox--dollar"));
    });

    context("when pressing number", () => {
      it("should renders the number value", () => {
        cy.get('input[name="value"]').clear().type("3500");
        cy.get('input[name="value"]').should("have.value", "3500");
      });
    });
  });

  context("Error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-moneybox--error-state"));
    });

    context("when pressing value does not meet the minimum requirement", () => {
      it("shows a validation error", () => {
        cy.get('input[name="value"]').clear().type("123");
        cy.contains("Minimum numbers 4 digit are allowed").should("exist");
      });

      context("when pressing value satisfies the requirement", () => {
        it("removes the validation error", () => {
          cy.get('input[name="value"]').clear().type("123");
          cy.contains("Minimum numbers 4 digit are allowed").should("exist");

          cy.get('input[name="value"]').clear().type("12345");
          cy.contains("Minimum numbers 4 digit are allowed").should(
            "not.exist"
          );
        });
      });
    });
  });
});
