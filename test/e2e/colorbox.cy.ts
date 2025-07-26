import { getIdContent } from "test/support/commands";

context("Colorbox Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-colorbox--default"));
    });

    it("Should render the label and accept valid hex input", () => {
      cy.findByText("Color").should("exist");

      cy.findByRole("textbox").clear().type("00ff00");
      cy.findByDisplayValue("00ff00").should("exist");
    });

    it("Should handle invalid input and update value", () => {
      cy.findByRole("textbox").clear().type("gggggg");
      cy.findByDisplayValue("gggggg").should("exist");

      cy.findByRole("textbox").clear().type("ff0099");
      cy.findByDisplayValue("ff0099").should("exist");
    });
  });

  describe("WithError", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-colorbox--with-error"));
    });

    it("Should show error message for invalid color", () => {
      cy.findByText("Color").should("exist");
      cy.findByText("Invalid color value.").should("exist");
    });

    it("Should update error state based on input", () => {
      cy.findByRole("textbox").clear().type("gggggg");
      cy.findByText("Invalid color value.").should("exist");

      cy.findByRole("textbox").clear().type("00ff00");
      cy.findByDisplayValue("00ff00").should("exist");
      cy.findByText("Invalid color value.").should("not.exist");
    });
  });
});
