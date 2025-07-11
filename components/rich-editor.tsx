import { KeyboardEvent, ReactNode, useEffect, useRef } from "react";
import {
  RemixiconComponentType,
  RiBold,
  RiItalic,
  RiListOrdered,
  RiListUnordered,
} from "@remixicon/react";
import TurndownService from "turndown";
import { marked } from "marked";
import { cn } from "./../lib/utils";

interface RichEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  toolbarRightPanel?: ReactNode;
  editorClassName?: string;
}

function RichEditor({
  value = "",
  onChange,
  toolbarRightPanel,
  editorClassName,
}: RichEditorProps) {
  const turndownService = new TurndownService();
  const editorRef = useRef<HTMLDivElement>(null);
  const stateValue = marked(value);

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
    onChange?.(markdown);
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
      e.preventDefault();
      return;
    }

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
  };

  return (
    <div className="border border-[#ececec] rounded-xs shadow-[0_1px_4px_-3px_#5b5b5b]">
      <div className="flex flex-row justify-between items-center border-b border-[#ececec] px-2 bg-white shadow-sm">
        <div className="flex flex-row justify-start items-start gap-1 py-1">
          <ToolbarButton icon={RiBold} onClick={() => handleCommand("bold")} />
          <ToolbarButton
            icon={RiItalic}
            onClick={() => handleCommand("italic")}
          />
          <ToolbarButton
            icon={RiListOrdered}
            onClick={() => handleCommand("insertOrderedList")}
          />
          <ToolbarButton
            icon={RiListUnordered}
            onClick={() => handleCommand("insertUnorderedList")}
          />
        </div>
        {toolbarRightPanel && (
          <div className="flex flex-row items-center gap-2">
            {toolbarRightPanel}
          </div>
        )}
      </div>

      <div
        ref={editorRef}
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

function ToolbarButton({
  icon: Icon,
  onClick,
}: {
  icon: RemixiconComponentType;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-1 cursor-pointer text-sm hover:bg-gray-200 rounded-xs"
    >
      <Icon size={16} />
    </button>
  );
}

RichEditor.ToolbarButton = ToolbarButton;

export { RichEditor };
