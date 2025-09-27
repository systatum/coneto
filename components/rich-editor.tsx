import {
  forwardRef,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  RemixiconComponentType,
  RiBold,
  RiCheckboxLine,
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
import { TipMenu } from "./tip-menu";
import styled, { css, CSSProp } from "styled-components";

interface RichEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  toolbarRightPanel?: ReactNode;
  editorStyle?: CSSProp;
  containerStyle?: CSSProp;
  mode?: RichEditorModeState;
  toolbarPosition?: RichEditorToolbarPositionState;
}

type RichEditorToolbarPositionState = "top" | "bottom";
type RichEditorModeState = "view-only" | "page-editor" | "text-editor";

export interface RichEditorToolbarButtonProps {
  icon?: RemixiconComponentType;
  onClick?: () => void;
  children?: ReactNode;
  style?: CSSProp;
  isOpen?: boolean;
  isActive?: boolean;
}

interface RichEditorComponent
  extends React.ForwardRefExoticComponent<
    RichEditorProps & React.RefAttributes<RichEditorRef>
  > {
  ToolbarButton: typeof RichEditorToolbarButton;
}

export interface RichEditorRef {
  insertPlainText: (data: string) => void;
  insertMarkdownContent: (data: string) => void;
}

const RichEditor = forwardRef<RichEditorRef, RichEditorProps>(
  (
    {
      value = "",
      mode = "text-editor",
      toolbarPosition = "top",
      onChange,
      toolbarRightPanel,
      editorStyle,
      containerStyle,
    },
    ref
  ) => {
    const turndownService = new TurndownService();

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
        return parentIsParagraph ? content : `${content}\n`;
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
          return content + "\n";
        }

        if (
          prevSibling &&
          (prevSibling.tagName === "UL" || prevSibling.tagName === "OL") &&
          nextSibling &&
          (nextSibling.tagName === "UL" || nextSibling.tagName === "OL")
        ) {
          return content.trim() ? content : "\n";
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
          (node as HTMLElement).classList.contains("custom-checkbox-wrapper")
        );
      },
      replacement: (_content, node) => {
        const el = node as HTMLElement & { checked?: boolean };
        const checked =
          (el as HTMLInputElement).checked || el.dataset.checked === "true";
        return `[${checked ? "x" : " "}] `;
      },
    });

    marked.use({ gfm: false, breaks: true });

    const editorRef = useRef<HTMLDivElement>(null);
    const savedSelection = useRef<Range | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const handleEditorChange = () => {
      const html = editorRef.current?.innerHTML.replace(/\u00A0/g, "") || "";
      const cleanedHTML = cleanupHtml(html);
      const markdown = turndownService.turndown(cleanedHTML);
      const cleanedMarkdown = cleanSpacing(markdown);

      if (onChange) {
        onChange(cleanedMarkdown);
      }
    };

    useImperativeHandle(ref, () => ({
      insertMarkdownContent: async (data: string) => {
        if (!editorRef.current) return;

        if (document.activeElement !== editorRef.current) {
          editorRef.current.focus();
          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        let sel = window.getSelection();
        let range = sel?.rangeCount ? sel.getRangeAt(0) : null;
        if (!range) return;

        let processedValue = preprocessMarkdown(data);

        let html = await marked.parse(processedValue);

        html = html.replace(/<p>&nbsp;<\/p>/g, "<p><br></p>");

        const temp = document.createElement("div");
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
    }));

    const [isOpen, setIsOpen] = useState(false);

    const [formatStates, setFormatStates] = useState({
      bold: false,
      italic: false,
    });

    const updateFormatStates = () => {
      if (!editorRef.current || mode === "view-only") return;

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
      if (!editorRef.current || editorRef.current.innerHTML) return;

      const initializeEditor = async () => {
        let processedValue = value;

        processedValue = preprocessMarkdown(processedValue);

        let html = await marked.parse(processedValue);

        html = html.replace(/<p>&nbsp;<\/p>/g, "<p><br></p>");

        editorRef.current.innerHTML = String(html);
        document.execCommand("defaultParagraphSeparator", false, "p");

        editorRef.current
          .querySelectorAll(".custom-checkbox-wrapper")
          .forEach((node) => node.remove());

        handleFilteringCheckbox();
      };

      initializeEditor();
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

    const handleCommand = (
      command:
        | "bold"
        | "italic"
        | "insertOrderedList"
        | "insertUnorderedList"
        | "checkbox"
    ) => {
      if (!editorRef.current) return;
      editorRef.current.focus();

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
        handleEditorChange();
        return;
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

        e.preventDefault();

        document.execCommand("insertLineBreak");

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

      if (e.key === "Backspace") {
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        if (!range.collapsed) return;

        const container = range.startContainer;

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

    const TIP_MENU_RICH_EDITOR = [
      {
        caption: "Heading 1",
        icon: RiH1,
        iconColor: "black",
        onClick: async () => {
          await editorRef.current?.focus();
          await handleHeading(1);
        },
      },
      {
        caption: "Heading 2",
        icon: RiH2,
        iconColor: "black",
        onClick: async () => {
          await editorRef.current?.focus();
          await handleHeading(2);
        },
      },
      {
        caption: "Heading 3",
        icon: RiH3,
        iconColor: "black",
        onClick: async () => {
          await editorRef.current?.focus();
          await handleHeading(3);
        },
      },
    ];

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

    return (
      <Wrapper
        aria-label="wrapper-editor"
        $containerStyle={containerStyle}
        $mode={mode}
      >
        {mode !== "view-only" && (
          <ToolbarWrapper
            aria-label="toolbar-content"
            $toolbarPosition={toolbarPosition}
          >
            <Toolbar $toolbarPosition={toolbarPosition}>
              <ToolbarGroup>
                <RichEditorToolbarButton
                  isActive={formatStates.bold}
                  icon={RiBold}
                  onClick={() => handleCommand("bold")}
                />
                <RichEditorToolbarButton
                  isActive={formatStates.italic}
                  icon={RiItalic}
                  onClick={() => handleCommand("italic")}
                />
                <RichEditorToolbarButton
                  icon={RiListOrdered}
                  onClick={() => handleCommand("insertOrderedList")}
                />
                <RichEditorToolbarButton
                  icon={RiListUnordered}
                  onClick={() => handleCommand("insertUnorderedList")}
                />
                <RichEditorToolbarButton
                  icon={RiCheckboxLine}
                  onClick={() => handleCommand("checkbox")}
                />
                <RichEditorToolbarButton
                  icon={RiHeading}
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
              </ToolbarGroup>
              {toolbarRightPanel && (
                <ToolbarRightPanel>{toolbarRightPanel}</ToolbarRightPanel>
              )}
            </Toolbar>
          </ToolbarWrapper>
        )}

        <EditorArea
          ref={editorRef}
          role="textbox"
          contentEditable
          $editorStyle={editorStyle}
          $toolbarPosition={toolbarPosition}
          $mode={mode}
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
            }
          }}
          onKeyDown={handleOnKeyDown}
        />
      </Wrapper>
    );
  }
) as RichEditorComponent;

