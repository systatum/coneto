import { getIdContent } from "test/support/commands";

context("Toolbar Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-toolbar--default"));
    });

    it("Should can be inspect and click for drawer", () => {
      cy.findByText("Default Mode").should("be.visible").closest("div").click();
      cy.findAllByLabelText("toolbar-menu-toggle").eq(0).click();
      cy.findAllByLabelText("toolbar-menu-toggle").eq(1).click();
      cy.findAllByLabelText("toolbar-menu-toggle").eq(2).click();
    });
  });
});
