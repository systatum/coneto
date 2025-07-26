import { getIdContent } from "test/support/commands";

context("ThumbField Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-thumbfield--default"));
    });

    it("should allow clicking thumb-up and thumb-down", () => {
      cy.findByLabelText("thumb-up").click();
      cy.findByLabelText("thumb-down").click();
    });
  });

  describe("WithLabel", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-thumbfield--with-label"));
    });

    it("should render label and allow thumb selection", () => {
      cy.findByText("Would you recommend this employer?").should("exist");
      cy.findByLabelText("thumb-up").click();
      cy.findByLabelText("thumb-down").click();
    });
  });

  describe("WithError", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-thumbfield--with-error"));
    });

    it("should show error and label, and allow selection", () => {
      cy.findByText("This field is required").should("exist");
      cy.findByText("How would you rate this employee’s performance?").should(
        "exist"
      );
      cy.findByLabelText("thumb-up").click();
      cy.findByLabelText("thumb-down").click();
    });
  });
});
