import { getIdContent } from "test/support/commands";

context("Table Component", () => {
  describe("Appendable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-table--appendable"));
    });

    const checkbox = () => cy.get("input[type=checkbox]").first();

    it("Should select and unselect a row", () => {
      checkbox().click().should("be.checked");
      checkbox().click().should("not.be.checked");
    });

    it("Should scroll to bottom, select and count", () => {
      cy.findByLabelText("table-scroll-container").scrollTo("bottom", {
        duration: 1000,
      });

      checkbox().click().should("be.checked");
      cy.get('input[type="checkbox"]:checked').should("have.length", 41);
    });
  });

  describe("Sortable with Pagination", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-table--sortable-with-pagination"));
    });

    it("Should go to next and previous page", () => {
      cy.findByLabelText("next-button-pagination").click();
      cy.contains("Pg. 2").should("exist");

      cy.findByLabelText("previous-button-pagination").click();
      cy.contains("Pg. 1").should("exist");
    });

    it("Should select a row", () => {
      cy.get("input[type=checkbox]").first().click().should("be.checked");
    });
  });

  describe("With Empty Slate", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-table--with-empty-slate"));
    });

    it("Should render empty slate content", () => {
      cy.contains("Manage your inventory transfers").should("exist");
      cy.contains("Add Item").should("exist");
      cy.contains("Learn More").should("exist");
    });
  });

  describe("With Row Group", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-table--with-row-group"));
    });

    it("Should render table with grouped rows", () => {
      cy.contains("Tech Articles").should("exist");
      cy.get("input[type=checkbox]").first().click().should("be.checked");
    });

    it("Should click top action buttons", () => {
      cy.contains("Copy").click();
      cy.contains("Delete").click();
    });
  });
});
