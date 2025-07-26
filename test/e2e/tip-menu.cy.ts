import { getIdContent } from "test/support/commands";

context("Tip Menu Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-tipmenu--default"));
    });
    it("Should can click and have class", () => {
      cy.findByText("Report Phishing").should("be.visible");
      cy.findByText("Report Junk").should("be.visible");
      cy.findByText("Block Sender").should("be.visible");
      cy.findByText("Mark as Read").should("be.visible");

      cy.wait(200);

      cy.findByText("Delete").click();
      cy.findByText("Confirm").should("be.visible");
      cy.findByText("Cancel").should("be.visible");
    });
  });
});
