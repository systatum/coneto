import styled, { css, CSSProp } from "styled-components";
import { Combobox, ComboboxOption } from "./combobox";
import React, {
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
  CodeLanguageEquivalent,
  RichEditorToolbarPosition,
} from "./rich-editor";
import { useId } from "react";
import ReactDOM from "react-dom/client";
import TurndownService from "./../lib/turndown/turndown";
import marked from "./../lib/marked/marked";
import { applyClassName } from "./../constants/classname";

/**
 * ── CodeMirror 6 ──
 * Unlike Monaco, CodeMirror ships as plain ES modules with no web-worker
 * bootstrapping required, so there's no environment/worker registration
 * step here (compare to the old `initMonacoEnvironment`). Language support
 * packages are small and imported eagerly below; if the bundle size becomes
 * a concern these can be swapped for dynamic `import()` per-language later.
 */

import { EditorView, KeyBinding, keymap, lineNumbers } from "@codemirror/view";
import { Compartment, EditorState, Prec } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  indentOnInput,
  bracketMatching,
  syntaxHighlighting,
  defaultHighlightStyle,
  LanguageSupport,
} from "@codemirror/language";
import {
  closeBrackets,
  closeBracketsKeymap,
  autocompletion,
  completionKeymap,
} from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { css as cssLanguage } from "@codemirror/lang-css";
import { html as htmlLanguage } from "@codemirror/lang-html";
import { python } from "@codemirror/lang-python";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";

/**
 * Resolves a language identifier (as used throughout this file / the
 * combobox `options`) to the matching CodeMirror `LanguageSupport`
 * extension. Anything unrecognized falls back to plain text (no
 * highlighting)
 */
function getLanguageExtension(lang: string): LanguageSupport | [] {
  switch (lang) {
    case "typescript":
    case "ts":
      return javascript({ typescript: true });
    case "tsx":
      return javascript({ jsx: true, typescript: true });
    case "javascript":
    case "js":
      return javascript();
    case "jsx":
      return javascript({ jsx: true });
    case "json":
      return json();
    case "css":
    case "scss":
    case "less":
      return cssLanguage();
    case "html":
      return htmlLanguage();
    case "python":
    case "py":
      return python();
    case "markdown":
    case "md":
      return markdown();
    default:
      return [];
  }
}

export type CodeEditorLanguage = CodeLanguageEquivalent;

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

