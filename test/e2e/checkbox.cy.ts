import { getIdContent } from "test/support/commands";

context("Checkbox Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-checkbox--default"));
    });

    it("Should be click on checkbox", () => {
      cy.get("input[type='checkbox']").click();
    });
  });

  describe("With Description", () => {
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

    it("Should have content with label & description and clickable", () => {
      CHECKBOX_OPTIONS.forEach((data) => {
        cy.findByText(data.label).should("exist").click();
        cy.findByText(data.description).should("exist");
      });
    });
  });

  describe("With Error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-checkbox--with-error"));
    });

    it("Should show red border when unchecked", () => {
      cy.findByText("You must agree before continuing").should("exist");
    });

    it("Should remove error border after checked", () => {
      cy.findByRole("checkbox").click();
      cy.findByText("You must agree before continuing").should("not.exist");
    });
  });
});
