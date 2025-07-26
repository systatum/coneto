import { getIdContent } from "test/support/commands";

context("DrawerTab Component", () => {
  describe("Default", () => {
    it("Should open DrawerTab and switch tabs", () => {
      cy.visit(getIdContent("stage-drawertab--default"));

      cy.findAllByRole("button").should("have.length.at.least", 2);

      cy.findAllByRole("button").first().click();
      cy.contains("File Attributes").should("exist");

      cy.findAllByRole("button").eq(1).click();
      cy.wait(300);
      cy.findAllByRole("button").eq(1).click();
    });
  });

  describe("FixedRight", () => {
    it("Should open DrawerTab and switch tabs", () => {
      cy.visit(getIdContent("stage-drawertab--fixed-right"));

      cy.findAllByRole("button").should("have.length.at.least", 2);

      cy.findAllByRole("button").first().click();
      cy.contains("File Attributes").should("exist");

      cy.findAllByRole("button").eq(1).click();
      cy.wait(300);
      cy.findAllByRole("button").eq(1).click();
    });
  });
});
