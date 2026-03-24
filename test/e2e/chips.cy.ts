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

          cy.findAllByText("Add").eq(0).click();
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

          cy.findAllByText("Cancel").eq(0).click();
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

  context("with custom renderer", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-chips--custom-renderer"));
    });

    context("when given", () => {
      it("should render content", () => {
        cy.findByRole("button").click();
        cy.findByText("Alice Johnson").click();
        cy.get("body").click(0, 0);
        cy.findByText("Alice Johnson").trigger("mouseover");
        cy.wait(200);

        cy.findAllByText("Name").eq(0).should("exist");

        cy.findByPlaceholderText("Search your role...").should("exist");
      });
    });
  });
});
