import { getIdContent } from "test/support/commands";

context("Moneybox Component", () => {
  describe("Dollar (Default)", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-moneybox--dollar"));
    });

    it("Should display and update dollar value", () => {
      cy.get('input[name="value"]').clear().type("3500");
      cy.get('input[name="value"]').should("have.value", "3500");
    });
  });

  describe("Euro", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-moneybox--euro"));
    });

    it("Should format value with comma separator", () => {
      cy.get('input[name="value"]').clear().type("1234");
      cy.get('input[name="value"]').should("have.value", "1234");
    });
  });

  describe("Yen", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-moneybox--yen"));
    });

    it("Should display Yen currency", () => {
      cy.get('input[name="value"]').clear().type("8800");
      cy.get('input[name="value"]').should("have.value", "8800");
    });
  });

  describe("With Label", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-moneybox--with-label"));
    });

    it("Should show label and update value", () => {
      cy.contains("label", "Money").should("exist");
      cy.get('input[name="value"]').clear().type("9999");
      cy.get('input[name="value"]').should("have.value", "9999");
    });
  });

  describe("Error State", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-moneybox--error-state"));
    });

    it("Should show error on invalid input", () => {
      cy.get('input[name="value"]').clear().type("123");
      cy.contains("Minimum numbers 4 digit are allowed").should("exist");

      cy.get('input[name="value"]').clear().type("12345");
      cy.contains("Minimum numbers 4 digit are allowed").should("not.exist");
    });
  });
});
