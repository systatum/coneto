import { getIdContent } from "test/support/commands";

describe("Treelist", () => {
  context("draggable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-treelist--nested"));
    });

    const dataTransfer = new DataTransfer();

    context("with canDropAsParent", () => {
      context("when the item does not allow dropping", () => {
        it("prevents moving into the item", () => {
          cy.findAllByLabelText("tree-list-caption")
            .eq(8)
            .should("have.text", "Backup")
            .parent()
            .should("have.attr", "data-group-id", "images")
            .trigger("dragstart", { dataTransfer });

          cy.findAllByLabelText("tree-list-caption")
            .eq(0)
            .should("have.text", ".cleverfiles")
            .parent()
            .should("have.attr", "data-group-id", "home")
            .trigger("dragover", { dataTransfer })
            .trigger("drop", { dataTransfer });

          cy.findAllByLabelText("tree-list-caption")
            .eq(1)
            .should("have.text", "Backup")
            .parent()
            .should("have.attr", "data-group-id", "home");

          cy.findAllByLabelText("tree-list-caption")
            .eq(0)
            .should("have.text", ".cleverfiles")
            .parent()
            .should("have.attr", "data-group-id", "home");
        });
      });

      context("when the item allows dropping", () => {
        it("move inside of item", () => {
          cy.findAllByLabelText("tree-list-caption")
            .eq(8)
            .should("have.text", "Backup")
            .parent()
            .should("have.attr", "data-group-id", "images")
            .trigger("dragstart", { dataTransfer });

          cy.findAllByLabelText("tree-list-caption")
            .eq(9)
            .should("have.text", "Trip to Bali")
            .parent()
            .should("have.attr", "data-group-id", "images")
            .trigger("dragover", { dataTransfer })
            .trigger("drop", { dataTransfer });

          cy.findAllByLabelText("tree-list-caption")
            .eq(8)
            .should("have.text", "Trip to Bali")

            .parent()
            .should("have.attr", "data-group-id", "images");

          cy.findAllByLabelText("tree-list-caption")
            .eq(8)
            .should("not.have.text", ".cleverfiles");
        });
      });
    });

    context("when dragging in the same level", () => {
      it("keeps the order in the group", () => {
        cy.findAllByLabelText("tree-list-caption")
          .eq(9)
          .should("have.text", "Trip to Bali")
          .parent()
          .should("have.attr", "data-group-id", "images");
        cy.findAllByLabelText("tree-list-caption")
          .eq(10)
          .should("have.text", "With family")
          .parent()
          .should("have.attr", "data-group-id", "images");

        cy.findAllByLabelText("draggable-request")
          .eq(9)
          .trigger("dragstart", { dataTransfer });
        dragOverAtEdge(
          cy.findAllByLabelText("tree-list-item").eq(10),
          "bottom",
          dataTransfer
        ).trigger("drop", { dataTransfer });

        cy.wait(100);

        cy.findAllByLabelText("tree-list-caption")
          .eq(9)
          .should("have.text", "With family")
          .parent()
          .should("have.attr", "data-group-id", "images");
        cy.findAllByLabelText("tree-list-caption")
          .eq(10)
          .should("have.text", "Trip to Bali")
          .parent()
          .should("have.attr", "data-group-id", "images");
      });
    });

    context("when drag across levels", () => {
      it("should moves the item to the new group", () => {
        cy.findAllByLabelText("tree-list-caption")
          .eq(7)
          .should("have.text", "My Favourite")
          .parent()
          .should("have.attr", "data-group-id", "home");
        cy.findAllByLabelText("tree-list-caption")
          .eq(6)
          .should("have.text", "Work")
          .parent()
          .should("have.attr", "data-group-id", "my-documents");

        cy.findAllByLabelText("draggable-request")
          .eq(7)
          .trigger("dragstart", { dataTransfer });

        dragOverAtEdge(
          cy.findAllByLabelText("tree-list-item").eq(6),
          "bottom",
          dataTransfer
        ).trigger("drop", { dataTransfer });

        cy.wait(100);

        cy.findAllByLabelText("tree-list-caption")
          .eq(7)
          .should("have.text", "My Favourite")
          .parent()
          .should("have.attr", "data-group-id", "my-documents");
        cy.findAllByLabelText("tree-list-caption")
          .eq(6)
          .should("have.text", "Work")
          .parent()
          .should("have.attr", "data-group-id", "my-documents");
      });
    });
  });

  // context("default", () => {
  //   beforeEach(() => {
  //     cy.visit(getIdContent("content-treelist--default"));
  //   });

  //   context("when collapsible", () => {
  //     it("should highlight selected item", () => {
  //       cy.contains("Member of Technical Staff").click();
  //       cy.contains("Adam Noto Hakarsa")
  //         .parent()
  //         .parent()
  //         .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");
  //       cy.contains("Adam Noto Hakarsa")
  //         .click()
  //         .parent()
  //         .parent()
  //         .should("have.css", "border-left-color", "rgb(59, 130, 246)");
  //     });

  //     it("should toggle collapse and expand items", () => {
  //       cy.contains("Member of Technical Staff").click();

  //       cy.contains("Adam Noto Hakarsa").should("exist");

  //       cy.contains("Member of Technical Staff").click();
  //       cy.contains("Adam Noto Hakarsa").should("not.be.visible");

  //       cy.contains("Member of Technical Staff").click();
  //       cy.contains("Adam Noto Hakarsa").should("be.visible");
  //     });

  //     it("should still allow selecting an item when expanded", () => {
  //       cy.contains("Member of Technical Staff").click();

  //       cy.contains("Adam Noto Hakarsa")
  //         .parent()
  //         .parent()
  //         .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");

  //       cy.contains("Adam Noto Hakarsa")
  //         .click()
  //         .parent()
  //         .parent()
  //         .should("have.css", "border-left-color", "rgb(59, 130, 246)");
  //     });
  //   });

  //   context("with onOpen", () => {
  //     context("with isLoading", () => {
  //       it("renders text with loading", () => {
  //         cy.contains("Adam Noto Hakarsa").should("not.exist");
  //         cy.contains("Member of Technical Staff").click();
  //         cy.findByLabelText("circle").should("be.visible");
  //         cy.wait(2000);
  //         cy.contains("Adam Noto Hakarsa").should("exist");
  //       });
  //     });

  //     context("with lastFetch", () => {
  //       it("renders fetch after one minute", () => {
  //         cy.contains("Adam Noto Hakarsa").should("not.exist");
  //         cy.contains("Member of Technical Staff").click();
  //         cy.findByLabelText("circle").should("exist");
  //         cy.wait(2000);
  //         cy.findByLabelText("circle").should("not.exist");
  //         cy.contains("Adam Noto Hakarsa").should("exist");
  //         cy.wait(20000);
  //         cy.contains("Member of Technical Staff").click();
  //         cy.contains("Member of Technical Staff").click();
  //         cy.findByLabelText("circle").should("exist");
  //       });
  //     });
  //   });
  // });

  // context("with nested", () => {
  //   beforeEach(() => {
  //     cy.visit(getIdContent("content-treelist--nested"));
  //   });

  //   const SELECTED_VERTICAL_LINE = "2px solid rgb(59, 130, 246)";
  //   const UNSELECTED_VERTICAL_LINE = "2px solid rgb(243, 243, 243)";
  //   const SAME_LEVEL_SELECTED_VERTICAL_LINE = "2px solid rgb(215, 214, 214)";

  //   const FILE_COLOR_ICON = "rgb(252, 231, 154)";
  //   const FILE_COLOR_FOLDER = "rgb(247, 212, 82)";

  //   context("with icon", () => {
  //     it("renders the icon on the item", () => {
  //       cy.contains(".cleverfile")
  //         .parent()
  //         .parent()
  //         .findByLabelText("tree-list-icon")
  //         .should("exist")
  //         .and("have.css", "color", FILE_COLOR_ICON);

  //       cy.contains("My Documents")
  //         .parent()
  //         .parent()
  //         .findByLabelText("tree-list-icon")
  //         .should("exist")
  //         .and("have.css", "color", FILE_COLOR_FOLDER);
  //     });

  //     context("when given iconOnActive", () => {
  //       context("when selecting", () => {
  //         it("renders the icon active", () => {
  //           cy.contains("My Documents")
  //             .parent()
  //             .parent()
  //             .findByLabelText("tree-list-icon")
  //             .should("exist")
  //             .and("have.css", "color", FILE_COLOR_FOLDER)
  //             .click();
  //           cy.contains("My Documents")
  //             .parent()
  //             .parent()
  //             .findByLabelText("tree-list-icon")
  //             .should("not.exist");

  //           cy.contains("My Documents")
  //             .parent()
  //             .parent()
  //             .findByLabelText("tree-list-icon-on-active")
  //             .should("exist")
  //             .and("have.css", "color", FILE_COLOR_FOLDER);
  //         });
  //       });
  //     });
  //   });

  //   context("with showHierarchy", () => {
  //     it("renders the line", () => {
  //       cy.contains("Contracts").click();
  //       cy.contains("Blueprints")
  //         .parent()
  //         .parent()
  //         .findByLabelText("vertical-line")
  //         .should("exist")
  //         .and("have.css", "border-left", UNSELECTED_VERTICAL_LINE);

  //       cy.findAllByLabelText("vertical-line-level")
  //         .eq(0)
  //         .should("exist")
  //         .and("have.css", "border-left", UNSELECTED_VERTICAL_LINE);
  //     });

  //     context("when clicking", () => {
  //       it("should render with blue line", () => {
  //         cy.contains("Contracts").click();
  //         cy.contains("Blueprints")
  //           .click()
  //           .parent()
  //           .parent()
  //           .findByLabelText("vertical-line")
  //           .should("exist")
  //           .and("have.css", "border-left", SELECTED_VERTICAL_LINE);

  //         cy.contains("Financial Report")
  //           .parent()
  //           .parent()
  //           .findByLabelText("vertical-line")
  //           .should("exist")
  //           .and("have.css", "border-left", SAME_LEVEL_SELECTED_VERTICAL_LINE);
  //       });

  //       context("when on another level", () => {
  //         it("render the grayish line", () => {
  //           cy.contains("Contracts").click();
  //           cy.contains("Blueprints")
  //             .click()
  //             .parent()
  //             .parent()
  //             .findByLabelText("vertical-line")
  //             .should("exist")
  //             .and("have.css", "border-left", SELECTED_VERTICAL_LINE);
  //           cy.contains("Blueprints")
  //             .parent()
  //             .parent()
  //             .findByLabelText("vertical-line")
  //             .should("exist")
  //             .and("have.css", "border-left", SELECTED_VERTICAL_LINE);

  //           cy.contains(".cleverfiles")
  //             .parent()
  //             .parent()
  //             .findByLabelText("vertical-line")
  //             .should("exist")
  //             .and("have.css", "border-left", UNSELECTED_VERTICAL_LINE);
  //         });
  //       });

  //       context("when on different group", () => {
  //         it("render the grayish line", () => {
  //           cy.contains("Contracts").click();

  //           cy.contains("Blueprints")
  //             .click()
  //             .parent()
  //             .parent()
  //             .findByLabelText("vertical-line")
  //             .should("exist")
  //             .and("have.css", "border-left", SELECTED_VERTICAL_LINE);

  //           cy.contains("Backup")
  //             .parent()
  //             .parent()
  //             .findByLabelText("vertical-line")
  //             .should("exist")
  //             .and("have.css", "border-left", UNSELECTED_VERTICAL_LINE);
  //         });
  //       });
  //     });
  //   });

  //   context("when collapsible", () => {
  //     it("renders the chevron", () => {
  //       cy.findByLabelText("nested-with-default").then(($container) =>
  //         cy
  //           .wrap($container)
  //           .findAllByLabelText("arrow-icon")
  //           .should("have.length", 4)
  //       );
  //       cy.findByLabelText("nested-with-prevent-default").then(($container) =>
  //         cy
  //           .wrap($container)
  //           .findAllByLabelText("arrow-icon")
  //           .should("have.length", 4)
  //       );
  //     });

  //     context("when clicking", () => {
  //       it("should collapsed the content", () => {
  //         cy.findByLabelText("nested-with-default").within(() => {
  //           cy.contains("Contracts").click();
  //           cy.findByText("Blueprints").should("exist");
  //           cy.findByText("Contracts").click();
  //           cy.findByText("Blueprints").should("not.exist");
  //         });
  //       });
  //     });

  //     context("with preventDefault", () => {
  //       context("when clicking item", () => {
  //         it("should not collapsed the content", () => {
  //           cy.findByLabelText("nested-with-prevent-default").within(() => {
  //             cy.findByText("Blueprints").should("not.exist");
  //             cy.findByText("Contracts").click();
  //             cy.findByText("Blueprints").should("not.exist");
  //           });
  //         });
  //       });

  //       context("when clicking arrow", () => {
  //         it("should collapsed the content", () => {
  //           cy.findByLabelText("nested-with-prevent-default").within(() => {
  //             cy.findByText("Blueprints").should("not.exist");
  //             cy.findByText("Contracts")
  //               .parent()
  //               .parent()
  //               .findByLabelText("arrow-icon")
  //               .click();
  //             cy.findByText("Blueprints").should("exist");
  //           });
  //         });
  //       });
  //     });
  //   });
  // });

  // context("with actions", () => {
  //   beforeEach(() => {
  //     cy.visit(getIdContent("content-treelist--with-actions"));

  //     cy.window().then((win) => {
  //       cy.spy(win.console, "log").as("consoleLog");
  //     });
  //   });

  //   it("should click item and action button exists", () => {
  //     cy.findByText("Discover").should("exist").click();

  //     cy.contains("Mohamad Naufal Alim")
  //       .parent()
  //       .parent()
  //       .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");
  //     cy.contains("Mohamad Naufal Alim")
  //       .click()
  //       .parent()
  //       .parent()
  //       .should("have.css", "border-left-color", "rgb(59, 130, 246)");
  //   });

  //   context("with actions item", () => {
  //     it("renders action on the item", () => {
  //       cy.contains("Adam Noto Hakarsa").trigger("mouseover");
  //       cy.findByLabelText("action-button")
  //         .should("be.visible")
  //         .and("have.attr", "title", "Edit")
  //         .click();
  //       cy.get("@consoleLog").should(
  //         "have.been.calledWith",
  //         "mts-1 was edited"
  //       );
  //     });

  //     context("when given multiple action", () => {
  //       it("renders with tip menu", () => {
  //         cy.findByPlaceholderText("Search your item...").click();
  //         cy.findByText("3").click();
  //         cy.contains("Adam Noto Hakarsa").trigger("mouseover");
  //         cy.findByLabelText("action-button").should("be.visible").click();
  //         cy.findByText("Copy").click();

  //         cy.get("@consoleLog").should(
  //           "have.been.calledWith",
  //           "mts-1 was copied"
  //         );
  //       });
  //     });
  //   });
  // });

  // context("without header", () => {
  //   it("should click item and action button exists", () => {
  //     cy.visit(getIdContent("content-treelist--with-actions"));

  //     cy.findByText("Discover").should("exist").click();

  //     cy.contains("Mohamad Naufal Alim")
  //       .parent()
  //       .parent()
  //       .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");
  //     cy.contains("Mohamad Naufal Alim")
  //       .click()
  //       .parent()
  //       .parent()
  //       .should("have.css", "border-left-color", "rgb(59, 130, 246)");

  //     cy.contains("Adam Noto Hakarsa")
  //       .parent()
  //       .parent()
  //       .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");

  //     cy.contains("Adam Noto Hakarsa")
  //       .click()
  //       .parent()
  //       .parent()
  //       .should("have.css", "border-left-color", "rgb(59, 130, 246)");

  //     cy.contains("Mohamad Naufal Alim")
  //       .parent()
  //       .parent()
  //       .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");
  //   });
  // });
});

// Test drag behavior using edge-based rules for intended drop positions
function dragOverAtEdge(
  subject: Cypress.Chainable<JQuery<HTMLElement>>,
  edge: "top" | "bottom",
  dataTransfer: DataTransfer
) {
  return subject.then(($el) => {
    const rect = $el[0].getBoundingClientRect();
    const EDGE = 6;

    const clientY =
      edge === "top" ? rect.top + EDGE - 5 : rect.top + rect.height - EDGE + 5;

    return cy.wrap($el).trigger("dragover", {
      dataTransfer,
      clientY,
      force: true,
    });
  });
}
