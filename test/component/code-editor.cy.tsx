import { useState } from "react";
import {
  CodeEditor,
  CodeEditorOption,
  CodeEditorProps,
} from "./../../components/code-editor";

const LANGUAGE_OPTIONS: CodeEditorOption[] = [
  { text: "TypeScript", value: "tsx" },
  { text: "Python", value: "python" },
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
  });

  context("language", () => {
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

  context("removeOnEmpty", () => {
    it("calls onClosed when backspacing an empty editor", () => {
      const onClosed = cy.stub().as("onClosed");
      cy.mount(<ProductCodeEditor removeOnEmpty onClosed={onClosed} />);

      codebox().realClick().realType("a{backspace}{backspace}");

      cy.get("@onClosed").should("have.been.called");
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
