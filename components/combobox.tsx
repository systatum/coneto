import React, { useState, useRef, useEffect } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  Placement,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface ComboboxProps {
  options: string[];
  inputValue: string;
  setInputValue: (data: string) => void;
  placeholder?: string;
}

export function Combobox({
  setInputValue,
  inputValue,
  options = [],
  placeholder,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const listRef = useRef<(HTMLLIElement | null)[]>([]);

  const FILTERED_OPTIONS = options.filter((opt) =>
    opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-start" as Placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const { getFloatingProps, getReferenceProps } = useInteractions([dismiss]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(value.length > 0);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, FILTERED_OPTIONS.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = FILTERED_OPTIONS[highlightedIndex];
      if (selected) {
        setInputValue(selected);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen && listRef.current[highlightedIndex]) {
      listRef.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-owns="combo-list"
      aria-controls="combo-list"
      aria-activedescendant={`option-${highlightedIndex}`}
      className="relative w-full text-xs ring-0"
    >
      <input
        {...getReferenceProps()}
        ref={(el) => {
          refs.setReference(el);
          inputRef.current = el;
        }}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (inputValue) setIsOpen(true);
        }}
        aria-autocomplete="list"
        placeholder={placeholder || "Search your item..."}
        className="w-full rounded-xs border border-gray-100 px-3 py-2 outline-none focus:border-blue-500 focus:ring-0 focus:ring-blue-500"
      />

      {inputValue !== "" && (
        <>
          <X
            onClick={() => {
              setInputValue("");
              setIsOpen((prev) => {
                const newState = !prev;
                if (newState && inputRef.current) {
                  inputRef.current.focus();
                }
                return newState;
              });
            }}
            size={12}
            className="absolute top-[11px] right-9 cursor-pointer text-gray-400"
          />
          <span className="absolute top-0.5 right-7 font-extralight text-lg text-gray-400">
            |
          </span>
        </>
      )}

      <div
        className="cursor-pointer"
        onClick={() => {
          setIsOpen((prev) => {
            const newState = !prev;
            if (newState && inputRef.current) {
              inputRef.current.focus();
            }
            return newState;
          });
        }}
      >
        {isOpen ? (
          <ChevronUp
            size={18}
            className="absolute text-gray-400 top-2 right-2"
          />
        ) : (
          <ChevronDown
            size={18}
            className="absolute text-gray-400 top-2 right-2"
          />
        )}
      </div>

      {isOpen && (
        <ul
          {...getFloatingProps()}
          ref={refs.setFloating}
          id="combo-list"
          role="listbox"
          style={{
            ...floatingStyles,
            width: refs.reference.current?.getBoundingClientRect().width,
            zIndex: 1000,
          }}
          className="max-h-60 overflow-y-auto rounded-xs border border-gray-100 bg-white shadow-lg"
        >
          {FILTERED_OPTIONS.length > 0 ? (
            FILTERED_OPTIONS.map((option, index) => (
              <li
                key={option}
                id={`option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                onMouseDown={() => {
                  setInputValue(option);
                  setIsOpen(false);
                }}
                onMouseEnter={() => {
                  setHighlightedIndex(index);
                }}
                className={`cursor-pointer px-3 py-2 ${
                  highlightedIndex === index ? "bg-blue-100" : ""
                }`}
                ref={(el) => {
                  listRef.current[index] = el;
                }}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="py-2 text-center text-gray-500">
              No content available.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
