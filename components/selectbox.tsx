import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  ReactNode,
  HTMLAttributes,
  MutableRefObject,
  Ref,
  CSSProperties,
} from "react";
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
import {
  RemixiconComponentType,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCloseLine,
} from "@remixicon/react";
import { cn } from "./../lib/utils";

export interface OptionsProps {
  text: string;
  value?: string | number;
}

export interface FloatingUIProps {
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  setIsOpen: (open: boolean) => void;
  getFloatingProps: (
    userProps?: HTMLAttributes<HTMLUListElement>
  ) => HTMLAttributes<HTMLUListElement>;
  refs: { setFloating: Ref<HTMLUListElement>; setReference: Ref<HTMLElement> };
  floatingStyles: CSSProperties;
  listRef: MutableRefObject<(HTMLLIElement | null)[]>;
  isOpen: boolean;
  className?: string;
}

export interface SelectboxProps {
  options?: OptionsProps[];
  inputValue?: OptionsProps;
  setInputValue?: (data: OptionsProps) => void;
  placeholder?: string;
  iconOpened?: RemixiconComponentType;
  iconClosed?: RemixiconComponentType;
  type?: "calendar" | "default";
  clearable?: boolean;
  containerClassName?: string;
  children?: (
    props: FloatingUIProps & {
      options: OptionsProps[];
      inputValue: OptionsProps;
      setInputValue: (value: OptionsProps) => void;
    }
  ) => ReactNode;
}

export function Selectbox({
  setInputValue,
  inputValue,
  options = [],
  placeholder,
  children,
  type = "default",
  iconOpened: IconOpened = RiArrowDownSLine,
  iconClosed: IconClosed = RiArrowUpSLine,
  clearable = false,
  containerClassName,
}: SelectboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<(HTMLLIElement | null)[]>([]);

  const FILTERED_OPTIONS = hasInteracted
    ? options.filter((opt) =>
        opt.text.toLowerCase().includes(inputValue.text.toLowerCase())
      )
    : options;

  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-start" as Placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const { getFloatingProps, getReferenceProps } = useInteractions([dismiss]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHasInteracted?.(true);
    let value = e.target.value;
    if (type === "calendar") {
      value = value.replace(/\D/g, "");

      if (value.length > 2 && value.length <= 4) {
        value = value.slice(0, 2) + "/" + value.slice(2);
      } else if (value.length > 4) {
        value =
          value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4, 8);
      }
    }

    setInputValue({ ...inputValue, text: value });

    setIsOpen(value.length > 0);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
        setHasInteracted(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHasInteracted(false);
    }
  };

  useEffect(() => {
    if (isOpen && listRef.current[highlightedIndex]) {
      listRef.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  const selectBoxClass = cn(
    "relative w-full text-xs ring-0",
    containerClassName
  );

  return (
    <div
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-owns="combo-list"
      aria-controls="combo-list"
      aria-activedescendant={`option-${highlightedIndex}`}
      className={selectBoxClass}
    >
      <input
        {...getReferenceProps()}
        ref={(el) => {
          refs.setReference(el);
          inputRef.current = el;
        }}
        type="text"
        value={inputValue.text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (type === "calendar") {
            setIsOpen(true);
          } else if (inputValue) {
            setIsOpen(true);
          }
        }}
        aria-autocomplete="list"
        placeholder={placeholder || "Search your item..."}
        className="w-full rounded-xs border border-gray-100 px-3 py-2 outline-none focus:border-[#61A9F9] focus:ring-0 focus:ring-[#61A9F9]"
      />

      {clearable && inputValue.text !== "" && (
        <>
          <RiCloseLine
            onClick={() => {
              setInputValue({
                text: "",
                value: 0,
              });
              setIsOpen(false);
              setHasInteracted(false);
            }}
            size={12}
            className="absolute top-[11px] z-20 right-9 cursor-pointer text-gray-400"
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
          <IconOpened
            size={18}
            className="absolute text-gray-400 top-2 right-2"
          />
        ) : (
          <IconClosed
            size={18}
            className="absolute text-gray-400 top-2 right-2"
          />
        )}
      </div>

      {isOpen &&
        children?.({
          isOpen,
          options: FILTERED_OPTIONS,
          highlightedIndex,
          setHighlightedIndex,
          setInputValue,
          inputValue,
          setIsOpen,
          getFloatingProps,
          refs,
          floatingStyles,
          listRef,
        })}
    </div>
  );
}
