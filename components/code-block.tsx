import styled, { css } from "styled-components";
import { Combobox, ComboboxSingleOption } from "./combobox";
import { useEffect, useRef, useState } from "react";

export const CodeBlockLanguage = {
  TypeScript: "typescript",
  JavaScript: "javascript",
  ReactTSX: "tsx",
  Python: "python",
  Rust: "rust",
  Go: "go",
  Java: "java",
  CSS: "css",
  HTML: "html",
  JSON: "json",
  SQL: "sql",
  Bash: "bash",
  Markdown: "markdown",
  PlainText: "plaintext",
} as const;

export type CodeBlockLanguage =
  (typeof CodeBlockLanguage)[keyof typeof CodeBlockLanguage];

export interface CodeBlockProps {
  value?: string;
  initialLang?: CodeBlockLanguage;
  onChange?: (code: string, lang: string) => void;
  onClosed?: () => void;
  readOnly?: boolean;
}

const SUPPORTED_LANGS: ComboboxSingleOption[] = [
  { text: "TypeScript", value: CodeBlockLanguage.TypeScript },
  { text: "JavaScript", value: CodeBlockLanguage.JavaScript },
  { text: "React TypeScript", value: CodeBlockLanguage.ReactTSX },
  { text: "Python", value: CodeBlockLanguage.Python },
  { text: "Rust", value: CodeBlockLanguage.Rust },
  { text: "Go", value: CodeBlockLanguage.Go },
  { text: "Java", value: CodeBlockLanguage.Java },
  { text: "CSS", value: CodeBlockLanguage.CSS },
  { text: "HTML", value: CodeBlockLanguage.HTML },
  { text: "JSON", value: CodeBlockLanguage.JSON },
  { text: "SQL", value: CodeBlockLanguage.SQL },
  { text: "Bash", value: CodeBlockLanguage.Bash },
  { text: "Markdown", value: CodeBlockLanguage.Markdown },
  { text: "Plain Text", value: CodeBlockLanguage.PlainText },
];

let monacoLoadPromise: Promise<typeof import("monaco-editor")> | null = null;

function loadMonaco(): Promise<typeof import("monaco-editor")> {
  if (monacoLoadPromise) return monacoLoadPromise;

  monacoLoadPromise = new Promise((resolve, reject) => {
    if ((window as any).monaco) {
      resolve((window as any).monaco);
      return;
    }

    const loaderScript = document.createElement("script");
    loaderScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs/loader.min.js";
    loaderScript.onload = () => {
      (window as any).require.config({
        paths: {
          vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs",
        },
      });
      (window as any).require(["vs/editor/editor.main"], (monaco: any) => {
        resolve(monaco);
      });
    };
    loaderScript.onerror = reject;
    document.head.appendChild(loaderScript);
  });

  return monacoLoadPromise;
}

export function CodeBlock({
  value = "",
  initialLang = "typescript",
  onChange,
  onClosed,
  readOnly = false,
}: CodeBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [lang, setLang] = useState(initialLang);
  const [isLoaded, setIsLoaded] = useState(false);
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    let destroyed = false;

    loadMonaco().then((monaco: any) => {
      if (destroyed || !containerRef.current) return;

      const editor = monaco.editor.create(containerRef.current, {
        value: value,
        language: initialLang,
        theme: "vs-dark",
        fontSize: 13,
        lineHeight: 20,
        fontFamily:
          '"Fira Code", "Cascadia Code", "JetBrains Mono", "Consolas", monospace',
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "off",
        renderLineHighlight: "line",
        cursorBlinking: "smooth",
        smoothScrolling: true,
        automaticLayout: true,
        tabSize: 2,
        lineNumbers: "on",
        glyphMargin: false,
        folding: false,
        readOnly,
        scrollbar: {
          verticalScrollbarSize: 4,
          horizontalScrollbarSize: 4,
          alwaysConsumeMouseWheel: false,
        },
        padding: { top: 10, bottom: 10 },
        overviewRulerLanes: 0,
        contextmenu: !readOnly,
      });

      editorRef.current = editor;

      const updateHeight = () => {
        const lineCount = editor.getModel()?.getLineCount() ?? 1;
        const lineHeight = 20;
        const padding = 20;
        const newHeight = Math.max(60, lineCount * lineHeight + padding);
        if (containerRef.current) {
          containerRef.current.style.height = `${newHeight}px`;
        }
        editor.layout();
      };

      updateHeight();

      editor.onDidChangeModelContent(() => {
        updateHeight();
        onChange?.(editor.getValue(), langRef.current);
      });

      setIsLoaded(true);
    });

    return () => {
      destroyed = true;
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, []);

  const handleLangChange = (newLang: CodeBlockLanguage) => {
    setLang(newLang);
    if (editorRef.current) {
      const monaco = (window as any).monaco;
      if (!monaco) return;

      const actualLang = newLang === "tsx" ? "typescript" : newLang;
      const currentValue = editorRef.current.getValue();

      if (newLang === "tsx" || newLang === "typescript") {
        // Set compiler options first
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
          jsx:
            newLang === "tsx"
              ? monaco.languages.typescript.JsxEmit.React
              : monaco.languages.typescript.JsxEmit.None,
          jsxFactory: "React.createElement",
        });

        // Create a new model with the correct file extension so the TS worker
        // can resolve the URI — this is what fixes "Could not find source file"
        const ext = newLang === "tsx" ? "tsx" : "ts";
        const newUri = monaco.Uri.parse(
          `inmemory://model/${Date.now()}.${ext}`
        );
        const newModel = monaco.editor.createModel(
          currentValue,
          actualLang,
          newUri
        );
        const oldModel = editorRef.current.getModel();
        editorRef.current.setModel(newModel);
        oldModel?.dispose();
      } else {
        // For non-TS languages, setModelLanguage is fine
        monaco.editor.setModelLanguage(
          editorRef.current.getModel(),
          actualLang
        );
      }

      onChange?.(currentValue, newLang);
    }
  };

  return (
    <BlockWrapper contentEditable={false}>
      <BlockHeader>
        <Combobox
          styles={{
            containerStyle: css`
              width: 150px;
              height: 10px;
            `,
            controlStyle: css`
              height: 10px;
            `,
            selectboxStyle: css`
              height: 10px;
            `,
          }}
          selectedOptions={lang}
          options={SUPPORTED_LANGS}
          onChange={(selectedOption) =>
            handleLangChange(selectedOption as CodeBlockLanguage)
          }
          disabled={readOnly}
        />

        {!readOnly && (
          <DeleteBtn type="button" onClick={onClosed} title="Remove code block">
            ✕
          </DeleteBtn>
        )}
      </BlockHeader>

      {!isLoaded && <Placeholder>Loading editor…</Placeholder>}
      <MonacoContainer ref={containerRef} $visible={isLoaded} />
    </BlockWrapper>
  );
}

const BlockWrapper = styled.div`
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 8px 0;
  background: #1e1e1e;
  user-select: none;
`;

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #2d2d2d;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const DeleteBtn = styled.button`
  margin-left: auto;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
  line-height: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
  }
`;

const MonacoContainer = styled.div<{ $visible: boolean }>`
  width: 100%;
  height: 60px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.15s;
`;

const Placeholder = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.25);
  font-size: 12px;
  font-family: monospace;
`;
