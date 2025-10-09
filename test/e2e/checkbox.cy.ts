import { getIdContent } from "test/support/commands";

describe("Checkbox", () => {
  context("when default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-checkbox--default"));
    });

    context("when clicking", () => {
      it("should have checked value on checkbox", () => {
        cy.findByRole("checkbox").click();
        cy.findByRole("checkbox").should("be.checked");
      });
    });
  });

  context("with description", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-checkbox--with-description"));
    });

    const CHECKBOX_OPTIONS = [
      {
        label: "Email",
        description: "Receive updates via email",
      },
      {
        label: "Push Notifications",
        description: "Receive updates via push notifications",
      },
      {
        label: "SMS",
        description: "Receive updates via text messages",
      },
    ];

    context("when given", () => {
      it("should render label & description", () => {
        CHECKBOX_OPTIONS.forEach((data) => {
          cy.findByText(data.label).should("exist").click();
          cy.findByText(data.description).should("exist");
        });
      });
    });
  });

  context("with error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-checkbox--with-error"));
    });

    context("when not qualified", () => {
      it("should show error", () => {
        cy.findByText("Please select an option before continuing.").should(
          "exist"
        );
      });
    });

    context("when clicking", () => {
      it("should remove error", () => {
        cy.findByRole("checkbox").click();
        cy.findByText("Please select an option before continuing.").should(
          "not.exist"
        );
      });
    });
  });

  context("when error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-checkbox--disabled"));
    });

    context("when given", () => {
      it("shouldn't checked value", () => {
        cy.findAllByRole("checkbox")
          .eq(0)
          .should("not.be.checked")
          .and("be.disabled");
        cy.findAllByRole("checkbox")
          .eq(0)
          .should("have.css", "cursor", "not-allowed");
      });
    });
  });
});
