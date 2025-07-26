import { getIdContent } from "test/support/commands";

context("FileDropBox Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-filedropbox--default"));
    });

    it("Should accept and upload multiple files", () => {
      cy.findByLabelText("filedropbox").selectFile(
        [
          "test/fixtures/test-images/sample-1.jpg",
          "test/fixtures/test-images/sample-2.jpg",
        ],
        {
          action: "drag-drop",
          force: true,
        }
      );

      cy.contains(/Uploading/).should("exist");

      cy.wait(4000);

      cy.contains(/Upload complete!/).should("exist");
    });
  });

  describe("Error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-filedropbox--error"));
    });

    it("Shows upload error message when some files fail to upload", () => {
      cy.findByLabelText("filedropbox").selectFile(
        [
          "test/fixtures/test-images/sample-1.jpg",
          "test/fixtures/test-images/sample-2.jpg",
        ],
        {
          action: "drag-drop",
          force: true,
        }
      );

      cy.contains(/Uploading/).should("exist");

      cy.wait(4000);

      cy.contains(/Upload complete! Succeed: 1, Failed: 1/).should("exist");
    });
  });
});
