import { getIdContent } from "test/support/commands";

describe("Toggle", () => {
  const onClickToggle = () => cy.findByLabelText("toggle-wrapper").click();

  context("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-toggle--default"));
    });

    it("should toggle checkbox state on click", () => {
      onClickToggle();
      cy.get("input[type=checkbox]").should("be.checked");
    });
  });

  context("with icon", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-toggle--with-icon"));
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
      cy.visit(getIdContent("input-elements-toggle--with-icon-and-loading"));
    });

    it("should show loading state (circle) after toggle", () => {
      onClickToggle();
      cy.get("input[type=checkbox]").should("be.checked");
      cy.findByLabelText("circle", { timeout: 1500 }).should("exist");
    });
  });

  context("with description", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-toggle--with-description"));
    });

    it("should render label and description", () => {
      cy.findByText("Click and load").should("exist");
      cy.findByText("Click and you will see a loading icon").should("exist");
    });

    context("when clicking", () => {
      it("should show loading indicator", () => {
        onClickToggle();
        cy.get("input[type=checkbox]").should("be.checked");

        cy.findByLabelText("circle").should("exist");
        cy.wait(2000);
        cy.findByLabelText("circle").should("not.exist");
      });
    });
  });

  context("with error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-toggle--with-error"));
    });

    it("should show error message", () => {
      cy.findByText("Must add value on toggle").should("exist");
    });

    context("when clicking", () => {
      it("should hide error message", () => {
        onClickToggle();
        cy.get("input[type=checkbox]").should("be.checked");
        cy.findByText("Must add value on toggle").should("not.exist");
      });
    });
  });
});
