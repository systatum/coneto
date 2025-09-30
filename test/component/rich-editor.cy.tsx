import { RichEditor } from "./../../components/rich-editor";

describe("RichEditor", () => {
  context("preprocessed value", () => {
    context("paragraph", () => {
      context("when the next line have empty space", () => {
        // Number 1 replace on `preprocessMarkdown`.
        // Replace multiple newlines with <br> (sometime marked can't like WYSIWYG)
        //    .replace(/\n(\n+)/g, (_, extraNewlines) => {
        //   const emptyParagraphs = "\n\n<br>".repeat(extraNewlines.length);
        //   return "\n" + emptyParagraphs;
        // })
        it("should render like WYSIWYG (not ", () => {
          const input = `Paragraph line 1
        

Paragraph line 2`;
          cy.mount(<RichEditor value={input} />);
          const preprocessed = preprocessMarkdown(input);

          expect(preprocessed).to.contain(
            "Paragraph line 1\n        \n\n\n<br>Paragraph line 2"
          );
        });
      });

      context("when the next line all paragraph", () => {
        // Number 2 replace on `preprocessMarkdown`.
        // Ensure that a <br> followed by a line starts a new paragraph
        // .replace(/<br>\n([^\s\n<][^\n]*)/g, "<br>\n\n$1")
        it("should render like WYSIWYG (not ", () => {
          const input = `Paragraph line 1
Paragraph line 2
Paragraph line 3
Paragraph line 4
`;
          cy.mount(<RichEditor value={input} />);
          const preprocessed = preprocessMarkdown(input);

          expect(preprocessed).to.contain(
            "Paragraph line 1\n\nParagraph line 2\n\nParagraph line 3\n\nParagraph line 4\n"
          );
        });
      });

      context("when the next line is paragraph", () => {
        // Number 3 replace on `preprocessMarkdown`.
        // When same as element paragraph, but different line -> marked can't read this.
        // without this, sometime paragraphs may merge into one
        // Example: "Hello\nWorld" => "Hello\n\nWorld"
        // .replace(
        //   /^(\s*(?:[\*\-\+]|\d+\.)\s+[^\n]+)\n(?![\s\*\-\+\d<\n])([^\n]+)/gm,
        //   "$1\n\n$2"
        // )
        it("should render like WYSIWYG (not ", () => {
          const input = `Paragraph line 1
Paragraph line 2`;
          cy.mount(<RichEditor value={input} />);
          const preprocessed = preprocessMarkdown(input);

          expect(preprocessed).to.contain(
            "Paragraph line 1\n\nParagraph line 2"
          );
        });
      });
    });

    context("ordered/unordered list", () => {
      context("when the next line is paragraph", () => {
        // number 4 replace on `preprocessMarkdown`.
        //    .replace(
        //   /^(\s*(?:[\*\-\+]|\d+\.)\s+[^\n]+)\n(?![\s\*\-\+\d<\n])([^\n]+)/gm,
        //   "$1\n\n$2"
        // )
        it("should render normally", () => {
          const input = `- Unordered list
Paragraph line`;
          cy.mount(<RichEditor value={input} />);
          const preprocessed = preprocessMarkdown(input);

          expect(preprocessed).to.contain("- Unordered list\n\nParagraph line");
        });
      });

      context("when a lot of list", () => {
        it("should render list as usual", () => {
          const input = `- Unordered list 1
- Unordered list 2
- Unordered list 3`;
          cy.mount(<RichEditor value={input} />);
          const preprocessed = preprocessMarkdown(input);

          expect(preprocessed).to.contain(
            "- Unordered list 1\n- Unordered list 2\n- Unordered list 3"
          );
        });
      });
    });
  });
});

const preprocessMarkdown = (markdown: string) => {
  return markdown
    .replace(/\n(\n+)/g, (_, extraNewlines) => {
      const emptyParagraphs = "\n\n<br>".repeat(extraNewlines.length);
      return "\n" + emptyParagraphs;
    })
    .replace(/<br>\n([^\s\n<][^\n]*)/g, "<br>\n\n$1")
    .replace(/([^\n])\n([a-zA-Z])/g, "$1\n\n$2")
    .replace(
      /^(\s*(?:[\*\-\+]|\d+\.)\s+[^\n]+)\n(?![\s\*\-\+\d<\n])([^\n]+)/gm,
      "$1\n\n$2"
    );
};