export type CodeEditorOption = ComboboxOption;

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

  const uid = useId();
  const comboboxId = `codeed-combo-${uid}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [lang, setLang] = useState<CodeEditorLanguage>(
    language ?? (options[0]?.value as CodeEditorLanguage)
  );
  const langRef = useRef(lang);
  langRef.current = lang;

  // Compartments let us swap language/theme/read-only state on an existing
  // view via `dispatch` instead of tearing the whole editor down (the CM6
  // equivalent of Monaco's `setModelLanguage` / `editor.setTheme`)

  const languageCompartment = useRef(new Compartment()).current;
  const themeCompartment = useRef(new Compartment()).current;
  const readOnlyCompartment = useRef(new Compartment()).current;

  const updateHeight = (view: EditorView) => {
    const lineCount = view.state.doc.lines;
    const lineHeight = 20;
    const padding = 20;
    const newHeight = Math.max(60, lineCount * lineHeight + padding);
    if (containerRef.current) {
      containerRef.current.style.height = `${newHeight}px`;
    }
  };

  const transparentBackground = Prec.high(
    EditorView.theme({
      "&": {
        backgroundColor: "transparent",
      },
      ".cm-content": {
        backgroundColor: "transparent",
      },
      ".cm-gutters": {
        border: "none",
        padding: "0px 4px 0px 2px",
      },
      ".cm-scroller": {
        scrollbarWidth: "thin", // Firefox
        scrollbarColor: `${richEditorTheme?.scrollThumb ?? "rgba(120,120,120,0.4)"} transparent`,
      },
      ".cm-scroller::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      ".cm-scroller::-webkit-scrollbar-track": {
        background: "transparent",
      },
      ".cm-scroller::-webkit-scrollbar-thumb": {
        backgroundColor:
          richEditorTheme?.scrollThumb ?? "rgba(120,120,120,0.4)",
        borderRadius: "4px",
      },
      ".cm-scroller::-webkit-scrollbar-thumb:hover": {
        backgroundColor:
          richEditorTheme?.scrollThumb ?? "rgba(120,120,120,0.6)",
      },
    })
  );

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;
    const editorKeymap: readonly KeyBinding[] = [
      {
        key: "ArrowUp",
        run: (view) => {
          const { head, empty } = view.state.selection.main;
          const atFirstLine = view.state.doc.lineAt(head).number === 1;
          if (empty && atFirstLine && head === 0) {
            CodeEditor.exitToEditor(id, "above");
            return true;
          }
          return false;
        },
      },
      {
        key: "ArrowDown",
        run: (view) => {
          const { head, empty } = view.state.selection.main;
          const isLastLine =
            view.state.doc.lineAt(head).number === view.state.doc.lines;
          const atDocEnd = head === view.state.doc.length;
          if (empty && isLastLine && atDocEnd) {
            CodeEditor.exitToEditor(id, "below");
            return true;
          }
          return false;
        },
      },
      {
        key: "Backspace",
        run: (view) => {
          if (removeOnEmpty && view.state.doc.length === 0) {
            onClosed?.();
            return true;
          }
          return false;
        },
      },
    ];

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          history(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          autocompletion(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          keymap.of([
            ...editorKeymap,
            ...closeBracketsKeymap,
            ...completionKeymap,
            ...historyKeymap,
            ...defaultKeymap,
          ]),
          languageCompartment.of(getLanguageExtension(lang)),
          themeCompartment.of(
            mode === "dark" ? [oneDark, transparentBackground] : []
          ),
          readOnlyCompartment.of(EditorView.editable.of(!readOnly)),
          EditorState.readOnly.of(readOnly),
          EditorView.theme({
            "&": {
              fontSize: "13px",
              height: "100%",
            },
            ".cm-content": {
              fontFamily:
                '"Fira Code", "Cascadia Code", "JetBrains Mono", "Consolas", monospace',
              padding: "10px 0",
              caretColor: "auto",
            },
            ".cm-gutters": {
              borderRadius: "0px",
            },
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              updateHeight(update.view);
              onChange?.(update.state.doc.toString(), langRef.current);
            }
          }),
        ],
      }),
      parent: containerRef.current,
    });

    editorRef.current = view;

    if (id) {
      const record = codeBlockRegistry.get(id);
      if (record) {
        record.editor = view;
      }
    }

    if (autoFocus) {
      requestAnimationFrame(() => {
        view.focus();
      });
    }

    updateHeight(view);
    setIsLoaded(true);

    return () => {
      view.destroy();
      editorRef.current = null;
    };
    // Re-create the editor whenever the color-mode changes (same as before)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update theme after change mode, to always synchronize.
  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.dispatch({
      effects: themeCompartment.reconfigure(
        mode === "dark" ? [oneDark, transparentBackground] : []
      ),
    });
  }, [mode]);

  // Keep the read-only compartment synced if the prop changes post-mount.
  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.dispatch({
      effects: [
        readOnlyCompartment.reconfigure(EditorView.editable.of(!readOnly)),
      ],
    });
  }, [readOnly]);

  useEffect(() => {
    if (!lang || !editorRef.current) return;
    editorRef.current.dispatch({
      effects: languageCompartment.reconfigure(getLanguageExtension(lang)),
    });
  }, [lang, isLoaded]);

  const handleLangChange = (newLang: CodeEditorLanguage) => {
    setLang(newLang);
    onChange?.(editorRef.current?.state.doc.toString() ?? "", newLang);
  };

  const filteredActions = actions?.map((action) => ({
    ...action,
    onClick: () =>
      action?.onClick({
        code: editorRef.current?.state.doc.toString(),
      }),
  }));

  return (
    <RichEditor.Base
      className={applyClassName("code-editor", className)}
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
  overflow: hidden;

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
  editor?: EditorView;
}

const codeBlockRegistry = new Map<string, CodeEditor>();
let blockIdCounter = 0;

/** Returns the next unique block ID (e.g. "code-mirror-block-1"). */
function nextBlockId() {
  return `code-mirror-block-${++blockIdCounter}`;
}

// ── CodeEditorBridge ──
// Rendered into each isolated React root (one per Code Mirror block).
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
 * Serializes the full editor content (rich text + Code mirror blocks) to Markdown
 * and delivers it via `onChange`.
 *
 * Steps:
 * 1. Clone the editor DOM to avoid mutating live nodes.
 * 2. Replace each CodeMirror wrapper with a `<pre><code>` element from the registry.
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

  // Replace each CodeMirror wrapper in the clone with a <pre><code> block so
  // turndown can convert it to fenced markdown
  clone.querySelectorAll("[data-cm-block-id]").forEach((node) => {
    const id = (node as HTMLElement).dataset.cmBlockId!;
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
 * a live CodeMirror widget. Called after `marked` renders Markdown into HTML.
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
    if (pre.dataset.cmHydrated) return;

    const codeEl = pre.querySelector("code");
    const langClass = codeEl?.className ?? "";
    const hasLangClass = /language-\w+/.test(langClass);

    if (!hasLangClass) {
      pre.dataset.cmHydrated = "true";
      return;
    }

    pre.dataset.cmHydrated = "true";

    const rawCode = codeEl?.textContent ?? pre.textContent ?? "";
    const langMatch = langClass.match(/language-(\w+)/);
    const lang = langMatch ? langMatch[1] : "plaintext";

    const id = nextBlockId();
    const wrapper = document.createElement("div");
    wrapper.dataset.cmBlockId = id;
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
 * Moves the cursor focus out of a CodeMirror code block and into the
 * adjacent rich-text editor content, either above or below the block.
 *
 * This is triggered when the user presses the Up arrow on the first line
 * of the editor (exits above) or the Down arrow on the last line (exits below).
 *
 * @param id        - The CodeMirror block ID (`data-cm-block-id` attribute).
 * @param direction - "above" to move to the preceding sibling element,
 *                    "below" to move to the following sibling element.
 */
function exitToEditor(id: string, direction: "above" | "below") {
  const wrapper = document.querySelector(`[data-cm-block-id="${id}"]`);
  if (!wrapper) return;

  // Resolve the adjacent sibling element in the requested direction.
  let target: HTMLElement | null =
    direction === "above"
      ? (wrapper.previousElementSibling as HTMLElement)
      : (wrapper.nextElementSibling as HTMLElement);

  const isCmBlock = (el: HTMLElement | null) =>
    el?.dataset.cmBlockId !== undefined;

  // If no sibling exists, inject a new empty paragraph so the cursor
  // always has a valid landing spot.
  if (!target || isCmBlock(target)) {
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
