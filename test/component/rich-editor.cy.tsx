import { RichEditor } from "./../../components/rich-editor";

describe("RichEditor", () => {
  context("preprocessed value", () => {
    context("paragraph", () => {
      context("when the next line have empty space", () => {
        it("should render exactly as the expected value", () => {
          const input = `Paragraph line 1


Paragraph line 2`;
          cy.mount(<RichEditor value={input} />);
          cy.findByRole("textbox")
            .invoke("text")
            .should("eq", "Paragraph line 1\n\n\nParagraph line 2\n");
        });
      });

      context("when the next line all paragraph", () => {
        it("should render exactly as the expected value", () => {
          const input = `Paragraph line 1
Paragraph line 2
Paragraph line 3
Paragraph line 4
`;
          cy.mount(<RichEditor value={input} />);
          cy.findByRole("textbox")
            .invoke("text")
            .should(
              "eq",
              "Paragraph line 1\nParagraph line 2\nParagraph line 3\nParagraph line 4\n"
            );
        });
      });

      context("when the next line is paragraph", () => {
        it("should render exactly as the expected value", () => {
          const input = `Paragraph line 1
Paragraph line 2`;
          cy.mount(<RichEditor value={input} />);
          cy.findByRole("textbox")
            .invoke("text")
            .should("eq", "Paragraph line 1\nParagraph line 2\n");
        });
      });
    });

    context("ordered/unordered list", () => {
      context("when the next line is paragraph", () => {
        it("should render normally", () => {
          const input = `- Unordered list
Paragraph line`;
          cy.mount(<RichEditor value={input} />);
          cy.findByRole("textbox")
            .invoke("text")
            .should("eq", "\nUnordered list\n\nParagraph line\n");
        });
      });

      context("when a lot of list", () => {
        it("should render list as usual", () => {
          const input = `- Unordered list 1
- Unordered list 2
- Unordered list 3`;
          cy.mount(<RichEditor value={input} />);
          cy.findByRole("textbox")
            .invoke("text")
            .should(
              "eq",
              "\nUnordered list 1\nUnordered list 2\nUnordered list 3\n\n"
            );
        });
      });
    });
  });
});
