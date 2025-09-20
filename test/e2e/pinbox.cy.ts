import { getIdContent } from "test/support/commands";

describe("Pinbox", () => {
  context("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-pinbox--default"));
    });

    context("when typing", () => {
      it("should render text value", () => {
        cy.findAllByLabelText("pinbox-input").eq(1).type("A");
        cy.findAllByLabelText("pinbox-input").eq(2).type("1");
        cy.findAllByLabelText("pinbox-input").eq(3).type("B");
        cy.findAllByLabelText("pinbox-input").eq(5).type("9");

        const contentExpected = ["S", "A", "1", "B", "-", "9"];

        contentExpected.forEach((data, index) => {
          cy.findAllByLabelText("pinbox-input")
            .eq(index)
            .should("have.value", data);
        });
      });
    });

    context("when typed and backspace", () => {
      it("should delete values and focus on the last deleted", () => {
        cy.findAllByLabelText("pinbox-input").eq(1).type("A");
        cy.findAllByLabelText("pinbox-input").eq(2).type("1");
        cy.findAllByLabelText("pinbox-input").eq(3).type("B");
        cy.findAllByLabelText("pinbox-input")
          .eq(5)
          .type("9")
          .type("{backspace}{backspace}");
        cy.findAllByLabelText("pinbox-input").eq(3).should("be.focused");

        const contentExpected = ["S", "A", "1", "B", "-", ""];

        contentExpected.forEach((data, index) => {
          cy.findAllByLabelText("pinbox-input")
            .eq(index)
            .should("have.value", data);
        });
      });
    });

    context("when click static", () => {
      it("shouldn't change value", () => {
        cy.findAllByLabelText("pinbox-input")
          .eq(0)
          .click()
          .type("t")
          .should("have.value", "S");
      });
    });

    context("when click, type on static and keydown right", () => {
      it("shouldn't change value first, add second input, and focus on third input", () => {
        cy.findAllByLabelText("pinbox-input")
          .eq(0)
          .click()
          .type("t{rightarrow}a");
        cy.findAllByLabelText("pinbox-input").eq(0).should("have.value", "S");
        cy.findAllByLabelText("pinbox-input").eq(1).should("have.value", "a");
        cy.findAllByLabelText("pinbox-input").eq(2).should("have.focus");
      });
    });

    context("when enter arrow right and arrow left", () => {
      it("should render focus after enter keydown", () => {
        cy.findAllByLabelText("pinbox-input")
          .eq(0)
          .click()
          .type("{rightarrow}{rightarrow}{rightarrow}");

        cy.findAllByLabelText("pinbox-input").eq(3).should("have.focus");
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
