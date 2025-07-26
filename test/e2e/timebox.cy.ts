import { getIdContent } from "test/support/commands";

context("Timebox Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-timebox--default"));
    });

    it("should allow entering hours and minutes", () => {
      cy.findByPlaceholderText("HH")
        .clear()
        .type("13")
        .should("have.value", "13");
      cy.findByPlaceholderText("MM")
        .clear()
        .type("45")
        .should("have.value", "45");
    });
  });

  describe("WithSeconds", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-timebox--with-seconds"));
    });

    it("should allow entering hours, minutes, and seconds", () => {
      cy.findByPlaceholderText("HH")
        .clear()
        .type("13")
        .should("have.value", "13");
      cy.findByPlaceholderText("MM")
        .clear()
        .type("45")
        .should("have.value", "45");
      cy.findByPlaceholderText("SS")
        .clear()
        .type("30")
        .should("have.value", "30");
    });

    it("Should input time with new behaviour arrow and enter", () => {
      cy.findByPlaceholderText("HH")
        .clear()
        .type("14{rightarrow}30{rightarrow}00{enter}");
    });
  });

  describe("WithLiveTime", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-timebox--with-live-time"));
    });

    it("should render a non-editable timebox with current time", () => {
      cy.findByPlaceholderText("HH").should("have.attr", "disabled");
      cy.findByPlaceholderText("MM").should("have.attr", "disabled");
      cy.findByPlaceholderText("SS").should("have.attr", "disabled");
    });
  });

  describe("WithError", () => {
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
