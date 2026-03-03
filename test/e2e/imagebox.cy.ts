import { getIdContent } from "test/support/commands";

describe("Imagebox Component", () => {
  context("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-imagebox--size"));
    });

    it("Should replace the preview when a new image is uploaded", () => {
      const firstImage = "test/fixtures/test-images/sample-1.jpg";

      cy.get('input[type="file"]')
        .eq(0)
        .selectFile(firstImage, { force: true });
      cy.get("img").should("exist");
    });
  });
});
