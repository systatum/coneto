import { getIdContent } from "test/support/commands";

describe("ErrorSlate component", () => {
  context("Default Story", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-errorslate--default"));
    });

    it("renders the 404 code and title", () => {
      cy.get(".face").should("have.length", 6);
      cy.get(".face").eq(0).should("contain.text", "4");
      cy.get(".face").eq(2).should("contain.text", "0");
      cy.get(".face").eq(4).should("contain.text", "4");
      cy.contains("PageNotFound").should("exist");
    });

    it("renders the message and homepage link", () => {
      cy.contains("We couldn't find the page you were looking for").should(
        "exist"
      );
      cy.get('a[href="/"]').should("contain", "return to the homepage");
    });
  });

  context("CustomColor Story", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-errorslate--custom-color"));
    });

    it("renders the 403 code and title", () => {
      cy.get(".face").should("have.length", 6);
      cy.get(".face").eq(0).should("contain.text", "4");
      cy.get(".face").eq(2).should("contain.text", "0");
      cy.get(".face").eq(4).should("contain.text", "3");
      cy.contains("AccessDenied").should("exist");
    });

    it("renders the custom error message and homepage link", () => {
      cy.contains("You don't have permission to view this page").should(
        "exist"
      );
      cy.get('a[href="/"]').should("contain", "return to the homepage");
    });

    it("has custom styling on the cube face (if testable)", () => {
      cy.get("[style]")
        .should("have.attr", "style")
        .and("include", "background: gold");
    });
  });
});
