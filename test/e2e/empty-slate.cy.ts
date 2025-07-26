import { getIdContent } from "test/support/commands";

context("EmptySlate component", () => {
  beforeEach(() => {
    cy.visit(getIdContent("content-emptyslate--default"));
  });

  it("Should render the image", () => {
    cy.get("img")
      .should("be.visible")
      .and("have.attr", "src")
      .and("include", "https://picsum.photos/200?random=1");
  });

  it("Should render the title and subtitle", () => {
    cy.contains("Manage your inventory transfers").should("exist");
    cy.contains(
      "Track and receive your incoming inventory from suppliers."
    ).should("exist");
  });

  it("Should allow button interaction", () => {
    cy.contains("Add Item").click();
    cy.contains("Learn More").click();
  });
});
