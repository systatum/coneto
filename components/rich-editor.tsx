import React, {
  forwardRef,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  RiBold,
  RiCheckboxLine,
  RiCodeSSlashLine,
  RiH1,
  RiH2,
  RiH3,
  RiHeading,
  RiItalic,
  RiListOrdered,
  RiListUnordered,
  RiPaintFill,
  RiTableLine,
  RiUnderline,
} from "@remixicon/react";
import TurndownService from "./../lib/turndown/turndown";
import { marked } from "./../lib/marked/marked";
import { TipMenu, TipMenuItemProps } from "./tip-menu";
import styled, { css, CSSProp } from "styled-components";
import { Figure, FigureProps } from "./figure";
import { RichEditorThemeConfig } from "./../theme";
import { useTheme } from "./../theme/provider";
import { CodeEditor, CodeEditorAction, CodeEditorOption } from "./code-editor";
import { applyClassName } from "./../constants/classname";
import { createPortal } from "react-dom";

export interface RichEditorFormatting {
  allowBold?: boolean;
  allowItalic?: boolean;
  allowUnderline?: boolean;
  allowOrderedList?: boolean;
  allowUnorderedList?: boolean;
  allowCheckBoxes?: boolean;
  allowHeading?: boolean;
  allowTable?: boolean;
}

export interface RichEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  toolbarRightPanel?: ReactNode;
  styles?: RichEditorStyles;
  mode?: RichEditorMode;
  toolbarPosition?: RichEditorToolbarPosition;
  autogrow?: boolean;
  height?: number;
  actions?: RichEditorAction[];
  codeEditor?: RichEditorCode;
  id?: string;
  className?: string;
  tokenRenderers?: RichEditorTokenRenderer;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  formatting?: RichEditorFormatting;
}

export type RichEditorTokenRenderer = Record<string, TokenRenderer>;

export interface TokenRenderer {
  endToken: string;
  render: (word: string) => ReactNode;
  className?: string;
}

export interface RichEditorCode {
  language?: RichEditorCodeLanguage;
  actions?: RichEditorCodeAction[];
  languageOptions?: RichEditorCodeLanguage[];
  id?: string;
  className?: string;
}

export type RichEditorCodeAction = CodeEditorAction;

export type RichEditorAction = RichEditorToolbarButtonProps;

export const RichEditorCodeLanguage = {
  TypeScript: "tsx",
  Python: "py",
  Ruby: "rb",
  CPP: "cpp",
  SQL: "sql",
  R: "r",
  PHP: "php",
  Go: "go",
  Rust: "rs",
  Java: "java",
  HTML: "html",
  CSS: "css",
  Text: "txt",
} as const;

export type RichEditorCodeLanguage =
  (typeof RichEditorCodeLanguage)[keyof typeof RichEditorCodeLanguage];

export const TranslatedRichEditorCodeLanguage: Record<
  RichEditorCodeLanguage,
  string
> = {
  tsx: "TypeScript",
  py: "Python",
  rb: "Ruby",
  cpp: "C++",
  sql: "SQL",
  r: "R",
  php: "PHP",
  go: "Go",
  rs: "Rust",
  java: "Java",
  html: "HTML",
  css: "CSS",
  txt: "Text",
};

export const CodeLanguageEquivalent = {
  tsx: "tsx",
  py: "python",
  rb: "ruby",
  cpp: "cpp",
  sql: "sql",
  r: "r",
  php: "php",
  go: "go",
  rs: "rust",
  java: "java",
  html: "html",
  css: "css",
  txt: "plaintext",
} as const;

export type CodeLanguageEquivalent =
  (typeof CodeLanguageEquivalent)[keyof typeof CodeLanguageEquivalent];

export interface RichEditorStyles extends BaseRichEditorStyles {
  editorStyle?: CSSProp;
  codeEditorStyle?: CSSProp;
}

export const RichEditorToolbarPosition = {
  Top: "top",
  Bottom: "bottom",
} as const;

export type RichEditorToolbarPosition =
  (typeof RichEditorToolbarPosition)[keyof typeof RichEditorToolbarPosition];

export const RichEditorMode = {
  ViewOnly: "view-only",
  PageEditor: "page-editor",
  TextEditor: "text-editor",
  CodeEditor: "code-editor",
  MarkdownEditor: "markdown-editor",
} as const;

export type RichEditorMode =
  (typeof RichEditorMode)[keyof typeof RichEditorMode];

export interface RichEditorToolbarButtonProps {
  icon?: FigureProps;
  onClick?: (props: { content?: string }) => void;
  children?: ReactNode;
  isOpen?: boolean;
  isActive?: boolean;
  styles?: RichEditorToolbarButtonStyles;
  ariaLabel?: string;
}

export interface RichEditorToolbarButtonStyles {
  self?: CSSProp;
}

interface RichEditorComponent
  extends React.ForwardRefExoticComponent<
    RichEditorProps & React.RefAttributes<RichEditorRef>
  > {
  ToolbarButton: typeof RichEditorToolbarButton;
  codeLanguage: typeof RichEditorCodeLanguage;
  translatedCodeLanguage: typeof TranslatedRichEditorCodeLanguage;
  Base: typeof BaseRichEditor;
  cleanupHtml: typeof cleanupHtml;
  cleanSpacing: typeof cleanSpacing;
}

export interface RichEditorRef {
  insertPlainText: (data: string) => void;
  insertMarkdownContent: (data: string) => void;
  syncTokens: () => void;
}

const TABLE_GRID_INITIAL_ROWS = 5;
const TABLE_GRID_MAX_ROWS = 12;
const TABLE_GRID_COLUMNS = 10;
const TABLE_GRID_CELL_SIZE = 14;

const normalizeHexColor = (color: string): string | null => {
  const value = color.trim().toLowerCase();
  if (!value || value === "transparent") return null;

  if (value.startsWith("#")) {
    if (/^#[0-9a-f]{3}$/.test(value)) {
      return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
    }

    return /^#[0-9a-f]{6}$/.test(value) ? value : null;
  }

  const match = value.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/
  );
  if (!match) return null;
  if (match[4] && Number(match[4]) === 0) return null;

  return `#${[match[1], match[2], match[3]]
    .map((channel) => Number(channel).toString(16).padStart(2, "0"))
    .join("")}`;
};

const TABLE_CELL_COLORS = [
  "#000000",
  "#3f3f3f",
  "#7f7f7f",
  "#a6a6a6",
  "#c0c0c0",
  "#d9d9d9",
  "#e6e6e6",
  "#f2f2f2",
  "#fafafa",
  "#ffffff",
  "#5b0f00",
  "#d02020",
  "#e07a00",
  "#ffd400",
  "#5bdc28",
  "#3ee0d8",
  "#2f7de1",
  "#1a2fd8",
  "#7a1ce0",
  "#d81ce0",
  "#d9b3a8",
  "#e6c9c2",
  "#f2ece0",
  "#f5f0c8",
  "#dbe8d4",
  "#cfdada",
  "#cfdcef",
  "#dce1ee",
  "#e0d4e8",
  "#ead4d9",
  "#c97b6f",
  "#d48b8f",
  "#edc08f",
  "#eee08a",
  "#b3d190",
  "#9dc0bb",
  "#93b5d9",
  "#95afd8",
  "#a796c6",
  "#c4a3b7",
  "#ad4f3d",
  "#c26b70",
  "#d99b57",
  "#dcbc4f",
  "#82a965",
  "#69918e",
  "#5d82b5",
  "#648cc6",
  "#8069a8",
  "#96658b",
  "#8a2c1f",
  "#a64449",
  "#b8722e",
  "#b79a35",
  "#5d7a4c",
  "#4d6a68",
  "#3f5b88",
  "#3f5f9e",
  "#5c467e",
  "#6c3e64",
  "#5e1a10",
  "#7a292f",
  "#8a4f1e",
  "#8b6f21",
  "#3f5735",
  "#34504e",
  "#2c4164",
  "#2c4478",
  "#422f5e",
  "#4b2b45",
  "#3a0f08",
  "#4d171a",
  "#5c340f",
  "#5a4812",
  "#263521",
  "#203432",
  "#1d2b44",
  "#1d2d50",
  "#2a1d3e",
  "#301a2b",
];

const PRESET_TABLE_COLOR_SET = new Set(
  TABLE_CELL_COLORS.map((color) => color.toLowerCase())
);

const tableCustomColors = (table: HTMLTableElement | null): string[] => {
  if (!table) return [];

  const colors: string[] = [];
  const seen = new Set<string>();

  table.querySelectorAll<HTMLTableCellElement>("th, td").forEach((cell) => {
    const color = normalizeHexColor(cell.style.backgroundColor);
    if (!color) return;
    if (color === "#e2e2e2") return;
    if (PRESET_TABLE_COLOR_SET.has(color)) return;
    if (seen.has(color)) return;

    seen.add(color);
    colors.push(color);
  });

  return colors;
};

