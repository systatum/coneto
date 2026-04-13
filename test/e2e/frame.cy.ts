import { getIdContent } from "test/support/commands";

describe("Frame", () => {
  context("Default", () => {
    it("Renders inner content", () => {
      cy.visit(getIdContent("stage-frame--default"));
      cy.contains("This is inside the frame.").should("exist");
    });
  });

  context("With Title", () => {
    it("Renders title and content", () => {
      cy.visit(getIdContent("stage-frame--with-title"));
      cy.contains("Frame Title").should("exist");
      cy.contains("This frame has a title.").should("exist");
    });
  });
});
