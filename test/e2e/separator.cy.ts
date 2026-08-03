import { getIdContent } from "test/support/commands";

context("Separator Component", () => {
  describe("LeftSide", () => {
    it("should render label floated to the left", () => {
      cy.visit(getIdContent("stage-separator--left-side"));
      cy.findByText("systatum.com")
        .should("exist")
        .then(($label) => {
          const label = $label[0].getBoundingClientRect();
          const container = $label[0]
            .closest('[aria-label="separator-container"]')!
            .getBoundingClientRect();
          expect(label.left - container.left).to.be.lessThan(
            container.width / 2
          );
        });
    });
  });

  describe("Right Side", () => {
    it("should render label floated to the right", () => {
      cy.visit(getIdContent("stage-separator--right-side"));
      cy.findByText("systatum.com")
        .should("exist")
        .then(($label) => {
          const label = $label[0].getBoundingClientRect();
          const container = $label[0]
            .closest('[aria-label="separator-container"]')!
            .getBoundingClientRect();
          expect(container.right - label.right).to.be.lessThan(
            container.width / 2
          );
        });
    });
  });
});