const RichEditor = forwardRef<RichEditorRef, RichEditorProps>(
  (
    {
      value = "",
      mode = "text-editor",
      toolbarPosition = "top",
      onChange,
      toolbarRightPanel,
      styles,
      autogrow = false,
      height = 200,
      actions,
      codeEditor,
      className,
      id,
      tokenRenderers,
      onKeyDown,
      formatting,
    },
    ref
  ) => {
    const {
      allowBold = true,
      allowItalic = true,
      allowUnderline = true,
      allowOrderedList = true,
      allowUnorderedList = true,
      allowCheckBoxes = false,
      allowHeading = true,
      allowTable = true,
    } = formatting ?? {};

    const {
      languageOptions: _languageOptions = Object.values(RichEditorCodeLanguage),
      language = _languageOptions[0],
      actions: codeEditorActions,
      className: codeClassName,
      id: codeId,
    } = codeEditor ?? {};

    const { currentTheme } = useTheme();
    const richEditorTheme = currentTheme?.richEditor;

    const languagesOptions = useMemo(() => {
      return Array.from(new Set(_languageOptions));
    }, [_languageOptions]);

    const OPTIONS_LANGUAGES: CodeEditorOption[] = languagesOptions.map(
      (lang) => ({
        text: TranslatedRichEditorCodeLanguage[lang],
        value: CodeLanguageEquivalent[lang],
      })
    );

    const turndownServiceRef = useRef<TurndownService>(new TurndownService());
    const turndownService = new TurndownService();

    CodeEditor.addFencedCodeRule(turndownService);
    addHtmlTableRule(turndownService);
    addHtmlTableRule(turndownServiceRef.current);

    turndownService.addRule("atxHeading", {
      filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
      replacement: function (content, node) {
        const hLevel = Number((node as HTMLElement).nodeName.charAt(1));
        const prefix = "#".repeat(hLevel);
        return `${prefix} ${content}\n`;
      },
    });

    turndownService.addRule("cleanListSpacing", {
      filter: ["ul", "ol"],
      replacement: function (content, node) {
        const parentIsParagraph = node.parentElement?.tagName === "P";
        return parentIsParagraph ? content : `${content}\n\n`;
      },
    });

    turndownService.addRule("listItem", {
      filter: "li",
      replacement: function (content, node) {
        content = content
          .replace(/^\n+/, "")
          .replace(/\n+$/, "\n")
          .replace(/\n/gm, "\n    ");

        var prefix = "* ";
        var parent = node.parentNode as HTMLElement;
        if (parent.nodeName === "OL") {
          var start = parent.getAttribute("start");
          var index = Array.prototype.indexOf.call(parent.children, node);
          prefix = (start ? parseInt(start, 10) + index : index + 1) + ". ";
        }

        return (
          prefix +
          content +
          (node.nextSibling && !/\n$/.test(content) ? "\n" : "")
        );
      },
    });

    turndownService.addRule("cleanParagraphSpacing", {
      filter: ["p"],
      replacement: function (content, node) {
        const htmlContent = (node as HTMLElement).innerHTML;

        const hasBrOnly = /^(\s*<br\s*\/?>\s*)+$/.test(htmlContent);
        const prevSibling = node.previousElementSibling;
        const nextSibling = node.nextElementSibling;

        if (
          prevSibling &&
          /^H[1-6]$/.test(prevSibling.tagName) &&
          nextSibling &&
          (nextSibling.tagName === "UL" || nextSibling.tagName === "OL")
        ) {
          return content + "\n";
        }

        if (
          prevSibling &&
          /^H[1-6]$/.test(prevSibling.tagName) &&
          nextSibling &&
          nextSibling.tagName === "P"
        ) {
          return content;
        }

        if (
          prevSibling &&
          prevSibling.tagName === "P" &&
          nextSibling &&
          /^H[1-6]$/.test(nextSibling.tagName)
        ) {
          return content;
        }

        if (
          prevSibling &&
          prevSibling.tagName === "P" &&
          nextSibling &&
          (nextSibling.tagName === "UL" || nextSibling.tagName === "OL")
        ) {
          return "\n\n" + content + "\n";
        }

        if (
          prevSibling &&
          (prevSibling.tagName === "UL" || prevSibling.tagName === "OL") &&
          nextSibling &&
          (nextSibling.tagName === "UL" || nextSibling.tagName === "OL")
        ) {
          return content.trim() ? "\n" + content + "\n" : "\n";
        }

        if (hasBrOnly) {
          if (
            prevSibling &&
            (prevSibling.tagName === "UL" || prevSibling.tagName === "OL")
          ) {
            return "\n" + (nextSibling ? "\n" : "");
          }

          if (prevSibling && prevSibling.tagName === "P") {
            return "\n" + (nextSibling ? "\n" : "");
          }
          return "\n" + (nextSibling ? "\n" : "");
        }
        if (!content.trim()) return "";

        if (
          prevSibling &&
          (prevSibling.tagName === "UL" || prevSibling.tagName === "OL")
        ) {
          return content + (nextSibling ? "\n" : "");
        }

        if (prevSibling && prevSibling.tagName === "P") {
          return "\n" + content + (nextSibling ? "\n" : "");
        }

        const prefix = prevSibling ? "\n" : "\n";
        const suffix = nextSibling ? "\n" : "";

        return prefix + content + suffix;
      },
    });

    turndownService.addRule("unwrapListsInParagraphs", {
      filter: (node) => {
        return node.nodeName === "P" && node.querySelector("ul, ol") !== null;
      },
      replacement: function (content, node) {
        const listElement = node.querySelector("ul, ol");
        if (listElement) {
          return turndownService.turndown(listElement.outerHTML);
        }
        return content;
      },
    });

    turndownService.keep(["input"]);

    turndownService.addRule("checkbox", {
      filter: (node) => {
        return (
          node.nodeName === "INPUT" &&
          (node as HTMLInputElement).type === "checkbox" &&
          (node as HTMLElement).classList.contains("coneto-checkbox-wrapper")
        );
      },
      replacement: (_content, node) => {
        const el = node as HTMLElement & { checked?: boolean };
        const checked =
          (el as HTMLInputElement).checked || el.dataset.checked === "true";
        return `[${checked ? "x" : " "}] `;
      },
    });

    // When bold/italic are disallowed, strip the tags on the way back to
    // markdown instead of emitting ** / _ markers, so re-parsing never
    // reintroduces formatting the editor isn't supposed to support.
    if (!allowBold) {
      turndownService.addRule("disallowedBold", {
        filter: ["strong", "b"],
        replacement: (content) => content,
      });
    }

    if (!allowItalic) {
      turndownService.addRule("disallowedItalic", {
        filter: ["em", "i"],
        replacement: (content) => content,
      });
    }

    if (!allowHeading) {
      turndownService.addRule("disallowedHeading", {
        filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
        replacement: (content) => content,
      });
    }

    // Underline is not part of the Markdown specification.
    // This custom rule preserves or serializes <u> elements because
    // Turndown does not support underline out of the box.
    if (!allowUnderline) {
      turndownService.addRule("disallowedUnderline", {
        filter: ["u"],
        replacement: (content) => content,
      });
    } else {
      turndownService.addRule("italic", {
        filter: ["u"],
        replacement: (content) => `~${content}~`,
      });
    }

    CodeEditor.addFencedCodeMarkedExtension();

    const isLegal = isLegalDocument(value);

    let prevWalkToken: any = null;

    marked.use({
      // GFM provides table parsing. Strikethrough stays disabled below so the
      // editor's single-tilde underline syntax remains unambiguous.
      gfm: true,
      breaks: true,
      // Disable the built-in strong/em/list renderers when the
      // corresponding formatting isn't allowed, so markdown syntax like
      // `**bold**` or `- item` renders as plain text instead of the
      // matching element.
      renderer: {
        strong(token) {
          if (!allowBold) return this.parser.parseInline(token.tokens);
          return false;
        },
        em(token) {
          if (!allowItalic) return this.parser.parseInline(token.tokens);
          return false;
        },
        del(token) {
          return this.parser.parseInline(token.tokens);
        },
        list(token) {
          if (
            (token.ordered && !allowOrderedList) ||
            (!token.ordered && !allowUnorderedList)
          ) {
            return token.items
              .map(
                (item: any) => `<p>${this.parser.parseInline(item.tokens)}</p>`
              )
              .join("\n");
          }
          return false;
        },
      },
      // Track previous token so we can detect
      // blank lines that appear immediately after headings.
      walkTokens(token) {
        if (
          token.type === "space" &&
          token.raw.length >= 2 &&
          prevWalkToken?.type === "heading"
        ) {
          const blankLines = token.raw.length - 1;

          // Convert heading-following spaces into a custom
          // emptyParagraph token so we can preserve spacing.
          token.type = "emptyParagraph";
          (token as any).count = blankLines;
        }
        prevWalkToken = token;
      },
      extensions: [
        {
          /**
           * Custom underline tokenizer.
           * Markdown has no native underline syntax, so this editor
           * claims `~text~` as its own inline convention. GFM's
           * `~~strikethrough~~` token is rendered as plain text below, so
           * single tildes remain unambiguous.
           *
           * When underline is disallowed, the tildes are dropped and the
           * inner content renders as plain inline text instead of <u>,
           * matching how disallowed bold/italic fall back to plain text.
           */
          name: "underline",
          level: "inline",
          start(src) {
            return src.indexOf("~");
          },
          tokenizer(src) {
            const match = src.match(/^~((?:(?!~).)+?)~/);
            if (match) {
              return {
                type: "underline",
                raw: match[0],
                tokens: this.lexer.inlineTokens(match[1]),
              };
            }
          },
          renderer(token) {
            if (!allowUnderline) return this.parser.parseInline(token.tokens);
            return `<u>${this.parser.parseInline(token.tokens)}</u>`;
          },
        },
        {
          /**
           * Custom heading tokenizer.
           * Ensures markdown headings are parsed consistently
           * and rendered as native h1-h6 elements.
           */
          name: "heading",
          level: "block",
          start(src) {
            return src.indexOf("#");
          },
          tokenizer(src) {
            // A backslash before the hashes means the user wrote a literal
            // "#", so keep the whole escaped line as plain text instead of
            // turning it into a heading.
            const escaped = src.match(/^(\\#{1,6}) ([^\n]+)/);
            if (escaped) {
              return {
                type: "paragraph",
                raw: escaped[0],
                text: escaped[0],
                tokens: this.lexer.inlineTokens(escaped[0]),
              };
            }

            const match = src.match(/^(#{1,6}) ([^\n]+)/);
            if (match) {
              return {
                type: "heading",
                raw: match[0],
                depth: match[1].length,
                text: match[2],
                tokens: [],
              };
            }
          },
          renderer(token) {
            return allowHeading
              ? `<h${token.depth}>${token.text}</h${token.depth}>`
              : token.text;
          },
        },
        {
          /**
           * Preserves multiple blank lines by converting them
           * into explicit empty paragraph elements.
           *
           * Skipped for:
           * - list contexts
           * - legal document rendering
           */
          name: "emptyParagraph",
          level: "block",
          start(src) {
            return src.indexOf("\n\n");
          },
          tokenizer(src, tokens) {
            const prevToken = tokens?.[tokens.length - 1];
            if (prevToken?.type === "list") return;

            const isListContext = /^[ \t]*([-*+]|\d+\.)\s/m.test(src);
            if (isListContext) return;

            const match = src.match(/^(\n{2,})/);
            if (match) {
              const isAfterHeading = prevToken?.type === "heading";
              // Add an extra line when spacing follows a heading.
              const blankLines = match[0].length - 1 + (isAfterHeading ? 1 : 0);
              return {
                type: "emptyParagraph",
                raw: match[0],
                count: blankLines,
              };
            }
          },
          renderer(token) {
            if (isLegal) return "";

            return "<p><br></p>".repeat(token.count);
          },
        },
        {
          /**
           * Converts consecutive single-line breaks into
           * individual paragraph elements.
           *
           * Example:
           *   Line A
           *   Line B
           *
           * Becomes:
           *   <p>Line A</p>
           *   <p>Line B</p>
           *
           * Skipped for:
           * - headings
           * - code fences
           * - lists
           * - indented blocks
           * - wrapped paragraphs
           */
          name: "lineSeparated",
          level: "block",
          start(src) {
            return src.indexOf("\n");
          },
          tokenizer(src, tokens) {
            const isHeading = /^#{1,6}\s/.test(src);
            if (isHeading) return;

            const isCodeFence = /^`{3,}/.test(src);
            if (isCodeFence) return;

            const firstLine = src.split("\n")[0];
            if (/^[ \t]*([-*+]|\d+\.)\s/.test(firstLine)) return;
            if (/^[ \t]+/.test(firstLine)) return;

            const match = src.match(/^([^\n]+)(\n(?!\n)[^\n]+)*(?=\n\n|\n?$)/);
            if (match && match[0].includes("\n")) {
              const lines = match[0].split("\n");

              // Treat long consecutive lines as a wrapped paragraph,
              // not as separate paragraphs.
              const looksLikeWrappedParagraph =
                lines.length > 1 && lines.every((l) => l.length > 20);

              if (looksLikeWrappedParagraph) return;

              if (lines.some((l) => /^`{3,}/.test(l.trim()))) return;
              if (lines.some((l) => /^ {4,}/.test(l))) return;
              if (lines.some((l) => /^[ \t]+\S/.test(l))) return;
              if (lines.some((l) => /^[ \t]*([-*+]|\d+\.)\s/.test(l))) return;
              // Heading lines interrupt the run so the heading tokenizer
              // renders them as real headings instead of paragraphs.
              if (lines.some((l) => /^ {0,3}#{1,6}\s/.test(l))) return;

              // Let the GFM table tokenizer own pipe-delimited rows.
              if (lines.some((l) => /^\s*\|.*\|\s*$/.test(l))) return;

              return {
                type: "lineSeparated",
                raw: match[0],
                lines: lines.filter((l) => l.trim() !== ""),
              };
            }
          },
          renderer(token) {
            if (isLegal) return "";
            return token.lines
              .map((line: string) => `<p>${line}</p>`)
              .join("\n");
          },
        },
      ],
    });

    if (tokenRenderers) {
      // build turndown rules
      const rules = buildTurndownRules(tokenRenderers);
      rules.forEach(({ name, filter, replacement }) => {
        turndownService.addRule(name, { filter, replacement });
        turndownServiceRef.current.addRule(name, { filter, replacement });
      });

      // build extensions
      const extensions = buildMarkedExtensions(tokenRenderers);
      marked.use({ extensions });
    }

    const editorRef = useRef<HTMLDivElement>(null);
    const savedSelection = useRef<Range | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const tableMenuRef = useRef<HTMLDivElement | null>(null);
    const cellColorMenuRef = useRef<HTMLDivElement | null>(null);
    const activeTableCellRef = useRef<HTMLTableCellElement | null>(null);

    const handleEditorChange = () => {
      CodeEditor.serializeAndEmit(editorRef, turndownService, onChange);
    };

    useImperativeHandle(ref, () => ({
      insertMarkdownContent: async (content: string) => {
        if (!editorRef.current) return;

        if (document.activeElement !== editorRef.current) {
          editorRef.current.focus();
          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        let sel = window.getSelection();
        let range = sel?.rangeCount ? sel.getRangeAt(0) : null;
        if (!range) return;

        let html = await marked.parse(content);

        html = splitBrIntoParagraphs(html);

        const temp = document.createElement("p");
        temp.innerHTML = html;

        const nodes = Array.from(temp.childNodes);

        nodes.forEach((node) => {
          range.insertNode(node);
          range.setStartAfter(node);
          range.collapse(true);
        });

        if (nodes.length > 0) {
          const lastNode = nodes[nodes.length - 1];

          range.setStartAfter(lastNode);
          range.collapse(true);
        }

        sel?.removeAllRanges();
        sel?.addRange(range);

        if (editorRef.current) {
          applyDefaultTableStyles(editorRef.current);
        }

        handleFilteringCheckbox();

        CodeEditor.hydrateFencedCodeEditors(
          editorRef,
          onChange,
          turndownServiceRef,
          mode === "view-only",
          OPTIONS_LANGUAGES,
          codeEditorActions,
          true
        );

        handleEditorChange();
      },
      insertPlainText: async (data: string) => {
        if (!editorRef.current) return;

        if (document.activeElement !== editorRef.current) {
          editorRef.current.focus();

          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        let sel = window.getSelection();
        let range = sel?.rangeCount ? sel.getRangeAt(0) : null;

        const temp = document.createElement("div");
        temp.innerHTML = data;

        const nodes = Array.from(temp.childNodes);

        nodes.forEach((node) => {
          range.insertNode(node);
          range.setStartAfter(node);
          range.collapse(true);
        });

        const spaceNode = document.createTextNode(" ");
        range.insertNode(spaceNode);
        range.setStartAfter(spaceNode);
        range.collapse(true);

        sel?.removeAllRanges();
        sel?.addRange(range);

        handleFilteringCheckbox();

        handleEditorChange();
      },
      syncTokens: () => {
        if (!editorRef.current) return;
        const html = editorRef.current.innerHTML.replace(/\u00A0/g, "");
        const cleanedHTML = cleanupHtml(html);
        const markdown = turndownService.turndown(cleanedHTML);
        const cleanedMarkdown = cleanSpacing(markdown);
        onChange?.(cleanedMarkdown);
      },
    }));

    const [isOpen, setIsOpen] = useState(false);
    const [isTableMenuOpen, setIsTableMenuOpen] = useState(false);
    const [tableGridSize, setTableGridSize] = useState({
      rows: 0,
      columns: 0,
    });
    const [visibleTableRows, setVisibleTableRows] = useState(
      TABLE_GRID_INITIAL_ROWS
    );
    const [isInTableCell, setIsInTableCell] = useState(false);
    const [isCellColorMenuOpen, setIsCellColorMenuOpen] = useState(false);
    const [customCellColor, setCustomCellColor] = useState("#ffffff");
    const [customTableColors, setCustomTableColors] = useState<string[]>([]);

    const [formatStates, setFormatStates] = useState({
      bold: false,
      italic: false,
      underline: false,
    });

    const updateFormatStates = () => {
      if (!editorRef.current || mode === "view-only") return;

      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const node = sel.anchorNode;

      if (!node || !editorRef.current.contains(node)) {
        setIsInTableCell(false);
        setFormatStates({ bold: false, italic: false, underline: false });
        return;
      }

      const element =
        node.nodeType === Node.ELEMENT_NODE
          ? (node as Element)
          : node.parentElement;
      const cell = element?.closest("td, th") as HTMLTableCellElement | null;

      setIsInTableCell(!!cell);
      if (cell) {
        activeTableCellRef.current = cell;
      }

      try {
        const bold = document.queryCommandState("bold");
        const italic = document.queryCommandState("italic");
        const underline = document.queryCommandState("underline");

        setFormatStates({
          bold,
          italic,
          underline,
        });
      } catch (error) {
        console.warn("Error checking command state:", error);
      }
    };

    useEffect(() => {
      const editor = editorRef.current;
      if (!editor || mode === "view-only") return;

      const handleSelectionChange = () => {
        setTimeout(updateFormatStates, 0);
      };

      const handleKeyUp = () => {
        updateFormatStates();
      };

      const handleMouseUp = () => {
        updateFormatStates();
      };

      const handleFocus = () => {
        updateFormatStates();
      };

      document.addEventListener("selectionchange", handleSelectionChange);
      editor.addEventListener("keyup", handleKeyUp);
      editor.addEventListener("mouseup", handleMouseUp);
      editor.addEventListener("focus", handleFocus);

      return () => {
        document.removeEventListener("selectionchange", handleSelectionChange);
        editor.removeEventListener("keyup", handleKeyUp);
        editor.removeEventListener("mouseup", handleMouseUp);
        editor.removeEventListener("focus", handleFocus);
      };
    }, [mode]);

    useEffect(() => {
      let isMounted = true;

      const initializeEditor = async () => {
        if (!editorRef.current || editorRef.current.innerHTML.trim()) return;

        let html: string;

        html = value?.trim() ? await marked.parse(value) : `<p>${value}</p>`;

        if (!html.trim().startsWith("<")) {
          html = `<p>${html}</p>`;
        }

        if (!isMounted || !editorRef.current) return;

        html = splitBrIntoParagraphs(html);

        editorRef.current.innerHTML = String(html);
        const tableStylesChanged = applyDefaultTableStyles(editorRef.current);
        document.execCommand("defaultParagraphSeparator", false, "p");

        editorRef.current
          .querySelectorAll(".custom-checkbox-wrapper")
          .forEach((node) => node.remove());

        handleFilteringCheckbox();

        CodeEditor.hydrateFencedCodeEditors(
          editorRef,
          onChange,
          turndownServiceRef,
          mode === "view-only",
          OPTIONS_LANGUAGES,
          codeEditorActions,
          false
        );

        if (tableStylesChanged && isMounted) {
          handleEditorChange();
        }
      };

      initializeEditor();

      return () => {
        isMounted = false;
      };
    }, []);

    const handleFilteringCheckbox = () => {
      if (!allowCheckBoxes) return;

      const walker = document.createTreeWalker(
        editorRef.current,
        NodeFilter.SHOW_TEXT
      );

      const textNodesToProcess: Text[] = [];

      while (walker.nextNode()) {
        const textNode = walker.currentNode as Text;
        if (textNode.nodeValue && /\[(x| )\]/i.test(textNode.nodeValue)) {
          textNodesToProcess.push(textNode);
        }
      }

      const isViewOnly = mode === "view-only";

      textNodesToProcess.forEach((textNode) => {
        if (!textNode.parentNode || !textNode.nodeValue) return;

        const parts = textNode.nodeValue.split(/(\[x\]|\[ \])/i);
        if (parts.length === 1) return;

        const fragment = document.createDocumentFragment();

        parts.forEach((part) => {
          if (part.toLowerCase() === "[x]") {
            fragment.appendChild(
              createCheckboxWrapper(
                true,
                turndownService,
                editorRef,
                onChange,
                isViewOnly
              )
            );
          } else if (part.toLowerCase() === "[ ]") {
            fragment.appendChild(
              createCheckboxWrapper(
                false,
                turndownService,
                editorRef,
                onChange,
                isViewOnly
              )
            );
          } else if (part) {
            fragment.appendChild(document.createTextNode(part));
          }
        });

        textNode.parentNode.replaceChild(fragment, textNode);
      });
    };

    const insertCodeEditor = () => {
      if (!editorRef.current) return;

      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);

      // Find the closest block-level element
      let anchorNode: Node | null = range.startContainer;
      while (
        anchorNode &&
        anchorNode !== editorRef.current &&
        !(anchorNode as Element).matches?.(
          "p, div, h1, h2, h3, h4, h5, h6, li, blockquote"
        )
      ) {
        anchorNode = anchorNode.parentNode;
      }

      const insertAfter =
        anchorNode && anchorNode !== editorRef.current
          ? anchorNode
          : editorRef.current.lastChild;

      const id = CodeEditor.nextBlockId();
      const wrapper = document.createElement("div");
      wrapper.dataset.cmBlockId = id;
      wrapper.contentEditable = "false";

      const after = document.createElement("p");
      after.innerHTML = "<br>";

      const parent = insertAfter?.parentNode ?? editorRef.current;
      const sibling = insertAfter?.nextSibling ?? null;

      // If the current block is an empty <p>, replace it with the code mirror block
      const isEmptyParagraph =
        insertAfter instanceof HTMLElement &&
        insertAfter.tagName === "P" &&
        (!insertAfter.textContent || insertAfter.textContent.trim() === "");

      if (isEmptyParagraph) {
        parent.replaceChild(wrapper, insertAfter);
        parent.insertBefore(after, wrapper.nextSibling);
      } else {
        parent.insertBefore(wrapper, sibling);
        parent.insertBefore(after, wrapper.nextSibling);
      }

      // Move cursor to the paragraph after the block
      const newRange = document.createRange();
      newRange.setStart(after, 0);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);

      CodeEditor.Editor(
        wrapper,
        id,
        "",
        CodeLanguageEquivalent[language],
        editorRef,
        onChange,
        turndownServiceRef,
        false,
        OPTIONS_LANGUAGES,
        codeEditorActions,
        true
      );

      handleEditorChange();
    };

    const getSelectedTableCell = (): HTMLTableCellElement | null => {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return null;

      const node = selection.anchorNode;
      if (!node || !editorRef.current?.contains(node)) return null;

      const element =
        node.nodeType === Node.ELEMENT_NODE
          ? (node as Element)
          : node.parentElement;

      return element?.closest("td, th") as HTMLTableCellElement | null;
    };

    const focusTableCell = (cell: HTMLTableCellElement) => {
      editorRef.current?.focus();
      const selection = window.getSelection();
      if (!selection) return;

      const range = document.createRange();
      range.selectNodeContents(cell);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    };

    const insertTable = (rows: number, columns: number) => {
      if (!editorRef.current || mode === "view-only") return;

      editorRef.current.focus();

      const selection = window.getSelection();
      if (savedSelection.current && selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelection.current);
        savedSelection.current = null;
      }

      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;

      let anchor: HTMLElement | null = null;
      let node: Node | null = range?.startContainer ?? null;

      while (node && node !== editorRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          if (
            element.tagName === "TABLE" ||
            element.matches("p, div, h1, h2, h3, h4, h5, h6, blockquote, pre")
          ) {
            anchor = element;
            break;
          }
        }
        node = node.parentNode;
      }

      const createCell = (tagName: "th" | "td") => {
        const cell = document.createElement(tagName);
        cell.appendChild(document.createElement("br"));
        return cell;
      };

      const table = document.createElement("table");
      table.className = "rich-editor-table";

      const header = document.createElement("thead");
      const headerRow = document.createElement("tr");
      for (let column = 0; column < columns; column++) {
        headerRow.appendChild(createCell("th"));
      }
      header.appendChild(headerRow);
      table.appendChild(header);

      if (rows > 1) {
        const body = document.createElement("tbody");
        for (let row = 1; row < rows; row++) {
          const bodyRow = document.createElement("tr");
          for (let column = 0; column < columns; column++) {
            bodyRow.appendChild(createCell("td"));
          }
          body.appendChild(bodyRow);
        }
        table.appendChild(body);
      }

      applyDefaultTableStyles(table);

      const after = document.createElement("p");
      after.appendChild(document.createElement("br"));

      if (
        anchor?.tagName === "P" &&
        !anchor.textContent?.trim() &&
        !anchor.querySelector("input, img, table")
      ) {
        anchor.replaceWith(table);
        table.insertAdjacentElement("afterend", after);
      } else if (anchor) {
        anchor.insertAdjacentElement("afterend", table);
        table.insertAdjacentElement("afterend", after);
      } else {
        editorRef.current.appendChild(table);
        editorRef.current.appendChild(after);
      }

      const firstCell = table.querySelector(
        "th, td"
      ) as HTMLTableCellElement | null;
      if (firstCell) {
        focusTableCell(firstCell);
        activeTableCellRef.current = firstCell;
        setIsInTableCell(true);
      }

      setIsTableMenuOpen(false);
      setTableGridSize({ rows: 0, columns: 0 });
      handleEditorChange();
    };

    const applyCellBackground = (color: string) => {
      const cell = activeTableCellRef.current;
      if (!cell) return;

      cell.style.backgroundColor = color;
      setCustomCellColor(normalizeHexColor(color) ?? customCellColor);
      setCustomTableColors(
        tableCustomColors(cell.closest("table") as HTMLTableElement | null)
      );
      focusTableCell(cell);
      handleEditorChange();
    };

    const handleCommand = (
      command:
        | "bold"
        | "italic"
        | "underline"
        | "insertOrderedList"
        | "insertUnorderedList"
        | "checkbox"
        | "codeBlock"
    ) => {
      if (!editorRef.current) return;

      if (command === "bold" && !allowBold) return;
      if (command === "italic" && !allowItalic) return;
      if (command === "underline" && !allowUnderline) return;
      if (command === "insertOrderedList" && !allowOrderedList) return;
      if (command === "insertUnorderedList" && !allowUnorderedList) return;
      if (command === "checkbox" && !allowCheckBoxes) return;

      editorRef.current.focus();

      if (command === "codeBlock") {
        insertCodeEditor();
        return;
      }

      const sel = window.getSelection();

      if (command === "checkbox") {
        if (!sel || !sel.rangeCount) return;

        const range = sel.getRangeAt(0);

        const checkboxWrapper = createCheckboxWrapper(
          false,
          turndownService,
          editorRef,
          onChange
        );

        range.insertNode(checkboxWrapper);

        const spaceNode = document.createTextNode("\u00A0");
        checkboxWrapper.after(spaceNode);

        const newRange = document.createRange();
        newRange.setStartAfter(spaceNode);
        newRange.collapse(true);

        sel.removeAllRanges();
        sel.addRange(newRange);

        handleEditorChange();
        return;
      }

      if (command === "bold" || command === "italic") {
        if (sel && sel.rangeCount && sel.isCollapsed) {
          applyInlineStyleToWord(command);
        } else {
          document.execCommand(command);
        }

        handleEditorChange();
        return;
      }

      if (command === "underline") {
        if (sel && sel.rangeCount && sel.isCollapsed) {
          applyInlineStyleToWord(command);
        } else {
          document.execCommand(command);
        }

        handleEditorChange();
        return;
      }

      document.execCommand(command);
      handleEditorChange();
    };

    // Converts the caret block when its text is a typed markdown heading
    // prefix ("#", "##", ..., up to "######"), Notion style. Lists and
    // checkboxes are handled by the space handler below. Returns whether it
    // converted, so the caller can swallow the triggering space.
    const convertMarkdownBlockPrefix = (): boolean => {
      if (!editorRef.current) return false;

      const selection = window.getSelection();

      if (!selection || selection.rangeCount === 0) return false;

      // Find the direct child of the editor that holds the caret.
      let node: Node | null = selection.anchorNode;

      while (node && node.parentElement !== editorRef.current) {
        node = node.parentElement;
      }

      if (!(node instanceof HTMLElement)) return false;

      const text = (node.textContent ?? "").trim();
      const heading = text.match(/^(#{1,6})$/);

      if (!heading) return false;

      const level = heading[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      const headingTag = `h${level}` as keyof HTMLElementTagNameMap;
      const newHeading = document.createElement(headingTag);

      node.replaceWith(newHeading);

      // Empty blocks cannot hold a typing caret in Chromium, so give the new
      // structure a <br> anchor for the caret to sit after.
      if (!newHeading.firstChild) {
        newHeading.appendChild(document.createElement("br"));
      }

      selection.removeAllRanges();

      const caret = document.createRange();
      caret.selectNodeContents(newHeading);
      caret.collapse(true);
      selection.addRange(caret);

      return true;
    };

    const handleOnKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);

      if (mode === "markdown-editor" && e.key === " ") {
        // Convert typed markdown block syntax (e.g. "## ") into a real
        // structure so serialized bodies never keep escaped leftovers like
        // "\## Heading".
        if (convertMarkdownBlockPrefix()) {
          e.preventDefault();
          handleEditorChange();
          return;
        }
      }

      if (mode === "view-only") {
        const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c";

        if (!isCopy) {
          e.preventDefault();
        }
      }

      if (mode !== "view-only" && allowTable) {
        const cell = getSelectedTableCell();

        if (cell) {
          if (e.key === "Tab") {
            const cells = Array.from(
              editorRef.current?.querySelectorAll<HTMLTableCellElement>(
                "td, th"
              ) ?? []
            );
            const index = cells.indexOf(cell);
            if (index === -1) return;

            const nextIndex = index + (e.shiftKey ? -1 : 1);
            if (nextIndex >= 0 && nextIndex < cells.length) {
              e.preventDefault();
              focusTableCell(cells[nextIndex]);
              return;
            }

            if (!e.shiftKey) {
              e.preventDefault();

              const table = cell.closest("table");
              if (table) {
                const row = table.insertRow(-1);
                const columnCount = cell.parentElement?.children.length ?? 1;
                for (let column = 0; column < columnCount; column++) {
                  const newCell = row.insertCell();
                  newCell.appendChild(document.createElement("br"));
                }

                applyDefaultTableStyles(table);

                const firstCell = row.cells.item(0);
                if (firstCell) focusTableCell(firstCell);
                handleEditorChange();
              }
            }

            return;
          }

          if (e.key === "Enter") {
            e.preventDefault();

            const selection = window.getSelection();
            if (!selection || !selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            range.deleteContents();

            const lineBreak = document.createElement("br");
            range.insertNode(lineBreak);
            range.setStartAfter(lineBreak);
            range.collapse(true);

            selection.removeAllRanges();
            selection.addRange(range);
            handleEditorChange();
            return;
          }
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        // Let the browser perform its native undo, then re-sync tokens and emit onChange
        setTimeout(() => {
          handleEditorChange();
        }, 200);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();

        if (!allowUnderline) return;

        const sel = window.getSelection();

        if (sel && sel.rangeCount && sel.isCollapsed) {
          applyInlineStyleToWord("underline");
        } else {
          document.execCommand("underline");
        }
        setTimeout(() => {
          updateFormatStates();
        }, 0);

        handleEditorChange();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();

        if (!allowBold) return;

        const sel = window.getSelection();

        if (sel && sel.rangeCount && sel.isCollapsed) {
          applyInlineStyleToWord("bold");
        } else {
          document.execCommand("bold");
        }
        setTimeout(() => {
          updateFormatStates();
        }, 0);

        handleEditorChange();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();

        if (!allowItalic) return;

        const sel = window.getSelection();
        if (sel && sel.rangeCount && sel.isCollapsed) {
          applyInlineStyleToWord("italic");
        } else {
          document.execCommand("italic");
        }
        setTimeout(() => {
          updateFormatStates();
        }, 0);

        handleEditorChange();
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;

        const range = sel.getRangeAt(0);

        // Find current block-level element
        let currentBlock: HTMLElement | null = null;
        let node: Node = range.startContainer;
        while (node && node !== editorRef.current) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            currentBlock = node as HTMLElement;
            break;
          }
          node = node.parentNode!;
        }

        if (!currentBlock) return;

        const targetSibling =
          e.key === "ArrowDown"
            ? currentBlock.nextElementSibling
            : currentBlock.previousElementSibling;

        if (!targetSibling?.hasAttribute("data-cm-block-id")) return;

        // Is caret on the edge line facing CodeMirror?
        const blockRect = currentBlock.getBoundingClientRect();

        // Build a single-char range to get accurate caret Y in Chrome
        let caretTop: number;
        let caretBottom: number;

        const textNode = range.startContainer;
        if (textNode.nodeType === Node.TEXT_NODE) {
          const charRange = document.createRange();
          const offset = range.startOffset;
          const len = (textNode.textContent || "").length;

          if (offset < len) {
            charRange.setStart(textNode, offset);
            charRange.setEnd(textNode, offset + 1);
          } else if (offset > 0) {
            charRange.setStart(textNode, offset - 1);
            charRange.setEnd(textNode, offset);
          } else {
            // empty text node fallback
            caretTop = blockRect.top;
            caretBottom = blockRect.bottom;
          }

          if (!caretTop) {
            const rects = charRange.getClientRects();
            caretTop = rects[0]?.top ?? blockRect.top;
            caretBottom = rects[0]?.bottom ?? blockRect.bottom;
          }
        } else {
          // <br> or empty block
          caretTop = blockRect.top;
          caretBottom = blockRect.bottom;
        }

        const isOnEdgeLine =
          e.key === "ArrowDown"
            ? caretBottom >= blockRect.bottom - 5
            : caretTop <= blockRect.top + 5;

        if (isOnEdgeLine) {
          e.preventDefault();
          const cmContent =
            targetSibling.querySelector<HTMLElement>(".cm-content");

          cmContent.focus();

          const cmSel = window.getSelection();
          const cmRange = document.createRange();

          const targetLine =
            e.key === "ArrowDown"
              ? cmContent.firstElementChild
              : cmContent.lastElementChild;

          if (targetLine) {
            cmRange.selectNodeContents(targetLine);
            cmRange.collapse(e.key === "ArrowDown");
            cmSel?.removeAllRanges();
            cmSel?.addRange(cmRange);
          }
        }
      }

      // This logic use for handle space for orderedlist/unorderedlist, and heading.
      if (e.key === "Enter") {
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        if (!range.collapsed) return;

        let container = range.startContainer as HTMLElement;

        let liParent: HTMLElement | null = null;
        if (container.nodeType === Node.ELEMENT_NODE) {
          liParent = (container as Element).closest("li");
        } else if (container.nodeType === Node.TEXT_NODE) {
          liParent = (container.parentNode as Element)?.closest("li");
        }

        if (liParent) {
          return;
        }

        const headingParent =
          container.nodeType === Node.ELEMENT_NODE
            ? (container as Element).closest("h1,h2,h3,h4,h5,h6")
            : (container.parentNode as Element)?.closest("h1,h2,h3,h4,h5,h6");

        // We can't split heading word with enter without this function.
        if (headingParent) {
          e.preventDefault();
          const lastChild = headingParent.lastChild;

          const isAtEnd =
            (range.startContainer.nodeType === Node.TEXT_NODE &&
              range.startOffset ===
                (range.startContainer.textContent?.length || 0) &&
              range.startContainer === lastChild) ||
            (range.startContainer === headingParent &&
              range.startOffset === headingParent.childNodes.length);

          if (isAtEnd) {
            const p = document.createElement("p");
            p.innerHTML = "<br>";
            headingParent.insertAdjacentElement("afterend", p);

            const newRange = document.createRange();
            newRange.setStart(p, 0);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
          } else {
            const textNode = range.startContainer;
            const offset = range.startOffset;

            if (textNode.nodeType === Node.TEXT_NODE) {
              const fullText = textNode.textContent || "";
              const before = fullText.slice(0, offset);
              const after = fullText.slice(offset);

              textNode.textContent = before;

              const p = document.createElement("p");
              p.textContent = after || "\u200B";
              headingParent.insertAdjacentElement("afterend", p);

              const newRange = document.createRange();
              newRange.setStart(p.firstChild || p, 0);
              newRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
          }

          handleEditorChange();
          return;
        }

        const isInFormattedText =
          container.nodeType === Node.TEXT_NODE &&
          ["B", "STRONG", "I", "EM"].includes(
            container.parentElement?.tagName ?? ""
          ) &&
          !/^H[1-6]$/.test(container.parentElement?.tagName ?? "");

        if (isInFormattedText) {
          e.preventDefault();

          let currentP: HTMLElement | null = container.parentElement;

          while (currentP && currentP.tagName !== "P") {
            currentP = currentP.parentElement;
          }

          const host = currentP ?? (container.parentElement as HTMLElement);

          const newP = document.createElement("p");
          host.insertAdjacentElement("afterend", newP);

          // Split at the caret: content after it moves into the new paragraph,
          // like the plain text branch, instead of staying behind.
          const afterRange = document.createRange();
          afterRange.setStart(range.startContainer, range.startOffset);
          afterRange.setEnd(host, host.childNodes.length);
          const afterFragment = afterRange.extractContents();

          const tempDiv = document.createElement("div");
          tempDiv.appendChild(afterFragment);
          newP.innerHTML = tempDiv.innerHTML || "<br>";

          if (!host.textContent?.trim() && !host.querySelector("input")) {
            host.innerHTML = "<br>";
          }

          const sel = window.getSelection();
          const newRange = document.createRange();
          newRange.setStart(newP, 0);
          sel.removeAllRanges();
          sel.addRange(newRange);
        } else {
          e.preventDefault();

          const sel = window.getSelection();
          if (!sel || !sel.rangeCount) return;

          const range = sel.getRangeAt(0);

          // Find the current block-level parent (p or root)
          let currentBlock: HTMLElement | null = null;
          let node: Node = range.startContainer;

          while (node && node !== editorRef.current) {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              (node as HTMLElement).tagName === "P"
            ) {
              currentBlock = node as HTMLElement;
              break;
            }
            node = node.parentNode!;
          }

          const newP = document.createElement("p");
          newP.innerHTML = "<br>";

          if (currentBlock) {
            // Split the current <p> at the caret position
            const afterRange = document.createRange();
            afterRange.setStart(range.startContainer, range.startOffset);
            afterRange.setEndAfter(currentBlock.lastChild!);
            const afterFragment = afterRange.extractContents();

            // If the extracted fragment has real content, put it in the new <p>
            const tempDiv = document.createElement("div");
            tempDiv.appendChild(afterFragment);
            const extractedText = tempDiv.textContent || "";
            if (extractedText.trim()) {
              newP.innerHTML = tempDiv.innerHTML;
            }

            // If current block is now empty, ensure it has a <br>
            if (
              !currentBlock.textContent?.trim() &&
              !currentBlock.querySelector("input")
            ) {
              currentBlock.innerHTML = "<br>";
            }

            currentBlock.insertAdjacentElement("afterend", newP);
          } else {
            range.insertNode(newP);
          }

          const newRange = document.createRange();
          newRange.setStart(newP, 0);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }

        setTimeout(() => {
          updateFormatStates();
        }, 0);

        handleEditorChange();
      }

      // this logic is to handle ordered and unordered lists, so when we type "1." or "-",
      // it will automatically convert it to an ordered or unordered list
      if (e.key === " ") {
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        const node = range.startContainer;

        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent ?? "";
          const caretPos = range.startOffset;

          const beforeCaret = text.slice(0, caretPos);
          const afterCaret = text.slice(caretPos);

          if (allowCheckBoxes) {
            const checkedCheckboxMatch = beforeCaret.match(/\[x\]$/);
            const uncheckedCheckboxMatch = beforeCaret.match(/\[ \]$/);

            if (checkedCheckboxMatch || uncheckedCheckboxMatch) {
              e.preventDefault();

              const patternLength = checkedCheckboxMatch
                ? checkedCheckboxMatch[0].length
                : uncheckedCheckboxMatch![0].length;
              const beforePattern = beforeCaret.slice(0, -patternLength);

              const checkboxWrapper = createCheckboxWrapper(
                !!checkedCheckboxMatch,
                turndownService,
                editorRef,
                onChange
              );

              const spaceNode = document.createTextNode("\u00A0");
              checkboxWrapper.after(spaceNode);

              if (beforePattern || afterCaret) {
                const afterText = afterCaret ?? "";

                node.textContent = beforePattern + afterText;

                const newRange = document.createRange();
                newRange.setStart(node, beforePattern.length);
                newRange.collapse(true);

                newRange.insertNode(checkboxWrapper);

                if (!afterText.startsWith(" ")) {
                  const spaceNode = document.createTextNode("\u00A0");
                  checkboxWrapper.after(spaceNode);
                }

                const finalRange = document.createRange();
                if (checkboxWrapper.nextSibling) {
                  finalRange.setStartAfter(checkboxWrapper.nextSibling);
                } else {
                  finalRange.setStartAfter(checkboxWrapper);
                }
                finalRange.collapse(true);

                sel.removeAllRanges();
                sel.addRange(finalRange);
              } else {
                const parent = node.parentNode;
                if (parent) {
                  parent.replaceChild(checkboxWrapper, node);

                  const spaceNode = document.createTextNode("\u00A0");
                  parent.insertBefore(spaceNode, checkboxWrapper.nextSibling);

                  const finalRange = document.createRange();
                  finalRange.setStartAfter(spaceNode);
                  finalRange.collapse(true);

                  sel.removeAllRanges();
                  sel.addRange(finalRange);
                }
              }

              handleEditorChange();
              return;
            }
          }

          const orderedMatch = allowOrderedList
            ? beforeCaret.match(/^(\d+)\.$/)
            : null;
          const unorderedMatch = allowUnorderedList
            ? beforeCaret.match(/^[-*]$/)
            : null;

          if (orderedMatch || unorderedMatch) {
            e.preventDefault();

            const li = document.createElement("li");
            if (afterCaret) {
              li.textContent = afterCaret;
            } else {
              li.appendChild(document.createElement("br"));
            }

            const list = document.createElement(orderedMatch ? "ol" : "ul");
            if (orderedMatch) {
              list.setAttribute("start", orderedMatch[1]);
            }
            list.appendChild(li);

            const parent = node.parentNode;
            if (parent) {
              parent.replaceChild(list, node);

              const prevSibling = list.previousSibling;
              if (prevSibling && prevSibling.nodeType === Node.ELEMENT_NODE) {
                if (
                  (prevSibling as HTMLElement).tagName === "INPUT" &&
                  (prevSibling as HTMLInputElement).type === "checkbox"
                ) {
                  li.insertBefore(prevSibling, li.firstChild);
                  li.insertBefore(
                    document.createTextNode("\u00A0"),
                    prevSibling.nextSibling
                  );
                }
              }
            }

            const newRange = document.createRange();
            if (afterCaret) {
              newRange.setStart(li.firstChild!, afterCaret.length);
            } else {
              newRange.setStart(li, 0);
            }
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
          }
        }
      }

      if (e.key === "`" && mode === "markdown-editor") {
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        const node = range.startContainer;

        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent ?? "";
          const caretPos = range.startOffset;

          const beforeCaret = text.slice(0, caretPos);

          if ((beforeCaret + "`").endsWith("```")) {
            e.preventDefault();

            const parent = node.parentElement;

            if (parent) {
              range.setStart(node, caretPos - 2);
              range.deleteContents();

              insertCodeEditor();
              handleEditorChange();
              return;
            }
          }
        }
      }

      if (e.key === "Backspace") {
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        if (!range.collapsed) return;

        const container = range.startContainer;

        // Delete code mirror block when caret is at start of block right after it
        const currentBlock =
          container.nodeType === Node.TEXT_NODE
            ? (container.parentNode as HTMLElement)?.closest(
                "p, h1, h2, h3, h4, h5, h6, li"
              )
            : (container as HTMLElement)?.closest(
                "p, h1, h2, h3, h4, h5, h6, li"
              );

        if (currentBlock && range.startOffset === 0) {
          const prevSibling = currentBlock.previousElementSibling;
          if (
            prevSibling instanceof HTMLElement &&
            prevSibling.dataset.cmBlockId !== undefined
          ) {
            e.preventDefault();
            prevSibling.remove();
            handleEditorChange();
            return;
          }
        }

        // Fallback: caret is at root editor level directly after code mirror block
        if (container === editorRef.current) {
          const nodeBefore =
            editorRef.current.childNodes[range.startOffset - 1];
          if (
            nodeBefore instanceof HTMLElement &&
            nodeBefore.dataset.cmBlockId !== undefined
          ) {
            e.preventDefault();
            nodeBefore.remove();
            handleEditorChange();
            return;
          }
        }

        let li: HTMLElement | null = null;

        if (container.nodeType === Node.ELEMENT_NODE) {
          li = (container as Element).closest("li");
        } else if (container.nodeType === Node.TEXT_NODE) {
          li = (container.parentNode as HTMLElement)?.closest("li");
        }

        if (
          li &&
          li.innerHTML === "<br>" &&
          li.parentElement &&
          (li.parentElement.tagName === "OL" ||
            li.parentElement.tagName === "UL") &&
          li.parentElement.children.length === 1
        ) {
          e.preventDefault();

          const parentList = li.parentElement;
          const block = document.createElement("p");
          block.innerHTML = "<br>";

          parentList.replaceWith(block);

          const newRange = document.createRange();
          newRange.setStart(block, 0);
          newRange.collapse(true);

          sel.removeAllRanges();
          sel.addRange(newRange);

          handleEditorChange();
          return;
        }

        let heading: HTMLElement | null = null;

        if (container.nodeType === Node.ELEMENT_NODE) {
          heading = (container as Element).closest("h1, h2, h3, h4, h5, h6");
        } else if (container.nodeType === Node.TEXT_NODE) {
          heading = (container.parentNode as HTMLElement)?.closest(
            "h1, h2, h3, h4, h5, h6"
          );
        }

        if (
          heading &&
          range.startOffset === 0 &&
          heading.textContent?.trim() === ""
        ) {
          e.preventDefault();

          const block = document.createElement("p");
          block.innerHTML = "<br>";

          heading.replaceWith(block);

          const newRange = document.createRange();
          newRange.setStart(block, 0);
          newRange.collapse(true);

          sel.removeAllRanges();
          sel.addRange(newRange);

          handleEditorChange();
          return;
        }

        // For request when span delete on editable content syncronize.
        requestAnimationFrame(() => {
          if (!editorRef.current) return;

          const spans = editorRef.current.querySelectorAll(
            'span[style*="font-size"], span[style*="font-weight"]'
          );

          spans.forEach((span) => {
            const style = span.getAttribute("style") || "";
            const hasOnlyFontStyling =
              /^(font-size:\s*[\d.]+em;\s*)?(font-weight:\s*inherit;\s*)?$/.test(
                style.replace(/\s/g, "")
              );

            if (hasOnlyFontStyling && span.textContent) {
              const parent = span.parentNode;
              if (parent) {
                const textNode = document.createTextNode(span.textContent);
                parent.replaceChild(textNode, span);
              }
            }
          });

          editorRef.current.normalize();
        });

        handleEditorChange();
      }
    };

    const handleHeading = (level: 1 | 2 | 3) => {
      if (!editorRef.current) return;

      editorRef.current.focus();

      const sel = window.getSelection();

      if (savedSelection.current) {
        sel?.removeAllRanges();
        sel?.addRange(savedSelection.current);
      }

      if (!sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      let node = range.commonAncestorContainer as HTMLElement;
      let offsetInNode = range.startOffset;

      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement!;
      }

      const headingTag = `h${level}` as keyof HTMLElementTagNameMap;

      let newHeading: HTMLElement;

      if (/^H[1-6]$/.test(node.tagName)) {
        if (node.tagName.toLowerCase() === headingTag) {
          const p = document.createElement("p");
          p.innerHTML = node.innerHTML;
          node.replaceWith(p);
          newHeading = p;
        } else {
          const h = document.createElement(headingTag);
          h.innerHTML = node.innerHTML;
          node.replaceWith(h);
          newHeading = h;
        }
      } else {
        newHeading = document.createElement(headingTag);

        const blockParagraph =
          node instanceof HTMLElement ? node.closest("p") : null;

        // Headings cannot live inside a paragraph. Replace the paragraph
        // with the heading, except for checkbox rows, where the heading goes
        // after the row instead.
        if (blockParagraph?.querySelector('input[type="checkbox"]')) {
          newHeading.innerHTML = "<br>";
          blockParagraph.insertAdjacentElement("afterend", newHeading);

          sel.removeAllRanges();

          const caret = document.createRange();
          caret.selectNodeContents(newHeading);
          caret.collapse(false);
          sel.addRange(caret);
        } else if (blockParagraph) {
          newHeading.innerHTML = blockParagraph.innerHTML || "<br>";
          blockParagraph.replaceWith(newHeading);
        } else {
          newHeading.innerHTML = "<br>";
          range.insertNode(newHeading);
        }
      }

      const textNode = newHeading.firstChild;
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        const pos = Math.min(offsetInNode, textNode.textContent!.length);
        const newRange = document.createRange();
        newRange.setStart(textNode, pos);
        newRange.collapse(true);

        sel.removeAllRanges();
        sel.addRange(newRange);
      } else {
        const newRange = document.createRange();
        newRange.selectNodeContents(newHeading);
        newRange.collapse(false);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }

      let nextSibling = newHeading.nextSibling;
      if (
        nextSibling &&
        nextSibling.nodeType === Node.TEXT_NODE &&
        !nextSibling.textContent?.trim()
      ) {
        nextSibling = nextSibling.nextSibling;
      }
      if (nextSibling && nextSibling.nodeName === "BR") {
        nextSibling.remove();
      }

      savedSelection.current = null;

      handleEditorChange();
    };

    const TIP_MENU_RICH_EDITOR: TipMenuItemProps[] = [
      {
        caption: "Heading 1",
        icon: {
          image: RiH1,
        },
        onClick: async () => {
          await editorRef.current?.focus();
          await handleHeading(1);
        },
      },
      {
        caption: "Heading 2",
        icon: {
          image: RiH2,
        },
        onClick: async () => {
          await editorRef.current?.focus();
          await handleHeading(2);
        },
      },
      {
        caption: "Heading 3",
        icon: {
          image: RiH3,
        },
        onClick: async () => {
          await editorRef.current?.focus();
          await handleHeading(3);
        },
      },
    ];

    const portals = useTokenPortals(editorRef, tokenRenderers);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          isOpen
        ) {
          setIsOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          tableMenuRef.current &&
          !tableMenuRef.current.contains(event.target as Node) &&
          isTableMenuOpen
        ) {
          setIsTableMenuOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isTableMenuOpen]);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          cellColorMenuRef.current &&
          !cellColorMenuRef.current.contains(event.target as Node) &&
          isCellColorMenuOpen
        ) {
          setIsCellColorMenuOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isCellColorMenuOpen]);

    const codeEditorId = useMemo(() => CodeEditor.nextBlockId(), []);

    if (mode === "code-editor") {
      return (
        <CodeEditor
          id={codeId ? codeId : codeEditorId}
          styles={{
            self: css`
              padding: 0px;
            `,
            contentStyle: css`
              min-height: 160px;
              ${toolbarPosition === "top"
                ? css`
                    margin-top: 37px;
                  `
                : css`
                    margin-bottom: 37px;
                  `};
              ${styles?.codeEditorStyle}
            `,
          }}
          className={codeClassName}
          toolbarPosition={toolbarPosition}
          actions={codeEditorActions}
          value={value}
          language={CodeLanguageEquivalent[language]}
          options={OPTIONS_LANGUAGES}
          onChange={(code) => onChange(code)}
        />
      );
    }

    return (
      <>
        <BaseRichEditor
          actions={actions}
          value={value}
          mode={mode}
          id={id}
          className={applyClassName("rich-editor", className)}
          styles={{
            ...styles,
            toolbarStyle: css`
              padding-left: 8px;
              padding-right: 8px;
              z-index: 10;
              ${styles?.toolbarStyle}
            `,
          }}
          leftSidePanel={
            mode !== "view-only" && (
              <>
                {allowBold && (
                  <RichEditorToolbarButton
                    ariaLabel="rich-editor-toolbar-bold"
                    isActive={formatStates.bold}
                    icon={{ image: RiBold }}
                    onClick={() => handleCommand("bold")}
                  />
                )}

                {allowItalic && (
                  <RichEditorToolbarButton
                    ariaLabel="rich-editor-toolbar-italic"
                    isActive={formatStates.italic}
                    icon={{ image: RiItalic }}
                    onClick={() => handleCommand("italic")}
                  />
                )}

                {allowUnderline && (
                  <RichEditorToolbarButton
                    ariaLabel="rich-editor-toolbar-underline"
                    isActive={formatStates.underline}
                    icon={{ image: RiUnderline }}
                    onClick={() => handleCommand("underline")}
                  />
                )}

                {allowOrderedList && (
                  <RichEditorToolbarButton
                    ariaLabel="rich-editor-toolbar-ordered-list"
                    icon={{ image: RiListOrdered }}
                    onClick={() => handleCommand("insertOrderedList")}
                  />
                )}

                {allowUnorderedList && (
                  <RichEditorToolbarButton
                    ariaLabel="rich-editor-toolbar-unordered-list"
                    icon={{ image: RiListUnordered }}
                    onClick={() => handleCommand("insertUnorderedList")}
                  />
                )}

                {allowTable && (
                  <MenuAnchor ref={tableMenuRef}>
                    <RichEditorToolbarButton
                      ariaLabel="rich-editor-toolbar-table"
                      icon={{ image: RiTableLine }}
                      isOpen={isTableMenuOpen}
                      onClick={() => {
                        const sel = window.getSelection();
                        if (sel && sel.rangeCount > 0) {
                          savedSelection.current = sel
                            .getRangeAt(0)
                            .cloneRange();
                        }
                        setIsOpen(false);
                        setTableGridSize({ rows: 0, columns: 0 });
                        setVisibleTableRows(TABLE_GRID_INITIAL_ROWS);
                        setIsTableMenuOpen(!isTableMenuOpen);
                      }}
                    />

                    {isTableMenuOpen && (
                      <MenuWrapper $toolbarPosition={toolbarPosition}>
                        <TableGridMenu
                          $theme={richEditorTheme}
                          aria-label="rich-editor-table-grid"
                          onMouseLeave={() => {
                            setTableGridSize({ rows: 0, columns: 0 });
                            setVisibleTableRows(TABLE_GRID_INITIAL_ROWS);
                          }}
                        >
                          <TableGrid>
                            {Array.from({ length: visibleTableRows }).map(
                              (_, row) => (
                                <TableGridRow key={row}>
                                  {Array.from({
                                    length: TABLE_GRID_COLUMNS,
                                  }).map((_, column) => {
                                    const active =
                                      row < tableGridSize.rows &&
                                      column < tableGridSize.columns;

                                    return (
                                      <TableGridCell
                                        key={column}
                                        type="button"
                                        $theme={richEditorTheme}
                                        $active={active}
                                        aria-label={`Insert ${row + 1} by ${
                                          column + 1
                                        } table`}
                                        onMouseDown={(event) =>
                                          event.preventDefault()
                                        }
                                        onMouseEnter={() => {
                                          setTableGridSize({
                                            rows: row + 1,
                                            columns: column + 1,
                                          });

                                          if (
                                            row === visibleTableRows - 1 &&
                                            visibleTableRows <
                                              TABLE_GRID_MAX_ROWS
                                          ) {
                                            setVisibleTableRows((current) =>
                                              Math.min(
                                                current + 2,
                                                TABLE_GRID_MAX_ROWS
                                              )
                                            );
                                          }
                                        }}
                                        onClick={() =>
                                          insertTable(row + 1, column + 1)
                                        }
                                      />
                                    );
                                  })}
                                </TableGridRow>
                              )
                            )}
                          </TableGrid>
                          <TableGridLabel $theme={richEditorTheme}>
                            {tableGridSize.rows > 0
                              ? `${tableGridSize.rows} × ${tableGridSize.columns}`
                              : "Insert table"}
                          </TableGridLabel>
                        </TableGridMenu>
                      </MenuWrapper>
                    )}
                  </MenuAnchor>
                )}

                {allowTable && (isInTableCell || isCellColorMenuOpen) && (
                  <MenuAnchor ref={cellColorMenuRef}>
                    <RichEditorToolbarButton
                      ariaLabel="rich-editor-toolbar-cell-color"
                      icon={{ image: RiPaintFill }}
                      isOpen={isCellColorMenuOpen}
                      onClick={() => {
                        const sel = window.getSelection();
                        if (sel && sel.rangeCount > 0) {
                          savedSelection.current = sel
                            .getRangeAt(0)
                            .cloneRange();
                        }

                        const cell = activeTableCellRef.current;
                        setCustomCellColor(
                          normalizeHexColor(
                            cell?.style.backgroundColor ?? ""
                          ) ?? "#ffffff"
                        );
                        setCustomTableColors(
                          tableCustomColors(
                            cell?.closest("table") as HTMLTableElement | null
                          )
                        );
                        setIsOpen(false);
                        setIsTableMenuOpen(false);
                        setIsCellColorMenuOpen(!isCellColorMenuOpen);
                      }}
                    />

                    {isCellColorMenuOpen && (
                      <MenuWrapper
                        $alignRight
                        $toolbarPosition={toolbarPosition}
                      >
                        <CellColorMenu
                          $theme={richEditorTheme}
                          aria-label="rich-editor-cell-color-palette"
                        >
                          <CellColorGrid>
                            {TABLE_CELL_COLORS.map((color) => (
                              <CellColorSwatch
                                key={color}
                                type="button"
                                $theme={richEditorTheme}
                                $color={color}
                                aria-label={`Set cell background color ${color}`}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => applyCellBackground(color)}
                              />
                            ))}
                          </CellColorGrid>

                          <CellColorCustom $theme={richEditorTheme}>
                            <span>Custom</span>
                            <input
                              type="color"
                              aria-label="Custom cell background color"
                              value={customCellColor}
                              onChange={(event) => {
                                setCustomCellColor(event.target.value);
                                applyCellBackground(event.target.value);
                              }}
                            />
                          </CellColorCustom>

                          {customTableColors.length > 0 && (
                            <CellColorGrid aria-label="Custom colors used in this table">
                              {customTableColors.map((color) => (
                                <CellColorSwatch
                                  key={color}
                                  type="button"
                                  $theme={richEditorTheme}
                                  $color={color}
                                  aria-label={`Set cell background color ${color}`}
                                  onMouseDown={(event) =>
                                    event.preventDefault()
                                  }
                                  onClick={() => applyCellBackground(color)}
                                />
                              ))}
                            </CellColorGrid>
                          )}
                        </CellColorMenu>
                      </MenuWrapper>
                    )}
                  </MenuAnchor>
                )}

                {allowCheckBoxes && (
                  <RichEditorToolbarButton
                    ariaLabel="rich-editor-toolbar-checkbox"
                    icon={{ image: RiCheckboxLine }}
                    onClick={() => handleCommand("checkbox")}
                  />
                )}

                {mode === "markdown-editor" && (
                  <RichEditorToolbarButton
                    ariaLabel="rich-editor-toolbar-code-block"
                    icon={{ image: RiCodeSSlashLine }}
                    onClick={() => handleCommand("codeBlock")}
                  />
                )}

                {allowHeading && (
                  <MenuAnchor>
                    <RichEditorToolbarButton
                      ariaLabel="rich-editor-toolbar-heading-menu"
                      icon={{ image: RiHeading }}
                      isOpen={isOpen}
                      onClick={() => {
                        const sel = window.getSelection();
                        if (sel && sel.rangeCount > 0) {
                          savedSelection.current = sel
                            .getRangeAt(0)
                            .cloneRange();
                        }
                        setIsTableMenuOpen(false);
                        setIsOpen(!isOpen);
                      }}
                    />

                    {isOpen && (
                      <MenuWrapper
                        ref={menuRef}
                        $toolbarPosition={toolbarPosition}
                      >
                        <TipMenu
                          setIsOpen={() => setIsOpen(false)}
                          subMenuList={TIP_MENU_RICH_EDITOR}
                        />
                      </MenuWrapper>
                    )}
                  </MenuAnchor>
                )}
              </>
            )
          }
          rightSidePanel={toolbarRightPanel}
          toolbarPosition={toolbarPosition}
          theme={richEditorTheme}
        >
          <EditorArea
            ref={editorRef}
            role="textbox"
            $theme={richEditorTheme}
            aria-label="rich-editor-content"
            contentEditable
            $editorStyle={styles?.editorStyle}
            $toolbarPosition={toolbarPosition}
            $mode={mode}
            $height={height}
            $autogrow={autogrow}
            onPaste={(e) => {
              if (mode === "view-only") return;

              e.preventDefault();

              const html = e.clipboardData.getData("text/html");
              const plain = e.clipboardData.getData("text/plain");

              const hasCodeColors = /color\s*:|background(-color)?\s*:/i.test(
                html
              );

              if (!html || hasCodeColors) {
                document.execCommand("insertText", false, plain);
              } else {
                document.execCommand("insertHTML", false, html);
              }

              if (editorRef.current) {
                applyDefaultTableStyles(editorRef.current);
              }

              handleEditorChange();
            }}
            onInput={() => {
              if (mode !== "view-only") {
                if (editorRef.current) {
                  syncCheckboxStates(editorRef.current);
                }

                const html =
                  editorRef.current?.innerHTML.replace(/\u00A0/g, "") || "";
                const cleanedHTML = cleanupHtml(html);

                const markdown = turndownService.turndown(cleanedHTML);
                const cleanedMarkdown = cleanSpacing(markdown);
                if (onChange) {
                  onChange(cleanedMarkdown);
                }

                CodeEditor.serializeAndEmit(
                  editorRef,
                  turndownService,
                  onChange
                );
              }
            }}
            onKeyDown={handleOnKeyDown}
          />
        </BaseRichEditor>

        {portals}
      </>
    );
  }
) as RichEditorComponent;

