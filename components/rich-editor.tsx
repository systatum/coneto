import { ReactNode, useEffect, useRef } from "react";
import {
  RemixiconComponentType,
  RiBold,
  RiItalic,
  RiNumber1,
} from "@remixicon/react";
import TurndownService from "turndown";
import { marked } from "marked";

interface RichEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  toolbarRightPanel?: ReactNode;
}

function RichEditor({
  value = "",
  onChange,
  toolbarRightPanel,
}: RichEditorProps) {
  const turndownService = new TurndownService();
  const editorRef = useRef<HTMLDivElement>(null);
  const stateValue = marked(value);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = String(stateValue);
    }
  }, [stateValue]);

  const handleCommand = (command: "bold" | "italic" | "insertOrderedList") => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command);
    const html = editorRef.current.innerHTML || "";
    const markdown = turndownService.turndown(html);
    onChange?.(markdown);
  };

  const handleOnKeyDown = (e) => {
    if (e.key === " ") {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      const node = range.startContainer;

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? "";

        const match = text.match(/^\d+\.$/);
        if (match) {
          e.preventDefault();

          node.textContent = "";

          const li = document.createElement("li");
          li.appendChild(document.createElement("br"));

          const ol = document.createElement("ol");
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
      }
    }
  };

  return (
    <div className="border rounded-xs shadow-sm">
      <div className="flex flex-row justify-between items-center border-b px-2 bg-gray-50">
        <div className="flex flex-row justify-start items-start gap-1 py-1">
          <ToolbarButton icon={RiBold} onClick={() => handleCommand("bold")} />
          <ToolbarButton
            icon={RiItalic}
            onClick={() => handleCommand("italic")}
          />
          <ToolbarButton
            icon={RiNumber1}
            onClick={() => handleCommand("insertOrderedList")}
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
        className="min-h-[200px] p-2 outline-none rich-editor"
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
