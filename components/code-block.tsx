import styled, { css, CSSProp } from "styled-components";
import { Combobox, ComboboxSingleOption } from "./combobox";
import {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  RichEditorThemeConfig,
  useTheme,
  getThemeSnapshot,
  subscribeTheme,
  ThemeProvider,
} from "./../theme";
import { Button } from "./button";
import { RiCloseLine } from "@remixicon/react";
import {
  RichEditor,
  RichEditorAction,
  RichEditorSupportedLanguagesMonaco,
  RichEditorToolbarPosition,
} from "./rich-editor";
import { useId } from "react";
import ReactDOM from "react-dom/client";
import TurndownService from "./../lib/turndown/turndown";

export type CodeBlockLanguage = RichEditorSupportedLanguagesMonaco;

export type CodeBlockAction = RichEditorAction;

export interface CodeBlockProps {
  value?: string;
  initialLang?: CodeBlockLanguage;
  onChange?: (code: string, lang: string) => void;
  onClosed?: () => void;
  readOnly?: boolean;
  clearable?: boolean;
  options?: CodeBlockOption[];
  styles?: CodeBlockStyles;
  valueLang?: CodeBlockLanguage;
  actions?: CodeBlockAction[];
  toolbarPosition?: RichEditorToolbarPosition;
}

interface CodeBlockStyles {
  self?: CSSProp;
  contentStyle?: CSSProp;
}

export type CodeBlockOption = ComboboxSingleOption;

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

function CodeBlock({
  value = "",
  initialLang = "typescript",
  onChange,
  onClosed,
  readOnly = false,
  clearable,
  options = [],
  styles,
  valueLang,
  actions,
  toolbarPosition = "top",
}: CodeBlockProps) {
  const { currentTheme, mode } = useTheme();
  const richEditorTheme = currentTheme?.richEditor;

  const uid = useId();
  const comboboxId = `combobox-richeditor-${uid}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [langLocal, setLangLocal] = useState(
    initialLang ?? (options[0]?.value as string)
  );
  const langRef = useRef(langLocal);

  const lang = valueLang ? valueLang : langLocal;

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
        renderLineHighlight: "none",
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
    setLangLocal(newLang);
    if (editorRef.current) {
      applyLangToMonaco(newLang);
    }
    onChange?.(editorRef.current?.getValue() ?? "", newLang);
  };

  useEffect(() => {
    if (!valueLang) return;
    applyLangToMonaco(valueLang);
  }, [valueLang, isLoaded]);

  const applyLangToMonaco = (newLang: CodeBlockLanguage) => {
    const monaco = (window as any).monaco;
    if (!monaco || !editorRef.current) return;

    const actualLang = newLang === "tsx" ? "typescript" : newLang;
    const currentValue = editorRef.current.getValue();

    if (newLang === "tsx" || newLang === "typescript") {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
        jsx:
          newLang === "tsx"
            ? monaco.languages.typescript.JsxEmit.React
            : monaco.languages.typescript.JsxEmit.None,
        jsxFactory: "React.createElement",
      });
      const ext = newLang === "tsx" ? "tsx" : "ts";
      const newUri = monaco.Uri.parse(`inmemory://model/${Date.now()}.${ext}`);
      const newModel = monaco.editor.createModel(
        currentValue,
        actualLang,
        newUri
      );
      const oldModel = editorRef.current.getModel();
      editorRef.current.setModel(newModel);
      oldModel?.dispose();
    } else {
      monaco.editor.setModelLanguage(editorRef.current.getModel(), actualLang);
    }
  };

  return (
    <RichEditor.Base
      actions={actions}
      toolbarPosition={toolbarPosition}
      theme={richEditorTheme}
      styles={{
        containerStyle: css`
          overflow: visible;
        `,
        toolbarStyle: css`
          padding-right: 6px;
        `,
        actionStyle: css`
          margin: 0px;
          padding-top: 2px;
          padding-bottom: 2px;
        `,
      }}
      leftSidePanel={
        !readOnly && (
          <Combobox
            strict
            id={comboboxId}
            styles={{
              containerStyle: css`
                width: 150px;
              `,
              controlStyle: css``,
              selectboxStyle: css`
                border-top: none;
                border-left: none;
                border-bottom: none;
                border-radius: 0px;
                background-color: transparent;
                &:focus-visible {
                  box-shadow: none;
                  border-bottom: none;
                }
              `,
              drawerStyle: css`
                max-height: 140px;
              `,
            }}
            selectedOptions={lang}
            onChange={(lang) => handleLangChange(lang as CodeBlockLanguage)}
            options={options}
          />
        )
      }
      rightSidePanel={
        !readOnly &&
        clearable && (
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
        )
      }
    >
      {!isLoaded && (
        <Placeholder $theme={richEditorTheme}>Loading editor…</Placeholder>
      )}
      <CodeEditor
        $readOnly={readOnly}
        $toolbarPosition={toolbarPosition}
        ref={containerRef}
        $visible={isLoaded}
        $style={styles?.contentStyle}
      />
    </RichEditor.Base>
  );
}

