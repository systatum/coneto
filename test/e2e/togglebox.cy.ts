import { getIdContent } from "test/support/commands";

describe("Togglebox", () => {
  const onClickToggle = () => cy.findByLabelText("togglebox-wrapper").click();

  context("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-togglebox--default"));
    });

    it("should toggle checkbox state on click", () => {
      onClickToggle();
      cy.get("input[type=checkbox]").should("be.checked");
    });
  });

  context("with icon", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-togglebox--with-icon"));
    });

    context("when clicking", () => {
      it("should toggle with icon and change state", () => {
        onClickToggle();
        cy.get("input[type=checkbox]").should("be.checked");
      });
    });
  });

  context("with icon and loading", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-togglebox--with-icon-and-loading"));
    });

    it("should show loading state (circle) after toggle", () => {
      onClickToggle();
      cy.get("input[type=checkbox]").should("be.checked");

      cy.findByLabelText("circle", { timeout: 1500 }).should("exist");
    });
  });

  context("with description", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-togglebox--with-description"));
    });

    it("should render label and description", () => {
      cy.findByText("Click and load").should("exist");
      cy.findByText("Click and you will see a loading icon").should("exist");
    });

    context("when clicking", () => {
      it("should show loading indicator", () => {
        onClickToggle();
        cy.get("input[type=checkbox]").should("be.checked");

        cy.findByLabelText("circle", { timeout: 1500 }).should("exist");
        cy.findByLabelText("circle", { timeout: 1500 }).should("not.exist");
      });
    });
  });

  context("with error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-togglebox--with-error"));
    });

    it("should show error message", () => {
      cy.findByText("Must add value on togglebox").should("exist");
    });

    context("when clicking", () => {
      it("should hide error message", () => {
        onClickToggle();
        cy.get("input[type=checkbox]").should("be.checked");
        cy.findByText("Must add value on togglebox").should("not.exist");
      });
    });
  });
});
