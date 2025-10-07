import { getIdContent } from "test/support/commands";

describe("Colorbox", () => {
  context("default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-colorbox--default"));
    });

    context("when type the textbox", () => {
      it("should render color from hex", () => {
        cy.findByText("Color").should("exist");

        cy.findByRole("textbox").clear().type("ff0099");
        cy.findByDisplayValue("ff0099").should("exist");
      });
    });

    context("when change with color selection", () => {
      it("should render color", () => {
        cy.get('input[type="color"]').then(($input) => {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          ).set;

          nativeInputValueSetter.call($input[0], "#ff0099");

          const event = new Event("input", { bubbles: true });
          $input[0].dispatchEvent(event);

          const changeEvent = new Event("change", { bubbles: true });
          $input[0].dispatchEvent(changeEvent);
        });

        cy.findByDisplayValue("ff0099").should("exist");
      });
    });
  });

  context("with error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-colorbox--with-error"));
    });

    context("when given", () => {
      it("should show error message with invalid color", () => {
        cy.findByText("Color").should("exist");
        cy.findByText("Invalid color value.").should("exist");
      });
    });

    context("when typing valid hex", () => {
      it("shouldn't render invalid color text", () => {
        cy.findByRole("textbox").clear().type("gggggg");
        cy.findByText("Invalid color value.").should("exist");

        cy.findByRole("textbox").clear().type("00ff00");
        cy.findByDisplayValue("00ff00").should("exist");
        cy.findByText("Invalid color value.").should("not.exist");
      });
    });
  });
});