interface BaseRichEditorProps {
  toolbarPosition?: RichEditorProps["toolbarPosition"];
  theme?: RichEditorThemeConfig;
  actions?: RichEditorAction[];
  leftSidePanel?: ReactNode;
  rightSidePanel?: ReactNode;
  styles?: BaseRichEditorStyles;
  children?: ReactNode;
  mode?: RichEditorProps["mode"];
  value?: string;
  id?: string;
  className?: string;
}

interface BaseRichEditorStyles {
  toolbarStyle?: CSSProp;
  actionStyle?: CSSProp;
  containerStyle?: CSSProp;
  leftSideStyle?: CSSProp;
  rightSideStyle?: CSSProp;
}

function BaseRichEditor({
  toolbarPosition,
  theme: richEditorTheme,
  actions,
  leftSidePanel,
  rightSidePanel,
  styles,
  children,
  mode,
  value,
  className,
  id,
}: BaseRichEditorProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarHeight, setToolbarHeight] = useState(37);

  useLayoutEffect(() => {
    const toolbar = toolbarRef.current;

    if (!toolbar) {
      return;
    }

    const updateToolbarHeight = () => {
      setToolbarHeight(toolbar.getBoundingClientRect().height);
    };

    updateToolbarHeight();

    const observer = new ResizeObserver(updateToolbarHeight);
    observer.observe(toolbar);

    return () => observer.disconnect();
  }, []);

  return (
    <Wrapper
      id={id}
      $theme={richEditorTheme}
      className={className}
      aria-label="rich-editor-wrapper"
      $containerStyle={styles?.containerStyle}
      $mode={mode}
      style={
        {
          "--rich-editor-toolbar-height": `${toolbarHeight}px`,
        } as React.CSSProperties
      }
    >
      {(leftSidePanel || rightSidePanel) && (
        <ToolbarWrapper
          ref={toolbarRef}
          aria-label="toolbar-content"
          $toolbarPosition={toolbarPosition}
          $mode={mode}
        >
          <Toolbar
            $mode={mode}
            $theme={richEditorTheme}
            $toolbarPosition={toolbarPosition}
            $style={styles?.toolbarStyle}
          >
            <ToolbarLeftPanel $style={styles?.leftSideStyle}>
              {leftSidePanel}

              {actions &&
                actions?.map((action, index) => (
                  <RichEditorToolbarButton
                    key={index}
                    {...action}
                    content={value}
                    styles={{
                      self: css`
                        ${styles?.actionStyle}

                        ${action?.styles?.self}
                      `,
                    }}
                  />
                ))}
            </ToolbarLeftPanel>
            {rightSidePanel && (
              <ToolbarRightPanel $style={styles?.rightSideStyle}>
                {rightSidePanel}
              </ToolbarRightPanel>
            )}
          </Toolbar>
        </ToolbarWrapper>
      )}

      {children}
    </Wrapper>
  );
}

