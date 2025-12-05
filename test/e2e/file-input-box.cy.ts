import { getIdContent } from "test/support/commands";

describe("FileInputBox", () => {
  context("when multiple", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-fileinputbox--default"));
    });

    context("when drag and drop", () => {
      it("renders multiple file", () => {
        cy.contains("sample-1.jpg").should("not.exist");
        cy.contains("sample-2.jpg").should("not.exist");
        cy.findByLabelText("fileinputbox").selectFile(
          [
            "test/fixtures/test-images/sample-1.jpg",
            "test/fixtures/test-images/sample-2.jpg",
          ],
          {
            action: "drag-drop",
            force: true,
          }
        );

        cy.contains("sample-1.jpg").should("exist");
        cy.contains("sample-2.jpg").should("exist");
      });

      context("when click close", () => {
        it("should remove file", () => {
          cy.contains("sample-1.jpg").should("not.exist");
          cy.contains("sample-2.jpg").should("not.exist");
          cy.findByLabelText("fileinputbox").selectFile(
            [
              "test/fixtures/test-images/sample-1.jpg",
              "test/fixtures/test-images/sample-2.jpg",
            ],
            {
              action: "drag-drop",
              force: true,
            }
          );

          cy.contains("sample-1.jpg").should("exist");
          cy.contains("sample-2.jpg").should("exist");

          cy.findAllByLabelText("delete-button").eq(0).click();
          cy.contains("sample-1.jpg").should("not.exist");
        });
      });
    });
  });

  context("with error", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-fileinputbox--with-error"));
    });

    it("renders an error message", () => {
      cy.contains("At least one file is required").should("exist");
    });

    context("when drag and drop", () => {
      it("should remove the error message", () => {
        cy.contains("At least one file is required").should("exist");

        cy.contains("sample-1.jpg").should("not.exist");
        cy.contains("sample-2.jpg").should("not.exist");
        cy.findByLabelText("fileinputbox").selectFile(
          [
            "test/fixtures/test-images/sample-1.jpg",
            "test/fixtures/test-images/sample-2.jpg",
          ],
          {
            action: "drag-drop",
            force: true,
          }
        );

        cy.contains("sample-1.jpg").should("exist");
        cy.contains("sample-2.jpg").should("exist");

        cy.contains("At least one file is required").should("not.exist");
      });
    });
  });
});
