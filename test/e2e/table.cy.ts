import { getIdContent } from "test/support/commands";

describe("Table Component", () => {
  context("Draggable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-table--draggable"));
    });

    context("when dragging and dropped content", () => {
      it("should move to the last dropped", () => {
        cy.findAllByLabelText("table-row")
          .eq(0)
          .should("contain.text", "Load Balancer 1");
        cy.findAllByLabelText("table-row")
          .eq(2)
          .should("contain.text", "Load Balancer 3");

        const dataTransfer = new DataTransfer();

        cy.findAllByLabelText("draggable-request")
          .eq(2)
          .trigger("dragstart", { dataTransfer });
        cy.findAllByLabelText("draggable-request")
          .eq(0)
          .trigger("dragover", { dataTransfer })
          .trigger("drop", { dataTransfer });

        cy.findAllByLabelText("table-row")
          .eq(0)
          .should("contain.text", "Load Balancer 3");
        cy.findAllByLabelText("table-row")
          .eq(2)
          .should("contain.text", "Load Balancer 2");
      });
    });

    context("With Row Group", () => {
      context("when dragging and dropped content", () => {
        it("should move to the last dropped", () => {
          cy.findAllByLabelText("table-row")
            .eq(40)
            .should("contain.text", "Understanding React 18");
          cy.findAllByLabelText("table-row")
            .eq(43)
            .should("contain.text", "React & Redux Bootcamp");

          const dataTransfer = new DataTransfer();

          cy.findAllByLabelText("draggable-request")
            .eq(40)
            .trigger("dragstart", { dataTransfer });
          cy.findAllByLabelText("draggable-request")
            .eq(43)
            .trigger("dragover", { dataTransfer })
            .trigger("drop", { dataTransfer });

          cy.findAllByLabelText("table-row")
            .eq(40)
            .should("contain.text", "TypeScript Deep Dive");
          cy.findAllByLabelText("table-row")
            .eq(42)
            .should("contain.text", "Understanding React 18");
        });
      });
    });
  });

  context("Appendable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-table--appendable"));
    });

    const checkbox = () => cy.get("input[type=checkbox]").first();

    context("when double click checkbox", () => {
      it("render selected and unselected checkbox", () => {
        checkbox().click().should("be.checked");
        checkbox().click().should("not.be.checked");
      });
    });

    context("when scroll to bottom and select", () => {
      it("renders content and have selected item", () => {
        cy.findByLabelText("table-scroll-container").scrollTo("bottom", {
          duration: 1000,
        });

        checkbox().click().should("be.checked");
        cy.get('input[type="checkbox"]:checked').should("have.length", 41);
      });
    });
  });

  context("Sortable with Pagination", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-table--sortable-with-pagination"));
    });

    context("when click next and previous button", () => {
      it("should move to another page", () => {
        cy.findByLabelText("next-button-pagination").click();
        cy.contains("Pg. 2").should("exist");

        cy.findByLabelText("previous-button-pagination").click();
        cy.contains("Pg. 1").should("exist");
      });
    });

    context("when click checkbox", () => {
      it("should select a row", () => {
        cy.get("input[type=checkbox]").first().click().should("be.checked");
      });
    });

    context("when click content", () => {
      it("should render checked", () => {
        cy.findByText("Load Balancer 1").click();
        cy.get("input[type=checkbox]").eq(1).should("be.checked");
        cy.findAllByText("HTTPS").eq(0).click();
        cy.get("input[type=checkbox]").eq(2).should("be.checked");
      });
    });
  });

  context("With Empty Slate", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-table--with-empty-slate"));
    });

    context("when empty content", () => {
      it("should render empty slate content", () => {
        cy.contains("Manage your inventory transfers").should("exist");
        cy.contains("Add Item").should("exist");
        cy.contains("Learn More").should("exist");
      });
    });
  });

  context("With Row Group", () => {
    beforeEach(() => {
      cy.visit(getIdContent("content-table--with-row-group"));
    });

    context("when click checkbox", () => {
      it("should render table with grouped rows", () => {
        cy.contains("Tech Articles").should("exist");
        cy.get("input[type=checkbox]").first().click().should("be.checked");
      });
    });

    context("when click action", () => {
      it("should clicked button", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.contains("Delete").should("be.disabled");
        cy.contains("Copy").click();
        cy.get("@consoleLog").should("have.been.calledWith", "Copy clicked");
      });
    });

    context("when click tip menu", () => {
      it("should display actions on tip and allow to clicking", () => {
        cy.findByLabelText("button-toggle").click();
        const COPY_ACTIONS = ["Copy to parent", "Copy to link"];
        COPY_ACTIONS.forEach((text) => {
          cy.contains(text).should("be.visible");
        });
        cy.contains(COPY_ACTIONS[0]).click();
      });
    });
  });
});
