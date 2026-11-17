import { useState } from "react";
import { css } from "styled-components";
import {
  CodeEditor,
  CodeEditorLanguage,
  CodeEditorOption,
  CodeEditorProps,
} from "./../../components/code-editor";

const LANGUAGE_OPTIONS: CodeEditorOption[] = [
  { text: "TypeScript", value: "tsx" },
  { text: "Python", value: "python" },
  { text: "SQL", value: "sql" },
];

describe("CodeEditor", () => {
  function ProductCodeEditor({ onChange, ...props }: CodeEditorProps) {
    const [value, setValue] = useState(props.value ?? "");

    return (
      <CodeEditor
        options={LANGUAGE_OPTIONS}
        {...props}
        value={value}
        onChange={(code, lang) => {
          setValue(code);
          onChange?.(code, lang);
        }}
      />
    );
  }

  const codebox = () => cy.findByRole("textbox", { name: "rich-editor-code" });

  context("accessibility", () => {
    it("labels the textbox", () => {
      cy.mount(<ProductCodeEditor />);

      codebox().should("exist");
    });
  });

  context("value", () => {
    function ExternalValueCodeEditor() {
      const [value, setValue] = useState("const x = 1");

      return (
        <>
          <button onClick={() => setValue("const y = 2")}>replace-code</button>
          <CodeEditor value={value} onChange={setValue} />
        </>
      );
    }

    it("renders the initial value", () => {
      cy.mount(<ProductCodeEditor value="const x = 1" />);

      cy.shouldHaveEditorFromValue("rich-editor-code", "const x = 1");
    });

    it("renders a value replaced by its parent", () => {
      cy.mount(<ExternalValueCodeEditor />);

      cy.shouldHaveEditorFromValue("rich-editor-code", "const x = 1");

      cy.findByRole("button", { name: "replace-code" }).click();

      cy.shouldHaveEditorFromValue("rich-editor-code", "const y = 2");
    });

    it("emits typed code with its language", () => {
      const onChange = cy.stub().as("onChange");
      cy.mount(<ProductCodeEditor onChange={onChange} />);

      codebox().realClick().realType("const x = 1");

      cy.get("@onChange").should("have.been.calledWith", "const x = 1", "tsx");
    });

    it("calls the latest onChange after it is replaced", () => {
      const firstChange = cy.stub().as("firstChange");
      const secondChange = cy.stub().as("secondChange");

      function SwappedOnChangeCodeEditor() {
        const [handler, setHandler] = useState<"first" | "second">("first");

        return (
          <>
            <button onClick={() => setHandler("second")}>
              use-second-handler
            </button>
            <CodeEditor
              onChange={handler === "first" ? firstChange : secondChange}
            />
          </>
        );
      }

      cy.mount(<SwappedOnChangeCodeEditor />);

      cy.findByRole("button", { name: "use-second-handler" }).click();
      codebox().realClick().realType("a");

      cy.get("@firstChange").should("not.have.been.called");
      cy.get("@secondChange").should("have.been.calledWith", "a", "tsx");
    });
  });

  context("indentation", () => {
    it("indents with two spaces when pressing Tab", () => {
      cy.mount(<ProductCodeEditor />);

      codebox().realClick().realPress("Tab");
      codebox().realType("a");

      cy.shouldHaveEditorFromValue("rich-editor-code", "  a");
    });
  });

  context("language", () => {
    function ExternalLanguageCodeEditor() {
      const [language, setLanguage] = useState<CodeEditorLanguage>("tsx");

      return (
        <>
          <button onClick={() => setLanguage("sql")}>use-sql</button>
          <CodeEditor
            options={LANGUAGE_OPTIONS}
            language={language}
            value="SELECT * FROM users;"
          />
        </>
      );
    }

    it("emits the selected language with the current code", () => {
      const onChange = cy.stub().as("onChange");
      cy.mount(<ProductCodeEditor value="const x = 1" onChange={onChange} />);

      cy.findByRole("combobox").click();
      cy.findByText("Python").click();

      cy.get("@onChange").should(
        "have.been.calledWith",
        "const x = 1",
        "python"
      );
    });

    it("renders a language replaced by its parent", () => {
      cy.mount(<ExternalLanguageCodeEditor />);

      cy.findByDisplayValue("TypeScript").should("exist");

      cy.findByRole("button", { name: "use-sql" }).click();

      cy.findByDisplayValue("SQL").should("exist");
    });
  });

  context("read-only", () => {
    function ToggleReadOnlyCodeEditor() {
      const [readOnly, setReadOnly] = useState(true);

      return (
        <>
          <button onClick={() => setReadOnly(false)}>enable-editing</button>
          <CodeEditor value="" readOnly={readOnly} />
        </>
      );
    }

    it("blocks editing when read-only", () => {
      const onChange = cy.stub().as("onChange");
      cy.mount(
        <ProductCodeEditor value="const x = 1" readOnly onChange={onChange} />
      );

      codebox()
        .should("have.attr", "contenteditable", "false")
        .realClick()
        .realType("abc");

      cy.get("@onChange").should("not.have.been.called");
    });

    it("allows editing after read-only turns off", () => {
      cy.mount(<ToggleReadOnlyCodeEditor />);

      codebox().should("have.attr", "contenteditable", "false");

      cy.findByRole("button", { name: "enable-editing" }).click();

      codebox()
        .should("have.attr", "contenteditable", "true")
        .realClick()
        .realType("abc");

      cy.shouldHaveEditorFromValue("rich-editor-code", "abc");
    });

    it("does not close when backspacing a read-only empty editor", () => {
      const onClosed = cy.stub().as("onClosed");
      cy.mount(
        <ProductCodeEditor readOnly removeOnEmpty onClosed={onClosed} />
      );

      codebox().realClick().realPress("Backspace");

      cy.get("@onClosed").should("not.have.been.called");
    });
  });

  context("autoFocus", () => {
    it("focuses the editor", () => {
      cy.mount(<ProductCodeEditor autoFocus />);

      codebox().should("be.focused");
    });
  });

  context("clearable", () => {
    it("calls onClosed when clicking the clear button", () => {
      const onClosed = cy.stub().as("onClosed");
      cy.mount(<ProductCodeEditor clearable onClosed={onClosed} />);

      cy.findByTitle("Remove code block").click();

      cy.get("@onClosed").should("have.been.called");
    });
  });

  context("styles", () => {
    it("applies its own container style", () => {
      cy.mount(
        <ProductCodeEditor
          styles={{
            self: css`
              padding: 12px;
            `,
          }}
        />
      );

      cy.get(".coneto-code-editor").should("have.css", "padding", "12px");
    });
  });

  context("removeOnEmpty", () => {
    it("calls onClosed when backspacing an empty editor", () => {
      const onClosed = cy.stub().as("onClosed");
      cy.mount(<ProductCodeEditor removeOnEmpty onClosed={onClosed} />);

      codebox().realClick().realType("a{backspace}{backspace}");

      cy.get("@onClosed").should("have.been.called");
    });
  });

  context("syntax highlighting", () => {
    const SAMPLES: Partial<Record<CodeEditorLanguage, string>> = {
      cpp: "int main() { return 0; }",
      sql: "SELECT * FROM users;",
      java: "public class Main {}",
      php: "<?php echo 1; ?>",
      go: "package main",
      rust: "fn main() {}",
      ruby: "def hello; end",
      r: "value <- 1",
    };

    it("highlights every advertised language", () => {
      Object.entries(SAMPLES).forEach(([language, sample]) => {
        cy.mount(
          <CodeEditor
            language={language as CodeEditorLanguage}
            value={sample}
          />
        );

        cy.get(".cm-line span").should("have.length.greaterThan", 0);
      });
    });
  });

  context("completion", () => {
    it("shows the completion popup outside the editor height", () => {
      cy.mount(<ProductCodeEditor />);

      codebox().realClick().realType("con");

      cy.get(".cm-tooltip-autocomplete").should("exist");

      cy.get(".cm-tooltip-autocomplete").then(($tooltip) => {
        const tooltip = $tooltip[0] as HTMLElement;
        const rect = tooltip.getBoundingClientRect();
        const hit = document.elementFromPoint(
          rect.left + rect.width / 2,
          rect.bottom - 2
        );

        expect(tooltip.contains(hit)).to.equal(true);
      });
    });
  });

  context("actions", () => {
    it("passes the current code to a toolbar action", () => {
      const onClick = cy.stub().as("onClick");
      cy.mount(
        <ProductCodeEditor
          actions={[{ ariaLabel: "run-code", children: "Run", onClick }]}
        />
      );

      codebox().realClick().realType("const x = 1");
      cy.findByRole("button", { name: "run-code" }).click();

      cy.get("@onClick").should("have.been.calledWith", {
        code: "const x = 1",
      });
    });
  });
});
