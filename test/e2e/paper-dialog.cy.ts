import { getIdContent } from "test/support/commands";

describe("PaperDialog", () => {
  context("default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-paperdialog--default"));
    });
    it("should open the dialog and show the form", () => {
      cy.findByText(/open/i).click();

      cy.findByText("Add New Employee").should("exist");
      cy.findByText(/save/i).should("exist");
    });

    it("should minimize the dialog", () => {
      cy.findByText(/open/i).click();
      cy.findByText(/minimize here/i).click();
    });

    context("when given width", () => {
      it("should maintain tab-to-drawer alignment", () => {
        cy.findByText(/open/i).click();
        cy.wait(300);
        cy.findByLabelText("paper-dialog-wrapper").then(($drawer) => {
          const drawerRect = $drawer[0].getBoundingClientRect();

          cy.findByLabelText("paper-dialog-toggle-restore").then(($tab) => {
            const tabRect = $tab[0].getBoundingClientRect();

            const isLeft = drawerRect.left === 0;

            if (isLeft) {
              expect(Math.abs(tabRect.left - drawerRect.right)).to.be.lessThan(
                10
              );
            } else {
              expect(Math.abs(tabRect.right - drawerRect.left)).to.be.lessThan(
                10
              );
            }
          });
        });
      });
    });
  });

  context("with left position", () => {
    it("should open and close the left-positioned dialog", () => {
      cy.visit(getIdContent("stage-paperdialog--fixed-left"));

      cy.findByRole("button", { name: /trigger/i }).click();

      cy.findByText("Add New Employee").should("exist");

      cy.findByLabelText("paper-dialog-toggle-close").click();
      cy.findByText("Add New Employee").should("not.exist");
    });
  });

  context("when nested", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-paperdialog--nested"));
      cy.findAllByLabelText("table-row")
        .eq(0)
        .trigger("mouseover")
        .then(() => {
          cy.wait(100);
          cy.findAllByRole("button").eq(0).click();
          cy.findByText("Edit").eq(0).click();
        });

      cy.wait(100);
      cy.findByText("Family Registry").should("exist");
      cy.findByText(
        "Detailed view of employees and their family registry records"
      ).should("exist");
    });

    context("when open the action-button inside of Paper", () => {
      it("should render the drawer", () => {
        cy.findAllByLabelText("table-row")
          .eq(5)
          .trigger("mouseover")
          .then(() => {
            cy.wait(100);
            cy.findAllByRole("button").eq(4).click();
            cy.findByText("Edit").eq(0).should("exist");
            cy.findByText("Delete").eq(0).should("exist");
          });
      });
    });

    it("should render nested dialog", () => {
      cy.findByText("Add Family").should("exist").click({ force: true });
      cy.findByText("Nested").should("exist");
    });
  });
});
