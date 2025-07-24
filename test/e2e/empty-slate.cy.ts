import { getIdContent } from "test/support/commands";

describe("EmptySlate component", () => {
  beforeEach(() => {
    cy.visit(getIdContent("content-emptyslate--default"));
  });

  it("should render the image", () => {
    cy.get("img")
      .should("be.visible")
      .and("have.attr", "src")
      .and("include", "https://picsum.photos/200?random=1");
  });

  it("should render the title and subtitle", () => {
    cy.contains("Manage your inventory transfers").should("exist");
    cy.contains(
      "Track and receive your incoming inventory from suppliers."
    ).should("exist");
  });

  it("should allow button interaction", () => {
    cy.contains("Add Item").click();
    cy.contains("Learn More").click();
  });
});
