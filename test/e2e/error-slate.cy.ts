import { getIdContent } from "test/support/commands";

context("ErrorSlate component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-errorslate--default"));
    });

    it("Renders the 404 code and title", () => {
      cy.findAllByLabelText("face-error-slate").should("have.length", 6);
      cy.findAllByLabelText("face-error-slate")
        .eq(0)
        .should("contain.text", "4");
      cy.findAllByLabelText("face-error-slate")
        .eq(2)
        .should("contain.text", "0");
      cy.findAllByLabelText("face-error-slate")
        .eq(4)
        .should("contain.text", "4");

      cy.contains("PageNotFound").should("exist");
    });

    it("Renders the message and homepage link", () => {
      cy.contains("We couldn't find the page you were looking for").should(
        "exist"
      );
      cy.get('a[href="/"]').should("contain", "return to the homepage");
    });
  });

  describe("Custom Color", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-errorslate--custom-color"));
    });

    it("Renders the 403 code and title", () => {
      cy.findAllByLabelText("face-error-slate").should("have.length", 6);
      cy.findAllByLabelText("face-error-slate")
        .eq(0)
        .should("contain.text", "4");
      cy.findAllByLabelText("face-error-slate")
        .eq(2)
        .should("contain.text", "0");
      cy.findAllByLabelText("face-error-slate")
        .eq(4)
        .should("contain.text", "3");
      cy.contains("AccessDenied").should("exist");
    });

    it("Renders the custom error message and homepage link", () => {
      cy.contains("You don't have permission to view this page").should(
        "exist"
      );
      cy.get('a[href="/"]').should("contain", "return to the homepage");
    });

    it("Has custom styling on the cube face (if testable)", () => {
      cy.get("[style]")
        .should("have.attr", "style")
        .and("include", "background: gold");
    });
  });
});
