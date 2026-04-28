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
} from "../theme";
import { Button } from "./button";
import { RiCloseLine } from "@remixicon/react";
import {
  RichEditor,
  RichEditorAction,
  MonacoCodeLanguageEquivalent,
  RichEditorToolbarPosition,
} from "./rich-editor";
import { useId } from "react";
import ReactDOM from "react-dom/client";
import TurndownService from "./../lib/turndown/turndown";
import marked from "./../lib/marked/marked";

/**
 * Monaco Editor uses Web Workers to run language services
 * (like TypeScript, JSON validation, IntelliSense, etc.) in a separate thread.
 *
 * In environments like Vite, workers are NOT automatically bundled or resolved.
 * So we must explicitly import each worker using the `?worker` suffix.
 *
 * The `?worker` tells Vite to:
 * - Treat the file as a Web Worker
 * - Bundle it separately
 * - Return a Worker constructor we can instantiate
 *
 * Without this setup:
 * - Monaco will fail to load language features
 * - You may see errors like:
 *   "Cannot read file ... json.worker.js"
 * - IntelliSense / syntax validation will not work
 */

import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import { applyConetoClassName } from "./../constants/classname";

/**
 * Registers the Monaco web worker factory on `window.MonacoEnvironment`.
 * Must be called before any editor instance is created. Safe to call multiple times.
 */

let initialized = false;

function initMonacoEnvironment() {
  if (initialized || typeof window === "undefined") return;

  (window as any).MonacoEnvironment = {
    getWorker(_: unknown, label: string) {
      if (label === "json") return new JsonWorker();
      if (label === "css" || label === "scss" || label === "less")
        return new CssWorker();
      if (label === "html") return new HtmlWorker();
      if (label === "typescript") return new TsWorker();
      return new EditorWorker();
    },
  };

  initialized = true;
}

// Cached promise so the Monaco bundle is only imported once.
let monacoPromise: Promise<
  typeof import("monaco-editor/esm/vs/editor/editor.main")
> | null = null;

/**
 * Lazily imports and caches the Monaco editor module.
 * @returns Promise resolving to the Monaco editor namespace.
 */

export function getMonacoEditor() {
  if (!monacoPromise) {
    monacoPromise = import("monaco-editor/esm/vs/editor/editor.main");
  }
  return monacoPromise;
}

export type CodeEditorLanguage = MonacoCodeLanguageEquivalent;

export interface CodeEditorAction extends Omit<RichEditorAction, "onClick"> {
  onClick?: (props: { code?: string }) => void;
}

export interface CodeEditorProps {
  id?: string;
  value?: string;
  language?: CodeEditorLanguage;
  onChange?: (code: string, lang: string) => void;
  onClosed?: () => void;
  readOnly?: boolean;
  clearable?: boolean;
  options?: CodeEditorOption[];
  styles?: CodeEditorStyles;
  actions?: CodeEditorAction[];
  toolbarPosition?: RichEditorToolbarPosition;
  removeOnEmpty?: boolean;
  autoFocus?: boolean;
  className?: string;
}

interface CodeEditorStyles {
  self?: CSSProp;
  contentStyle?: CSSProp;
}

export type CodeEditorOption = ComboboxSingleOption;