function RichEditorToolbarButton({
  icon,
  onClick,
  children,
  styles,
  isOpen,
  isActive,
  ariaLabel,
  content,
}: RichEditorToolbarButtonProps & { content?: string }) {
  const { currentTheme } = useTheme();
  const richEditorTheme = currentTheme?.richEditor;

  return (
    <ToolbarButton
      $theme={richEditorTheme}
      $style={styles?.self}
      type="button"
      $isOpen={isOpen}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.({ content });
      }}
      $isActive={isActive}
      aria-label={ariaLabel ?? "rich-editor-toolbar-button"}
      aria-pressed={isActive}
    >
      {icon && <Figure {...icon} />}
      {children}
    </ToolbarButton>
  );
}

const Wrapper = styled.div<{
  $containerStyle?: CSSProp;
  $mode?: RichEditorMode;
  $theme: RichEditorThemeConfig;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  ${({ $mode, $theme }) =>
    $mode !== "page-editor" &&
    css`
      border: 1px solid ${$theme.borderColor};
      box-shadow: 0 1px 4px -3px #5b5b5b;
      border-radius: 4px;
      overflow: hidden;
    `};

  width: 100%;

  position: relative;

  ${({ $containerStyle }) => $containerStyle}
`;

const ToolbarWrapper = styled.div<{
  $toolbarPosition?: RichEditorToolbarPosition;
  $mode?: RichEditorMode;
}>`
  position: ${({ $mode }) => ($mode === "page-editor" ? "fixed" : "absolute")};
  width: 100%;

  ${({ $toolbarPosition }) =>
    $toolbarPosition === "top"
      ? css`
          top: 0;
        `
      : css`
          bottom: 0;
        `}
`;

const Toolbar = styled.div<{
  $toolbarPosition?: RichEditorToolbarPosition;
  $theme: RichEditorThemeConfig;
  $style: CSSProp;
  $mode: RichEditorMode;
}>`
  display: flex;
  flex-direction: row;
  width: 100%;
  position: relative;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ $theme }) => $theme.toolbarBackground};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  ${({ $toolbarPosition, $theme, $mode }) =>
    $toolbarPosition === "top"
      ? css`
          ${$mode !== "page-editor" &&
          css`
            border-top-right-radius: 4px;
            border-top-left-radius: 4px;
          `}
          border-bottom: 1px solid ${$theme.borderColor};
        `
      : css`
          ${$mode !== "page-editor" &&
          css`
            border-bottom-right-radius: 4px;
            border-bottom-left-radius: 4px;
          `}
          border-top: 1px solid ${$theme.borderColor};
        `}

  ${({ $style }) => $style}
