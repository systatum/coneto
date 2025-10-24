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

    context("when making selection using arrow keys", () => {
      context("when using enter", () => {
        it("should trigger action", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.findByPlaceholderText("Select a fruit...")
            .as("input")
            .type("{enter}");

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "New fruit added"
          );
        });
      });

      context("when using arrow down and enter", () => {
        it("should render value", () => {
          cy.findByPlaceholderText("Select a fruit...")
            .as("input")
            .type("{downarrow}{enter}");

          cy.findByPlaceholderText("Select a fruit...").should(
            "have.value",
            "Apple"
          );
        });
      });

      context("when using arrow up and enter", () => {
        it("should render value", () => {
          cy.findByPlaceholderText("Select a fruit...")
            .as("input")
            .type("{downarrow}{downarrow}{uparrow}{enter}");

          cy.findByPlaceholderText("Select a fruit...").should(
            "have.value",
            "Apple"
          );
        });
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

    context("when making selection", () => {
      context("when by clicking the item", () => {
        it("shows all options when opening the combobox", () => {
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

          cy.findByPlaceholderText("Select a fruit...").type(
            "{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}"
          );
          FRUIT_OPTIONS.forEach((data) =>
            cy.findByRole("option", { name: data }).should("be.visible")
          );
        });
      });

      context("when by hitting enter", () => {
        it("shows all options when opening the combobox", () => {
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

          cy.findByPlaceholderText("Select a fruit...").type(
            "{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}"
          );
          FRUIT_OPTIONS.forEach((data) =>
            cy.findByRole("option", { name: data }).should("be.visible")
          );
        });

        it("renders selected value", () => {
          cy.findByPlaceholderText("Select a fruit...")
            .click()
            .type("Apple")
            .type("{enter}");
          cy.findByPlaceholderText("Select a fruit...").should(
            "have.value",
            "Apple"
          );
        });
      });
    });
  });

  context("Multiple Selection", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-combobox--multiple-selection"));
    });

    context("when selecting option", () => {
      const FRUIT_OPTIONS = [
        "Apple",
        "Banana",
        "Orange",
        "Grape",
        "Pineapple",
        "Strawberry",
        "Watermelon",
      ];

      it("should have multiple value", () => {
        cy.findAllByPlaceholderText("Select a fruit...")
          .eq(0)
          .click()
          .type("{enter}{downarrow}{enter}", { force: true });
        cy.get("input[type=checkbox]").eq(0).should("be.checked");
        cy.get("input[type=checkbox]").eq(1).should("be.checked");

        FRUIT_OPTIONS.map((data) => {
          cy.findByText(data).should("exist");
        });
      });
    });

    context("with maximum selectable items", () => {
      it("renders only select as much as allowed", () => {
        cy.findAllByPlaceholderText("Select a fruit...")
          .eq(1)
          .click()
          .type("{enter}{downarrow}{enter}", { force: true });
        cy.get("input[type=checkbox]").eq(0).should("be.checked");
        cy.get("input[type=checkbox]").eq(1).should("be.checked");
        cy.get("input[type=checkbox]").eq(2).should("not.be.checked");
        cy.get("input[type=checkbox]").eq(3).should("not.be.checked");
      });

      context("when deselecting one option and choosing another", () => {
        it("renders with the selected option", () => {
          cy.findAllByPlaceholderText("Select a fruit...")
            .eq(1)
            .click()
            .type("{enter}{downarrow}{enter}{enter}{downarrow}{enter}", {
              force: true,
            });
          cy.get("input[type=checkbox]").eq(0).should("be.checked");
          cy.get("input[type=checkbox]").eq(1).should("not.be.checked");
          cy.get("input[type=checkbox]").eq(2).should("be.checked");
          cy.get("input[type=checkbox]").eq(3).should("not.be.checked");
        });
      });
    });

    context("when searching options through the searchbox", () => {
      it("should render with filtered options", () => {
        const FRUIT_OPTIONS = [
          "Apple",
          "Banana",
          "Orange",
          "Grape",
          "Pineapple",
          "Strawberry",
          "Watermelon",
          "Mango",
          "Blueberry",
          "Kiwi",
          "Papaya",
          "Cherry",
          "Peach",
          "Plum",
          "Guava",
          "Raspberry",
          "Lychee",
          "Coconut",
          "Pear",
          "Pomegranate",
        ];

        cy.findAllByPlaceholderText("Select a fruit...")
          .eq(1)
          .click()
          .then(() => {
            cy.findByLabelText("textbox-search").type(
              "Apple{enter}{downarrow}{enter}",
              { force: true }
            );
          });
        cy.findAllByPlaceholderText("Select a fruit...")
          .eq(1)
          .should("have.value", "Apple, Pineapple");
        cy.get("input[type='checkbox']").eq(0).should("be.checked");
        cy.get("input[type='checkbox']").eq(1).should("be.checked");

        FRUIT_OPTIONS.map((data) => {
          if (data === "Apple" || data === "Pineapple") {
            cy.findByText(data).should("exist");
          } else {
            cy.findByText(data).should("not.exist");
          }
        });
      });

      context("when losing focus", () => {
        it("should render empty string on the searchbox", () => {
          cy.findAllByPlaceholderText("Select a fruit...")
            .eq(1)
            .click()
            .type("{enter}{downarrow}{enter}", { force: true });
          cy.findAllByPlaceholderText("Select a fruit...").eq(1).click();
          cy.findByLabelText("textbox-search").should("have.value", "");
        });
      });
    });
  });
});
