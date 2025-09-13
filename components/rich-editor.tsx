import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
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
}

export interface RichEditorToolbarButtonProps {
  icon?: RemixiconComponentType;
  onClick?: () => void;
  children?: ReactNode;
  style?: CSSProp;
  isOpen?: boolean;
}

function RichEditor({
  value = "",
  onChange,
  toolbarRightPanel,
  editorStyle,
  containerStyle,
}: RichEditorProps) {
  const turndownService = new TurndownService();

  turndownService.addRule("atxHeading", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function (content, node) {
      const hLevel = Number((node as HTMLElement).nodeName.charAt(1));
      const prefix = "#".repeat(hLevel);
      return `\n\n${prefix} ${content}\n\n`;
    },
  });

  turndownService.addRule("cleanListSpacing", {
    filter: ["ul", "ol"],
    replacement: function (content) {
      return `\n${content}\n`;
    },
  });

  turndownService.keep(["input"]);

  turndownService.addRule("checkbox", {
    filter: function (node) {
      return (
        node.nodeName === "SPAN" &&
        (node as HTMLElement).classList.contains("custom-checkbox-wrapper")
      );
    },
    replacement: function (content, node) {
      const checked = (node as HTMLElement).dataset.checked === "true";
      return `[${checked ? "x" : " "}]`;
    },
  });

  marked.use({ gfm: false });

  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!editorRef.current || editorRef.current.innerHTML) return;

    editorRef.current.innerHTML = String(marked(value));

    editorRef.current
      .querySelectorAll(".custom-checkbox-wrapper")
      .forEach((node) => node.remove());

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

    textNodesToProcess.forEach((textNode) => {
      if (!textNode.parentNode || !textNode.nodeValue) return;

      const parts = textNode.nodeValue.split(/(\[x\]|\[ \])/i);
      if (parts.length === 1) return;

      const fragment = document.createDocumentFragment();

      parts.forEach((part) => {
        if (part.toLowerCase() === "[x]") {
          fragment.appendChild(
            createCheckboxWrapper(true, turndownService, editorRef, onChange)
          );
        } else if (part.toLowerCase() === "[ ]") {
          fragment.appendChild(
            createCheckboxWrapper(false, turndownService, editorRef, onChange)
          );
        } else if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }, []);

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

    if (command === "checkbox") {
      const sel = window.getSelection();
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

      const html = editorRef.current.innerHTML || "";
      const markdown = turndownService.turndown(html);
      if (onChange) {
        onChange(markdown);
      }
    } else {
      document.execCommand(command);
      const html = editorRef.current.innerHTML || "";
      const markdown = turndownService.turndown(html);
      if (onChange) {
        onChange(markdown);
      }
    }
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      if (!range.collapsed) return;

      const container = range.startContainer;
      const offset = range.startOffset;

      if (e.key === "ArrowLeft") {
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        if (!range.collapsed) return;

        const container = range.startContainer;
        const offset = range.startOffset;

        if (container.nodeType === Node.TEXT_NODE && offset === 0) {
          let nodeToCheck: Node | null = container.previousSibling;

          while (nodeToCheck) {
            if (
              nodeToCheck.nodeType === Node.ELEMENT_NODE &&
              (nodeToCheck as HTMLElement).classList.contains(
                "custom-checkbox-wrapper"
              )
            ) {
              e.preventDefault();
              const newRange = document.createRange();
              newRange.setStartBefore(nodeToCheck);
              newRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(newRange);
              return;
            }
            nodeToCheck = nodeToCheck.previousSibling;
          }
        }
      }

      if (e.key === "ArrowRight") {
        let nodeToCheck: Node | null = null;

        if (
          container.nodeType === Node.TEXT_NODE &&
          offset === container.textContent?.length
        ) {
          nodeToCheck = container.nextSibling;
        } else if (container.nodeType === Node.ELEMENT_NODE) {
          const childNodes = Array.from(container.childNodes);
          nodeToCheck = childNodes[offset];
        }

        if (nodeToCheck?.nodeType === Node.ELEMENT_NODE) {
          const element = nodeToCheck as HTMLElement;
          if (element.classList.contains("custom-checkbox-wrapper")) {
            e.preventDefault();

            const newRange = document.createRange();
            newRange.setStartAfter(element);
            newRange.collapse(true);

            sel.removeAllRanges();
            sel.addRange(newRange);
            return;
          }
        }
      }
    }

    // This logic use for handle space for orderedlist/unorderedlist
    if (e.key === "Enter") {
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

      if (!li) return;

      const parentList = li.parentElement;
      if (
        !parentList ||
        (parentList.tagName !== "UL" && parentList.tagName !== "OL")
      )
        return;

      const liText = (li.textContent || "").replace(/\u00A0/g, "").trim();
      const liHasCheckbox = !!li.querySelector(".custom-checkbox-wrapper");
      if (liText === "" && !liHasCheckbox) {
        e.preventDefault();
        const p = document.createElement("p");
        p.innerHTML = "<br>";

        if (li === parentList.lastElementChild) {
          parentList.insertAdjacentElement("afterend", p);
        } else {
          parentList.parentNode?.insertBefore(p, parentList);
        }

        li.remove();

        const newRange = document.createRange();
        newRange.setStart(p, 0);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);

        const html = editorRef.current?.innerHTML.replace(/\u00A0/g, "") || "";
        onChange?.(turndownService.turndown(html));
        return;
      }

      e.preventDefault();

      const newLi = document.createElement("li");

      let nodeAfter: Node | null = null;
      if (container.nodeType === Node.TEXT_NODE) {
        const textNode = container as Text;
        const offset = range.startOffset;
        const textLen = textNode.textContent?.length || 0;
        if (offset < textLen) {
          nodeAfter = textNode.splitText(offset);
        } else {
          nodeAfter = textNode.nextSibling;
        }
      } else if (container.nodeType === Node.ELEMENT_NODE) {
        const el = container as Element;
        nodeAfter = el.childNodes[range.startOffset] || null;
      }

      while (nodeAfter && nodeAfter.parentNode === li) {
        const next = nodeAfter.nextSibling;
        newLi.appendChild(nodeAfter);
        nodeAfter = next;
      }

      const newLiText = (newLi.textContent || "").replace(/\u00A0/g, "").trim();
      const newLiHasCheckbox = !!newLi.querySelector(
        ".custom-checkbox-wrapper"
      );
      if (!newLi.hasChildNodes() || (newLiText === "" && !newLiHasCheckbox)) {
        newLi.innerHTML = "<br>";
      }

      li.parentNode?.insertBefore(newLi, li.nextSibling);

      const walker = document.createTreeWalker(
        newLi,
        NodeFilter.SHOW_TEXT,
        null
      );
      const firstText = walker.nextNode() as Text | null;
      const newRange = document.createRange();

      if (firstText) {
        newRange.setStart(firstText, 0);
      } else {
        const firstChild = newLi.firstChild as Node | null;
        if (
          firstChild &&
          firstChild.nodeType === Node.ELEMENT_NODE &&
          (firstChild as HTMLElement).classList.contains(
            "custom-checkbox-wrapper"
          )
        ) {
          const after = firstChild.nextSibling;
          if (after && after.nodeType === Node.TEXT_NODE) {
            newRange.setStart(after, 0);
          } else {
            const txt = document.createTextNode("\u00A0");
            newLi.appendChild(txt);
            newRange.setStart(txt, 1);
          }
        } else {
          newRange.selectNodeContents(newLi);
          newRange.collapse(true);
        }
      }

      sel.removeAllRanges();
      sel.addRange(newRange);

      const html = editorRef.current?.innerHTML.replace(/\u00A0/g, "") || "";
      onChange?.(turndownService.turndown(html));
      return;
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

          const html = editorRef.current?.innerHTML || "";
          const markdown = turndownService.turndown(html);
          onChange?.(markdown);
          return;
        }

        const orderedMatch = beforeCaret.match(/^(\d+)\.$/);
        const unorderedMatch = beforeCaret.match(/^[-*]$/);

        if (orderedMatch || unorderedMatch) {
          e.preventDefault();

          const li = document.createElement("li");

          if (afterCaret) {
            li.appendChild(document.createTextNode(afterCaret));
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
            newRange.setStart(li.lastChild!, afterCaret.length);
          } else {
            newRange.setStart(li, 0);
          }
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      }
    }

    const removeNode = (n: Node | null) => {
      if (!n) return;
      const p = n.parentNode;
      if (p) p.removeChild(n);
    };

    if (e.key === "Backspace") {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      if (!range.collapsed) return;

      const container = range.startContainer;

      const updateMarkdown = () => {
        const html = editorRef.current?.innerHTML.replace(/\u00A0/g, "") || "";
        const markdown = turndownService.turndown(html);
        console.log(html);
        onChange?.(markdown);
      };

      let node: Node | null =
        container.nodeType === Node.TEXT_NODE && range.startOffset === 0
          ? container.previousSibling
          : container.nodeType === Node.ELEMENT_NODE
            ? (container.childNodes[range.startOffset - 1] ?? null)
            : null;

      if (
        (node instanceof HTMLInputElement &&
          (node as HTMLElement).classList.contains(
            "custom-checkbox-wrapper"
          )) ||
        (node?.nodeType === Node.TEXT_NODE &&
          node.nextSibling instanceof HTMLInputElement &&
          (node as HTMLElement).classList.contains("custom-checkbox-wrapper"))
      ) {
        e.preventDefault();

        if (node instanceof HTMLInputElement) removeNode(node);
        else if (
          node?.nodeType === Node.TEXT_NODE &&
          (node as HTMLElement).classList.contains("custom-checkbox-wrapper")
        ) {
          removeNode(node.nextSibling);
          removeNode(node);
        }

        updateMarkdown();
        return;
      }

      const li =
        container.nodeType === Node.TEXT_NODE
          ? (container.parentNode as HTMLElement)?.closest("li")
          : (container as HTMLElement).closest("li");

      if (!li || range.startOffset !== 0) return;

      const list = li.parentElement;
      if (!list || (list.tagName !== "UL" && list.tagName !== "OL")) return;

      e.preventDefault();
      const content = li.innerHTML;

      if (list.children.length === 1 || li === list.firstElementChild) {
        const p = document.createElement("p");
        p.innerHTML = !content.trim() || content === "<br>" ? "<br>" : content;

        if (list.children.length === 1) list.replaceWith(p);
        else list.parentNode?.insertBefore(p, list);

        removeNode(li);

        const newRange = document.createRange();
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      } else {
        const prevLi = li.previousElementSibling as HTMLElement;
        if (!prevLi) return;

        let cursorPos = prevLi.textContent?.length || 0;
        if (prevLi.innerHTML === "<br>") {
          prevLi.innerHTML = "";
          cursorPos = 0;
        }

        const checkboxWrapper = prevLi.querySelector(
          ".custom-checkbox-wrapper"
        );
        let insertBeforeNode: Node | null =
          checkboxWrapper?.nextSibling ?? prevLi.firstChild;

        while (li.firstChild) {
          prevLi.insertBefore(li.firstChild, insertBeforeNode);
          insertBeforeNode = insertBeforeNode?.nextSibling ?? null;
        }
        removeNode(li);

        const newRange = document.createRange();
        const walker = document.createTreeWalker(prevLi, NodeFilter.SHOW_TEXT);
        let pos = 0,
          target: Text | null = null,
          offset = 0;

        while (walker.nextNode()) {
          const text = walker.currentNode as Text;
          const len = text.textContent?.length || 0;
          if (pos + len >= cursorPos) {
            target = text;
            offset = cursorPos - pos;
            break;
          }
          pos += len;
        }

        if (target) newRange.setStart(target, offset);
        else {
          newRange.selectNodeContents(prevLi);
          newRange.collapse(false);
        }

        sel.removeAllRanges();
        sel.addRange(newRange);
      }

      updateMarkdown();
    }

    if (e.key === "Delete") {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      const container = range.startContainer;
      const offset = range.startOffset;

      let nodeToCheck: Node | null = null;

      if (
        container.nodeType === Node.TEXT_NODE &&
        offset === container.textContent?.length
      ) {
        nodeToCheck = container.nextSibling;
      } else if (container.nodeType === Node.ELEMENT_NODE) {
        const childNodes = Array.from(container.childNodes);
        nodeToCheck = childNodes[offset] ?? null;
      }

      if (nodeToCheck) {
        if (
          nodeToCheck.nodeType === Node.TEXT_NODE &&
          nodeToCheck.nodeValue === "\u00A0" &&
          nodeToCheck.nextSibling instanceof HTMLElement &&
          nodeToCheck.nextSibling.classList.contains("custom-checkbox-wrapper")
        ) {
          e.preventDefault();
          removeNode(nodeToCheck.nextSibling);
          removeNode(nodeToCheck);

          const html =
            editorRef.current?.innerHTML.replace(/\u00A0/g, "") || "";
          const markdown = turndownService.turndown(html);
          onChange?.(markdown);
          return;
        }

        if (
          nodeToCheck.nodeType === Node.ELEMENT_NODE &&
          (nodeToCheck as HTMLElement).classList.contains(
            "custom-checkbox-wrapper"
          )
        ) {
          e.preventDefault();
          const spaceNode = nodeToCheck.nextSibling;
          removeNode(nodeToCheck);

          if (
            spaceNode?.nodeType === Node.TEXT_NODE &&
            spaceNode.nodeValue === "\u00A0"
          ) {
            removeNode(spaceNode);
          }

          const html =
            editorRef.current?.innerHTML.replace(/\u00A0/g, "") || "";
          const markdown = turndownService.turndown(html);
          onChange?.(markdown);
          return;
        }
      }

      const html = editorRef.current?.innerHTML.replace(/\u00A0/g, "") || "";
      console.log(html);
      const markdown = turndownService.turndown(html);
      onChange?.(markdown);
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

    if (!sel || !sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    let node = range.commonAncestorContainer as HTMLElement;

    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement!;
    }

    const headingTag = `h${level}` as keyof HTMLElementTagNameMap;

    if (/^H[1-6]$/.test(node.tagName)) {
      const newHeading = document.createElement(headingTag);
      newHeading.innerHTML = node.innerHTML;

      node.replaceWith(newHeading);

      const newRange = document.createRange();
      newRange.selectNodeContents(newHeading);
      newRange.collapse(false);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      const heading = document.createElement(headingTag);
      heading.innerHTML = sel.toString();

      range.deleteContents();
      range.insertNode(heading);

      const newRange = document.createRange();
      newRange.selectNodeContents(heading);
      newRange.collapse(false);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }

    savedSelection.current = null;

    const html = editorRef.current.innerHTML || "";

    const markdown = turndownService.turndown(html);
    if (onChange) {
      onChange(markdown);
    }
  };

  const TIP_MENU_RICH_EDITOR = [
    {
      caption: "Heading 1",
      icon: RiH1,
      iconColor: "black",
      onClick: () => {
        editorRef.current?.focus();
        handleHeading(1);
      },
    },
    {
      caption: "Heading 2",
      icon: RiH2,
      iconColor: "black",
      onClick: () => {
        editorRef.current?.focus();
        handleHeading(2);
      },
    },
    {
      caption: "Heading 3",
      icon: RiH3,
      iconColor: "black",
      onClick: () => {
        editorRef.current?.focus();
        handleHeading(3);
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
    <Wrapper $containerStyle={containerStyle}>
      <Toolbar>
        <ToolbarGroup>
          <RichEditorToolbarButton
            icon={RiBold}
            onClick={() => handleCommand("bold")}
          />
          <RichEditorToolbarButton
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
              setIsOpen(true);
            }}
          />

          {isOpen && (
            <MenuWrapper ref={menuRef}>
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

      <EditorArea
        ref={editorRef}
        role="textbox"
        contentEditable
        $editorStyle={editorStyle}
        onInput={() => {
          const html =
            editorRef.current?.innerHTML.replace(/\u00A0/g, "") || "";
          const markdown = turndownService.turndown(html);
          onChange?.(markdown);
        }}
        onKeyDown={handleOnKeyDown}
      />
    </Wrapper>
  );
}

function RichEditorToolbarButton({
  icon: Icon,
  onClick,
  children,
  style,
  isOpen,
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
      aria-label="rich-editor-toolbar-button"
    >
      {Icon && <Icon size={16} />}
      {children && <span>{children}</span>}
    </ToolbarButton>
  );
}

const Wrapper = styled.div<{ $containerStyle?: CSSProp }>`
  border: 1px solid #ececec;
  border-radius: 4px;
  box-shadow: 0 1px 4px -3px #5b5b5b;

  ${({ $containerStyle }) => $containerStyle}
`;

const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ececec;
  padding: 0 8px;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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

const MenuWrapper = styled.div`
  position: absolute;
  top: 100%;
  right: -100px;
  transform: translateY(4px);
  z-index: 10;
`;

const EditorArea = styled.div<{
  $editorStyle?: CSSProp;
}>`
  min-height: 200px;
  padding: 8px;
  outline: none;
  background-color: white;

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
    margin: 0.5em 0;
  }

  h2 {
    font-size: 1.5em;
    margin: 0.5em 0;
  }

  h3 {
    font-size: 1.25em;
    margin: 0.5em 0;
  }

  ${({ $editorStyle }) => $editorStyle};
`;

const ToolbarButton = styled.button<{ $style?: CSSProp; $isOpen?: boolean }>`
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
  onChange?: (value: string) => void
) {
  const wrapper = document.createElement("span");
  wrapper.className = "custom-checkbox-wrapper";
  wrapper.dataset.checked = String(isChecked);
  wrapper.contentEditable = "false";
  wrapper.style.display = "inline-flex";
  wrapper.style.alignItems = "center";
  wrapper.style.position = "relative";
  wrapper.style.userSelect = "none";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isChecked;
  checkbox.style.appearance = "none";
  checkbox.style.height = "14px";
  checkbox.style.width = "14px";
  checkbox.style.cursor = "pointer";
  checkbox.style.outline = "none";
  checkbox.style.backgroundColor = isChecked ? "#61A9F9" : "#ffffff";
  checkbox.style.border = `1px solid ${isChecked ? "#61A9F9" : "#6b7280"}`;

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "3");
  icon.setAttribute("fill", "none");
  icon.style.position = "absolute";
  icon.style.top = "50%";
  icon.style.left = "50%";
  icon.style.transform = isChecked
    ? "translate(-50%, -50%) scale(1)"
    : "translate(-50%, -50%) scale(0)";
  icon.style.transition = "transform 150ms";
  icon.style.color = "white";
  icon.style.pointerEvents = "none";
  icon.style.height = "10px";
  icon.style.width = "10px";

  const polyline = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline"
  );
  polyline.setAttribute("points", "20 6 9 17 4 12");
  icon.appendChild(polyline);

  checkbox.addEventListener("change", () => {
    const checked = checkbox.checked;
    wrapper.dataset.checked = String(checked);
    checkbox.style.backgroundColor = checked ? "#61A9F9" : "#ffffff";
    checkbox.style.borderColor = checked ? "#61A9F9" : "#6b7280";
    icon.style.transform = checked
      ? "translate(-50%, -50%) scale(1)"
      : "translate(-50%, -50%) scale(0)";

    const html = editorRef.current?.innerHTML || "";
    const markdown = turndownService.turndown(html);
    onChange?.(markdown);
  });

  wrapper.addEventListener("click", (e) => {
    if (e.target === wrapper) {
      checkbox.focus();
      checkbox.click();
    }
  });

  wrapper.appendChild(checkbox);
  wrapper.appendChild(icon);

  return wrapper;
}

RichEditor.ToolbarButton = RichEditorToolbarButton;

export { RichEditor };