`;

const ToolbarLeftPanel = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;

  ${({ $style }) => $style}
`;

const ToolbarRightPanel = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  ${({ $style }) => $style}
`;

const MenuAnchor = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const MenuWrapper = styled.div<{
  $alignRight?: boolean;
  $toolbarPosition?: RichEditorToolbarPosition;
}>`
  position: absolute;
  ${({ $toolbarPosition }) =>
    $toolbarPosition === "top"
      ? css`
          top: 100%;
          transform: translateY(4px);
        `
      : css`
          bottom: 100%;
          transform: translateY(-4px);
        `}
  left: ${({ $alignRight }) => ($alignRight ? "auto" : "0")};
  right: ${({ $alignRight }) => ($alignRight ? "0" : "auto")};
  min-width: max-content;
  z-index: 40;
`;

const TableGridMenu = styled.div<{ $theme: RichEditorThemeConfig }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 1px solid ${({ $theme }) => $theme.borderColor || "#d4d4d8"};
  border-radius: 6px;
  background-color: ${({ $theme }) => $theme.backgroundColor || "#ffffff"};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
`;

const TableGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const TableGridRow = styled.div`
  display: flex;
  gap: 3px;
`;

const TableGridCell = styled.button<{
  $active: boolean;
  $theme: RichEditorThemeConfig;
}>`
  flex: 0 0 ${TABLE_GRID_CELL_SIZE}px;
  width: ${TABLE_GRID_CELL_SIZE}px;
  height: ${TABLE_GRID_CELL_SIZE}px;
  min-width: ${TABLE_GRID_CELL_SIZE}px;
  min-height: ${TABLE_GRID_CELL_SIZE}px;
  padding: 0;
  border: 1px solid ${({ $theme }) => $theme.borderColor || "#d4d4d8"};
  border-radius: 2px;
  background-color: ${({ $active, $theme }) =>
    $active ? $theme.toolbarButtonActive || "#dbeafe" : "transparent"};
  cursor: pointer;

  &:hover {
    background-color: ${({ $theme }) => $theme.toolbarButtonHover || "#eff6ff"};
  }
`;

