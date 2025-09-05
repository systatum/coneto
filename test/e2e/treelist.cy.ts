import { getIdContent } from "test/support/commands";

describe("Treelist", () => {
  context("default", () => {
    it("should highlight selected item", () => {
      cy.visit(getIdContent("content-treelist--default"));

      cy.contains("Adam Noto Hakarsa")
        .parent()
        .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");
      cy.contains("Adam Noto Hakarsa")
        .click()
        .parent()
        .should("have.css", "border-left-color", "rgb(59, 130, 246)");
    });

    it("should toggle collapse and expand items", () => {
      cy.visit(getIdContent("content-treelist--default"));

      cy.contains("Adam Noto Hakarsa").should("exist");

      cy.contains("Member of Technical Staff").click();
      cy.contains("Adam Noto Hakarsa").should("not.exist");

      cy.contains("Member of Technical Staff").click();
      cy.contains("Adam Noto Hakarsa").should("exist");
    });

    it("should still allow selecting an item when expanded", () => {
      cy.visit(getIdContent("content-treelist--default"));

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

  context("with actions", () => {
    it("should click item and action button exists", () => {
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

  context("without header", () => {
    it("should click item and action button exists", () => {
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