function CodeEditor({
  id,
  value = "",
  language = "tsx",
  onChange,
  onClosed,
  readOnly = false,
  clearable,
  options = [],
  styles,
  actions,
  toolbarPosition = "top",
  removeOnEmpty,
  autoFocus,
  className,
}: CodeEditorProps) {
  const { currentTheme, mode } = useTheme();
  const richEditorTheme = currentTheme?.richEditor;
  const editorTheme = mode === "dark" ? "vs-dark" : "vs";

  useEffect(() => {
    initMonacoEnvironment();
  }, []);

  const uid = useId();
  const comboboxId = `codeed-combo-${uid}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [lang, setLang] = useState<CodeEditorLanguage>(
    language ?? (options[0]?.value as CodeEditorLanguage)
  );
  const langRef = useRef(lang);

  langRef.current = lang;

  useEffect(() => {
    let disposed = false;

    (async () => {
      if (!containerRef.current) return;
      if (editorRef.current) return;

      try {
        const { KeyCode, editor } = await getMonacoEditor();

        if (disposed || !containerRef.current) return;

        const monacoEditor = editor.create(containerRef.current, {
          value,
          language,
          theme: editorTheme,
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
          fixedOverflowWidgets: true,
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

        editorRef.current = monacoEditor;

        if (id) {
          const record = codeBlockRegistry.get(id);
          if (record) {
            record.editor = monacoEditor;
          }
        }

        if (autoFocus) {
          requestAnimationFrame(() => {
            if (!disposed) {
              monacoEditor.focus();
            }
          });
        }

        const updateHeight = () => {
          const lineCount = monacoEditor.getModel()?.getLineCount() ?? 1;
          const lineHeight = 20;
          const padding = 20;
          const newHeight = Math.max(60, lineCount * lineHeight + padding);
          if (containerRef.current) {
            containerRef.current.style.height = `${newHeight}px`;
          }
          monacoEditor.layout();
        };

        updateHeight();

        monacoEditor.onDidChangeModelContent(() => {
          updateHeight();
          onChange?.(monacoEditor.getValue(), langRef.current);
        });

        monacoEditor.onKeyDown((e) => {
          const position = monacoEditor.getPosition();
          const model = monacoEditor.getModel();

          if (!position || !model) return;

          const lineNumber = position.lineNumber;
          const column = position.column;

          const isFirstLine = position.lineNumber === 1;
          const isLastLine = position.lineNumber === model.getLineCount();

          const lineMaxColumn = model.getLineMaxColumn(lineNumber);

          const isAtLineStart = column === 1;
          const isAtLineEnd = column === lineMaxColumn;

          if (e.keyCode === KeyCode.UpArrow && isFirstLine && isAtLineStart) {
            e.preventDefault();
            CodeEditor.exitToEditor(id, "above");
            return;
          }

          if (
            e.keyCode === KeyCode.Backspace &&
            removeOnEmpty &&
            monacoEditor.getValue().length === 0
          ) {
            e.preventDefault();
            onClosed?.();
            return;
          }

          if (e.keyCode === KeyCode.DownArrow && isLastLine && isAtLineEnd) {
            e.preventDefault();
            CodeEditor.exitToEditor(id, "below");
            return;
          }
        });
        setIsLoaded(true);
      } catch (e: any) {
        if (e?.message === "Canceled") return;
        throw e;
      }
    })();

    return () => {
      disposed = true;
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
    // Re-create the editor whenever the color-mode changes (same as before)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update theme after change mode, to always synchronize.
  useEffect(() => {
    if (!editorRef.current) return;

    (async () => {
      try {
        const { editor } = await getMonacoEditor();
        editor.setTheme(editorTheme);
      } catch {
        return;
      }
    })();
  }, [mode, editorTheme]);

  useEffect(() => {
    if (!lang) return;
    applyLangToMonaco(lang).catch((e) => {
      if (e?.message !== "Canceled") throw e;
    });
  }, [lang, isLoaded]);

  const handleLangChange = (newLang: CodeEditorLanguage) => {
    setLang(newLang);
    onChange?.(editorRef.current?.getValue() ?? "", newLang);
  };

  const applyLangToMonaco = async (newLang: CodeEditorLanguage) => {
    if (!editorRef.current) return;

    try {
      const { editor } = await getMonacoEditor();

      const actualLang = newLang === "tsx" ? "typescript" : newLang;

      editor.setModelLanguage(editorRef.current.getModel(), actualLang);
    } catch (e: any) {
      if (e?.message === "Canceled") return;
      throw e;
    }
  };

  const filteredActions = actions?.map((action) => ({
    ...action,
    onClick: () =>
      action?.onClick({
        code: editorRef.current?.getValue(),
      }),
  }));

  const codeEditorClassName = applyConetoClassName("code-editor", className);

  return (
    <RichEditor.Base
      className={codeEditorClassName}
      actions={filteredActions}
      toolbarPosition={toolbarPosition}
      theme={richEditorTheme}
      styles={{
        containerStyle: css`
          overflow: unset;
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
            onChange={(lang) => handleLangChange(lang as CodeEditorLanguage)}
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
        <Placeholder
          $readOnly={readOnly}
          $toolbarPosition={toolbarPosition}
          $theme={richEditorTheme}
        >
          Loading editor…
        </Placeholder>
      )}
      <Editor
        id={id}
        aria-label="rich-editor-code"
        $readOnly={readOnly}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        $toolbarPosition={toolbarPosition}
        ref={containerRef}
        $visible={isLoaded}
        $style={styles?.contentStyle}
      />
    </RichEditor.Base>
  );
}

const Placeholder = styled.div<{
  $theme: RichEditorThemeConfig;
  $toolbarPosition?: RichEditorToolbarPosition;
  $readOnly: boolean;
}>`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $theme }) => $theme.placeholderColor};
  font-size: 12px;
  font-family: monospace;

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
`;

