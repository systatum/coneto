import { getIdContent } from "test/support/commands";

describe("DocumentViewer", () => {
  beforeEach(() => {
    cy.visit(getIdContent("content-documentviewer--default"));
    cy.wait(1000);
  });

  context("default rendering", () => {
    it("renders the document title", () => {
      cy.findByText("Team Collaboration Notes").should("exist");
    });
  });

  context("scrolling", () => {
    it("scrolls to the bottom", () => {
      cy.findByLabelText("container-content")
        .should("exist")
        .scrollTo("bottom");
    });
  });

  context("page size / zoom", () => {
    it("changes zoom with keyboard", () => {
      cy.findByPlaceholderText("zoom your pdf...").as("input");
      cy.get("@input").type("{uparrow}{enter}");
    });
  });

  context("selection / hover", () => {
    it("shows contentOnHover when hovered", () => {
      cy.findAllByLabelText("selection-box").eq(0).trigger("mouseover");

      cy.findAllByLabelText("selection-content-hovered")
        .eq(0)
        .should("be.visible")
        .and("contain.text", "heyyy");
    });

    it("drag selection and show tip menu", () => {
      cy.get("body")
        .trigger("mousedown", { clientX: 400, clientY: 300 })
        .trigger("mousemove", { clientX: 500, clientY: 400 })
        .trigger("mouseup");
    });

    it("drag selection and test ref clearSelection", () => {
      cy.get("body")
        .trigger("mousedown", { clientX: 400, clientY: 300 })
        .trigger("mousemove", { clientX: 500, clientY: 400 })
        .trigger("mouseup");

      cy.contains("button", "Cancel").click();
    });
  });
});
