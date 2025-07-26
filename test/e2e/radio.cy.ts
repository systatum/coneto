import { getIdContent } from "test/support/commands";

context("Radio Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-radio--default"));
    });

    it("Should select second radio option", () => {
      cy.findByText("Mentions").click();
    });
  });

  describe("With Description", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-radio--with-description"));
    });

    it("Should select radio option and data title/description exists", () => {
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
