import { getIdContent } from "test/support/commands";

describe("Treelist", () => {
  context("default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-treelist--default"));
    });

    context("when collapsible", () => {
      it("should highlight selected item", () => {
        cy.contains("Member of Technical Staff").click();
        cy.contains("Adam Noto Hakarsa")
          .parent()
          .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");
        cy.contains("Adam Noto Hakarsa")
          .click()
          .parent()
          .should("have.css", "border-left-color", "rgb(59, 130, 246)");
      });

      it("should toggle collapse and expand items", () => {
        cy.contains("Member of Technical Staff").click();

        cy.contains("Adam Noto Hakarsa").should("exist");

        cy.contains("Member of Technical Staff").click();
        cy.contains("Adam Noto Hakarsa").should("not.be.visible");

        cy.contains("Member of Technical Staff").click();
        cy.contains("Adam Noto Hakarsa").should("be.visible");
      });

      it("should still allow selecting an item when expanded", () => {
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

    context("with onOpen", () => {
      context("with isLoading", () => {
        it("renders text with loading", () => {
          cy.contains("Adam Noto Hakarsa").should("not.exist");
          cy.contains("Member of Technical Staff").click();
          cy.findByLabelText("circle").should("be.visible");
          cy.wait(2000);
          cy.contains("Adam Noto Hakarsa").should("exist");
        });
      });

      context("with lastFetch", () => {
        it("renders fetch after one minute", () => {
          cy.contains("Adam Noto Hakarsa").should("not.exist");
          cy.contains("Member of Technical Staff").click();
          cy.findByLabelText("circle").should("exist");
          cy.wait(2000);
          cy.findByLabelText("circle").should("not.exist");
          cy.contains("Adam Noto Hakarsa").should("exist");
          cy.wait(20000);
          cy.contains("Member of Technical Staff").click();
          cy.contains("Member of Technical Staff").click();
          cy.findByLabelText("circle").should("exist");
        });
      });
    });
  });

  context("with nested", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-treelist--nested"));
    });

    context("with showHierarchy", () => {
      it("renders the line", () => {
        cy.contains("Blueprints")
          .parent()
          .findByLabelText("vertical-line")
          .should("exist")
          .and("have.css", "border-left", "2px solid rgb(243, 243, 243)");

        cy.findAllByLabelText("vertical-line-level")
          .eq(0)
          .should("exist")
          .and("have.css", "border-left", "2px solid rgb(243, 243, 243)");
      });

      context("when clicking", () => {
        it("should render with blue line", () => {
          cy.contains("Blueprints")
            .click()
            .parent()
            .findByLabelText("vertical-line")
            .should("exist")
            .and("have.css", "border-left", "2px solid rgb(59, 130, 246)");

          cy.contains("Financial Report")
            .parent()
            .findByLabelText("vertical-line")
            .should("exist")
            .and("have.css", "border-left", "2px solid rgb(215, 214, 214)");
        });

        context("when on another level", () => {
          it("render the grayish line", () => {
            cy.contains("Blueprints")
              .click()
              .parent()
              .findByLabelText("vertical-line")
              .should("exist")
              .and("have.css", "border-left", "2px solid rgb(59, 130, 246)");

            cy.contains(".cleverfiles")
              .parent()
              .findByLabelText("vertical-line")
              .should("exist")
              .and("have.css", "border-left", "2px solid rgb(243, 243, 243)");
          });
        });

        context("when on different group", () => {
          it("render the grayish line", () => {
            cy.contains("Blueprints")
              .click()
              .parent()
              .findByLabelText("vertical-line")
              .should("exist")
              .and("have.css", "border-left", "2px solid rgb(59, 130, 246)");

            cy.contains("Backup")
              .parent()
              .findByLabelText("vertical-line")
              .should("exist")
              .and("have.css", "border-left", "2px solid rgb(243, 243, 243)");
          });
        });
      });
    });

    context("when collapsible", () => {
      it("renders the chevron", () => {
        cy.findAllByLabelText("arrow-icon").should("have.length", 4);
      });

      context("when clicking", () => {
        it("should collapsed the content", () => {
          cy.findByText("Blueprints").should("be.visible");
          cy.findByText("Contracts").click();
          cy.findAllByLabelText("arrow-icon").eq(2).click();
          cy.findByText("Blueprints").should("not.be.visible");
        });

        it("renders consistent line color", () => {
          cy.findByText("Blueprints").should("exist");
          cy.findByText("Contracts")
            .click()
            .parent()
            .findByLabelText("vertical-line")
            .should("exist")
            .and("have.css", "border-left", "2px solid rgb(59, 130, 246)");

          cy.findAllByLabelText("arrow-icon").eq(2).click();
          cy.findByText("Blueprints").should("not.exist");

          cy.findByText("Contracts")
            .parent()
            .findByLabelText("vertical-line")
            .should("exist")
            .and("have.css", "border-left", "2px solid rgb(59, 130, 246)");
        });
      });
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