const Editor = styled.div<{
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
  overflow: visible;

  & .monaco-editor,
  & .monaco-editor .overflow-guard {
    border-radius: 8px;
  }

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

// ── Code block registry ──
// Tracks every mounted Monaco block by ID. Used during serialization to read
// the current code and language for each block.
interface CodeEditor {
  wrapper: HTMLElement;
  code: string;
  lang: string;
  editor?: any;
}

const codeBlockRegistry = new Map<string, CodeEditor>();
let blockIdCounter = 0;

/** Returns the next unique block ID (e.g. "monaco-block-1"). */
function nextBlockId() {
  return `monaco-block-${++blockIdCounter}`;
}

// ── CodeEditorBridge ──
// Rendered into each isolated React root (one per Monaco block).
// Subscribes to the global theme store so the nested CodeEditor stays in sync
// even though it lives outside the main React tree.
function CodeEditorBridge({
  id,
  code,
  language,
  editorRef,
  onChange,
  turndownServiceRef,
  isViewOnly,
  wrapper,
  options,
  actions,
  autoFocus,
}: {
  id: string;
  code: string;
  language: CodeEditorLanguage;
  editorRef: RefObject<HTMLDivElement>;
  onChange: ((value: string) => void) | undefined;
  turndownServiceRef: MutableRefObject<TurndownService>;
  isViewOnly: boolean;
  wrapper: HTMLElement;
  options: CodeEditorOption[];
  actions: CodeEditorAction[];
  autoFocus: boolean;
}) {
  const [theme, setTheme] = useState(getThemeSnapshot());

  useEffect(() => {
    return subscribeTheme(() => {
      setTheme(getThemeSnapshot());
    });
  }, []);

  return (
    <ThemeProvider mode={theme.mode} themes={theme.themes}>
      <CodeEditor
        id={id}
        clearable
        removeOnEmpty
        autoFocus={autoFocus}
        value={codeBlockRegistry.get(id)?.code ?? code}
        language={language}
        readOnly={isViewOnly}
        onChange={(newCode, lang) => {
          codeBlockRegistry.set(id, { wrapper, code: newCode, lang });
          serializeAndEmit(editorRef, turndownServiceRef.current, onChange);
        }}
        options={options}
        onClosed={() => {
          exitToEditor(id, "above");
          codeBlockRegistry.delete(id);
          wrapper?.remove();
          serializeAndEmit(editorRef, turndownServiceRef.current, onChange);
        }}
        actions={actions}
      />
    </ThemeProvider>
  );
}

/**
 * Mounts a CodeEditorBridge into `wrapper` using an isolated React root
 * and registers an initial entry in the code block registry.
 */
function RenderCodeEditor(
  wrapper: HTMLElement,
  id: string,
  code: string,
  language: CodeEditorLanguage,
  editorRef: React.RefObject<HTMLDivElement>,
  onChange: ((value: string) => void) | undefined,
  turndownServiceRef: React.MutableRefObject<TurndownService>,
  isViewOnly: boolean,
  options: CodeEditorOption[],
  actions: CodeEditorAction[],
  autoFocus: boolean
) {
  codeBlockRegistry.set(id, { wrapper, code, lang: language });

  const root = ReactDOM.createRoot(wrapper);
  root.render(
    <CodeEditorBridge
      id={id}
      code={code}
      autoFocus={autoFocus}
      language={language}
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

/**
 * Serializes the full editor content (rich text + Monaco blocks) to Markdown
 * and delivers it via `onChange`.
 *
 * Steps:
 * 1. Clone the editor DOM to avoid mutating live nodes.
 * 2. Replace each Monaco wrapper with a `<pre><code>` element from the registry.
 * 3. Convert HTML → Markdown via Turndown, then clean up spacing.
 */
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

/**
 * Scans the editor for unhydrated `<pre>` elements and replaces each with
 * a live Monaco widget. Called after `marked` renders Markdown into HTML.
 */
function hydrateFencedCodeEditors(
  editorRef: React.RefObject<HTMLDivElement>,
  onChange: ((value: string) => void) | undefined,
  turndownServiceRef: React.MutableRefObject<TurndownService>,
  isViewOnly: boolean,
  options: CodeEditorOption[],
  actions: CodeEditorAction[],
  autoFocus: boolean
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
    RenderCodeEditor(
      wrapper,
      id,
      rawCode,
      lang as CodeEditorLanguage,
      editorRef,
      onChange,
      turndownServiceRef,
      isViewOnly,
      options,
      actions,
      autoFocus
    );
  });
}

/**
 * Registers a Turndown rule that converts `<pre><code>` elements to
 * fenced Markdown code blocks. Must be called once when the Turndown
 * service is created.
 */
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

/**
 * Moves the cursor focus out of a Monaco code block and into the
 * adjacent rich-text editor content, either above or below the block.
 *
 * This is triggered when the user presses the Up arrow on the first line
 * of the editor (exits above) or the Down arrow on the last line (exits below).
 *
 * @param id        - The Monaco block ID (`data-monaco-block-id` attribute).
 * @param direction - "above" to move to the preceding sibling element,
 *                    "below" to move to the following sibling element.
 */
function exitToEditor(id: string, direction: "above" | "below") {
  const wrapper = document.querySelector(`[data-monaco-block-id="${id}"]`);
  if (!wrapper) return;

  // Resolve the adjacent sibling element in the requested direction.
  let target: HTMLElement | null =
    direction === "above"
      ? (wrapper.previousElementSibling as HTMLElement)
      : (wrapper.nextElementSibling as HTMLElement);

  const isMonaco = (el: HTMLElement | null) =>
    el?.dataset.monacoBlockId !== undefined;

  // If no sibling exists, inject a new empty paragraph so the cursor
  // always has a valid landing spot.
  if (!target || isMonaco(target)) {
    const p = document.createElement("p");
    p.innerHTML = "<br>";
    if (direction === "above") {
      wrapper.parentNode?.insertBefore(p, wrapper);
    } else {
      wrapper.parentNode?.insertBefore(p, wrapper.nextSibling);
    }
    target = p;
  }

  // --- Place the cursor inside the target element ---
  //
  // We avoid using TreeWalker(SHOW_TEXT) here because it is invisible to
  // <br> nodes. A paragraph that contains only <br> (i.e. an empty/blank
  // line) has no text nodes, so TreeWalker would return null and the cursor
  // would land in the wrong position, effectively skipping the empty space.
  // Instead we inspect firstChild / lastChild directly.
  const sel = window.getSelection();
  const range = document.createRange();

  if (direction === "above") {
    // Target is above the block → place the cursor at the END of the element
    // so it appears after all existing text and <br> nodes.
    const lastChild = target.lastChild;
    if (lastChild) {
      if (lastChild.nodeType === Node.TEXT_NODE) {
        // Land after the last character of the text node.
        range.setStart(lastChild, lastChild.textContent?.length ?? 0);
      } else {
        // lastChild is a <br> or another element.
        // Setting the offset to its index positions the cursor just before
        // that trailing <br>, which is the last visible caret position.
        const index = Array.from(target.childNodes).indexOf(
          lastChild as ChildNode
        );
        range.setStart(target, index);
      }
    } else {
      // Element is completely empty — place cursor at the very beginning.
      range.setStart(target, 0);
    }
  } else {
    // Target is below the block → place the cursor at the START of the element.
    const firstChild = target.firstChild;
    if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
      // Land before the first character of the text node.
      range.setStart(firstChild, 0);
    } else {
      // firstChild is a <br> or the element is empty — offset 0 is correct.
      range.setStart(target, 0);
    }
  }

  range.collapse(true);
  sel?.removeAllRanges();
  sel?.addRange(range);
  target.focus();
}

