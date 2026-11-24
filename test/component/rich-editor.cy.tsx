import marked from "./../../lib/marked/marked";
import {
  RichEditor,
  RichEditorCodeAction,
  RichEditorMode,
  RichEditorProps,
  RichEditorRef,
} from "./../../components/rich-editor";
import { useEffect, useRef, useState } from "react";
import { css } from "styled-components";
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

  context("markdown autoformat", () => {
    it("converts a typed heading prefix into a real heading", () => {
      cy.mount(
        <ProductRichEditor mode={RichEditorMode.MarkdownEditor} value="" />
      );

      cy.findByRole("textbox").click();
      cy.findByRole("textbox").type("## ");
      cy.get("h2").should("exist");

      cy.findByRole("textbox").type("Hehe");
      cy.get("h2").should("have.text", "Hehe");
    });

    it("converts a typed list prefix into a real list", () => {
      cy.mount(
        <ProductRichEditor mode={RichEditorMode.MarkdownEditor} value="" />
      );

      cy.findByRole("textbox").click();
      cy.findByRole("textbox").type("- ");
      cy.get("ul li").should("exist");

      cy.findByRole("textbox").type("Item");
      cy.get("ul li").should("have.text", "Item");
    });
  });

  context("table insertion", () => {
    it("inserts a table using the hovered grid size", () => {
      cy.mount(
        <ProductRichEditor mode={RichEditorMode.MarkdownEditor} value="" />
      );

      cy.findByRole("textbox").click();
      cy.findByLabelText("rich-editor-toolbar-table").click();
      cy.get('[aria-label^="Insert "]').should("have.length", 50);
      cy.findByLabelText("Insert 1 by 1 table").then(($cell) => {
        const cell = $cell[0].getBoundingClientRect();
        expect(Math.round(cell.width)).to.equal(Math.round(cell.height));
      });
      cy.findByLabelText("Insert 2 by 3 table").realHover();
      cy.findByLabelText("rich-editor-table-grid").should(
        "contain.text",
        "2 × 3"
      );
      cy.findByLabelText("Insert 2 by 3 table").click();

      cy.get("table").should("exist");
      cy.get("table thead th").should("have.length", 3);
      cy.get("table tbody tr").should("have.length", 1);
      cy.get("table tbody td").should("have.length", 3);
    });

    it("serializes table content as HTML and keeps cell styles", () => {
      function TableMount() {
        const [value, setValue] = useState("");

        return (
          <div>
            <RichEditor
              mode={RichEditorMode.MarkdownEditor}
              value={value}
              onChange={(next) => setValue(next)}
            />
            <pre data-testid="serialized-value">{value}</pre>
          </div>
        );
      }

      cy.mount(<TableMount />);

      cy.findByRole("textbox").click();
      cy.findByLabelText("rich-editor-toolbar-table").click();
      cy.findByLabelText("Insert 2 by 2 table").click();
      cy.get("th").first().invoke("css", "background-color", "rgb(255, 0, 0)");
      cy.get("th").first().type("Name");

      cy.findByTestId("serialized-value").should("contain.text", "<table");
      cy.findByTestId("serialized-value").should("contain.text", "<th");
      cy.findByTestId("serialized-value").should(
        "contain.text",
        "border-collapse: collapse"
      );
      cy.findByTestId("serialized-value").should(
        "contain.text",
        "table-layout: fixed"
      );
      cy.findByTestId("serialized-value").should(
        "contain.text",
        "border: 1px solid rgb(209, 213, 219)"
      );
      cy.findByTestId("serialized-value").should(
        "contain.text",
        "background-color: rgb(255, 0, 0)"
      );
      cy.findByTestId("serialized-value").should("contain.text", "Name");
    });

    it("adds inline presentation styles to existing tables", () => {
      cy.mount(
        <ProductRichEditor
          mode={RichEditorMode.MarkdownEditor}
          value={"<table><tr><th>Name</th></tr></table>"}
        />
      );

      cy.get("table")
        .should("have.attr", "style")
        .and("contain", "border-collapse: collapse")
        .and("contain", "table-layout: fixed");
      cy.get("th")
        .should("have.attr", "style")
        .and("contain", "background-color: rgb(226, 226, 226)")
        .and("contain", "font-weight: 600");
    });

    it("applies background colors to header and body cells", () => {
      function TableMount() {
        const [value, setValue] = useState("");

        return (
          <div>
            <RichEditor
              mode={RichEditorMode.MarkdownEditor}
              value={value}
              onChange={(next) => setValue(next)}
            />
            <pre data-testid="serialized-value">{value}</pre>
          </div>
        );
      }

      cy.mount(<TableMount />);

      cy.findByLabelText("rich-editor-toolbar-cell-color").should("not.exist");

      cy.findByRole("textbox").click();
      cy.findByLabelText("rich-editor-toolbar-table").click();
      cy.findByLabelText("Insert 2 by 2 table").click();

      cy.get("th").first().click();
      cy.findByLabelText("rich-editor-toolbar-cell-color").click();
      cy.get('[aria-label^="Set cell background color"]').should(
        "have.length",
        80
      );
      cy.findByLabelText("Set cell background color #d02020").click();
      cy.get("th")
        .first()
        .should("have.css", "background-color", "rgb(208, 32, 32)");
      cy.findByLabelText("rich-editor-cell-color-palette").should("exist");
      cy.findByLabelText("Custom colors used in this table").should(
        "not.exist"
      );
      cy.findByLabelText("rich-editor-toolbar-cell-color").click();

      cy.get("td").first().click();
      cy.findByLabelText("rich-editor-toolbar-cell-color").click();
      cy.findByLabelText("Set cell background color #2f7de1").click();
      cy.get("td")
        .first()
        .should("have.css", "background-color", "rgb(47, 125, 225)");

      cy.findByTestId("serialized-value").should(
        "contain.text",
        "background-color: rgb(208, 32, 32)"
      );
      cy.findByTestId("serialized-value").should(
        "contain.text",
        "background-color: rgb(47, 125, 225)"
      );
    });

    it("applies a custom color and keeps the picker mounted", () => {
      function TableMount() {
        const [value, setValue] = useState("");

        return (
          <div>
            <RichEditor
              height={600}
              mode={RichEditorMode.MarkdownEditor}
              value={value}
              onChange={(next) => setValue(next)}
            />
            <pre data-testid="serialized-value">{value}</pre>
          </div>
        );
      }

      cy.mount(<TableMount />);

      cy.findByRole("textbox").click();
      cy.findByLabelText("rich-editor-toolbar-table").click();
      cy.findByLabelText("Insert 2 by 2 table").click();
      cy.get("td").first().click();
      cy.findByLabelText("rich-editor-toolbar-cell-color").click();

      const custom = cy.findByLabelText("Custom cell background color");
      custom.should("be.visible").focus().should("be.visible");
      custom.then(($input) => {
        const style = getComputedStyle($input[0]);
        expect(style.width).to.equal("18px");
        expect(style.height).to.equal("18px");
        expect(style.borderRadius).to.equal("50%");
      });

      custom.then(($input) => {
        const input = $input[0] as HTMLInputElement;
        const setValue = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value"
        )?.set;

        setValue?.call(input, "#123456");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

      cy.get("td")
        .first()
        .should("have.css", "background-color", "rgb(18, 52, 86)");
      cy.findByLabelText("rich-editor-cell-color-palette").should("exist");
      cy.findByLabelText("Custom colors used in this table").within(() => {
        cy.findByLabelText("Set cell background color #123456").should("exist");
      });

      cy.findByLabelText("rich-editor-toolbar-cell-color").click();
      cy.findByLabelText("rich-editor-toolbar-cell-color").click();
      cy.findByLabelText("Custom colors used in this table").within(() => {
        cy.findByLabelText("Set cell background color #123456").should("exist");
      });

      cy.findByTestId("serialized-value").should(
        "contain.text",
        "background-color: rgb(18, 52, 86)"
      );
    });

    it("renders an existing markdown table", () => {
      cy.mount(
        <ProductRichEditor
          mode={RichEditorMode.MarkdownEditor}
          value={"| Name | Score |\n| --- | --- |\n| Ada | 10 |"}
        />
      );

      cy.get("table thead th").should("have.length", 2);
      cy.get("table tbody td").should("have.length", 2);
      cy.get("table tbody tr").should("contain.text", "Ada");
    });
  });

  context("undo after markdown autoformat", () => {
    function UndoMount() {
      const [value, setValue] = useState("");
      const [printValue, setPrintValue] = useState("");

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <RichEditor
            mode={RichEditorMode.MarkdownEditor}
            value={value}
            onChange={(next) => setValue(next)}
          />
          <RichEditor.ToolbarButton
            ariaLabel="print-value"
            icon={{ image: RiPrinterFill }}
            onClick={() => setPrintValue(value)}
          >
            Print
          </RichEditor.ToolbarButton>
          <pre>{printValue}</pre>
        </div>
      );
    }

    it("keeps typing sane after undoing the conversion", () => {
      cy.mount(<UndoMount />);

      cy.findByRole("textbox").click();
      cy.findByRole("textbox").type("## ");
      cy.findByRole("textbox").type("Hehe");
      cy.findByRole("textbox").type("{ctrl+z}");
      cy.findByRole("textbox").type("Yo");

      cy.findByLabelText("print-value").click();
      cy.get("pre").should("contain.text", "Yo");
      cy.get("h2").should("contain.text", "Yo");
    });
  });

  context("headings after a paragraph line", () => {
    it("renders single-newline headings as real headings on load", () => {
      cy.mount(
        <ProductRichEditor
          mode={RichEditorMode.MarkdownEditor}
          value={"Welcome to the demo.\n## Hey\n# Yyyo\nSup"}
        />
      );

      cy.get("h2").should("have.text", "Hey");
      cy.get("h1").should("have.text", "Yyyo");
      cy.get("p").last().should("have.text", "Sup");
    });
  });

  context("enter inside formatted text", () => {
    it("splits the block at the caret", () => {
      cy.mount(
        <ProductRichEditor mode={RichEditorMode.MarkdownEditor} value="" />
      );

      cy.findByRole("textbox").click();
      cy.findByRole("textbox").type("Hello world");
      cy.findByRole("textbox").type(
        "{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}"
      );
      cy.findByRole("textbox").type(
        "{shift}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{shift}"
      );
      cy.findByLabelText("rich-editor-toolbar-bold").click();

      // Park the caret inside the bold run, then split with enter.
      cy.findByRole("textbox").type("{rightarrow}{leftarrow}{leftarrow}");
      cy.findByRole("textbox").type("{enter}");

      cy.get("p").should("have.length", 2);
      cy.get("p")
        .first()
        .should("contain", "Hello")
        .find("b")
        .should("have.text", "wor");
      cy.get("p").last().find("b").should("have.text", "ld");
    });
  });

  context("heading after a checkbox row", () => {
    it("places the new heading after the checkbox paragraph instead of nesting", () => {
      cy.mount(
        <ProductRichEditor
          mode={RichEditorMode.MarkdownEditor}
          value=""
          formatting={{ allowCheckBoxes: true }}
        />
      );

      cy.findByRole("textbox").click();
      cy.findByLabelText("rich-editor-toolbar-checkbox").click();
      cy.findByRole("textbox").type("Task{enter}");
      cy.findByLabelText("rich-editor-toolbar-heading-menu").click();
      cy.findByText("Heading 2").click();
      cy.findByRole("textbox").type("Chapter");

      cy.get("h2").should("have.text", "Chapter");
      cy.get("p input[type=checkbox]").should("exist");
      cy.get("p h2").should("not.exist");
    });
  });

  context("heading menu placement", () => {
    it("opens the heading menu directly under its toolbar button", () => {
      cy.mount(
        <ProductRichEditor mode={RichEditorMode.MarkdownEditor} value="" />
      );

      cy.findByLabelText("rich-editor-toolbar-heading-menu").then(($button) => {
        const button = $button[0].getBoundingClientRect();

        cy.findByLabelText("rich-editor-toolbar-heading-menu").click();

        cy.findByLabelText("tip-menu").then(($menu) => {
          const menu = $menu[0].getBoundingClientRect();

          expect(Math.abs(menu.left - button.left)).to.be.lessThan(2);
          expect(menu.top).to.be.greaterThan(button.bottom);
        });
      });
    });
  });

  context("formatting rule", () => {
    it("keeps GFM strikethrough disabled", () => {
      cy.mount(<ProductRichEditor value="~~gone~~" />);

      cy.get("del").should("not.exist");
      cy.findByRole("textbox").should("contain.text", "gone");
    });

    it("renders except checkboxes and code", () => {
      cy.mount(<ProductRichEditor />);

      cy.findByLabelText("rich-editor-toolbar-bold").should("exist");
      cy.findByLabelText("rich-editor-toolbar-italic").should("exist");
      cy.findByLabelText("rich-editor-toolbar-underline").should("exist");
      cy.findByLabelText("rich-editor-toolbar-ordered-list").should("exist");
      cy.findByLabelText("rich-editor-toolbar-unordered-list").should("exist");
      cy.findByLabelText("rich-editor-toolbar-heading-menu").should("exist");
      cy.findByLabelText("rich-editor-toolbar-table").should("exist");

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
              allowTable: false,
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
        cy.findByLabelText("rich-editor-toolbar-table").should("not.exist");

        cy.findByLabelText("rich-editor-toolbar-checkbox").should("not.exist");
        cy.findByLabelText("rich-editor-toolbar-code-block").should(
          "not.exist"
        );
      });
    });

    context("allowBold", () => {
      context("with true and typing", () => {
        it("renders the markdown with **", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{
                allowBold: true,
              }}
              value="**Test**"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "**Test123**");
        });

        it("renders the html with <strong>", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{
                allowBold: true,
              }}
              value="**Test**"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "**Test123**");

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should("eq", "<p><strong>Test123</strong></p>");
        });
      });

      context("with false and typing", () => {
        it("renders the markdown only **", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{
                allowBold: false,
              }}
              value="**Test**"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "Test123");
        });

        it("renders the html without <strong>", () => {
          cy.mount(
            <ProductRichEditor
              formatting={{
                allowBold: false,
              }}
              value="**Test**"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should("eq", "<p>Test123</p>");
        });
      });
    });

    context("allowItalic", () => {
      context("with true and typing", () => {
        it("renders the markdown with _", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(<ProductRichEditor value="_Test_" />);

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "_Test123_");
        });

        it("renders the html with <em>", () => {
          cy.mount(<ProductRichEditor value="_Test_" />);

          cy.findByRole("textbox").click().realType("123");

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should("eq", "<p><em>Test123</em></p>");
        });
      });

      context("with false and typing", () => {
        it("renders the markdown without _", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{ allowItalic: false }}
              value="_Test_"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "Test123");
        });

        it("renders the html without <em>", () => {
          cy.mount(
            <ProductRichEditor
              formatting={{ allowItalic: false }}
              value="_Test_"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should("eq", "<p>Test123</p>");
        });
      });
    });

    context("allowUnderline", () => {
      context("with true and typing", () => {
        it("renders the markdown with ~", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{
                allowUnderline: true,
              }}
              value="~Test~"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "~Test123~");
        });

        it("renders the html with <u>", () => {
          cy.mount(
            <ProductRichEditor
              formatting={{
                allowUnderline: true,
              }}
              value="~Test~"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should("eq", "<p><u>Test123</u></p>");
        });
      });

      context("with false and typing", () => {
        it("renders the markdown without ~", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{
                allowUnderline: false,
              }}
              value="~Test~"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "Test123");
        });

        it("renders the html without <u>", () => {
          cy.mount(
            <ProductRichEditor
              formatting={{
                allowUnderline: false,
              }}
              value="Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should("eq", "<p>Test123</p>");
        });
      });
    });

    context("allowUnorderedList", () => {
      context("with true and typing", () => {
        it("renders the markdown with *", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{
                allowUnorderedList: true,
              }}
              value="* Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "* Test123");
        });

        it("renders the html with <ul><li>", () => {
          cy.mount(
            <ProductRichEditor
              formatting={{
                allowUnorderedList: true,
              }}
              value="* Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should("eq", "<ul><li>Test123</li></ul>");
        });
      });

      context("with false and typing", () => {
        it("renders the markdown without *", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{
                allowUnorderedList: false,
              }}
              value="* Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "Test123");
        });

        it("renders the html without <ul><li>", () => {
          cy.mount(
            <ProductRichEditor
              formatting={{
                allowUnorderedList: false,
              }}
              value="* Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should("eq", "<p>Test123</p>");
        });
      });
    });

    context("allowOrderedList", () => {
      context("with true and typing", () => {
        it("renders the markdown with number", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{
                allowOrderedList: true,
              }}
              value="1. Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "1. Test123");
        });

        it("renders the html with <ol><li>", () => {
          cy.mount(
            <ProductRichEditor
              formatting={{
                allowOrderedList: true,
              }}
              value="1. Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should("eq", "<ol><li>Test123</li></ol>");
        });
      });

      context("with false and typing", () => {
        it("renders the markdown without number", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{
                allowOrderedList: false,
              }}
              value="1. Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "Test123");
        });

        it("renders the html without <ol><li>", () => {
          cy.mount(
            <ProductRichEditor
              formatting={{
                allowOrderedList: false,
              }}
              value="1. Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should("eq", "<p>Test123</p>");
        });
      });
    });

    context("allowHeading", () => {
      context("with true and typing", () => {
        it("renders the markdown with #", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{
                allowHeading: true,
              }}
              value="# Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "# Test123");
        });

        it("renders the html with <h1>", () => {
          cy.mount(
            <ProductRichEditor
              formatting={{
                allowHeading: true,
              }}
              value="# Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should("eq", "<h1>Test123</h1>");
        });
      });

      context("with false and typing", () => {
        it("renders the markdown without #", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{
                allowHeading: false,
              }}
              value="# Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "Test123");
        });

        it("renders the html without <h1>", () => {
          cy.mount(
            <ProductRichEditor
              formatting={{
                allowHeading: false,
              }}
              value="# Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should("eq", "<p>Test123</p>");
        });
      });
    });

    context("allowCheckboxes", () => {
      context("with true and typing", () => {
        it("renders the markdown with [ ]", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{
                allowCheckBoxes: true,
              }}
              value="[ ] Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should("have.been.calledWith", "[ ] Test123");
        });

        it("renders the html with checkbox", () => {
          cy.mount(
            <ProductRichEditor
              formatting={{
                allowCheckBoxes: true,
              }}
              value="[ ] Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should(
              "eq",
              `<p><input type="checkbox" class="coneto-checkbox-wrapper" contenteditable="false" data-checked="false" style="cursor: pointer;"> Test123</p>`
            );
        });
      });

      context("with false and typing", () => {
        it("renders the markdown without [ ]", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductRichEditor
              formatting={{
                allowCheckBoxes: false,
              }}
              value="[ ] Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByLabelText("toolbar-print").click();

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "\\[ \\] Test123"
          );
        });

        it("renders the html without checkbox", () => {
          cy.mount(
            <ProductRichEditor
              formatting={{
                allowCheckBoxes: false,
              }}
              value="[ ] Test"
            />
          );

          cy.findByRole("textbox").click().realType("123");

          cy.findByRole("textbox")
            .invoke("html")
            .then((html) => html.replace(/\n/g, ""))
            .should("eq", "<p>[ ] Test123</p>");
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

              // Insert both nodes as a single fragment so the sibling order
              // (tokenSpan, then zws) is deterministic \u2014 two sequential
              // insertNode() calls on the same range don't reliably
              // preserve insertion order across browsers.
              const fragment = document.createDocumentFragment();
              fragment.appendChild(tokenSpan);
              fragment.appendChild(zws);

              const currentRange = sel.getRangeAt(0);
              currentRange.insertNode(fragment);

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

            cy.wait(1000);

            cy.findByText("Print").click();

            cy.get("pre").should(($pre) => {
              const lines = $pre.text().split("\n");

              expect(lines[1]?.trim()).to.eq('<{["mention"]}> Test 123');
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

    context("code-editor mode without id", () => {
      it("keeps the generated id stable while typing", () => {
        cy.mount(<ProductRichEditor mode="code-editor" value="" />);

        cy.get("[id^='code-mirror-block-']")
          .invoke("attr", "id")
          .then((generatedId) => {
            cy.findByRole("textbox", { name: "rich-editor-code" })
              .realClick()
              .realType("a");

            cy.get("[id^='code-mirror-block-']").should(
              "have.attr",
              "id",
              generatedId
            );
          });
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

  context("styles", () => {
    it("applies codeEditorStyle to the code editor", () => {
      cy.mount(
        <ProductRichEditor
          mode="code-editor"
          value=""
          styles={{
            codeEditorStyle: css`
              min-height: 321px;
            `,
          }}
        />
      );

      cy.get(".cm-editor").parent().should("have.css", "min-height", "321px");
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

      context("when pressing enter inside an indented block", () => {
        it("keeps the current line indentation", () => {
          cy.mount(
            <ProductRichEditor
              mode="code-editor"
              value={"func a() {\n  let i = 0;\n}"}
            />
          );

          cy.get(".cm-line").contains("let i = 0;").realClick();
          cy.findByRole("textbox", { name: "rich-editor-code" }).type(
            "{end}{enter}let j = 1;"
          );

          cy.get(".cm-line").should(($lines) => {
            expect($lines.eq(1).text()).to.eq("  let i = 0;");
            expect($lines.eq(2).text()).to.eq("  let j = 1;");
          });
        });

        it("keeps indentation after switching to rust", () => {
          cy.mount(
            <ProductRichEditor
              mode="code-editor"
              value=""
              codeEditor={{ language: "cpp" }}
            />
          );

          cy.findByRole("combobox").click();
          cy.findByText("Rust").click();

          cy.findByRole("textbox", { name: "rich-editor-code" })
            .realClick()
            .type("func a() {{}{enter}const i = 0;{enter}const j = 1;");

          cy.get(".cm-line").should(($lines) => {
            expect($lines.eq(1).text()).to.eq("  const i = 0;");
            expect($lines.eq(2).text()).to.eq("  const j = 1;");
          });
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

    context("when pressing enter inside a code block", () => {
      it("keeps the current line indentation", () => {
        cy.mount(
          <ProductRichEditor
            mode="markdown-editor"
            value={"```go\nfunc a() {\n  let i = 0;\n}\n```"}
          />
        );

        cy.findByRole("textbox", { name: "rich-editor-code" }).should("exist");

        cy.get(".cm-line").contains("let i = 0;").realClick();
        cy.findByRole("textbox", { name: "rich-editor-code" }).type(
          "{end}{enter}let j = 1;"
        );

        cy.get(".cm-line").should(($lines) => {
          expect($lines.eq(1).text()).to.eq("  let i = 0;");
          expect($lines.eq(2).text()).to.eq("  let j = 1;");
        });
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
                expect(el?.closest("[data-cm-block-id]")).to.be.null;

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

          // Wait for the second Monaco instance to actually finish mounting
          // before any dependent test proceeds — under heavy load (e.g. deep
          // into a full-suite run) its async initialization can take well
          // over the default 4s command timeout.
          cy.findAllByLabelText("rich-editor-code", { timeout: 15000 }).should(
            "have.length",
            2
          );
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
        cy.findByLabelText("rich-editor-content")
          .should("have.css", "min-height", "200px")
          .and("have.css", "overflow-y", "hidden")
          .and(($editor) => {
            // Long content grows past the min height instead of scrolling
            // inside a fixed box, so keep the assertion off the exact pixel
            // height, which shifts with font wrapping.
            expect(parseFloat($editor.css("height"))).to.be.greaterThan(200);
          });
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
            .then(($editor) => cy.wrap(parseFloat($editor.css("height"))))
            .then((before) => {
              cy.findByLabelText("rich-editor-content")
                .click()
                .type("{enter}{enter}{enter}")
                .then(($editor) => {
                  expect(parseFloat($editor.css("height"))).to.be.greaterThan(
                    before
                  );
                });
            });
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
