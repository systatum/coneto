import { Helper } from "./../../components/helper";

describe("Helper", () => {
  const value = "This is a helper tooltip";
  const mountHelper = () => {
    cy.mount(<Helper value={value} />);
    cy.get("svg").should("exist");
  };

  beforeEach(() => {
    mountHelper();
  });
  it("should render icon", () => {
    // render the helper icon;
  });

  context("when hovering the icon", () => {
    it("should show dialog on hover", () => {
      cy.get("svg").trigger("mouseover");
      cy.wait(400);
      cy.contains(value).should("be.visible");
    });
  });
});
