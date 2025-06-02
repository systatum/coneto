import { CSSProperties, HTMLAttributes, MutableRefObject, Ref } from "react";

interface ComboboxListProps {
  options: string[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  setInputValue: (value: string) => void;
  setIsOpen: (open: boolean) => void;
  getFloatingProps: (
    userProps?: HTMLAttributes<HTMLUListElement>
  ) => HTMLAttributes<HTMLUListElement>;
  refs?: {
    setFloating?: Ref<HTMLUListElement>;
    reference?: Ref<HTMLElement> & { current?: HTMLElement | null };
  };
  floatingStyles: CSSProperties;
  listRef: MutableRefObject<(HTMLLIElement | null)[]>;
}

export default function Combobox({
  floatingStyles,
  getFloatingProps,
  highlightedIndex,
  listRef,
  options,
  refs,
  setHighlightedIndex,
  setInputValue,
  setIsOpen,
}: ComboboxListProps) {
  return (
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
      {options.length > 0 ? (
        options.map((option, index) => (
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
  );
}
