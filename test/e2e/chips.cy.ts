import { getIdContent } from "test/support/commands";

describe("Chips", () => {
  beforeEach(() => {
    cy.visit(getIdContent("input-elements-chips--default"));
  });
  context("when default ", () => {
    context("when search", () => {
      it("should select a chip", () => {
        cy.findByRole("button").click();
        cy.findByRole("textbox").type("Anime");
        cy.findByText("Anime").click();
      });
    });

    context("when double select", () => {
      it("should deselect a chip", () => {
        cy.findByRole("button").click();
        cy.findByRole("textbox").type("Anime");
        cy.findByText("Anime").dblclick();
        cy.findByRole("button").click();
      });
    });
  });

  context("when creatable", () => {
    context("when missing option", () => {
      context("when pressing empty button", () => {
        it("should change to creatable mode", () => {
          cy.findByRole("button").click();
          cy.findByRole("textbox").type("MyCustomTag");
          cy.findByText(/Create a new label/i).click();

          cy.findByPlaceholderText(/Create a new label/i)
            .clear()
            .type("MyCustomTag");

          cy.findByRole("button", { name: /Add/i }).click();
        });
      });

      context("when pressing button close", () => {
        it("should change to idle mode", () => {
          cy.findByRole("button").click();
          cy.findByRole("textbox").type("MyCustomTag");
          cy.findByText(/Create a new label/i).click();

          cy.findByPlaceholderText(/Create a new label/i)
            .clear()
            .type("MyCustomTag");

          cy.findByRole("button", { name: /Add/i }).click();
          cy.findByRole("button", { name: /Cancel/i }).click();
        });
      });
    });
  });

  context("when deletable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-chips--deletable"));
    });

    context("when pressing delete", () => {
      it("should trigger delete", () => {
        cy.findByRole("button").click();
        cy.findByText("Anime").trigger("mouseover");
        cy.findAllByLabelText("badge-action").eq(0).click({ force: true });
      });
    });
  });
});
