import marked from "./../../lib/marked/marked";
import { RichEditor } from "./../../components/rich-editor";
import { useEffect, useState } from "react";

describe("RichEditor", () => {
  context("selection behavior", () => {
    context("when selecting bold text outside the editor", () => {
      it("does not update the editor bold state", () => {
        function Wrapper() {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <RichEditor value="test" />
              <div
                data-testid="external-bold"
                style={{
                  fontWeight: "bold",
                }}
              >
                This is text with font bold
              </div>
            </div>
          );
        }

        cy.mount(<Wrapper />);
        cy.findAllByLabelText("rich-editor-toolbar-button")
          .eq(0)
          .should("have.attr", "aria-pressed", "false");

        cy.get('[data-testid="external-bold"]').then(($el) => {
          cy.window().then((win) => {
            const range = win.document.createRange();
            range.selectNodeContents($el[0]);

            const sel = win.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          });
        });

        cy.findAllByLabelText("rich-editor-toolbar-button")
          .eq(0)
          .should("have.attr", "aria-pressed", "false");
      });
    });

    context("when selecting italic text outside the editor", () => {
      it("does not update the editor italic state", () => {
        function Wrapper() {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <RichEditor value="test" />
              <div
                data-testid="external-italic"
                style={{
                  fontStyle: "italic",
                }}
              >
                This is text with font italic
              </div>
            </div>
          );
        }

        cy.mount(<Wrapper />);
        cy.findAllByLabelText("rich-editor-toolbar-button")
          .eq(1)
          .should("have.attr", "aria-pressed", "false");

        cy.get('[data-testid="external-italic"]').then(($el) => {
          cy.window().then((win) => {
            const range = win.document.createRange();
            range.selectNodeContents($el[0]);

            const sel = win.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          });
        });

        cy.findAllByLabelText("rich-editor-toolbar-button")
          .eq(1)
          .should("have.attr", "aria-pressed", "false");
      });
    });
  });

  context("with mounted-state guard", () => {
    it("safely aborts async parsing after unmount", () => {
      cy.stub(marked, "parse").callsFake(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve("<p>test</p>"), 50);
          })
      );

      function Wrapper() {
        const [show, setShow] = useState(true);

        useEffect(() => {
          setShow(false);
        }, []);

        return show ? <RichEditor value="test" /> : null;
      }

      cy.mount(<Wrapper />);

      cy.wait(60);
    });
  });

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
Paragraph line 4`;
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
