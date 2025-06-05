import {
  CSSProperties,
  HTMLAttributes,
  MutableRefObject,
  Ref,
  useEffect,
} from "react";
import { OptionsProps, Selectbox } from "./selectbox";
import { cn } from "./../lib/utils";

interface ComboboxProps {
  options: OptionsProps[];
  containerClassName?: string;
  inputValue: OptionsProps;
  setInputValue: (data: OptionsProps) => void;
  clearable?: boolean;
  placeholder?: string;
  emptySlate?: string;
}
interface ComboboxDrawerProps extends ComboboxProps {
  emptySlate?: string;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  setIsOpen?: (open: boolean) => void;
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
  options,
  inputValue,
  setInputValue,
  clearable = false,
  placeholder,
  containerClassName,
  emptySlate = "Not available.",
}: ComboboxProps) {
  return (
    <Selectbox
      containerClassName={containerClassName}
      options={options}
      inputValue={inputValue}
      setInputValue={setInputValue}
      placeholder={placeholder}
      clearable={clearable}
    >
      {(props) => <ComboboxDrawer emptySlate={emptySlate} {...props} />}
    </Selectbox>
  );
}

function ComboboxDrawer({
  floatingStyles,
  getFloatingProps,
  highlightedIndex,
  listRef,
  options,
  refs,
  setHighlightedIndex,
  setInputValue,
  setIsOpen,
  inputValue,
  emptySlate = "Not Available.",
}: ComboboxDrawerProps) {
  useEffect(() => {
    const selectedIndex = options.findIndex(
      (option) => option.value === inputValue.value
    );

    if (selectedIndex !== -1) {
      requestAnimationFrame(() => {
        const selectedEl = listRef.current[selectedIndex];
        if (selectedEl) {
          selectedEl.scrollIntoView({ block: "center" });
        }
      });
    }
  }, [inputValue.value, options, listRef]);

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
        options.map((option, index) => {
          return (
            <li
              key={option.value}
              id={`option-${index}`}
              role="option"
              aria-selected={
                option.value.toString() === inputValue.value.toString()
              }
              data-highlighted={highlightedIndex === index}
              onMouseDown={() => {
                setInputValue(option);
                setIsOpen(false);
              }}
              onMouseEnter={() => {
                setHighlightedIndex(index);
              }}
              className={cn(
                `cursor-pointer px-3 py-2`,
                highlightedIndex === index ? "bg-blue-100" : "",
                inputValue.value === option.value
                  ? "bg-[#61A9F9] font-semibold text-white"
                  : ""
              )}
              ref={(el) => {
                listRef.current[index] = el;
              }}
            >
              {option.text}
            </li>
          );
        })
      ) : (
        <li className="py-2 text-center text-gray-500">{emptySlate}</li>
      )}
    </ul>
  );
}
