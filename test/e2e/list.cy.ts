import { getIdContent } from "test/support/commands";

context("List Component", () => {
  describe("Default", () => {
    it("Should render list items", () => {
      cy.visit(getIdContent("content-list--default"));
      cy.contains("Home").should("exist");
      cy.contains("View your profile").should("exist");
    });
  });

  describe("With Search", () => {
    it("Should filter items by search input", () => {
      cy.visit(getIdContent("content-list--with-search"));
      cy.get("[data-testid='textbox-search']").type("settings");
      cy.contains("Adjust preferences").should("exist");
      cy.contains("Home").should("not.exist");
    });
  });

  describe("Wit Group", () => {
    it("Should render grouped sections", () => {
      cy.visit(getIdContent("content-list--with-group"));
      cy.contains("Recent Content").should("exist");
      cy.contains("Messages").should("exist");
      cy.contains("All Content").should("exist");
    });
  });

  describe("Draggable", () => {
    it("Should support drag and drop", () => {
      cy.visit(getIdContent("content-list--draggable"));

      const dataTransfer = new DataTransfer();

      cy.get('[aria-label="Draggable request"]')
        .eq(0)
        .trigger("dragstart", { dataTransfer });

      cy.get('[aria-label="Draggable request"]')
        .eq(1)
        .trigger("dragover", { dataTransfer })
        .trigger("drop", { dataTransfer });
    });
  });

  describe("With Loading", () => {
    it("Should show loading skeletons", () => {
      cy.visit(getIdContent("content-list--with-loading"));
      cy.get("[data-testid='circle'], .animate-pulse, .skeleton").should(
        "exist"
      );
    });
  });

  describe("Custom Opener", () => {
    it("Should render with toggle and checkbox selection", () => {
      cy.visit(getIdContent("content-list--custom-opener"));
      cy.contains("Your latest activity").should("exist");
      cy.get("input[type='checkbox']").first().check({ force: true });
      cy.get("input[type='checkbox']").first().should("be.checked");
    });
  });
});
