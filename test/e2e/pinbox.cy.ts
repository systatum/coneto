import { getIdContent } from "test/support/commands";

describe("Pinbox", () => {
  context("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-pinbox--default"));
    });

    context("specific", () => {
      context("when pressing", () => {
        it("should render character", () => {
          cy.findAllByLabelText("pinbox-input").eq(1).type("2");
          cy.findAllByLabelText("pinbox-input").eq(2).type("1");
          cy.findAllByLabelText("pinbox-input").eq(3).type("a");
          cy.findAllByLabelText("pinbox-input").eq(5).type("b");

          const contentExpected = ["S", "2", "1", "A", "-", "B"];

          contentExpected.forEach((data, index) => {
            cy.findAllByLabelText("pinbox-input")
              .eq(index)
              .should("have.value", data);
          });
        });
      });

      context("when alphanumeric pressing with alphabet", () => {
        it("should render character", () => {
          cy.findAllByLabelText("pinbox-input").eq(1).type("a");

          const contentExpected = ["S", "A", "", "", "-", ""];

          contentExpected.forEach((data, index) => {
            cy.findAllByLabelText("pinbox-input")
              .eq(index)
              .should("have.value", data);
          });
        });
      });

      context("when alphanumeric pressing with digit", () => {
        it("should render character", () => {
          cy.findAllByLabelText("pinbox-input").eq(1).type("2");

          const contentExpected = ["S", "2", "", "", "-", ""];

          contentExpected.forEach((data, index) => {
            cy.findAllByLabelText("pinbox-input")
              .eq(index)
              .should("have.value", data);
          });
        });
      });

      context("when digit pressing with alphabet", () => {
        it("should not render character", () => {
          cy.findAllByLabelText("pinbox-input").eq(2).type("b");

          const contentExpected = ["S", "", "", "", "-", ""];

          contentExpected.forEach((data, index) => {
            cy.findAllByLabelText("pinbox-input")
              .eq(index)
              .should("have.value", data);
          });
        });
      });

      context("when digit pressing with digit", () => {
        it("should render character", () => {
          cy.findAllByLabelText("pinbox-input").eq(2).type("2");

          const contentExpected = ["S", "", "2", "", "-", ""];

          contentExpected.forEach((data, index) => {
            cy.findAllByLabelText("pinbox-input")
              .eq(index)
              .should("have.value", data);
          });
        });
      });

      context("when alphabet pressing with alphabet", () => {
        it("should render character", () => {
          cy.findAllByLabelText("pinbox-input").eq(3).type("a");
          cy.findAllByLabelText("pinbox-input").eq(5).type("b");

          const contentExpected = ["S", "", "", "A", "-", "B"];

          contentExpected.forEach((data, index) => {
            cy.findAllByLabelText("pinbox-input")
              .eq(index)
              .should("have.value", data);
          });
        });
      });

      context("when alphabet pressing with digit", () => {
        it("should not render character", () => {
          cy.findAllByLabelText("pinbox-input").eq(3).type("2");
          cy.findAllByLabelText("pinbox-input").eq(5).type("3");

          const contentExpected = ["S", "", "", "", "-", ""];

          contentExpected.forEach((data, index) => {
            cy.findAllByLabelText("pinbox-input")
              .eq(index)
              .should("have.value", data);
          });
        });
      });

      context("when pressing right arrow", () => {
        it("move to the next textbox", () => {
          cy.findAllByLabelText("pinbox-input")
            .eq(1)
            .click()
            .type("{rightarrow}");
          cy.findAllByLabelText("pinbox-input").eq(2).should("be.focused");
        });

        context("when the next element is static", () => {
          it("move to the next editable textbox", () => {
            cy.findAllByLabelText("pinbox-input")
              .eq(1)
              .click()
              .type("{rightarrow}{rightarrow}{rightarrow}");
            cy.findAllByLabelText("pinbox-input").eq(5).should("be.focused");
          });
        });
      });

      context("when pressing backspace", () => {
        it("remove value textbox", () => {
          cy.findAllByLabelText("pinbox-input")
            .eq(1)
            .click()
            .type("12{backspace}{backspace}");

          cy.findAllByLabelText("pinbox-input").eq(2).should("be.focused");
        });

        it("move to the previous textbox", () => {
          cy.findAllByLabelText("pinbox-input")
            .eq(2)
            .click()
            .type("{backspace}");
          cy.findAllByLabelText("pinbox-input").eq(1).should("be.focused");
        });

        context("when the previous element is static", () => {
          it("move to the previous editable textbox", () => {
            cy.findAllByLabelText("pinbox-input")
              .eq(5)
              .click()
              .type("{backspace}");
            cy.findAllByLabelText("pinbox-input").eq(3).should("be.focused");
          });
        });
      });
    });

    context("static", () => {
      context("when active", () => {
        context("when pressing character", () => {
          it("doesn't change it's value", () => {
            cy.findAllByLabelText("pinbox-input")
              .eq(0)
              .click()
              .type("t")
              .should("have.value", "S");
          });
        });

        context("when pressing right arrow", () => {
          it("move to the next textbox", () => {
            cy.findAllByLabelText("pinbox-input")
              .eq(0)
              .click()
              .type("{rightarrow}2");
            cy.findAllByLabelText("pinbox-input")
              .eq(0)
              .should("have.value", "S");
            cy.findAllByLabelText("pinbox-input")
              .eq(1)
              .should("have.value", "2");
            cy.findAllByLabelText("pinbox-input").eq(2).should("have.focus");
          });
        });

        context("when pressing left arrow", () => {
          it("move to previous textbox", () => {
            cy.findAllByLabelText("pinbox-input")
              .eq(4)
              .click()
              .type("{leftarrow}{leftarrow}");

            cy.findAllByLabelText("pinbox-input").eq(2).should("have.focus");
          });
        });

        context("when pressing backspace", () => {
          it("doesn't change it's value", () => {
            cy.findAllByLabelText("pinbox-input")
              .eq(0)
              .click()
              .type("{backspace}");

            cy.findAllByLabelText("pinbox-input")
              .eq(0)
              .should("have.value", "S");
          });
        });
      });
    });
  });

  context("Masked", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-pinbox--masked"));
    });

    context("when given", () => {
      it("should mask input characters after delay", () => {
        cy.findAllByLabelText("pinbox-input")
          .eq(1)
          .type("A")
          .should("have.value", "A");

        cy.wait(600);
        cy.findAllByLabelText("pinbox-input").eq(1).should("have.value", "•");
      });
    });
  });

  context("Disabled", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-pinbox--disabled"));
    });

    context("when given", () => {
      it("should be disabled and show correct styles", () => {
        cy.findAllByLabelText("pinbox-input").eq(1).should("be.disabled");

        cy.findAllByLabelText("pinbox-input")
          .eq(1)
          .should("have.css", "background-color", "rgb(249, 250, 251)");
        cy.findAllByLabelText("pinbox-input")
          .eq(1)
          .should("have.css", "opacity", "0.6");
        cy.findAllByLabelText("pinbox-input")
          .eq(1)
          .should("have.css", "border-color", "rgba(0, 0, 0, 0.3)");
      });
    });
  });

  context("Error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-pinbox--error"));
    });

    context("when given", () => {
      it("should show error styles and error message", () => {
        cy.findAllByLabelText("pinbox-input").eq(1).type("Z");

        cy.findAllByLabelText("pinbox-input")
          .eq(1)
          .should("have.css", "border-color", "rgb(248, 113, 113)");
        cy.findAllByLabelText("pinbox-input")
          .eq(1)
          .should("have.css", "color", "rgb(153, 27, 27)");

        cy.contains("Error value").should("be.visible");
      });
    });
  });
});
