import { getIdContent } from "test/support/commands";

context("Phonebox Component", () => {
  describe("DefaultPhonebox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-phonebox--default-phonebox"));
    });

    it("Should type phone number and select Indonesia", () => {
      cy.findByPlaceholderText("Enter your phone number").type("08123456789");

      cy.findByRole("button").click();
      cy.findByPlaceholderText("Search your country...").type("Indonesia");
      cy.findByText("Indonesia").click();
    });
  });

  describe("DisablePhonebox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-phonebox--disable-phonebox"));
    });

    it("Should be disabled", () => {
      cy.findByPlaceholderText("Can't edit").should("be.disabled");
    });
  });

  describe("PhoneboxWithError", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-phonebox--phonebox-with-error"));
    });

    it("Should show error after typing invalid", () => {
      cy.findByPlaceholderText("Enter phone number").type("invalid");

      // Optional: assert the error message is visible
      cy.findByText("Invalid phone number").should("exist");
    });
  });
});
