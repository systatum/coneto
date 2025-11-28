import { getIdContent } from "test/support/commands";

describe("List", () => {
  context("default", () => {
    it("should render list items", () => {
      cy.visit(getIdContent("content-list--default"));
      cy.contains("Home").should("exist");
      cy.contains("View your profile").should("exist");
    });
  });

  context("with search", () => {
    it("should filter items by search input", () => {
      cy.visit(getIdContent("content-list--with-search"));
      cy.findByLabelText("textbox-search").type("settings");
      cy.contains("Adjust preferences").should("exist");
      cy.contains("Home").should("not.exist");
    });
  });

  context("with group", () => {
    it("should render grouped sections", () => {
      cy.visit(getIdContent("content-list--with-group"));
      cy.contains("Recent Content").should("exist");
      cy.contains("Messages").should("exist");
      cy.contains("All Content").should("exist");
    });
  });

  context("draggable", () => {
    it("should allow reordering items by dragging backward", () => {
      cy.visit(getIdContent("content-list--draggable"));

      const dataTransfer = new DataTransfer();

      cy.get('[aria-label="draggable-request"]')
        .eq(2)
        .trigger("dragstart", { dataTransfer });

      cy.get('[aria-label="draggable-request"]')
        .eq(0)
        .trigger("dragover", { dataTransfer })
        .trigger("drop", { dataTransfer });
    });
  });

  context("with loading", () => {
    it("should show loading skeletons", () => {
      cy.visit(getIdContent("content-list--with-loading"));
      cy.findByLabelText("circle").should("exist");
    });
  });

  context("custom", () => {
    context("with checkbox", () => {
      it("renders the checkbox on the left side", () => {
        cy.visit(getIdContent("content-list--custom-opener"));
        cy.contains("Your latest activity").should("exist");
        cy.get("input[type='checkbox']").first().check({ force: true });
        cy.get("input[type='checkbox']").first().should("be.checked");
      });
    });

    context("with togglebox opener", () => {
      beforeEach(() => {
        cy.visit(getIdContent("content-list--custom-opener"));
      });

      it("renders in the right side", () => {
        cy.findAllByLabelText("list-right-side-wrapper")
          .eq(0)
          .should("have.css", "justify-content", "end")
          .and("have.css", "gap", "4px");
      });

      it("renders with fit-content (48px)", () => {
        cy.findAllByLabelText("togglebox-container")
          .eq(0)
          .should("have.css", "width", "48px");

        cy.findAllByLabelText("togglebox-container")
          .eq(0)
          .then(($el) => {
            const width = $el[0].getBoundingClientRect().width;
            expect(width).to.be.closeTo(48, 0);
          });
      });

      context("when given actions", () => {
        it("renders correct spacing between togglebox and action", () => {
          cy.findAllByLabelText("list-action-button")
            .eq(0)
            .then(($action) => {
              cy.findAllByLabelText("togglebox-container").then(($toggle) => {
                const a = $action[0].getBoundingClientRect();
                const t = $toggle[0].getBoundingClientRect();

                const gap = t.left - a.right;

                expect(gap).to.be.closeTo(4, 1);
              });
            });
        });
      });

      context("when clicking", () => {
        it("renders collapsed the content", () => {
          cy.contains("Messages").should("be.visible");
          cy.findAllByLabelText("togglebox-thumb").eq(0).click();
          cy.contains("Messages").should("not.be.visible");
        });
      });
    });
  });
});
