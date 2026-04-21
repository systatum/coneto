import styled, { css } from "styled-components";
import { Combobox, ComboboxSingleOption } from "./combobox";
import { useEffect, useRef, useState } from "react";
import { CodeBlockThemeConfig, useTheme } from "./../theme";
import { Button } from "./button";
import { RiCloseLine } from "@remixicon/react";

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
  const { currentTheme, mode } = useTheme();
  const codeBlockTheme = currentTheme?.codeBlock;

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
        theme: mode === "dark" ? "vs-dark" : "vs",
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

      requestAnimationFrame(() => {
        editor.focus();
      });

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
  }, [mode]);

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
    <BlockWrapper $theme={codeBlockTheme} contentEditable={false}>
      <BlockHeader $theme={codeBlockTheme}>
        <Combobox
          styles={{
            containerStyle: css`
              width: 150px;
              height: 25px;
            `,
            controlStyle: css`
              height: 25px;
            `,
            selectboxStyle: css`
              height: 25px;
            `,
            drawerStyle: css`
              max-height: 140px;
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
          <Button
            type="button"
            variant="ghost"
            styles={{
              self: css`
                padding: 4px;
                height: 20px;
              `,
            }}
            onClick={onClosed}
            icon={{
              image: RiCloseLine,
              size: 14,
            }}
            title="Remove code block"
          />
        )}
      </BlockHeader>

      {!isLoaded && (
        <Placeholder $theme={codeBlockTheme}>Loading editor…</Placeholder>
      )}
      <MonacoContainer ref={containerRef} $visible={isLoaded} />
    </BlockWrapper>
  );
}

const BlockWrapper = styled.div<{ $theme: CodeBlockThemeConfig }>`
  border-radius: 2px;
  border: 1px solid ${({ $theme }) => $theme.borderColor};
  margin: 8px 0;
  background: ${({ $theme }) => $theme.backgroundColor};
  user-select: none;
`;

const BlockHeader = styled.div<{ $theme: CodeBlockThemeConfig }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 12px;
  background-color: ${({ $theme }) => $theme.headerBackground};
  border-bottom: 1px solid ${({ $theme }) => $theme.borderColor};
`;

const Placeholder = styled.div<{ $theme: CodeBlockThemeConfig }>`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $theme }) => $theme.placeholderColor};
  font-size: 12px;
  font-family: monospace;
`;

const MonacoContainer = styled.div<{ $visible: boolean }>`
  width: 100%;
  height: 60px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.15s;
`;
