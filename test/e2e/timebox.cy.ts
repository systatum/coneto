import { getIdContent } from "test/support/commands";

describe("Timebox", () => {
  context("when on HH:MM", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-timebox--default"));
    });

    context("when typing", () => {
      it("renders the input with value and move automaticaly", () => {
        cy.findByPlaceholderText("HH").clear().type("1430");
        cy.findByPlaceholderText("HH").should("have.value", "14");
        cy.findByPlaceholderText("MM").should("have.value", "30");
      });

      context("when more than maximum allowed time", () => {
        it("should move to the next field and transfer the value", () => {
          cy.findByPlaceholderText("HH").clear().type("25");
          cy.findByPlaceholderText("HH").should("have.value", "2");
          cy.findByPlaceholderText("MM").should("have.value", "5");
        });
      });

      context("when pressing backspace", () => {
        it("should move to the previous input", () => {
          cy.findByPlaceholderText("HH")
            .clear()
            .type("25{backspace}{backspace}");
          cy.findByPlaceholderText("HH")
            .should("have.value", "2")
            .and("be.focused");
        });
      });

      context("when pressing colon", () => {
        it("should move to the next input", () => {
          cy.findByPlaceholderText("HH").clear().type("4:");
          cy.findByPlaceholderText("HH")
            .should("have.value", "4")
            .and("not.be.focused");
          cy.findByPlaceholderText("MM")
            .should("have.value", "")
            .and("be.focused");
        });
      });
    });
  });

  context("when on HH:MM:SS", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-timebox--with-seconds"));
    });

    context("when typing", () => {
      it("renders the input with value and move automaticaly", () => {
        cy.findByPlaceholderText("HH").clear().type("143000");
        cy.findByPlaceholderText("HH").should("have.value", "14");
        cy.findByPlaceholderText("MM").should("have.value", "30");
        cy.findByPlaceholderText("SS").should("have.value", "00");
      });

      context("when more than maximum allowed time", () => {
        it("should move to the next field and transfer the value", () => {
          cy.findByPlaceholderText("HH").clear().type("25");
          cy.findByPlaceholderText("HH").should("have.value", "2");
          cy.findByPlaceholderText("MM").should("have.value", "5");
        });
      });

      context("when pressing backspace", () => {
        it("should move to the previous input", () => {
          cy.findByPlaceholderText("HH")
            .clear()
            .type("25{backspace}{backspace}");
          cy.findByPlaceholderText("HH")
            .should("have.value", "2")
            .and("be.focused");
        });
      });

      context("when pressing colon", () => {
        it("should move to the next input", () => {
          cy.findByPlaceholderText("HH").clear().type("25:");
          cy.findByPlaceholderText("HH")
            .should("have.value", "2")
            .and("not.be.focused");
          cy.findByPlaceholderText("MM")
            .should("have.value", "5")
            .and("not.be.focused");
          cy.findByPlaceholderText("SS")
            .should("have.value", "")
            .and("be.focused");
        });
      });
    });
  });

  context("with live time", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-timebox--with-live-time"));
    });

    it("should render a non-editable timebox with current time", () => {
      cy.findByPlaceholderText("HH").should("have.attr", "disabled");
      cy.findByPlaceholderText("MM").should("have.attr", "disabled");
      cy.findByPlaceholderText("SS").should("have.attr", "disabled");
    });
  });

  context("with error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-timebox--with-error"));
    });

    it("should show error initially and validate on input", () => {
      cy.contains("This field is required").should("exist");

      cy.findByPlaceholderText("HH").clear().type("13");

      cy.contains("This field is required").should("not.exist");
    });
  });
});
