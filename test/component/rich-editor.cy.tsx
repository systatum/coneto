import marked from "./../../lib/marked/marked";
import {
  RichEditor,
  RichEditorCodeAction,
  RichEditorProps,
  RichEditorRef,
} from "./../../components/rich-editor";
import { useEffect, useRef, useState } from "react";
import { RiArrowRightSLine, RiPrinterFill } from "@remixicon/react";
import { generateSentence } from "./../../lib/text";
import { Badge } from "./../../components/badge";

describe("RichEditor", () => {
  function ProductRichEditor(props: RichEditorProps) {
    const [value, setValue] = useState(props?.value ?? "test");

    const CODE_EDITOR_ACTIONS: RichEditorCodeAction[] = [
      {
        icon: {
          image: RiArrowRightSLine,
        },
        children: "Run",
        onClick: ({ code }) => console.log(`compile the content: ${code}`),
      },
    ];

    const TOOLBAR_RIGHT_PANEL_ACTIONS = (
      <RichEditor.ToolbarButton
        ariaLabel="toolbar-print"
        icon={{ image: RiPrinterFill }}
        onClick={() => {
          console.log(value);
        }}
      >
        Print
      </RichEditor.ToolbarButton>
    );

    return (
      <RichEditor
        value={value}
        onChange={(val) => setValue(val)}
        toolbarRightPanel={TOOLBAR_RIGHT_PANEL_ACTIONS}
        codeEditor={{ actions: CODE_EDITOR_ACTIONS }}
        {...props}
      />
    );
  }

  context.only("formatting rule", () => {
    it("renders except checkboxes and code", () => {
      cy.mount(<ProductRichEditor />);

      cy.findByLabelText("rich-editor-toolbar-bold").should("exist");
      cy.findByLabelText("rich-editor-toolbar-italic").should("exist");
      cy.findByLabelText("rich-editor-toolbar-underline").should("exist");
      cy.findByLabelText("rich-editor-toolbar-ordered-list").should("exist");
      cy.findByLabelText("rich-editor-toolbar-unordered-list").should("exist");
      cy.findByLabelText("rich-editor-toolbar-heading-menu").should("exist");

      cy.findByLabelText("rich-editor-toolbar-checkbox").should("not.exist");
      cy.findByLabelText("rich-editor-toolbar-code-block").should("not.exist");
    });

    context("when make all false", () => {
      it("renders without action button", () => {
        cy.mount(
          <ProductRichEditor
            formatting={{
              allowBold: false,
              allowCheckBoxes: false,
              allowItalic: false,
              allowOrderedList: false,
              allowUnderline: false,
              allowUnorderedList: false,
            }}
          />
        );

        cy.findByLabelText("rich-editor-toolbar-bold").should("not.exist");
        cy.findByLabelText("rich-editor-toolbar-italic").should("not.exist");
        cy.findByLabelText("rich-editor-toolbar-underline").should("not.exist");
        cy.findByLabelText("rich-editor-toolbar-ordered-list").should(
          "not.exist"
        );
        cy.findByLabelText("rich-editor-toolbar-unordered-list").should(
          "not.exist"
        );
        cy.findByLabelText("rich-editor-toolbar-heading-menu").should(
          "not.exist"
        );

        cy.findByLabelText("rich-editor-toolbar-checkbox").should("not.exist");
        cy.findByLabelText("rich-editor-toolbar-code-block").should(
          "not.exist"
        );
      });
    });

    context("initial value", () => {
      context("bold", () => {
        context("with true", () => {
          it("renders the markdown with **", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });
            cy.mount(<ProductRichEditor value="**Test**" />);
            cy.findByLabelText("toolbar-print").click();

            cy.get("@consoleLog").should("have.been.calledWith", "**Test**");
          });

          it("renders the html with <strong>", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });
            cy.mount(<ProductRichEditor value="**Test**" />);

            cy.findByRole("textbox")
              .invoke("html")
              .then((html) => html.replace(/\n/g, ""))
              .should("eq", "<p><strong>Test</strong></p>");
          });
        });

        context("with false", () => {
          it("renders on the markdown without **", () => {});
          it("renders on the markdown without <b>", () => {});
        });
      });

      context("italic", () => {
        context("with true", () => {
          it("renders the markdown with _", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.mount(<ProductRichEditor value="_Test_" />);

            cy.findByLabelText("toolbar-print").click();

            cy.get("@consoleLog").should("have.been.calledWith", "_Test_");
          });

          it("renders the html with <em>", () => {
            cy.mount(<ProductRichEditor value="_Test_" />);

            cy.findByRole("textbox")
              .invoke("html")
              .then((html) => html.replace(/\n/g, ""))
              .should("eq", "<p><em>Test</em></p>");
          });
        });

        context("with false", () => {
          it("renders the markdown without _", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.mount(<ProductRichEditor value="Test" />);

            cy.findByLabelText("toolbar-print").click();

            cy.get("@consoleLog").should("have.been.calledWith", "Test");
          });

          it("renders the html without <em>", () => {
            cy.mount(<ProductRichEditor value="Test" />);

            cy.findByRole("textbox")
              .invoke("html")
              .then((html) => html.replace(/\n/g, ""))
              .should("eq", "<p>Test</p>");
          });
        });
      });

      context("underline", () => {
        context("with true", () => {
          it("renders the markdown with <u>", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.mount(<ProductRichEditor value="<u>Test</u>" />);

            cy.findByLabelText("toolbar-print").click();

            cy.get("@consoleLog").should("have.been.calledWith", "<u>Test</u>");
          });

          it("renders the html with <u>", () => {
            cy.mount(<ProductRichEditor value="<u>Test</u>" />);

            cy.findByRole("textbox")
              .invoke("html")
              .then((html) => html.replace(/\n/g, ""))
              .should("eq", "<p><u>Test</u></p>");
          });
        });

        context("with false", () => {
          it("renders the markdown without <u>", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.mount(<ProductRichEditor value="Test" />);

            cy.findByLabelText("toolbar-print").click();

            cy.get("@consoleLog").should("have.been.calledWith", "Test");
          });

          it("renders the html without <u>", () => {
            cy.mount(<ProductRichEditor value="Test" />);

            cy.findByRole("textbox")
              .invoke("html")
              .then((html) => html.replace(/\n/g, ""))
              .should("eq", "<p>Test</p>");
          });
        });
      });

      context("unordered list", () => {
        context("with true", () => {
          it("renders the markdown with *", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.mount(<ProductRichEditor value="* Test" />);

            cy.findByLabelText("toolbar-print").click();

            cy.get("@consoleLog").should("have.been.calledWith", "* Test");
          });

          it("renders the html with <ul><li>", () => {
            cy.mount(<ProductRichEditor value="* Test" />);

            cy.findByRole("textbox")
              .invoke("html")
              .then((html) => html.replace(/\n/g, ""))
              .should("eq", "<ul><li>Test</li></ul>");
          });
        });

        context("with false", () => {
          it("renders the markdown without *", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.mount(<ProductRichEditor value="Test" />);

            cy.findByLabelText("toolbar-print").click();

            cy.get("@consoleLog").should("have.been.calledWith", "Test");
          });

          it("renders the html without <ul><li>", () => {
            cy.mount(<ProductRichEditor value="Test" />);

            cy.findByRole("textbox")
              .invoke("html")
              .then((html) => html.replace(/\n/g, ""))
              .should("eq", "<p>Test</p>");
          });
        });
      });

      context("ordered list", () => {
        context("with true", () => {
          it("renders the markdown with number", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.mount(<ProductRichEditor value="1. Test" />);

            cy.findByLabelText("toolbar-print").click();

            cy.get("@consoleLog").should("have.been.calledWith", "1. Test");
          });

          it("renders the html with <ol><li>", () => {
            cy.mount(<ProductRichEditor value="1. Test" />);

            cy.findByRole("textbox")
              .invoke("html")
              .then((html) => html.replace(/\n/g, ""))
              .should("eq", "<ol><li>Test</li></ol>");
          });
        });

        context("with false", () => {
          it("renders the markdown without number", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.mount(<ProductRichEditor value="Test" />);

            cy.findByLabelText("toolbar-print").click();

            cy.get("@consoleLog").should("have.been.calledWith", "Test");
          });

          it("renders the html without <ol><li>", () => {
            cy.mount(<ProductRichEditor value="Test" />);

            cy.findByRole("textbox")
              .invoke("html")
              .then((html) => html.replace(/\n/g, ""))
              .should("eq", "<p>Test</p>");
          });
        });
      });

      context("heading", () => {
        context("with true", () => {
          it("renders the markdown with #", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.mount(<ProductRichEditor value="# Test" />);

            cy.findByLabelText("toolbar-print").click();

            cy.get("@consoleLog").should("have.been.calledWith", "# Test");
          });

          it("renders the html with <h1>", () => {
            cy.mount(<ProductRichEditor value="# Test" />);

            cy.findByRole("textbox")
              .invoke("html")
              .then((html) => html.replace(/\n/g, ""))
              .should("eq", "<h1>Test</h1>");
          });
        });

        context("with false", () => {
          it("renders the markdown without #", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.mount(<ProductRichEditor value="Test" />);

            cy.findByLabelText("toolbar-print").click();

            cy.get("@consoleLog").should("have.been.calledWith", "Test");
          });

          it("renders the html without <h1>", () => {
            cy.mount(<ProductRichEditor value="Test" />);

            cy.findByRole("textbox")
              .invoke("html")
              .then((html) => html.replace(/\n/g, ""))
              .should("eq", "<p>Test</p>");
          });
        });
      });
    });
  });

  context("tokenRenderers", () => {
    function ProductRichEditorWithTokenRenderers() {
      const editorRef = useRef<RichEditorRef>(null);

      const [value, setValue] = useState(
        `The authentication redesign has been assigned to <{["alim"]}> . Please review the latest mockups before the standup.`
      );
      const [printValue, setPrintValue] = useState("");

      const TOOLBAR_RIGHT_PANEL_ACTIONS = (
        <RichEditor.ToolbarButton
          icon={{ image: RiPrinterFill }}
          onClick={() => {
            setPrintValue(value);
          }}
        >
          Print
        </RichEditor.ToolbarButton>
      );

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <RichEditor
            ref={editorRef}
            onChange={(e) => setValue(e)}
            onKeyDown={(e) => {
              if (e.key !== "[") return;

              const sel = window.getSelection();
              if (!sel || !sel.rangeCount) return;

              const range = sel.getRangeAt(0);
              const node = range.startContainer;
              if (node.nodeType !== Node.TEXT_NODE) return;

              const beforeCaret = (node.textContent ?? "").slice(
                0,
                range.startOffset
              );
              if (!beforeCaret.endsWith("<{")) return;

              e.preventDefault();

              const delRange = document.createRange();
              delRange.setStart(node, range.startOffset - 2);
              delRange.setEnd(node, range.startOffset);
              delRange.deleteContents();

              const tokenSpan = document.createElement("span");
              tokenSpan.dataset.tokenStart = "<{[";
              tokenSpan.dataset.tokenEnd = "]}>";
              tokenSpan.dataset.tokenWord = '"mention"';
              tokenSpan.dataset.tokenType = "custom-token-";

              const inner = document.createElement("span");
              inner.contentEditable = "false";
              tokenSpan.appendChild(inner);

              const zws = document.createTextNode("\u200B");

              const currentRange = sel.getRangeAt(0);
              currentRange.insertNode(zws);
              currentRange.insertNode(tokenSpan);

              const afterRange = document.createRange();
              afterRange.setStartAfter(zws);
              afterRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(afterRange);
            }}
            value={value}
            tokenRenderers={{
              "<{[": {
                endToken: "]}>",
                render: (word) => {
                  const parsed = JSON.parse(`[${word}]`);
                  const [username] = parsed;
                  return (
                    <Badge
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => {
                        const text =
                          (e.currentTarget as HTMLElement).innerText
                            ?.trim()
                            .replace(/^@/, "") ?? "";

                        const tokenSpan = (
                          e.currentTarget as HTMLElement
                        ).closest<HTMLElement>("[data-token-start]");

                        if (tokenSpan) {
                          tokenSpan.dataset.tokenWord = `"${text}"`;
                        }
                      }}
                      onBlur={() => {
                        // Always sync immediately on blur — no debounce needed
                        editorRef.current?.syncTokens();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Mention clicked:", username);
                      }}
                      withCircle
                      caption={`@${username}`}
                    />
                  );
                },
              },
            }}
            toolbarRightPanel={TOOLBAR_RIGHT_PANEL_ACTIONS}
          />
          {printValue !== "" && (
            <pre
              style={{
                padding: 28,
                background: "#D3D3D3",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {printValue}
            </pre>
          )}
        </div>
      );
    }

    context("when given rule with <{[{name}]}>", () => {
      context("when pressing backspace and control z", () => {
        context("when print the markdown", () => {
          it("should still renders properly markdown", () => {
            cy.mount(<ProductRichEditorWithTokenRenderers />);
            cy.findByRole("textbox")
              .findAllByLabelText("badge")
              .eq(0)
              .should("have.text", "@alim");
            cy.findByRole("textbox").type("{selectAll}{backspace}test");
            cy.findByText("Print").click();

            cy.get("pre").should("have.text", "test");
            cy.wait(300);

            cy.window().then((win) => {
              const editor = win.document.querySelector('[role="textbox"]');
              editor.dispatchEvent(
                new win.KeyboardEvent("keydown", {
                  key: "z",
                  metaKey: true,
                  bubbles: true,
                  cancelable: true,
                })
              );
              win.document.execCommand("undo");
            });
            cy.wait(300);
            cy.findByText("Print").click();

            cy.get("pre").should(
              "have.text",
              'The authentication redesign has been assigned to <{["alim"]}> . Please review the latest mockups before the standup.'
            );
          });
        });
      });

      it("should shows the component with this rule", () => {
        cy.mount(<ProductRichEditorWithTokenRenderers />);
        cy.findByRole("textbox")
          .findAllByLabelText("badge")
          .eq(0)
          .should("have.text", "@alim");
      });

      context("when print value", () => {
        it("renders the markdown as well", () => {
          cy.mount(<ProductRichEditorWithTokenRenderers />);

          cy.findByText("Print").click();

          cy.get("pre").should(
            "have.text",
            'The authentication redesign has been assigned to <{["alim"]}> . Please review the latest mockups before the standup.'
          );
        });
      });

      context("when pressing <{[ to show <{[{name}]}>", () => {
        it("should renders new badge", () => {
          cy.mount(<ProductRichEditorWithTokenRenderers />);
          cy.findByRole("textbox").realClick().realType("{enter} <{[ Test 123");

          cy.findAllByLabelText("badge").eq(1).should("have.text", "@mention");
        });

        context("when print value", () => {
          it("renders the markdown properly", () => {
            cy.mount(<ProductRichEditorWithTokenRenderers />);

            cy.findByRole("textbox")
              .realClick()
              .realType("{enter} <{[ Test 123");

            cy.findAllByLabelText("badge")
              .eq(1)
              .should("have.text", "@mention");

            cy.findByText("Print").click();

            cy.get("pre")
              .invoke("text")
              .then((text) => {
                const lines = text.split("\n");

                expect(lines[1].trim()).to.eq('<{["mention"]}> Test 123');
              });
          });
        });
      });
    });
  });

  context("id", () => {
    context("code-editor mode", () => {
      beforeEach(() => {
        cy.mount(
          <ProductRichEditor
            mode="code-editor"
            value=""
            codeEditor={{
              id: "test123",
            }}
          />
        );
      });

      it("renders the id in the parent", () => {
        cy.get("#test123").should("exist");
      });
    });

    context("non code-editor mode", () => {
      beforeEach(() => {
        cy.mount(
          <ProductRichEditor
            mode="markdown-editor"
            value=""
            id="markdown-editor-21"
          />
        );
      });

      it("renders the id in the parent", () => {
        cy.get("#markdown-editor-21").should("exist");
      });
    });
  });

  context("mode", () => {
    context("with view-only", () => {
      const viewOnlyPlainTextValue = `                              Systatum Antrikan License
                                            Version 1.0, 2026
                                 https://systatum.com/licenses/

  TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

  1.  Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.`;
      beforeEach(() => {
        cy.mount(
          <ProductRichEditor
            mode="view-only"
            height={400}
            value={viewOnlyPlainTextValue}
          />
        );
        cy.wait(600);
      });

      it("should not shows code editor", () => {
        cy.findAllByLabelText("rich-editor-content")
          .first()
          .should("contain.text", "Systatum Antrikan License")
          .and("contain.text", "Version 1.0, 2026")
          .and("contain.text", "https://systatum.com/licenses/");

        cy.findAllByLabelText("rich-editor-code").should("not.exist");
      });

      context("when typing the editor", () => {
        it("should not change the value", () => {
          cy.findByRole("textbox").type("{selectall}{backspace}test 123");

          cy.findAllByLabelText("rich-editor-content")
            .first()
            .should("contain.text", "Systatum Antrikan License")
            .and("contain.text", "Version 1.0, 2026")
            .and("contain.text", "https://systatum.com/licenses/");
        });
      });
    });

    context("with code-editor", () => {
      beforeEach(() => {
        cy.mount(<ProductRichEditor mode="code-editor" value="" />);
        cy.wait(600);
      });

      it("should renders code editor mode ", () => {
        cy.findAllByLabelText("rich-editor-code").should("exist");
      });

      context("when given actions", () => {
        it("renders the button in the toolbar", () => {
          cy.findAllByLabelText("rich-editor-code").should("exist");
          cy.findAllByLabelText("rich-editor-toolbar-button").should(
            "have.text",
            "Run"
          );
        });

        context("when clicking", () => {
          it("renders the console with content in the toolbar ", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });
            cy.mount(<ProductRichEditor mode="code-editor" value="" />);
            cy.wait(400);
            cy.findByLabelText("rich-editor-code")
              .realClick()
              .realType("Test 123");
            cy.findAllByLabelText("rich-editor-code").should("exist");

            cy.findAllByLabelText("rich-editor-toolbar-button")
              .should("have.text", "Run")
              .click();

            cy.get("@consoleLog").should(
              "have.been.calledWith",
              "compile the content: Test 123"
            );
          });
        });
      });

      context("when initialize value", () => {
        it("should renders the value code", () => {
          const code = `import { Button } from "@systatum/coneto/button"

    function Content(){
      return <Button variant="primary">Your caption</Button>
    }

    export default Content`;
          cy.mount(<ProductRichEditor mode="code-editor" value={code} />);
          cy.shouldHaveEditorFromValue("rich-editor-code", code);
        });
      });

      context("when pressing character", () => {
        it("should renders the value code", () => {
          cy.shouldHaveEditorFromValue("rich-editor-code", "");

          // monaco unique, so we should declare with real type (can't interact with DOM)
          cy.findByLabelText("rich-editor-code")
            .realClick()
            .realType("const x = 1");
          cy.shouldHaveEditorFromValue("rich-editor-code", "const x = 1");
        });
      });
    });
  });

  context("with markdown-editor", () => {
    beforeEach(() => {
      cy.mount(<ProductRichEditor mode="markdown-editor" value="" />);
      cy.wait(1000);
    });

    it("should renders the button markdown", () => {
      cy.findAllByLabelText("rich-editor-toolbar-code-block").should("exist");
    });

    context("when pressing toolbar code block", () => {
      it("renders the code-editor", () => {
        cy.findByLabelText("rich-editor-code").should("not.exist");
        cy.findAllByLabelText("rich-editor-toolbar-code-block")
          .should("exist")
          .click();
        cy.findByLabelText("rich-editor-code").should("exist");
      });

      context("when open the combobox", () => {
        it("renders properly list element (not removed padding)", () => {
          cy.findByLabelText("rich-editor-code").should("not.exist");
          cy.findByLabelText("rich-editor-content")
            .click()
            .should("be.focused")
            .type("- Test{enter}{enter}");
          cy.findAllByLabelText("rich-editor-toolbar-code-block")
            .should("exist")
            .click();
          cy.findByLabelText("rich-editor-code").should("exist");
          cy.findByRole("combobox").click();

          // editor list padding
          cy.get("li").eq(0).should("have.css", "padding", "0px");

          // combobox list padding
          cy.get("li").eq(1).should("have.css", "padding", "8px 12px");
        });
      });
    });

    context("when typing triple backtick", () => {
      it("renders the code-editor", () => {
        cy.findByLabelText("rich-editor-code").should("not.exist");
        cy.findByLabelText("rich-editor-content").realClick().type("```");
        cy.findByLabelText("rich-editor-code").should("exist");
      });
    });

    context("complex behavior", () => {
      beforeEach(() => {
        cy.findByLabelText("rich-editor-code").should("not.exist");
        cy.findByLabelText("rich-editor-content")
          .click()
          .should("be.focused")
          .type("Test{enter}```");
      });
      context(
        "when line 1 is text, line 2 is empty, line 3 code editor",
        () => {
          context("when typing arrow up", () => {
            it("should respect the empty space", () => {
              cy.findByLabelText("rich-editor-content")
                .realClick()
                .realType("{uparrow}");

              cy.window().then((win) => {
                const sel = win.getSelection();
                const anchorNode = sel?.anchorNode;

                // The empty <p><br></p> — anchorNode will be the <p> itself or its <br>
                const el =
                  anchorNode instanceof Element
                    ? anchorNode
                    : anchorNode?.parentElement;

                // Should NOT be inside the monaco/code block
                expect(el?.closest("[data-monaco-block-id]")).to.be.null;

                // Should equal on the line 1 (a <p> with text "Test")
                expect(el?.textContent?.trim()).to.equal("Test");

                // Should be a <p> with BR element (the empty line 2)
                expect(el?.nodeName).to.equal("P");
              });
            });
          });
        }
      );

      context("when triple backtick after arrow down", () => {
        beforeEach(() => {
          cy.findByLabelText("rich-editor-content")
            .realClick()
            .realType("{downarrow}```");
        });

        it("should render double code-editor", () => {
          cy.findAllByLabelText("rich-editor-code").should("have.length", 2);
        });

        context("when typing arrow up", () => {
          it("should move to markdown-editor first", () => {
            cy.realType("{uparrow}");

            cy.findByLabelText("rich-editor-content").should("be.focused");
          });
        });
      });
    });

    context("when code-editor was created", () => {
      beforeEach(() => {
        cy.findByLabelText("rich-editor-code").should("not.exist");
        cy.findByLabelText("rich-editor-content")
          .click()
          .should("be.focused")
          .type("```");
      });

      context("when typing arrow up", () => {
        it("should move to the upside in rich-editor", () => {
          cy.findByLabelText("rich-editor-content").should("not.be.focused");

          cy.findByLabelText("rich-editor-code")
            .realClick()
            .realType("const x = 1{uparrow}{uparrow}");

          cy.findByLabelText("rich-editor-content").should("be.focused");
        });
      });

      context("when typing arrow down", () => {
        it("should move to the downside in rich-editor", () => {
          cy.findByLabelText("rich-editor-content").should("not.focused");

          cy.findByLabelText("rich-editor-code").realType(
            "const x = 1{downarrow}{downarrow}"
          );

          cy.findByLabelText("rich-editor-content").should("be.focused");
        });
      });

      context("when typing backspace", () => {
        context("when value is empty", () => {
          it("should remove the code editor", () => {
            cy.findByLabelText("rich-editor-content").should("not.focused");

            cy.findByLabelText("rich-editor-code").realType("{backspace}");

            cy.findByLabelText("rich-editor-code").should("not.exist");
          });
        });

        context("when value is not empty", () => {
          it("only remove value on the code editor", () => {
            cy.findByLabelText("rich-editor-content").should("not.focused");

            cy.findByLabelText("rich-editor-code").realType("value{backspace}");

            cy.shouldHaveEditorFromValue("rich-editor-code", "valu");
          });
        });
      });
    });
  });

  context("height", () => {
    context("when given 300px", () => {
      it("renders a textarea with 300px", () => {
        cy.mount(
          <ProductRichEditor
            value={generateSentence({ minLen: 250, maxLen: 250, seed: 1234 })}
            height={300}
          />
        );
        cy.findByLabelText("rich-editor-content").should(
          "have.css",
          "height",
          "300px"
        );
      });
    });
  });

  context("autogrow", () => {
    context("when given true", () => {
      it("renders a textarea that grows with content", () => {
        cy.mount(
          <ProductRichEditor
            autogrow
            value={generateSentence({ minLen: 250, maxLen: 250, seed: 1234 })}
          />
        );
        cy.findByLabelText("rich-editor-content").should(
          "have.css",
          "height",
          "576px"
        );
      });

      context("when pressing enter", () => {
        it("increases the textarea height accordingly", () => {
          cy.mount(
            <ProductRichEditor
              autogrow
              value={generateSentence({ minLen: 250, maxLen: 250, seed: 1234 })}
            />
          );
          cy.findByLabelText("rich-editor-content")
            .should("have.css", "height", "576px")
            .click()
            .type("{enter}{enter}{enter}");

          cy.findByLabelText("rich-editor-content").should(
            "have.css",
            "height",
            "696px"
          );
        });
      });
    });

    context("when given false", () => {
      it("renders a textarea with fixed height", () => {
        cy.mount(
          <ProductRichEditor
            value={generateSentence({ minLen: 200, maxLen: 250, seed: 1234 })}
          />
        );
        cy.findAllByLabelText("rich-editor-content").should(
          "have.css",
          "height",
          "200px"
        );
      });

      context("when pressing enter", () => {
        it("maintains the fixed textarea height", () => {
          cy.mount(
            <ProductRichEditor
              value={generateSentence({ minLen: 200, maxLen: 250, seed: 1234 })}
            />
          );
          cy.findAllByLabelText("rich-editor-content")
            .should("have.css", "height", "200px")
            .click()
            .type("{enter}{enter}{enter}");

          cy.findAllByLabelText("rich-editor-content").should(
            "have.css",
            "height",
            "200px"
          );
        });
      });
    });
  });

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
        cy.findByLabelText("rich-editor-toolbar-bold").should(
          "have.attr",
          "aria-pressed",
          "false"
        );

        cy.get('[data-testid="external-bold"]').then(($el) => {
          cy.window().then((win) => {
            const range = win.document.createRange();
            range.selectNodeContents($el[0]);

            const sel = win.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          });
        });

        cy.findByLabelText("rich-editor-toolbar-bold").should(
          "have.attr",
          "aria-pressed",
          "false"
        );
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
        cy.findByLabelText("rich-editor-toolbar-italic").should(
          "have.attr",
          "aria-pressed",
          "false"
        );

        cy.get('[data-testid="external-italic"]').then(($el) => {
          cy.window().then((win) => {
            const range = win.document.createRange();
            range.selectNodeContents($el[0]);

            const sel = win.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          });
        });

        cy.findAllByLabelText("rich-editor-toolbar-italic").should(
          "have.attr",
          "aria-pressed",
          "false"
        );
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
    context("heading", () => {
      context("when the next line have empty space", () => {
        it("should add the empty space", () => {
          const input = `### Heading line 1

  Paragraph line 3`;
          cy.mount(<RichEditor value={input} />);
          cy.findByRole("textbox")
            .find("p")
            .eq(0)
            .should("contain.html", "<br>");
        });
      });

      context("when the next line is paragraph", () => {
        it("should not have empty space", () => {
          const input = `### Heading line 1
  Paragraph line 2`;
          cy.mount(<RichEditor value={input} />);
          cy.findByRole("textbox")
            .find("p")
            .eq(0)
            .should("not.contain.html", "<br>");
        });
      });
    });

    context("paragraph", () => {
      context("when the next line have empty space", () => {
        it("should render exactly as the expected value", () => {
          const input = `Paragraph line 1


Paragraph line 2`;
          cy.mount(<RichEditor value={input} />);
          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should(
              "eq",
              "<p>Paragraph line 1</p><p><br></p><p><br></p><p>Paragraph line 2</p>"
            );
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
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should(
              "eq",
              "<p>Paragraph line 1</p><p>Paragraph line 2</p><p>Paragraph line 3</p><p>Paragraph line 4</p>"
            );
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
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should(
              "eq",
              "<ul><li>Unordered list</li></ul><p>Paragraph line</p>"
            );
        });
      });

      context("when a lot of list", () => {
        it("should render list as usual", () => {
          const input = `- Unordered list 1
- Unordered list 2
- Unordered list 3`;
          cy.mount(<RichEditor value={input} />);
          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should(
              "eq",
              "<ul><li>Unordered list 1</li><li>Unordered list 2</li><li>Unordered list 3</li></ul>"
            );
        });
      });
    });
  });
});
