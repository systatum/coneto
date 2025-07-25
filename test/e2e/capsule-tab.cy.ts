import { getIdContent } from "test/support/commands";

describe("CapsuleTab Component", () => {
  beforeEach(() => {
    cy.visit(getIdContent("stage-capsuletab--default"));
  });

  it("Default switches to Write tab and types in the textbox", () => {
    cy.contains("Review Tab").should("exist");

    cy.findByRole("tab", { name: /Write/i }).click();

    cy.contains("Write Tab").should("exist");

    cy.findByRole("textbox").type("This is a test comment");

    cy.findByRole("textbox").should("have.value", "This is a test comment");
  });
});
