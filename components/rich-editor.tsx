import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
import {
  RemixiconComponentType,
  RiBold,
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
import styled, { CSSProp } from "styled-components";

interface RichEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  toolbarRightPanel?: ReactNode;
  editorStyles?: CSSProp;
}

export interface RichEditorToolbarButtonProps {
  icon?: RemixiconComponentType;
  onClick?: () => void;
  children?: ReactNode;
}

function RichEditor({
  value = "",
  onChange,
  toolbarRightPanel,
  editorStyles,
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

  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const stateValue = marked(value);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = String(stateValue);
    }
  }, [stateValue]);

  const handleCommand = (
    command: "bold" | "italic" | "insertOrderedList" | "insertUnorderedList"
  ) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command);
    const html = editorRef.current.innerHTML || "";
    const markdown = turndownService.turndown(html);
    if (onChange) {
      onChange(markdown);
    }
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
      e.preventDefault();
      return;
    }

    // This logic use for handle space for orderedlist/unorderedlist
    if (e.key === "Enter") {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);
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

      e.preventDefault();

      const br = document.createElement("br");

      range.deleteContents();
      range.insertNode(br);

      const newRange = document.createRange();
      newRange.setStartAfter(br);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);

      const html = editorRef.current?.innerHTML || "";
      const markdown = turndownService.turndown(html);
      onChange?.(markdown);
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

        return;
      }
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
      sel.addRange;
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
    <Wrapper>
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
            icon={RiHeading}
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
        $editorStyles={editorStyles}
        onInput={() => {
          const html = editorRef.current?.innerHTML || "";
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
}: RichEditorToolbarButtonProps) {
  return (
    <ToolbarButton
      type="button"
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

const Wrapper = styled.div`
  border: 1px solid #ececec;
  border-radius: 4px;
  box-shadow: 0 1px 4px -3px #5b5b5b;
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
  $editorStyles?: CSSProp;
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

  ${({ $editorStyles }) => $editorStyles};
`;

const ToolbarButton = styled.button`
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
    background-color: #e5e7eb;
  }
`;

RichEditor.ToolbarButton = RichEditorToolbarButton;

export { RichEditor };
