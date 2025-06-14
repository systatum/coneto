import { Ref, useEffect } from "react";
import { DrawerProps, OptionsProps, Selectbox } from "./selectbox";
import { cn } from "./../lib/utils";

export type ComboboxProps = Partial<BaseComboboxProps> & {
  label?: string;
  showError?: boolean;
  errorMessage?: string;
};

interface BaseComboboxProps {
  options: OptionsProps[];
  containerClassName?: string;
  inputValue: OptionsProps;
  setInputValue: (data: OptionsProps) => void;
  clearable?: boolean;
  placeholder?: string;
  emptySlate?: string;
  highlightOnMatch?: boolean;
}

type ComboboxDrawerProps = Omit<DrawerProps, "refs"> &
  BaseComboboxProps & {
    refs?: {
      setFloating?: Ref<HTMLUListElement>;
      reference?: Ref<HTMLElement> & { current?: HTMLElement | null };
    };
  };

export default function Combobox({
  options,
  setInputValue,
  clearable = false,
  placeholder,
  containerClassName,
  highlightOnMatch = false,
  emptySlate = "Not available.",
  errorMessage,
  label,
  showError,
}: ComboboxProps) {
  return (
    <div className={cn(`flex w-full flex-col gap-2 text-xs`)}>
      {label && <label>{label}</label>}
      <div className="flex flex-col gap-1 text-xs"></div>
      <Selectbox
        highlightOnMatch={highlightOnMatch}
        containerClassName={containerClassName}
        options={options}
        setInputValue={setInputValue}
        placeholder={placeholder}
        clearable={clearable}
      >
        {(props) => <ComboboxDrawer emptySlate={emptySlate} {...props} />}
      </Selectbox>

      {showError && <span className="text-red-600">{errorMessage}</span>}
    </div>
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
