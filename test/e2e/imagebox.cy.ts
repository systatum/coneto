import { getIdContent } from "test/support/commands";

context("Imagebox Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-imagebox--extra-small"));
    });

    it("Should replace the preview when a new image is uploaded", () => {
      const firstImage = "test/fixtures/test-images/sample-1.jpg";

      cy.get('input[type="file"]').selectFile(firstImage, { force: true });
      cy.get("img").should("exist");
    });
  });
});
