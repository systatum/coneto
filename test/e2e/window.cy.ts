import { getIdContent } from "test/support/commands";

context("Window Component", () => {
  describe("Default", () => {
    it("Should render 2 vertical cells with correct content", () => {
      cy.visit(getIdContent("content-window--default"));

      cy.get("[data-testid='window-cell']").should("have.length", 2);
      cy.get("[data-testid='window-cell']")
        .eq(0)
        .should("contain.text", "left");
      cy.get("[data-testid='window-cell']")
        .eq(1)
        .should("contain.text", "Right");
    });
  });

  describe("Horizontal", () => {
    it("Should render 2 horizontal cells with correct content and resize", () => {
      cy.visit(getIdContent("content-window--horizontal"));

      cy.get("[data-testid='window-cell']").should("have.length", 2);
      cy.get("[data-testid='window-cell']").eq(0).should("contain.text", "Up");
      cy.get("[data-testid='window-cell']")
        .eq(1)
        .should("contain.text", "Down");

      cy.get("[data-testid='window-divider-0']").trigger("mousedown", {
        which: 1,
      });
      cy.wait(500);
      cy.document().trigger("mousemove", { clientY: 300 });
      cy.wait(500);
      cy.document().trigger("mouseup");
    });
  });

  describe("Closable", () => {
    it("Should remove cell on close icon click", () => {
      cy.visit(getIdContent("content-window--closable"));

      cy.get("[data-testid='window-cell']").should("have.length", 2);
      cy.get("[data-testid='window-cell']")
        .eq(1)
        .should("contain.text", "right");

      cy.get("[data-testid='window-button']").first().click();
      cy.get("[data-testid='window-cell']").should("have.length", 1);
      cy.get("[data-testid='window-cell']")
        .eq(0)
        .should("contain.text", "left");
    });
  });
});
