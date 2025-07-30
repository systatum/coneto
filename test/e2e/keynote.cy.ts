import { getIdContent } from "test/support/commands";

context("Keynote Component", () => {
  describe("Custom Rendering", () => {
    it("should render custom email and trigger click", () => {
      cy.visit(getIdContent("content-keynote--custom-rendering"));

      cy.findByText("alim@systatum.com").should("be.visible").click();
    });
  });
});
