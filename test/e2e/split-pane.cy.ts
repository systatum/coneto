import { getIdContent } from "test/support/commands";

describe("SplitPane", () => {
  context("Default", () => {
    it("Should render 2 vertical cells with correct content", () => {
      cy.visit(getIdContent("content-splitpane--default"));

      cy.findAllByLabelText("split-pane-cell").should("have.length", 2);
      cy.findAllByLabelText("split-pane-cell")
        .eq(0)
        .should("contain.text", "Left");
      cy.findAllByLabelText("split-pane-cell")
        .eq(1)
        .should("contain.text", "Right");
    });
  });

  context("Horizontal", () => {
    it("Should render 2 horizontal cells with correct content and resize", () => {
      cy.visit(getIdContent("content-splitpane--horizontal"));

      cy.findAllByLabelText("split-pane-cell").should("have.length", 2);
      cy.findAllByLabelText("split-pane-cell")
        .eq(0)
        .should("contain.text", "Up");
      cy.findAllByLabelText("split-pane-cell")
        .eq(1)
        .should("contain.text", "Down");

      cy.findAllByLabelText("split-pane-divider").eq(0).trigger("mousedown", {
        which: 1,
      });
      cy.wait(500);
      cy.document().trigger("mousemove", { clientY: 300 });
      cy.wait(500);
      cy.document().trigger("mouseup");
    });
  });

  context("Closable", () => {
    it("Should remove cell on close icon click", () => {
      cy.visit(getIdContent("content-splitpane--closable"));

      cy.findAllByLabelText("split-pane-cell").should("have.length", 2);
      cy.findAllByLabelText("split-pane-cell")
        .eq(1)
        .should("contain.text", "Right");

      cy.findAllByLabelText("split-pane-button").first().click();
      cy.findAllByLabelText("split-pane-cell").should("have.length", 1);
      cy.findAllByLabelText("split-pane-cell")
        .eq(0)
        .should("contain.text", "Left");
    });
  });
});
