import { getIdContent } from "test/support/commands";

describe("FileDropBox", () => {
  context("default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-filedropbox--default"));
    });

    context("when drag and drop", () => {
      it("should accept and upload multiple files", () => {
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
      });
    });
  });

  context("with error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-filedropbox--error"));
    });

    context("when failed", () => {
      it("shows upload error message", () => {
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
});