const TableGridLabel = styled.span<{ $theme: RichEditorThemeConfig }>`
  font-size: 12px;
  color: ${({ $theme }) =>
    $theme.mutedTextColor || $theme.textColor || "#71717a"};
  white-space: nowrap;
`;

const CellColorMenu = styled.div<{ $theme: RichEditorThemeConfig }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid ${({ $theme }) => $theme.borderColor || "#d4d4d8"};
  border-radius: 6px;
  background-color: ${({ $theme }) => $theme.backgroundColor || "#ffffff"};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
`;

const CellColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 18px);
  gap: 6px;
`;

const CellColorSwatch = styled.button<{
  $color: string;
  $theme: RichEditorThemeConfig;
}>`
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  padding: 0;
  border: 1px solid ${({ $theme }) => $theme.borderColor || "#d4d4d8"};
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  cursor: pointer;

  &:hover {
    transform: scale(1.12);
  }

  &:focus-visible {
    outline: 2px solid
      ${({ $theme }) => $theme.toolbarButtonFocused || "#93c5fd"};
    outline-offset: 1px;
  }
`;

const CellColorCustom = styled.div<{ $theme: RichEditorThemeConfig }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  color: ${({ $theme }) =>
    $theme.mutedTextColor || $theme.textColor || "#71717a"};

  input[type="color"] {
    appearance: none;
    -webkit-appearance: none;
    flex: 0 0 18px;
    width: 18px;
    height: 18px;
    min-width: 18px;
    min-height: 18px !important;
    padding: 0;
    border: 1px solid ${({ $theme }) => $theme.borderColor || "#d4d4d8"};
    border-radius: 50%;
    background: transparent;
    cursor: pointer;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: 0;
      border-radius: 50%;
    }

    &::-moz-color-swatch {
      border: 0;
      border-radius: 50%;
    }
  }
