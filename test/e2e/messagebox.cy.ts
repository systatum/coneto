import { getIdContent } from "test/support/commands";

describe("Messagebox Component", () => {
  it("renders Primary story", () => {
    cy.visit(getIdContent("content-messagebox--primary"));
    cy.contains("This is a primary message box.").should("be.visible");
  });

  it("renders Success story", () => {
    cy.visit(getIdContent("content-messagebox--success"));
    cy.contains("This is a success message.").should("be.visible");
  });

  it("renders Danger story", () => {
    cy.visit(getIdContent("content-messagebox--danger"));
    cy.contains("This is a danger message.").should("be.visible");
  });

  it("renders Warning story", () => {
    cy.visit(getIdContent("content-messagebox--warning"));
    cy.contains("This is a warning message.").should("be.visible");
  });

  it("renders WithCustomIcon story", () => {
    cy.visit(getIdContent("content-messagebox--with-custom-icon"));
    cy.contains("This message uses a custom RemixIcon.").should("be.visible");
  });

  it("renders WithActions story and clicks Retry button", () => {
    cy.visit(getIdContent("content-messagebox--with-actions"));

    cy.get("button").contains(/retry/i).should("be.visible").click();
    cy.get("a")
      .contains(/view website/i)
      .should("have.attr", "href", "https://systatum.com");
  });

  it("renders ClosableWithActions story and closes the messagebox", () => {
    cy.visit(getIdContent("content-messagebox--closable-with-actions"));

    cy.get("button").contains(/retry/i).should("be.visible").click();
    cy.get("a")
      .contains(/view website/i)
      .should("have.attr", "href", "https://systatum.com");

    cy.get('[aria-label="Closable request"]').click().should("exist");
  });
});
