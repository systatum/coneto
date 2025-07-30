import { getIdContent } from "test/support/commands";

context("FileInputBox Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-fileinputbox--default")); // Adjust if your story ID is different
    });

    it("Should accept and display a single uploaded file", () => {
      cy.findByLabelText("fileinputbox").selectFile(
        ["test/fixtures/test-images/sample-1.jpg"],
        {
          action: "drag-drop",
          force: true,
        }
      );

      cy.contains("sample-1.jpg").should("exist");
    });
  });
});
