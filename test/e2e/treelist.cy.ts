import { getIdContent } from "test/support/commands";

describe("Treelist", () => {
  context("Default", () => {
    it("Should highlight selected item", () => {
      cy.visit(getIdContent("content-treelist--default"));

      cy.contains("Adam Noto Hakarsa")
        .parent()
        .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");
      cy.contains("Adam Noto Hakarsa")
        .click()
        .parent()
        .should("have.css", "border-left-color", "rgb(59, 130, 246)");
    });
  });

  context("With Collapsible", () => {
    it("Should toggle collapse and expand items", () => {
      cy.visit(getIdContent("content-treelist--with-collapsible"));

      cy.contains("Adam Noto Hakarsa").should("exist");

      cy.contains("Member of Technical Staff").click();
      cy.contains("Adam Noto Hakarsa").should("not.exist");

      cy.contains("Member of Technical Staff").click();
      cy.contains("Adam Noto Hakarsa").should("exist");
    });

    it("Should still allow selecting an item when expanded", () => {
      cy.visit(getIdContent("content-treelist--with-collapsible"));

      cy.contains("Member of Technical Staff").click();
      cy.contains("Member of Technical Staff").click();

      cy.contains("Adam Noto Hakarsa")
        .parent()
        .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");

      cy.contains("Adam Noto Hakarsa")
        .click()
        .parent()
        .should("have.css", "border-left-color", "rgb(59, 130, 246)");
    });
  });

  context("With Actions", () => {
    it("Should click item and action button exists", () => {
      cy.visit(getIdContent("content-treelist--with-actions"));

      cy.findByText("Discover").should("exist").click();

      cy.contains("Mohamad Naufal Alim")
        .parent()
        .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");
      cy.contains("Mohamad Naufal Alim")
        .click()
        .parent()
        .should("have.css", "border-left-color", "rgb(59, 130, 246)");
    });
  });

  context("Without Header", () => {
    it("Should click item and action button exists", () => {
      cy.visit(getIdContent("content-treelist--with-actions"));

      cy.findByText("Discover").should("exist").click();

      cy.contains("Mohamad Naufal Alim")
        .parent()
        .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");
      cy.contains("Mohamad Naufal Alim")
        .click()
        .parent()
        .should("have.css", "border-left-color", "rgb(59, 130, 246)");

      cy.contains("Adam Noto Hakarsa")
        .parent()
        .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");

      cy.contains("Adam Noto Hakarsa")
        .click()
        .parent()
        .should("have.css", "border-left-color", "rgb(59, 130, 246)");

      cy.contains("Mohamad Naufal Alim")
        .parent()
        .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");
    });
  });
});
