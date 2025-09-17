import { getIdContent } from "test/support/commands";

describe("Combobox", () => {
  context("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-combobox--default"));
    });

    context("when type and choosen", () => {
      it("should filter and selected option", () => {
        cy.findByPlaceholderText("Select a fruit...").as("input").type("ap");

        cy.findByRole("option", { name: "Apple" }).should("be.visible");
        cy.findByRole("option", { name: "Grape" }).should("be.visible");

        cy.get("@input").type("{downarrow}{enter}");
        cy.get("@input").should("have.value", "Grape");
      });
    });
  });

  context("Clearable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-combobox--clearable"));
    });

    context("when typed, choosen and clicked x", () => {
      it("should clear the input", () => {
        cy.findByPlaceholderText("Select a fruit...").as("input").type("gr");

        cy.findByRole("option", { name: "Grape" }).click();

        cy.get("@input").should("have.value", "Grape");

        cy.findByLabelText("clearable-content").click();
        cy.get("@input").should("have.value", "");
      });
    });
  });

  context("With Actions", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-combobox--with-actions"));
    });

    context("when given", () => {
      it("should render action and trigger it", () => {
        cy.findByPlaceholderText("Select a fruit...").as("input").type("Pap");

        cy.findByText("Add Fruit").should("be.visible").click();
      });
    });
  });

  context("Strict Value", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-combobox--strict-value"));
    });

    context("when doesn't clicked option", () => {
      it("should not accept free text if not in options", () => {
        cy.findByPlaceholderText("Select a fruit...").type("Durian").blur();

        cy.findByDisplayValue("Durian").should("exist");
        cy.get("body").click("topLeft");
        cy.findByDisplayValue("Durian").should("not.exist");
      });
    });

    context("when search, choosen and clicked selectbox", () => {
      it("should show all option if we clicked", () => {
        cy.findByPlaceholderText("Select a fruit...").type("Apple").click();

        const FRUIT_OPTIONS = [
          "Apple",
          "Banana",
          "Orange",
          "Grape",
          "Pineapple",
          "Strawberry",
          "Watermelon",
        ];

        cy.findByRole("option", { name: "Apple" }).click();

        cy.findByPlaceholderText("Select a fruit...").click();
        FRUIT_OPTIONS.forEach((data) =>
          cy.findByRole("option", { name: data }).should("be.visible")
        );
      });
    });

    context("when search, choosen with enter and clicked selectbox", () => {
      it("should show all option if we clicked", () => {
        cy.findByPlaceholderText("Select a fruit...")
          .click()
          .type("Apple")
          .type("{enter}");

        const FRUIT_OPTIONS = [
          "Apple",
          "Banana",
          "Orange",
          "Grape",
          "Pineapple",
          "Strawberry",
          "Watermelon",
        ];

        cy.findByPlaceholderText("Select a fruit...").type("{downarrow}");
        FRUIT_OPTIONS.forEach((data) =>
          cy.findByRole("option", { name: data }).should("be.visible")
        );
      });
    });
  });
});
