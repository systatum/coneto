import { getIdContent } from "test/support/commands";

describe("Table Component - Appendable", () => {
  beforeEach(() => {
    cy.visit(getIdContent("content-table--appendable"));
  });

  const checkbox = () => cy.get("input[type=checkbox]").first();

  it("should select and unselect a row", () => {
    checkbox().click().should("be.checked");
    checkbox().click().should("not.be.checked");
  });

  it("should scroll to bottom, select and count", () => {
    cy.get('[data-testid="table-scroll-container"]').scrollTo("bottom", {
      duration: 1000,
    });

    checkbox().click().should("be.checked");
    cy.get('input[type="checkbox"]:checked').should("have.length", 41);
  });
});

describe("Table Component - Sortable with Pagination", () => {
  beforeEach(() => {
    cy.visit(getIdContent("content-table--sortable-with-pagination"));
  });

  it("should go to next and previous page", () => {
    cy.get('[aria-label="next-button-pagination"]').click();
    cy.contains("Pg. 2").should("exist");

    cy.get('[aria-label="previous-button-pagination"]').click();
    cy.contains("Pg. 1").should("exist");
  });

  it("should select a row", () => {
    cy.get("input[type=checkbox]").first().click().should("be.checked");
  });
});

describe("Table Component - With Empty Slate", () => {
  beforeEach(() => {
    cy.visit(getIdContent("content-table--with-empty-slate"));
  });

  it("should render empty slate content", () => {
    cy.contains("Manage your inventory transfers").should("exist");
    cy.contains("Add Item").should("exist");
    cy.contains("Learn More").should("exist");
  });
});

describe("Table Component - With Row Group", () => {
  beforeEach(() => {
    cy.visit(getIdContent("content-table--with-row-group"));
  });

  it("should render table with grouped rows", () => {
    cy.contains("Tech Articles").should("exist");
    cy.get("input[type=checkbox]").first().click().should("be.checked");
  });

  it("should click top action buttons", () => {
    cy.contains("Copy").click();
    cy.contains("Delete").click();
  });
});
