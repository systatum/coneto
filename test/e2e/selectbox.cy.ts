import { getIdContent } from "test/support/commands";

context("Selectbox Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-selectbox--default"));
    });

    it("Should render placeholder and open options on click", () => {
      cy.findByPlaceholderText("click this place holder")
        .should("exist")
        .click();
      cy.findByRole("listbox").should("be.visible");
      cy.findByText("Selectbox content default.").click();
      cy.findByPlaceholderText("click this place holder").should(
        "have.value",
        "Selectbox content default."
      );
    });
  });

  describe("Clearable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-selectbox--clearable"));
    });

    it("Should allow selecting and clearing a value", () => {
      cy.findByPlaceholderText("click this place holder")
        .should("exist")
        .click();
      cy.findByRole("listbox").should("be.visible");
      cy.findByText("Selectbox content with clearable.").click();
      cy.findByPlaceholderText("click this place holder").should(
        "have.value",
        "Selectbox content with clearable."
      );

      cy.findByLabelText("clearable-content").click();
      cy.findByPlaceholderText("click this place holder").should(
        "have.value",
        ""
      );
    });
  });
});
