import { getIdContent } from "test/support/commands";

describe("Capsule", () => {
  context("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-capsule--default"));
    });

    context("when pressing", () => {
      it("should allow changing active state", () => {
        cy.findByText("List").should("exist").click();
        cy.wait(400);
        cy.findByText("New").should("exist").click();
      });
    });
  });

  context("With Icon", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-capsule--with-icon"));
    });

    it("should renders the icon", () => {
      cy.findByText("List").should("exist").click();
      cy.wait(400);
      cy.findByText("New").should("exist").click();
      cy.findAllByLabelText("capsule-icon").eq(0).should("exist");
      cy.findAllByLabelText("capsule-icon").eq(1).should("exist");
    });
  });
});
