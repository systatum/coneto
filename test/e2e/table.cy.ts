import { getIdContent } from "test/support/commands";

describe("Table Component", () => {
  context("Appendable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-table--appendable"));
    });

    const checkbox = () => cy.get("input[type=checkbox]").first();

    it("should select and unselect a row", () => {
      checkbox().click().should("be.checked");
      checkbox().click().should("not.be.checked");
    });

    it("should scroll to bottom, select and count", () => {
      cy.findByLabelText("table-scroll-container").scrollTo("bottom", {
        duration: 1000,
      });

      checkbox().click().should("be.checked");
      cy.get('input[type="checkbox"]:checked').should("have.length", 41);
    });
  });

  context("Sortable with Pagination", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-table--sortable-with-pagination"));
    });

    it("should go to next and previous page", () => {
      cy.findByLabelText("next-button-pagination").click();
      cy.contains("Pg. 2").should("exist");

      cy.findByLabelText("previous-button-pagination").click();
      cy.contains("Pg. 1").should("exist");
    });

    it("should select a row", () => {
      cy.get("input[type=checkbox]").first().click().should("be.checked");
    });

    it("should can check if we clicked on Table Row", () => {
      cy.findByText("Load Balancer 1").click();
      cy.get("input[type=checkbox]").eq(1).should("be.checked");
      cy.findAllByText("HTTPS").eq(0).click();
      cy.get("input[type=checkbox]").eq(2).should("be.checked");
    });
  });

  context("With Empty Slate", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-table--with-empty-slate"));
    });

    it("should render empty slate content", () => {
      cy.contains("Manage your inventory transfers").should("exist");
      cy.contains("Add Item").should("exist");
      cy.contains("Learn More").should("exist");
    });
  });

  context("With Row Group", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-table--with-row-group"));
    });

    it("should render table with grouped rows", () => {
      cy.contains("Tech Articles").should("exist");
      cy.get("input[type=checkbox]").first().click().should("be.checked");
    });

    it("should click top action buttons", () => {
      cy.contains("Delete").should("be.disabled");
      cy.contains("Copy").click();
    });

    it("should display expected actions on tip menu and allow clicking them", () => {
      cy.findByLabelText("button-toggle").click();
      const COPY_ACTIONS = ["Copy to parent", "Copy to link"];
      COPY_ACTIONS.forEach((text) => {
        cy.contains(text).should("be.visible");
      });
      cy.contains(COPY_ACTIONS[0]).click();
    });
  });
});
