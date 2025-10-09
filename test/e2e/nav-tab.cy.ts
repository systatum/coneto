import { getIdContent } from "test/support/commands";

describe("NavTab", () => {
  context("when default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-navtab--default"));
    });

    context("when pressing tab", () => {
      it("should move to another tab", () => {
        cy.contains("Review").should("exist");

        cy.findByRole("tab", { name: /Write/i }).click();
        cy.contains("Write").should("exist");
        cy.findByRole("textbox").type("This is a test comment");
        cy.findByRole("textbox").should("have.value", "This is a test comment");
      });
    });

    context("when given onClick", () => {
      context("when pressing tab", () => {
        it("should work and move to another tab", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });
          cy.contains("Review").should("exist");

          cy.findByRole("tab", { name: /Write/i }).click();

          cy.contains("Write").should("exist");
          cy.findByRole("textbox").type("This is a test comment");
          cy.findByRole("textbox").should(
            "have.value",
            "This is a test comment"
          );

          cy.get("@consoleLog").should("have.been.calledWith", "test tab 1");
        });
      });
    });
  });
});
