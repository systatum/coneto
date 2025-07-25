import { getIdContent } from "test/support/commands";

describe("Separator Component", () => {
  it("LeftSide - should render label floated to the left", () => {
    cy.visit(getIdContent("stage-separator--left-side"));
    cy.findByText("systatum.com")
      .should("exist")
      .then(($label) => {
        const label = $label[0];
        const computedStyle = getComputedStyle(label);
        expect(computedStyle.left).not.to.equal("auto");
      });
  });

  it("RightSide - should render label floated to the right", () => {
    cy.visit(getIdContent("stage-separator--right-side"));
    cy.findByText("systatum.com")
      .should("exist")
      .then(($label) => {
        const label = $label[0];
        const computedStyle = getComputedStyle(label);
        expect(computedStyle.left).not.to.equal("auto");
      });
  });
});
