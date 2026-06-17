import React, {
  forwardRef,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
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

export const MonacoCodeLanguageEquivalent = {
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

export type MonacoCodeLanguageEquivalent =
  (typeof MonacoCodeLanguageEquivalent)[keyof typeof MonacoCodeLanguageEquivalent];

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
    },
    ref
  ) => {
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
        value: MonacoCodeLanguageEquivalent[lang],
      })
    );

    const turndownServiceRef = useRef<TurndownService>(new TurndownService());
    const turndownService = new TurndownService();

    CodeEditor.addFencedCodeRule(turndownService);

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

    CodeEditor.addFencedCodeMarkedExtension();

    marked.use({
      gfm: false,
      breaks: true,
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
            return `<h${token.depth}>${token.text}</h${token.depth}>`;
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

    const isLegal = isLegalDocument(value);

    let prevWalkToken: any = null;

    marked.use({
      gfm: false,
      breaks: true,
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
            return `<h${token.depth}>${token.text}</h${token.depth}>`;
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

    const editorRef = useRef<HTMLDivElement>(null);
    const savedSelection = useRef<Range | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

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

    const [formatStates, setFormatStates] = useState({
      bold: false,
      italic: false,
    });

    const updateFormatStates = () => {
      if (!editorRef.current || mode === "view-only") return;

      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const node = sel.anchorNode;

      if (!node || !editorRef.current.contains(node)) {
        setFormatStates({ bold: false, italic: false });
        return;
      }

      try {
        const bold = document.queryCommandState("bold");
        const italic = document.queryCommandState("italic");

        setFormatStates({
          bold,
          italic,
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
      };

      initializeEditor();

      return () => {
        isMounted = false;
      };
    }, []);

    const handleFilteringCheckbox = () => {
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
      wrapper.dataset.monacoBlockId = id;
      wrapper.contentEditable = "false";

      const after = document.createElement("p");
      after.innerHTML = "<br>";

      const parent = insertAfter?.parentNode ?? editorRef.current;
      const sibling = insertAfter?.nextSibling ?? null;

      // If the current block is an empty <p>, replace it with the monaco block
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
        MonacoCodeLanguageEquivalent[language],
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

    const handleCommand = (
      command:
        | "bold"
        | "italic"
        | "insertOrderedList"
        | "insertUnorderedList"
        | "checkbox"
        | "codeBlock"
    ) => {
      if (!editorRef.current) return;
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

      document.execCommand(command);
      handleEditorChange();
    };

    const handleOnKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);

      if (mode === "view-only") {
        const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c";

        if (!isCopy) {
          e.preventDefault();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
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

        if (!targetSibling?.hasAttribute("data-monaco-block-id")) return;

        // Is caret on the edge line facing Monaco?
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
          const focusTarget =
            targetSibling.querySelector<HTMLElement>(".native-edit-context") ??
            targetSibling.querySelector<HTMLElement>(".monaco-editor textarea");

          focusTarget?.focus();
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

          const newP = document.createElement("p");
          newP.innerHTML = "<br>";

          let currentP = container.parentElement;
          while (currentP && currentP.tagName !== "P") {
            currentP = currentP.parentElement;
          }

          if (currentP) {
            currentP.insertAdjacentElement("afterend", newP);
          } else {
            container.parentElement?.insertAdjacentElement("afterend", newP);
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

          const orderedMatch = beforeCaret.match(/^(\d+)\.$/);
          const unorderedMatch = beforeCaret.match(/^[-*]$/);

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

        // Delete monaco block when caret is at start of block right after it
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
            prevSibling.dataset.monacoBlockId !== undefined
          ) {
            e.preventDefault();
            prevSibling.remove();
            handleEditorChange();
            return;
          }
        }

        // Fallback: caret is at root editor level directly after monaco block
        if (container === editorRef.current) {
          const nodeBefore =
            editorRef.current.childNodes[range.startOffset - 1];
          if (
            nodeBefore instanceof HTMLElement &&
            nodeBefore.dataset.monacoBlockId !== undefined
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
        if (
          sel.isCollapsed &&
          range.startContainer.nodeType === Node.TEXT_NODE
        ) {
          const textContent = range.startContainer.textContent || "";
          newHeading.textContent = textContent;
          range.startContainer.parentNode?.replaceChild(
            newHeading,
            range.startContainer
          );
        } else if (!sel.isCollapsed) {
          const startContainer = range.startContainer;

          let lineNode: Node;
          if (startContainer.nodeType === Node.TEXT_NODE) {
            lineNode = startContainer;
          } else {
            lineNode =
              startContainer.childNodes[range.startOffset] || startContainer;
          }

          const lineText = lineNode.textContent || "";
          newHeading.textContent = lineText;

          if (lineNode.parentNode) {
            lineNode.parentNode.replaceChild(newHeading, lineNode);
          }
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

    const codeEditorId = CodeEditor.nextBlockId();

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
            `,
          }}
          className={codeClassName}
          toolbarPosition={toolbarPosition}
          actions={codeEditorActions}
          value={value}
          language={MonacoCodeLanguageEquivalent[language]}
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
                <RichEditorToolbarButton
                  ariaLabel="rich-editor-toolbar-bold"
                  isActive={formatStates.bold}
                  icon={{ image: RiBold }}
                  onClick={() => handleCommand("bold")}
                />

                <RichEditorToolbarButton
                  ariaLabel="rich-editor-toolbar-italic"
                  isActive={formatStates.italic}
                  icon={{ image: RiItalic }}
                  onClick={() => handleCommand("italic")}
                />

                <RichEditorToolbarButton
                  ariaLabel="rich-editor-toolbar-ordered-list"
                  icon={{ image: RiListOrdered }}
                  onClick={() => handleCommand("insertOrderedList")}
                />

                <RichEditorToolbarButton
                  ariaLabel="rich-editor-toolbar-unordered-list"
                  icon={{ image: RiListUnordered }}
                  onClick={() => handleCommand("insertUnorderedList")}
                />

                <RichEditorToolbarButton
                  ariaLabel="rich-editor-toolbar-checkbox"
                  icon={{ image: RiCheckboxLine }}
                  onClick={() => handleCommand("checkbox")}
                />

                {mode === "markdown-editor" && (
                  <RichEditorToolbarButton
                    ariaLabel="rich-editor-toolbar-code-block"
                    icon={{ image: RiCodeSSlashLine }}
                    onClick={() => handleCommand("codeBlock")}
                  />
                )}

                <RichEditorToolbarButton
                  ariaLabel="rich-editor-toolbar-heading-menu"
                  icon={{ image: RiHeading }}
                  isOpen={isOpen}
                  onClick={() => {
                    const sel = window.getSelection();
                    if (sel && sel.rangeCount > 0) {
                      savedSelection.current = sel.getRangeAt(0).cloneRange();
                    }
                    setIsOpen(!isOpen);
                  }}
                />

                {isOpen && (
                  <MenuWrapper ref={menuRef} $toolbarPosition={toolbarPosition}>
                    <TipMenu
                      setIsOpen={() => setIsOpen(false)}
                      subMenuList={TIP_MENU_RICH_EDITOR}
                    />
                  </MenuWrapper>
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
  return (
    <Wrapper
      id={id}
      $theme={richEditorTheme}
      className={className}
      aria-label="rich-editor-wrapper"
      $containerStyle={styles?.containerStyle}
      $mode={mode}
    >
      {(leftSidePanel || rightSidePanel) && (
        <ToolbarWrapper
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

const MenuWrapper = styled.div<{
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
  right: -100px;
  z-index: 40;
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
              margin-top: 37px;
            `
          : css`
              margin-bottom: 37px;
            `
        : ""};

  pre[data-monaco-hydrated]:not([data-monaco-block-id]),
  pre[data-monaco-hydrated]:not([data-monaco-block-id]) code {
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
        "ul, ol, h1, h2, h3, h4, h5, h6, b, i, input, strong, [data-token-start]"
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

// To apply instyle to word bold or italic
const applyInlineStyleToWord = (style: "bold" | "italic") => {
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
