import { getIdContent } from "test/support/commands";

context("Toolbar Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-toolbar--default"));
    });

    it("Should can be inspect and click for drawer", () => {
      cy.findByText("Default Mode").should("be.visible").closest("div").click();
      cy.findByLabelText("toolbar-menu-toggle-Default Mode").click();
      cy.findByLabelText("toolbar-menu-toggle-Primary Mode").click();
      cy.findByLabelText("toolbar-menu-toggle-Danger Mode").click();
    });
  });
});
