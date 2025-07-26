import { getIdContent } from "test/support/commands";

context("Textbox Component", () => {
  describe("Input", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-textbox--input"));
    });

    it("Should type into the input", () => {
      cy.findByPlaceholderText("Type here...")
        .clear()
        .type("This is input text");
    });
  });

  describe("Textarea", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-textbox--textarea"));
    });

    it("Should type into the textarea", () => {
      cy.findByPlaceholderText("Type your message...")
        .clear()
        .type("This is Textarea");
    });
  });

  describe("InputMessage", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-textbox--input-message"));
    });

    it("Should type message and trigger action icon", () => {
      cy.findByPlaceholderText("Type a message...")
        .clear()
        .type("This is a Input message");

      cy.findByLabelText("action-icon").click({ force: true });
    });
  });

  describe("Password", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-textbox--password"));
    });

    it("Should type a password and see password", () => {
      cy.findByPlaceholderText("Enter password...")
        .clear()
        .type("mypassword123");
      cy.findByLabelText("action-icon").click({ force: true });
    });
  });

  describe("WithErrorMessage", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-textbox--with-error-message"));
    });

    it("Should show error message after typing", () => {
      cy.findByPlaceholderText("Type with error...")
        .clear()
        .type("Error triggered");
      cy.findByRole("textbox").should("have.value", "Error triggered");
      cy.findByText("This field is required").should("be.visible");
    });
  });
});
