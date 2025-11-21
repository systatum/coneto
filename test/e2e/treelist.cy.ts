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
      cy.contains("Adam Noto Hakarsa").should("not.be.visible");

      cy.contains("Member of Technical Staff").click();
      cy.contains("Adam Noto Hakarsa").should("be.visible");
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
    beforeEach(() => {
      cy.visit(getIdContent("content-treelist--with-actions"));

      cy.window().then((win) => {
        cy.spy(win.console, "log").as("consoleLog");
      });
    });

    it("should click item and action button exists", () => {
      cy.findByText("Discover").should("exist").click();

      cy.contains("Mohamad Naufal Alim")
        .parent()
        .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");
      cy.contains("Mohamad Naufal Alim")
        .click()
        .parent()
        .should("have.css", "border-left-color", "rgb(59, 130, 246)");
    });

    context("with actions item", () => {
      it("renders action on the item", () => {
        cy.contains("Adam Noto Hakarsa").trigger("mouseover");
        cy.findByLabelText("list-action-button")
          .should("be.visible")
          .and("have.attr", "title", "Edit")
          .click();
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "mts-1 was edited"
        );
      });

      context("when given multiple action", () => {
        it("renders with tip menu", () => {
          cy.findByPlaceholderText("Search your item...").click();
          cy.findByText("3").click();
          cy.contains("Adam Noto Hakarsa").trigger("mouseover");
          cy.findByLabelText("list-action-button").should("be.visible").click();
          cy.findByText("Copy").click();

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "mts-1 was copied"
          );
        });
      });
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