function RichEditorToolbarButton({
  icon: Icon,
  onClick,
  children,
  style,
  isOpen,
  isActive,
}: RichEditorToolbarButtonProps) {
  return (
    <ToolbarButton
      $style={style}
      type="button"
      $isOpen={isOpen}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      $isActive={isActive}
      aria-label="rich-editor-toolbar-button"
    >
      {Icon && <Icon size={16} />}
      {children && <span>{children}</span>}
    </ToolbarButton>
  );
}

const Wrapper = styled.div<{
  $containerStyle?: CSSProp;
  $mode?: RichEditorModeState;
}>`
  ${({ $mode }) =>
    $mode !== "page-editor" &&
    css`
      border: 1px solid #ececec;
      border-radius: 4px;
      box-shadow: 0 1px 4px -3px #5b5b5b;
    `}

  position: relative;

  ${({ $containerStyle }) => $containerStyle}
`;

const ToolbarWrapper = styled.div<{
  $toolbarPosition?: RichEditorToolbarPositionState;
}>`
  position: absolute;
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
  $toolbarPosition?: RichEditorToolbarPositionState;
}>`
  display: flex;
  flex-direction: row;
  width: 100%;
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  ${({ $toolbarPosition }) =>
    $toolbarPosition === "top"
      ? css`
          border-bottom: 1px solid #ececec;
        `
      : css`
          border-top: 1px solid #ececec;
        `}
