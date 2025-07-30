import { getIdContent } from "test/support/commands";

context("Togglebox Component", () => {
  const onClickToggle = () => cy.findByLabelText("togglebox").click();

  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-togglebox--default"));
    });

    it("should toggle checkbox state on click", () => {
      onClickToggle();
    });
  });

  describe("With Icon", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-togglebox--with-icon"));
    });

    it("should toggle with icon and change state", () => {
      onClickToggle();
    });
  });

  describe("With Icon And Loading", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-togglebox--with-icon-and-loading"));
    });

    it("should show loading state (circle) after toggle", () => {
      onClickToggle();

      cy.findByLabelText("circle", { timeout: 1500 }).should("exist");
    });
  });
});
