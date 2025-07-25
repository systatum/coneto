import {
  forwardRef,
  KeyboardEvent,
  Ref,
  useEffect,
  useMemo,
  useState,
} from "react";

import { DrawerProps, OptionsProps, Selectbox } from "./selectbox";
import { cn } from "./../lib/utils";
import { RemixiconComponentType } from "@remixicon/react";

export type ComboboxProps = Partial<BaseComboboxProps> & {
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClick?: () => void;
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
  strict?: boolean;
  actions?: ComboboxActionProps[];
}

export interface ComboboxActionProps {
  onClick?: () => void;
  icon?: RemixiconComponentType;
  title: string;
  className?: string;
}

type ComboboxDrawerProps = Omit<DrawerProps, "refs"> &
  BaseComboboxProps & {
    refs?: {
      setFloating?: Ref<HTMLUListElement>;
      reference?: Ref<HTMLElement> & { current?: HTMLElement | null };
    };
  };

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
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
      inputValue,
      strict,
      actions,
      onKeyDown,
      onClick,
    },
    ref
  ) => {
    return (
      <div
        className={cn(`flex w-full flex-col gap-2 text-xs`, containerClassName)}
      >
        {label && <label>{label}</label>}
        <Selectbox
          ref={ref}
          highlightOnMatch={highlightOnMatch}
          containerClassName={containerClassName}
          options={options}
          inputValue={inputValue}
          setInputValue={setInputValue}
          placeholder={placeholder}
          clearable={clearable}
          strict={strict}
          onKeyDown={onKeyDown}
        >
          {(props) => (
            <ComboboxDrawer
              {...props}
              emptySlate={emptySlate}
              actions={actions}
              onClick={onClick}
            />
          )}
        </Selectbox>

        {showError && <span className="text-red-600">{errorMessage}</span>}
      </div>
    );
  }
);

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
  actions,
  onClick,
  emptySlate = "Not Available.",
}: ComboboxDrawerProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === inputValue.value),
    [options, inputValue.value]
  );

  useEffect(() => {
    if (!hasScrolled && inputValue?.value != null && options.length > 0) {
      const selectedEl = listRef.current[selectedIndex];
      if (selectedEl) {
        requestAnimationFrame(() => {
          selectedEl.scrollIntoView({ block: "center" });
        });
        setHasScrolled(true);
      }
    }
  }, [selectedIndex]);

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
      {actions && (
        <div className="flex flex-col w-full">
          {actions.map((data, index) => (
            <div
              key={index}
              onMouseEnter={() => {
                setHighlightedIndex(null);
              }}
              onClick={() => {
                if (data.onClick) {
                  data.onClick();
                }
                setIsOpen(false);
              }}
              className={cn(
                "flex flex-row relative hover:bg-blue-100 w-full items-center cursor-pointer px-3 py-2 gap-2",
                data.className
              )}
            >
              <div>{data.title}</div>
              {data.icon && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2">
                  <data.icon size={16} />
                </span>
              )}
            </div>
          ))}
          <div
            aria-label="divider"
            className="w-full h-px border-b my-[2px] border-gray-300"
          ></div>
        </div>
      )}
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
                if (onClick) {
                  onClick();
                }
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

export { Combobox };
