import { getIdContent } from "test/support/commands";

context("Togglebox Component", () => {
  const onClickToggle = () => cy.findByLabelText("togglebox").click();

  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-togglebox--default"));
    });

    it("should toggle checkbox state on click", () => {
      onClickToggle();
      cy.get("input[type=checkbox]").should("be.checked");
    });
  });

  describe("With Icon", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-togglebox--with-icon"));
    });

    it("should toggle with icon and change state", () => {
      onClickToggle();
      cy.get("input[type=checkbox]").should("be.checked");
    });
  });

  describe("With Icon And Loading", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-togglebox--with-icon-and-loading"));
    });

    it("should show loading state (circle) after toggle", () => {
      onClickToggle();
      cy.get("input[type=checkbox]").should("be.checked");

      cy.findByLabelText("circle", { timeout: 1500 }).should("exist");
    });
  });

  describe("With Description", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-togglebox--with-description"));
    });

    it("should render label and description", () => {
      cy.findByText("With Icon And Loading").should("exist");
      cy.findByText("If we clicked, that expected had loading").should("exist");
    });

    it("should show loading after clicking", () => {
      onClickToggle();
      cy.get("input[type=checkbox]").should("be.checked");

      cy.findByLabelText("circle", { timeout: 1500 }).should("exist");
      cy.findByLabelText("circle", { timeout: 1500 }).should("not.exist");
    });
  });

  describe("With Error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-togglebox--with-error"));
    });

    it("should show error message when unchecked", () => {
      cy.findByText("Must add value on togglebox").should("exist");
    });

    it("should hide error message when checked", () => {
      onClickToggle();
      cy.get("input[type=checkbox]").should("be.checked");
      cy.findByText("Must add value on togglebox").should("not.exist");
    });
  });
});