`;

const EditorArea = styled.div<{
  $toolbarPosition?: RichEditorToolbarPosition;
  $editorStyle?: CSSProp;
  $mode?: RichEditorMode;
  $autogrow?: boolean;
  $height?: number;
  $theme: RichEditorThemeConfig;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }
  padding: 8px;
  outline: none;
  background-color: ${({ $theme }) => $theme.backgroundColor};

  ${({ $mode, $autogrow, $height }) =>
    $mode === "page-editor"
      ? css`
          min-height: 100dvh;
          max-height: 100dvh;
          overflow: auto;
        `
      : $autogrow
        ? css`
            min-height: ${`${$height}px`};
            overflow: hidden;
          `
        : css`
            min-height: ${`${$height}px`};
            max-height: ${`${$height}px`};
            overflow-y: auto;
          `}

  ${({ $toolbarPosition, $mode }) =>
    $mode === "page-editor"
      ? $toolbarPosition === "top"
        ? css`
            padding-top: 45px;
          `
        : css`
            padding-bottom: 45px;
          `
      : $mode !== "view-only"
        ? $toolbarPosition === "top"
          ? css`
              margin-top: var(--rich-editor-toolbar-height, 37px);
            `
          : css`
              margin-bottom: var(--rich-editor-toolbar-height, 37px);
            `
        : ""};

  pre[data-cm-hydrated]:not([data-cm-block-id]),
  pre[data-cm-hydrated]:not([data-cm-block-id]) code {
    padding-bottom: 0.5rem;
  }

  ${({ $mode }) =>
    $mode === "view-only" &&
    css`
      padding: 12px;
      user-select: text;
      caret-color: transparent;
      outline: none;
    `};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ $theme }) => $theme?.scrollThumb || "#3f3f46"};
    border-radius: 999px;
  }

  ol {
    list-style-type: decimal !important;
    list-style-position: outside !important;
    padding-left: 2.6rem !important;
    margin: 0 !important;
  }

  ul:not(#combo-list) {
    list-style-type: disc !important;
    list-style-position: outside !important;
    padding-left: 2.6rem !important;
    margin: 0 !important;
  }

  li:not(#combo-list li) {
    display: list-item !important;
    padding: 0 !important;
  }

  li p {
    padding: 0.25rem 0;
  }

  h1 {
    font-size: 2em;
    margin: 0.25em 0;
  }

  h2 {
    font-size: 1.65em;
    margin: 0.3em 0;
  }

  h3:not(#combo-list h3) {
    font-size: 1.3em;
    margin: 0.4em 0;
  }

  p:not(li p) {
    min-height: 24px;
    padding-bottom: 0.5rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.5rem 0;
    table-layout: fixed;
  }

  th,
  td {
    min-width: 2rem;
    padding: 6px 8px;
    border: 1px solid #d1d5db;
    vertical-align: top;
    text-align: left;
  }

  th {
    font-weight: 600;
    background-color: #e2e2e2;
  }

  th:focus,
  td:focus {
    outline: 2px solid
      ${({ $theme }) => $theme.toolbarButtonFocused || "#93c5fd"};
    outline-offset: -2px;
  }

  ${({ $editorStyle }) => $editorStyle};
`;

const ToolbarButton = styled.button<{
  $style?: CSSProp;
  $isOpen?: boolean;
  $isActive?: boolean;
  $theme: RichEditorThemeConfig;
}>`
  padding: 4px 8px;
  margin: 6px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  background: transparent;
  border-color: transparent;
  border-radius: 2px;
  max-height: 28px;
  background-color: ${({ $theme }) => $theme.toolbarBackground};
  color: ${({ $theme }) => $theme.textColor};

  &:hover {
    ${({ $isOpen, $theme }) =>
      !$isOpen &&
      css`
        background-color: ${$theme.toolbarButtonHover};
      `}
  }

  ${({ $isOpen, $theme }) =>
    $isOpen &&
    css`
      background-color: ${$theme.toolbarButtonHover};
      box-shadow:
        inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
        inset 0 -0.5px 0.5px ${$theme.toolbarButtonHover};
    `}

  ${({ $isActive, $theme }) =>
    $isActive &&
    css`
      background-color: ${$theme.toolbarButtonActive};

      box-shadow:
        inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
        inset 0 -0.5px 0.5px ${$theme.toolbarButtonActive};
    `}

  &:active {
    background-color: ${({ $theme }) => $theme.toolbarButtonActive};
    box-shadow:
      inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
      inset 0 -0.5px 0.5px ${({ $theme }) => $theme.toolbarButtonActive};
  }
  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px ${({ $theme }) => $theme.toolbarButtonFocused};
    transition: box-shadow 0.2s ease;
  }
  ${({ $style }) => $style}
`;

function createCheckboxWrapper(
  isChecked: boolean,
  turndownService: TurndownService,
  editorRef: React.RefObject<HTMLDivElement>,
  onChange?: (value: string) => void,
  isViewOnly?: boolean
) {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = isChecked;
  input.className = "coneto-checkbox-wrapper";
  input.contentEditable = "false";
  input.style.cursor = isViewOnly ? "default" : "pointer";
  input.dataset.checked = String(isChecked);

  if (isViewOnly) {
    input.style.pointerEvents = "none";
  } else {
    input.addEventListener("change", () => {
      input.dataset.checked = String(input.checked);

      const html = editorRef.current?.innerHTML.replace(/\u00A0/g, "") || "";
      const markdown = turndownService.turndown(html);
      const cleanedMarkdown = cleanSpacing(markdown);

      if (onChange) {
        onChange(cleanedMarkdown);
      }
    });
  }

  return input;
}

// Cleans up spacing in markdown text by:
// - Replacing non-breaking spaces (&nbsp;) with normal spaces
// - Preserving spacing for list markers (*, [ ], numbers.)
// - Collapsing multiple spaces into a single space elsewhere
const addHtmlTableRule = (service: TurndownService) => {
  service.addRule("htmlTable", {
    filter: "table",
    replacement: (_content, node) =>
      `\n\n${(node as HTMLElement).outerHTML}\n\n`,
  });
};

const setDefaultStyle = (
  element: HTMLElement,
  property: string,
  value: string
): boolean => {
  if (element.style.getPropertyValue(property).trim() === "") {
    element.style.setProperty(property, value);
    return true;
  }

  return false;
};

// Tables carry their presentation inline so Webder renders the same table the
// editor shows. Existing values are preserved so users can override them.
const applyDefaultTableStyles = (root: HTMLElement): boolean => {
  const tables = Array.from(root.querySelectorAll<HTMLTableElement>("table"));
  if (root instanceof HTMLTableElement) tables.unshift(root);

  let changed = false;

  tables.forEach((table) => {
    changed = setDefaultStyle(table, "width", "100%") || changed;
    changed = setDefaultStyle(table, "border-collapse", "collapse") || changed;
    changed = setDefaultStyle(table, "margin", "0.5rem 0") || changed;
    changed = setDefaultStyle(table, "table-layout", "fixed") || changed;
    changed = setDefaultStyle(table, "font-size", "1rem") || changed;

    table.querySelectorAll<HTMLTableCellElement>("th, td").forEach((cell) => {
      changed = setDefaultStyle(cell, "min-width", "2rem") || changed;
      changed = setDefaultStyle(cell, "padding", "6px 8px") || changed;
      changed = setDefaultStyle(cell, "border", "1px solid #d1d5db") || changed;
      changed = setDefaultStyle(cell, "vertical-align", "top") || changed;
      changed = setDefaultStyle(cell, "text-align", "left") || changed;

      if (cell.tagName === "TH") {
        changed = setDefaultStyle(cell, "font-size", "1rem") || changed;
        changed = setDefaultStyle(cell, "font-weight", "600") || changed;
        changed = setDefaultStyle(cell, "letter-spacing", "normal") || changed;
        changed = setDefaultStyle(cell, "text-transform", "none") || changed;
        changed =
          setDefaultStyle(cell, "background-color", "#e2e2e2") || changed;
      }
    });
  });

  return changed;
};

