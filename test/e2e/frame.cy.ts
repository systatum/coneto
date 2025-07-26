import { getIdContent } from "test/support/commands";

context("Frame Component", () => {
  describe("Default", () => {
    it("Renders inner content", () => {
      cy.visit(getIdContent("stage-frame--default"));
      cy.contains("This is inside the frame.").should("exist");
    });
  });

  describe("With Title", () => {
    it("Renders title and content", () => {
      cy.visit(getIdContent("stage-frame--with-title"));
      cy.contains("Frame Title").should("exist");
      cy.contains("This frame has a title.").should("exist");
    });
  });

  describe("Custom", () => {
    it("Renders custom title and background", () => {
      cy.visit(getIdContent("stage-frame--custom"));
      cy.contains("Frame w/ Class").should("exist");
      cy.contains("This frame has a custom background color.").should("exist");
    });
  });
});
