import { getIdContent } from "test/support/commands";

context("Button Component", () => {
  describe("Default", () => {
    it("Should click and have correct class", () => {
      cy.visit(getIdContent("controls-button--default"));

      cy.findByRole("button", { name: /Button/i }).click();
      cy.findByRole("button", { name: /Button/i }).should(
        "have.class",
        "h-9",
        "px-4"
      );
      cy.findByRole("button", { name: /Button/i }).should(
        "have.class",
        "bg-[rgb(243,243,243)]",
        "text-black"
      );
    });
  });

  describe("Default Large", () => {
    it("Should click and have correct class", () => {
      cy.visit(getIdContent("controls-button--default-large"));

      cy.findByRole("button", { name: /Button/i }).click();
      cy.findByRole("button", { name: /Button/i }).should(
        "have.class",
        "h-10",
        "px-6"
      );
      cy.findByRole("button", { name: /Button/i }).should(
        "have.class",
        "bg-[rgb(243,243,243)]",
        "text-black"
      );
    });
  });

  describe("Default Small", () => {
    it("Should click and have correct class", () => {
      cy.visit(getIdContent("controls-button--default-small"));

      cy.findByRole("button", { name: /Button/i }).click();
      cy.findByRole("button", { name: /Button/i }).should(
        "have.class",
        "h-8",
        "px-3"
      );
      cy.findByRole("button", { name: /Button/i }).should(
        "have.class",
        "bg-[rgb(243,243,243)]",
        "text-black"
      );
    });
  });

  describe("Default Icon", () => {
    it("Should click and have correct class", () => {
      cy.visit(getIdContent("controls-button--default-icon"));

      cy.findByRole("button", { name: /Movie/i }).click();
      cy.findByRole("button", { name: /Movie/i }).should(
        "have.class",
        "size-9"
      );
    });
  });

  describe("Primary", () => {
    it("Should click and have correct class", () => {
      cy.visit(getIdContent("controls-button--primary"));

      cy.findByRole("button", { name: /Button/i }).click();
      cy.findByRole("button", { name: /Button/i }).should(
        "have.class",
        "bg-[rgb(86,154,236)]",
        "text-white"
      );
      cy.findByRole("button", { name: /Button/i }).should(
        "have.class",
        "h-9",
        "px-4"
      );
    });
  });

  describe("Secondary", () => {
    it("Should click and have correct class", () => {
      cy.visit(getIdContent("controls-button--secondary"));

      cy.findByRole("button", { name: /Button/i }).click();
      cy.findByRole("button", { name: /Button/i }).should(
        "have.class",
        "bg-secondary",
        "text-secondary-foreground"
      );
    });
  });

  describe("Danger", () => {
    it("Should click and have correct class", () => {
      cy.visit(getIdContent("controls-button--danger"));

      cy.findByRole("button", { name: /Button/i }).click();
      cy.findByRole("button", { name: /Button/i }).should(
        "have.class",
        "bg-[rgb(206,55,93)]",
        "text-white"
      );
    });
  });

  describe("Outline", () => {
    it("Should click and have correct class", () => {
      cy.visit(getIdContent("controls-button--outline"));

      cy.findByRole("button", { name: /Button/i }).click();
      cy.findByRole("button", { name: /Button/i }).should(
        "have.class",
        "h-9",
        "bg-background"
      );
    });
  });

  describe("With Loading", () => {
    it("Should be disabled and have correct class", () => {
      cy.visit(getIdContent("controls-button--with-loading"));

      cy.findByRole("button", { name: /Button/i }).should(
        "have.attr",
        "disabled"
      );
      cy.findByRole("button", { name: /Button/i }).should(
        "have.class",
        "bg-[rgb(243,243,243)]"
      );
    });
  });
});