const cleanSpacing = (text: string): string => {
  return text
    .replace(/\u200B/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\[(x| )\]\s+/gi, "[$1] ")
    .split("\n")
    .map((line) => {
      return line;
    })
    .join("\n");
};

function syncCheckboxStates(container: HTMLElement) {
  const checkboxes = container.querySelectorAll(
    'input[type="checkbox"].custom-checkbox-wrapper'
  );
  checkboxes.forEach((checkbox) => {
    const input = checkbox as HTMLInputElement;
    input.dataset.checked = String(input.checked);
  });
}

// Clean up HTML so that <div> elements don't cause extra spacing in <ul> or <ol>.
// This ensures ordered and unordered lists are not wrapped with <div> or <p>,
// since semantically <ul>/<ol> should not be wrapped by those tags.
// Remove unnecessary <span> with font-size when deleting from a heading line to a paragraph
const cleanupHtml = (html: string): string => {
  const container = document.createElement("div");
  container.innerHTML = html;

  // Token spans must never serialize as blank, or turndown's blank rule
  // drops them before their own rule can match.
  container
    .querySelectorAll<HTMLElement>(
      "[data-token-start] > span[contenteditable='false']"
    )
    .forEach((inner) => {
      if (!inner.firstChild) {
        inner.appendChild(document.createTextNode("\u200B"));
      }
    });

  Array.from(container.querySelectorAll("div")).forEach((div) => {
    if (div.closest("[data-token-start]")) return;

    if (div.querySelector("ul, ol")) {
      const frag = document.createDocumentFragment();
      while (div.firstChild) {
        frag.appendChild(div.firstChild);
      }
      div.parentNode?.replaceChild(frag, div);
    } else {
      const p = document.createElement("p");
      p.innerHTML = div.innerHTML || "<br>";
      div.parentNode?.replaceChild(p, div);
    }
  });

  Array.from(container.querySelectorAll("p")).forEach((p) => {
    if (p.querySelector("ul, ol")) {
      const frag = document.createDocumentFragment();
      while (p.firstChild) {
        frag.appendChild(p.firstChild);
      }
      p.parentNode?.replaceChild(frag, p);
    }
  });

  Array.from(container.querySelectorAll("p")).forEach((p) => {
    if (
      p.querySelector(
        "ul, ol, h1, h2, h3, h4, h5, h6, b, i, u, em, input, strong, [data-token-start]"
      )
    )
      return;

    const frag = document.createDocumentFragment();
    let buffer = "";

    const walker = document.createTreeWalker(p, NodeFilter.SHOW_ALL);
    while (walker.nextNode()) {
      const node = walker.currentNode;

      if (node.nodeType === Node.TEXT_NODE) {
        buffer += node.textContent || "";
      } else if (node.nodeName.toLowerCase() === "br") {
        if (buffer.trim()) {
          const newP = document.createElement("p");
          newP.innerHTML = buffer.trim();
          frag.appendChild(newP);
          buffer = "";
        } else {
          frag.appendChild(document.createElement("br"));
        }
      }
    }

    if (buffer.trim()) {
      const newP = document.createElement("p");
      newP.innerHTML = buffer.trim();
      frag.appendChild(newP);
    }

    p.parentNode?.replaceChild(frag, p);
  });

  Array.from(container.querySelectorAll("span")).forEach((span) => {
    if (span.hasAttribute("data-token-start")) return;
    if (span.closest("[data-token-start]")) return;

    const style = span.getAttribute("style") || "";

    const hasOnlyFontStyling =
      /^(font-size:\s*[\d.]+em;\s*)?(font-weight:\s*inherit;\s*)?$/.test(
        style.replace(/\s/g, "")
      );

    const shouldRemove = hasOnlyFontStyling || !style || style.trim() === "";

    if (shouldRemove) {
      const parent = span.parentNode;
      if (parent) {
        if (span.textContent) {
          const textNode = document.createTextNode(span.textContent);
          parent.replaceChild(textNode, span);
        } else {
          parent.removeChild(span);
        }
      }
    }
  });

  container.normalize();

  return container.innerHTML;
};

// To apply instyle to word bold, italic or underline
const applyInlineStyleToWord = (style: "bold" | "italic" | "underline") => {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  const node = range.startContainer;

  if (node.nodeType !== Node.TEXT_NODE) {
    document.execCommand(style);
    return;
  }

  const text = node.textContent || "";
  let start = range.startOffset;
  let end = range.startOffset;

  while (start > 0 && /\S/.test(text[start - 1])) start--;

  while (end < text.length && /\S/.test(text[end])) end++;

  if (start === end) {
    document.execCommand(style);
    return;
  }

  const relativeOffset = range.startOffset - start;

  const wordRange = document.createRange();
  wordRange.setStart(node, start);
  wordRange.setEnd(node, end);

  sel.removeAllRanges();
  sel.addRange(wordRange);

  document.execCommand(style);

  const newNode = sel.anchorNode;
  if (newNode) {
    let textNode: Node | null = null;

    if (newNode.nodeType === Node.TEXT_NODE) {
      textNode = newNode;
    } else if (newNode.nodeType === Node.ELEMENT_NODE && newNode.firstChild) {
      textNode = newNode.firstChild;
    }

    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      const pos = Math.min(relativeOffset, textNode.textContent!.length);
      const newRange = document.createRange();
      newRange.setStart(textNode, pos);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  }
};

const splitBrIntoParagraphs = (html: string): string => {
  const container = document.createElement("div");
  container.innerHTML = html;

  // Convert bare root-level <br> to <p><br></p>
  Array.from(container.childNodes).forEach((node) => {
    if (node.nodeName === "BR") {
      const p = document.createElement("p");
      p.innerHTML = "<br>";
      container.replaceChild(p, node);
    }
  });

  // Insert <p><br></p> between a list and the next sibling when they are
  // directly adjacent with no paragraph separator
  Array.from(container.childNodes).forEach((node) => {
    if (node.nodeName === "UL" || node.nodeName === "OL") {
      const next = (node as Element).nextElementSibling;
      if (
        next &&
        next.nodeName !== "P" &&
        next.nodeName !== "UL" &&
        next.nodeName !== "OL"
      ) {
        const p = document.createElement("p");
        p.innerHTML = "<br>";
        container.insertBefore(p, next);
      }
    }
  });

  container.querySelectorAll("p").forEach((p) => {
    if (p.querySelector("[data-token-start]")) return;

    // Skip empty paragraphs — already correct, don't re-split them
    const isEmptyParagraph =
      p.childNodes.length === 0 ||
      (p.childNodes.length === 1 && p.firstChild?.nodeName === "BR");
    if (isEmptyParagraph) return;

    if (p.querySelector("ul, ol, h1, h2, h3, h4, h5, h6, pre, input")) return;

    const fragments: Node[][] = [[]];

    p.childNodes.forEach((node) => {
      if (node.nodeName === "BR") {
        fragments.push([]);
      } else {
        fragments[fragments.length - 1].push(node.cloneNode(true));
      }
    });

    if (fragments.length <= 1) return;

    const newNodes = fragments.map((nodes) => {
      const newP = document.createElement("p");
      if (nodes.length === 0) {
        newP.innerHTML = "<br>";
      } else {
        nodes.forEach((n) => newP.appendChild(n));
      }
      return newP;
    });

    p.replaceWith(...newNodes);
  });

  return container.innerHTML;
};

const isLegalDocument = (src: string) => {
  return /^(MIT License|Apache License|GNU |BSD |ISC License|Copyright \(c\)|TERMS AND CONDITIONS|END OF TERMS)/im.test(
    src
  );
};

function buildMarkedExtensions(tokenRenderers: Record<string, TokenRenderer>) {
  return Object.entries(tokenRenderers).map(
    ([startToken, { endToken, className }]) => {
      const escapedStart = escapeRegex(startToken);
      const escapedEnd = escapeRegex(endToken);
      const safeClass =
        className ?? `custom-token-${startToken.replace(/[^a-z0-9]/gi, "")}`;

      return {
        name: safeClass,
        level: "inline" as const,
        start(src: string) {
          return src.indexOf(startToken);
        },
        tokenizer(src: string) {
          const rule = new RegExp(
            `^${escapedStart}((?:(?!${escapedEnd}).)+?)${escapedEnd}`
          );
          const match = rule.exec(src);

          if (match) {
            return {
              type: safeClass,
              raw: match[0],
              word: match[1],
            };
          }
        },
        renderer(token: any) {
          const safeWord = token.word
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;");

          return `<span data-token-start="${startToken}" data-token-end="${endToken}" data-token-word="${safeWord}" data-token-type="${safeClass}"><span contenteditable="false"></span></span>&#8203;`;
        },
      };
    }
  );
}

function buildTurndownRules(tokenRenderers: Record<string, TokenRenderer>) {
  return Object.entries(tokenRenderers).map(
    ([startToken, { endToken, className }]) => {
      const safeClass =
        className ?? `custom-token-${startToken.replace(/[^a-z0-9]/gi, "")}`;

      return {
        name: safeClass,
        filter(node: HTMLElement) {
          return (
            node.nodeName === "SPAN" &&
            node.dataset.tokenStart === startToken &&
            node.dataset.tokenEnd === endToken
          );
        },
        replacement(_content: string, node: HTMLElement) {
          const raw = node.dataset.tokenWord ?? "";
          const decoded = raw
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, "&")
            .replace(/&#39;/g, "'");

          const word = (decoded || node.dataset.tokenWord) ?? "";

          const next = node.nextSibling;
          if (
            next?.nodeType === Node.TEXT_NODE &&
            next.textContent === "\u200B"
          ) {
            next.textContent = "";
          }
          return `${startToken}${word}${endToken}`;
        },
      };
    }
  );
}

function useTokenPortals(
  editorRef: React.RefObject<HTMLDivElement>,
  tokenRenderers?: Record<string, TokenRenderer>
) {
  const [portals, setPortals] = useState<React.ReactPortal[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  // Track which nodes already have a portal mounted
  const mountedNodes = useRef<Set<HTMLElement>>(new Set());

  const scanAndRender = useCallback(
    (source?: MutationRecord[]) => {
      if (!editorRef.current || !tokenRenderers) return;

      // If mutation came only from characterData inside a token, skip re-render
      // — the onInput handler on Badge already updated data-token-word directly
      if (source?.length) {
        const allInsideToken = source.every((m) =>
          (m.target as HTMLElement).closest?.("[data-token-start]")
        );
        if (allInsideToken) return;
      }

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const nodes = editorRef.current?.querySelectorAll<HTMLElement>(
          "[data-token-start] > span[contenteditable='false']"
        );
        if (!nodes) return;

        let changed = false;
        const newPortals = Array.from(nodes).map((node) => {
          const outer = node.closest<HTMLElement>("[data-token-start]")!;
          const startToken = outer.dataset.tokenStart!;
          const word = outer.dataset.tokenWord!;
          const renderer = tokenRenderers[startToken];
          if (!renderer) return null;

          // Skip re-render if this node already has a portal
          if (mountedNodes.current.has(node)) {
            // Return existing portal — find it from current state
            return (
              portals.find((p) => (p as any).containerInfo === node) ?? null
            );
          }

          changed = true;
          mountedNodes.current.add(node);

          return createPortal(
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              {renderer.render(word)}
            </span>,
            node
          );
        });

        // Clean up nodes that are no longer in the DOM
        mountedNodes.current.forEach((n) => {
          if (!editorRef.current?.contains(n)) {
            mountedNodes.current.delete(n);
            changed = true;
          }
        });

        if (changed) {
          setPortals(newPortals.filter(Boolean) as React.ReactPortal[]);
        }
      }, 50);
    },
    [tokenRenderers]
  );

  useEffect(() => {
    if (!editorRef.current || !tokenRenderers) return;

    scanAndRender();

    const observer = new MutationObserver((mutations) =>
      scanAndRender(mutations)
    );
    observer.observe(editorRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      clearTimeout(timerRef.current);
      mountedNodes.current.clear();
    };
  }, [scanAndRender]);

  return portals;
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

RichEditor.ToolbarButton = RichEditorToolbarButton;
RichEditor.codeLanguage = RichEditorCodeLanguage;
RichEditor.translatedCodeLanguage = TranslatedRichEditorCodeLanguage;
RichEditor.Base = BaseRichEditor;
RichEditor.cleanupHtml = cleanupHtml;
RichEditor.cleanSpacing = cleanSpacing;

export { RichEditor };
