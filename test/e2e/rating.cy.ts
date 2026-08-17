import { getIdContent } from "test/support/commands";

context("Rating Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-rating--default"));
    });

    it("Should display 5 stars and allow clicking", () => {
      cy.findAllByRole("img", { hidden: true }).should("have.length", 5);
      cy.findAllByRole("img", { hidden: true }).eq(3).click();
      cy.findAllByRole("img", { hidden: true }).should("have.length", 5);
    });
  });

  describe("Not Editable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-rating--not-editable"));
    });

    it("Should show 5 stars and not be editable", () => {
      cy.findAllByRole("img", { hidden: true }).should("have.length", 5);
    });
  });

  describe("With Label", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-rating--with-label"));
    });

    ["Default", "Custom render"].forEach((example) => {
      describe(example, () => {
        it("Should show label text and 5 stars", () => {
          cy.get("#storybook-root > div > div")
            .filter((_, element) => {
              return (
                Cypress.$(element).children().first().text().trim() === example
              );
            })
            .within(() => {
              cy.findAllByRole("img", { hidden: true }).should(
                "have.length",
                5
              );
            });
        });
      });
    });
  });

  describe("Size", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-rating--size"));
    });

    ["Small", "Medium", "Large"].forEach((size) => {
      describe(size, () => {
        it(`Should display 5 ${size.toLowerCase()} stars and allow clicking`, () => {
          cy.contains("div", size)
            .parent()
            .within(() => {
              cy.findAllByRole("img", { hidden: true }).should(
                "have.length",
                5
              );
              cy.findAllByRole("img", { hidden: true }).eq(3).click();
              cy.findAllByRole("img", { hidden: true }).should(
                "have.length",
                5
              );
            });
        });
      });
    });
  });
});