const Placeholder = styled.div<{ $theme: RichEditorThemeConfig }>`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $theme }) => $theme.placeholderColor};
  font-size: 12px;
  font-family: monospace;
`;

const CodeEditor = styled.div<{
  $visible: boolean;
  $style: CSSProp;
  $toolbarPosition?: RichEditorToolbarPosition;
  $readOnly: boolean;
}>`
  width: 100%;
  height: 60px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.15s;
  border-radius: 4px;
  clip-path: inset(0 round 4px);

  ${({ $toolbarPosition, $readOnly }) =>
    !$readOnly &&
    css`
      ${$toolbarPosition === "top"
        ? css`
            margin-top: 35px;
          `
        : css`
            margin-bottom: 35px;
          `}
    `}

  ${({ $style }) => $style}
`;

interface CodeBlockEditor {
  wrapper: HTMLElement;
  code: string;
  lang: string;
}

const codeBlockRegistry = new Map<string, CodeBlockEditor>();
let blockIdCounter = 0;

function nextBlockId() {
  return `monaco-block-${++blockIdCounter}`;
}

function CodeBlockBridge({
  id,
  code,
  initialLang,
  editorRef,
  onChange,
  turndownServiceRef,
  isViewOnly,
  wrapper,
  options,
  actions,
}: {
  id: string;
  code: string;
  initialLang: CodeBlockLanguage;
  editorRef: RefObject<HTMLDivElement>;
  onChange: ((value: string) => void) | undefined;
  turndownServiceRef: MutableRefObject<TurndownService>;
  isViewOnly: boolean;
  wrapper: HTMLElement;
  options: CodeBlockOption[];
  actions: CodeBlockAction[];
}) {
  const [theme, setTheme] = useState(getThemeSnapshot());

  useEffect(() => {
    return subscribeTheme(() => {
      setTheme(getThemeSnapshot());
    });
  }, []);

  return (
    <ThemeProvider mode={theme.mode} themes={theme.themes}>
      <CodeBlock
        clearable
        value={codeBlockRegistry.get(id)?.code ?? code}
        initialLang={initialLang}
        readOnly={isViewOnly}
        onChange={(newCode, lang) => {
          codeBlockRegistry.set(id, { wrapper, code: newCode, lang });
          serializeAndEmit(editorRef, turndownServiceRef.current, onChange);
        }}
        options={options}
        onClosed={() => {
          codeBlockRegistry.delete(id);
          wrapper.remove();
          serializeAndEmit(editorRef, turndownServiceRef.current, onChange);
        }}
        actions={actions}
      />
    </ThemeProvider>
  );
}

