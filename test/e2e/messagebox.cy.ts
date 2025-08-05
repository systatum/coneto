import { getIdContent } from "test/support/commands";

context("Messagebox Component", () => {
  describe("Primary", () => {
    it("Should render primary message", () => {
      cy.visit(getIdContent("content-messagebox--primary"));
      cy.contains("This is a primary message box.").should("be.visible");
    });
  });

  describe("Success", () => {
    it("Should render success message", () => {
      cy.visit(getIdContent("content-messagebox--success"));
      cy.contains("This is a success message.").should("be.visible");
    });
  });

  describe("Danger", () => {
    it("Should render danger message", () => {
      cy.visit(getIdContent("content-messagebox--danger"));
      cy.contains("This is a danger message.").should("be.visible");
    });
  });

  describe("Warning", () => {
    it("Should render warning message", () => {
      cy.visit(getIdContent("content-messagebox--warning"));
      cy.contains("This is a warning message.").should("be.visible");
    });
  });

  describe("With Custom Icon", () => {
    it("Should render custom icon message", () => {
      cy.visit(getIdContent("content-messagebox--with-custom-icon"));
      cy.contains("This message uses a custom RemixIcon.").should("be.visible");
    });
  });

  describe("With Actions", () => {
    it("Should render actions and respond to Retry click", () => {
      cy.visit(getIdContent("content-messagebox--with-actions"));

      cy.get("button").contains(/retry/i).should("be.visible").click();
      cy.get("a")
        .contains(/view website/i)
        .should("have.attr", "href", "https://systatum.com");
    });
  });

  describe("Closable With Actions", () => {
    it("Should render closable message with actions", () => {
      cy.visit(getIdContent("content-messagebox--closable-with-actions"));

      cy.get("button").contains(/retry/i).should("be.visible").click();
      cy.get("a")
        .contains(/view website/i)
        .should("have.attr", "href", "https://systatum.com");

      cy.findByLabelText("closable-request").click().should("exist");
    });
  });
});
