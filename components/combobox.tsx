import { CSSProperties, HTMLAttributes, MutableRefObject, Ref } from "react";
import { OptionsProps, Selectbox } from "./selectbox";
import { cn } from "./../lib/utils";

interface ComboboxProps {
  options: OptionsProps[];
  containerClassName?: string;
  inputValue: OptionsProps;
  setInputValue: (data: OptionsProps) => void;
  clearable?: boolean;
  placeholder?: string;
  empty?: string;
  selectedValue?: string | number;
}
interface ComboboxDrawerProps extends ComboboxProps {
  empty?: string;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
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
  options,
  inputValue,
  setInputValue,
  clearable = false,
  placeholder,
  containerClassName,
  selectedValue,
  empty = "Not available.",
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
      {(props) => (
        <ComboboxDrawer
          selectedValue={selectedValue}
          empty={empty}
          {...props}
        />
      )}
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
  selectedValue,
  empty = "Not Available.",
}: ComboboxDrawerProps) {
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
              aria-selected={highlightedIndex === index}
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
                selectedValue === option.value
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
        <li className="py-2 text-center text-gray-500">{empty}</li>
      )}
    </ul>
  );
}