function CodeBlockEditor(
  wrapper: HTMLElement,
  id: string,
  code: string,
  initialLang: CodeBlockLanguage,
  editorRef: React.RefObject<HTMLDivElement>,
  onChange: ((value: string) => void) | undefined,
  turndownServiceRef: React.MutableRefObject<TurndownService>,
  isViewOnly: boolean,
  options: CodeBlockOption[],
  actions: CodeBlockAction[]
) {
  codeBlockRegistry.set(id, { wrapper, code, lang: initialLang });

  const root = ReactDOM.createRoot(wrapper);
  root.render(
    <CodeBlockBridge
      id={id}
      code={code}
      initialLang={initialLang}
      editorRef={editorRef}
      onChange={onChange}
      turndownServiceRef={turndownServiceRef}
      isViewOnly={isViewOnly}
      wrapper={wrapper}
      options={options}
      actions={actions}
    />
  );
}

function serializeAndEmit(
  editorRef: React.RefObject<HTMLDivElement>,
  turndownService: TurndownService,
  onChange: ((value: string) => void) | undefined
) {
  if (!editorRef.current || !onChange) return;

  // Clone the editor DOM so we can mutate it safely
  const clone = editorRef.current.cloneNode(true) as HTMLElement;

  // Replace each Monaco wrapper in the clone with a <pre><code> block so
  // turndown can convert it to fenced markdown
  clone.querySelectorAll("[data-monaco-block-id]").forEach((node) => {
    const id = (node as HTMLElement).dataset.monacoBlockId!;
    const record = codeBlockRegistry.get(id);
    if (!record) return;

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = `language-${record.lang}`;
    code.textContent = record.code;
    pre.appendChild(code);
    node.parentNode?.replaceChild(pre, node);
  });

  const html = clone.innerHTML.replace(/\u00A0/g, "");
  const cleanedHTML = RichEditor.cleanupHtml(html);
  const markdown = turndownService.turndown(cleanedHTML);
  const cleanedMarkdown = RichEditor.cleanSpacing(markdown);
  onChange(cleanedMarkdown);
}

// Parse fenced code blocks from the editor HTML and mount Monaco widgets
function hydrateFencedCodeBlocks(
  editorRef: React.RefObject<HTMLDivElement>,
  onChange: ((value: string) => void) | undefined,
  turndownServiceRef: React.MutableRefObject<TurndownService>,
  isViewOnly: boolean,
  options: CodeBlockOption[],
  actions: CodeBlockAction[]
) {
  if (!editorRef.current) return;

  editorRef.current.querySelectorAll("pre").forEach((pre) => {
    // Skip if already hydrated
    if (pre.dataset.monacoHydrated) return;
    pre.dataset.monacoHydrated = "true";

    const codeEl = pre.querySelector("code");
    const rawCode = codeEl?.textContent ?? pre.textContent ?? "";
    const langClass = codeEl?.className ?? "";
    const langMatch = langClass.match(/language-(\w+)/);
    const lang = langMatch ? langMatch[1] : "plaintext";

    const id = nextBlockId();
    const wrapper = document.createElement("div");
    wrapper.dataset.monacoBlockId = id;
    wrapper.contentEditable = "false";

    pre.replaceWith(wrapper);
    CodeBlockEditor(
      wrapper,
      id,
      rawCode,
      lang as CodeBlockLanguage,
      editorRef,
      onChange,
      turndownServiceRef,
      isViewOnly,
      options,
      actions
    );
  });
}

// Turndown rule for fenced code (must be registered before use)
function addFencedCodeRule(ts: TurndownService) {
  ts.addRule("fencedCode", {
    filter: (node) => {
      return (
        node.nodeName === "PRE" && node.firstElementChild?.nodeName === "CODE"
      );
    },
    replacement: (_content, node) => {
      const codeEl = (node as HTMLElement).querySelector("code")!;
      const lang = (codeEl.className.match(/language-(\w+)/) || [])[1] || "";
      const code = codeEl.textContent || "";
      return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
    },
  });
}

CodeBlock.addFencedCodeRule = addFencedCodeRule;
CodeBlock.hydrateFencedCodeBlocks = hydrateFencedCodeBlocks;
CodeBlock.serializeAndEmit = serializeAndEmit;
CodeBlock.Editor = CodeBlockEditor;
CodeBlock.nextBlockId = nextBlockId;

export { CodeBlock };
