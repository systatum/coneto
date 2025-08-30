import { RichEditor } from "./../../components/rich-editor";

describe("RichEditor", () => {
  context("heading tip menu", () => {
    context("when click", () => {
      beforeEach(() => {
        cy.mount(<RichEditor />);
        cy.findAllByLabelText("rich-editor-toolbar-button").eq(4).click();
      });
      it("renders heading menu items", () => {
        cy.contains("Heading 1").should("exist");
        cy.contains("Heading 2").should("exist");
        cy.contains("Heading 3").should("exist");
      });

      it("renders background color active", () => {
        cy.findAllByLabelText("rich-editor-toolbar-button").eq(4).click();
        cy.contains("Heading 1").should("exist");
        cy.contains("Heading 2").should("exist");
        cy.contains("Heading 3").should("exist");
      });
    });

    context("when hover", () => {
      it("renders background color hover", () => {
        cy.mount(<RichEditor />);
        cy.findAllByLabelText("rich-editor-toolbar-button")
          .eq(4)
          .realHover()
          .wait(150)
          .should("have.css", "background-color", "rgb(229, 231, 235)");
      });
    });
  });
});