/**
 * Registers a custom `marked` block extension for fenced code blocks.
 * Must be called once before any Markdown is parsed.
 *
 * Converts:
 * ```ts
 * const x = 1;
 * ```
 * → `<pre><code class="language-ts">const x = 1;</code></pre>`
 */
function addFencedCodeMarkedExtension() {
  marked.use({
    gfm: false,
    breaks: true,
    extensions: [
      {
        name: "fencedCode",
        level: "block",
        start(src) {
          return src.indexOf("```");
        },
        tokenizer(src) {
          const match = src.match(/^```(\w*)\n([\s\S]*?)```/);
          if (match) {
            return {
              type: "code",
              raw: match[0],
              lang: match[1],
              text: match[2],
            };
          }
        },
        renderer(token) {
          return `<pre><code class="language-${token.lang}">${token.text}</code></pre>`;
        },
      },
    ],
  });
}

CodeEditor.addFencedCodeRule = addFencedCodeRule;
CodeEditor.hydrateFencedCodeEditors = hydrateFencedCodeEditors;
CodeEditor.serializeAndEmit = serializeAndEmit;
CodeEditor.Editor = RenderCodeEditor;
CodeEditor.nextBlockId = nextBlockId;
CodeEditor.exitToEditor = exitToEditor;
CodeEditor.addFencedCodeMarkedExtension = addFencedCodeMarkedExtension;

export { CodeEditor };