`;

const ToolbarGroup = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
  padding: 6px 0;
`;

const ToolbarRightPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const MenuWrapper = styled.div<{
  $toolbarPosition?: RichEditorToolbarPositionState;
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
  $toolbarPosition?: RichEditorToolbarPositionState;
  $editorStyle?: CSSProp;
  $mode?: RichEditorModeState;
}>`
  padding: 8px;
  outline: none;
  background-color: white;

  ${({ $mode }) =>
    $mode === "page-editor"
      ? css`
          min-height: 100vh;
          max-height: 100vh;
          overflow: auto;
        `
      : css`
          min-height: 200px;
        `}

  ${({ $toolbarPosition }) =>
    $toolbarPosition === "top"
      ? css`
          padding-top: 45px;
        `
      : css`
          padding-bottom: 45px;
        `};
  ${({ $mode }) =>
    $mode === "view-only" &&
    css`
      padding: 12px;
      user-select: text;
      caret-color: transparent;
      outline: none;
    `};
  ol {
    list-style-type: decimal !important;
    list-style-position: outside !important;
    padding-left: 2.6rem !important;
    margin: 0 !important;
  }

  ul {
    list-style-type: disc !important;
    list-style-position: outside !important;
    padding-left: 2.6rem !important;
    margin: 0 !important;
  }

  li {
    padding-left: 0 !important;
    display: list-item !important;
  }

  h1 {
    font-size: 2em;
    margin: 0.25em 0;
  }

  h2 {
    font-size: 1.65em;
    margin: 0.3em 0;
  }

  h3 {
    font-size: 1.3em;
    margin: 0.4em 0;
  }

  ${({ $editorStyle }) => $editorStyle};
`;

const ToolbarButton = styled.button<{
  $style?: CSSProp;
  $isOpen?: boolean;
  $isActive?: boolean;
}>`
  padding: 4px 8px;
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
  &:hover {
    ${({ $isOpen }) =>
      !$isOpen &&
      css`
        background-color: #e5e7eb;
      `}
  }

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      background-color: #cfcfcf;
      box-shadow:
        inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
        inset 0 -0.5px 0.5px #cfcfcf;
    `}

  ${({ $isActive }) =>
    $isActive &&
    css`
      background-color: #cfcfcf;
      box-shadow:
        inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
        inset 0 -0.5px 0.5px #cfcfcf;
    `}

  &:active {
    background-color: #cfcfcf;
    box-shadow:
      inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
      inset 0 -0.5px 0.5px #cfcfcf;
  }
  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px #00000033;
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
  input.className = "custom-checkbox-wrapper";
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
    if (p.querySelector("ul, ol, h1, h2, h3, h4, h5, h6, b, i, input, strong"))
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

// To read markdown when have list
const preprocessMarkdown = (markdown: string) => {
  return markdown
    .replace(/\n(\n+)/g, (_, extraNewlines) => {
      const emptyParagraphs = "\n\n<br>".repeat(extraNewlines.length);
      return "\n" + emptyParagraphs;
    })
    .replace(/<br>\n([^\s\n<][^\n]*)/g, "<br>\n\n$1")
    .replace(/([^\n])\n([a-zA-Z])/g, "$1\n\n$2")
    .replace(
      /^(\s*(?:[\*\-\+]|\d+\.)\s+[^\n]+)\n(?![\s\*\-\+\d<\n])([^\n]+)/gm,
      "$1\n\n$2"
    );
};

RichEditor.ToolbarButton = RichEditorToolbarButton;

export { RichEditor };
