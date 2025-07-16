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
import { cn } from "./../lib/utils";
import { TipMenu } from "./tip-menu";

interface RichEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  toolbarRightPanel?: ReactNode;
  editorClassName?: string;
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
  editorClassName,
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

    // this logic is to handle ordered and unordered lists, so when we type "1." or "-",
    // it will automatically convert it to an ordered or unordered list
    if (e.key === " ") {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      const node = range.startContainer;

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? "";

        const orderedMatch = text.match(/^(\d+)\.$/);
        if (orderedMatch) {
          e.preventDefault();

          const rawNumber = orderedMatch[1];
          const parsedNumber = parseInt(rawNumber, 10);

          node.textContent = "";

          const li = document.createElement("li");
          li.appendChild(document.createElement("br"));

          const ol = document.createElement("ol");

          ol.setAttribute("start", parsedNumber.toString());
          ol.appendChild(li);

          const parent = node.parentNode;
          if (parent) {
            parent.replaceChild(ol, node);
          }

          const newRange = document.createRange();
          newRange.setStart(li, 0);
          newRange.collapse(true);

          sel.removeAllRanges();
          sel.addRange(newRange);
        }

        const unorderedMatch = text.match(/^[-*]$/);
        if (unorderedMatch) {
          e.preventDefault();

          node.textContent = "";

          const li = document.createElement("li");
          li.appendChild(document.createElement("br"));

          const ul = document.createElement("ul");
          ul.appendChild(li);

          const parent = node.parentNode;
          if (parent) {
            parent.replaceChild(ul, node);
          }

          const newRange = document.createRange();
          newRange.setStart(li, 0);
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
    <div className="border border-[#ececec] rounded-xs shadow-[0_1px_4px_-3px_#5b5b5b]">
      <div className="flex flex-row justify-between items-center border-b border-[#ececec] px-2 bg-white shadow-sm">
        <div className="flex flex-row relative justify-start items-start gap-1 py-[6px]">
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
            <div
              ref={menuRef}
              className={cn(
                "absolute top-full -right-[100px] translate-y-1 z-10"
              )}
            >
              <TipMenu
                setIsOpen={() => {
                  setIsOpen(false);
                }}
                subMenuList={TIP_MENU_RICH_EDITOR}
              />
            </div>
          )}
        </div>
        {toolbarRightPanel && (
          <div className="flex flex-row items-center gap-2">
            {toolbarRightPanel}
          </div>
        )}
      </div>

      <div
        ref={editorRef}
        role="textbox"
        contentEditable
        className={cn(
          "min-h-[200px] p-2 outline-none rich-editor",
          editorClassName
        )}
        onInput={() => {
          const html = editorRef.current?.innerHTML || "";
          const markdown = turndownService.turndown(html);
          onChange?.(markdown);
        }}
        onKeyDown={handleOnKeyDown}
      />
    </div>
  );
}

function RichEditorToolbarButton({
  icon: Icon,
  onClick,
  children,
}: RichEditorToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick();
        }
      }}
      className="px-2 py-1 flex flex-row items-center gap-1 cursor-pointer text-sm hover:bg-gray-200 rounded-xs"
    >
      {Icon && <Icon size={16} />}
      {children && <span className="text-s,">{children}</span>}
    </button>
  );
}

RichEditor.ToolbarButton = RichEditorToolbarButton;

export { RichEditor };
