import { getIdContent } from "test/support/commands";

describe("Radio", () => {
  context("when default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-radio--default"));
    });

    context("when clicking", () => {
      it("should selected option", () => {
        cy.findByText("Mentions").click();
        cy.findAllByRole("radio").eq(1).should("be.checked");
      });
    });
  });

  context("with description", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-radio--with-description"));
    });

    context("when given", () => {
      it("renders the radio and text", () => {
        cy.findByText("Mentions").click();

        const RADIO_OPTIONS = [
          {
            label: "Comments",
            description: "Get notified when someone posts a comment",
          },
          {
            label: "Mentions",
            description: "Get notified when someone mentions you",
          },
          {
            label: "Follows",
            description: "Get notified when someone follows you",
          },
          {
            label: "None",
            description: "Don't notify me",
          },
        ];

        RADIO_OPTIONS.forEach((data) => {
          cy.findByText(data.label).should("exist");
          cy.findByText(data.description).should("exist");
        });
      });
    });
  });

  context("with error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-radio--with-error"));
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
        cy.findByText("Comments").click();
        cy.findByText("Please select an option before continuing.").should(
          "not.exist"
        );
      });
    });
  });

  context("when disabled", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-radio--disabled"));
    });

    context("when given", () => {
      it("shouldn't checked value", () => {
        cy.findAllByRole("radio")
          .eq(0)
          .should("not.be.checked")
          .and("be.disabled");
        cy.findAllByRole("radio")
          .eq(0)
          .should("have.css", "cursor", "not-allowed");
      });
    });
  });
});
