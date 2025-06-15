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
  childClassName?: string;
  highlightOnMatch?: boolean;
  children?: (
    props: DrawerProps & {
      options: OptionsProps[];
      inputValue: OptionsProps;
      setInputValue: (value: OptionsProps) => void;
    }
  ) => ReactNode;
}

export interface DrawerProps {
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

export interface OptionsProps {
  text: string;
  value?: string | number;
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
  highlightOnMatch,
}: SelectboxProps) {
  const [inputValueLocal, setInputValueLocal] = useState<OptionsProps>(
    inputValue
      ? inputValue
      : {
          text: "",
          value: 0,
        }
  );

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<(HTMLLIElement | null)[]>([]);

  const FILTERED_OPTIONS = hasInteracted
    ? options.filter((opt) =>
        opt.text.toLowerCase().includes(inputValueLocal.text.toLowerCase())
      )
    : options;

  const FILTERED_ACTIVE = options.filter(
    (opt) => opt.text === inputValueLocal.text
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
    if (setInputValue) {
      setInputValue({ ...inputValue, text: value });
    }
    setInputValueLocal({ ...inputValueLocal, text: value });

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
        if (setInputValue) {
          setInputValue?.(selected);
        }
        setInputValueLocal(selected);
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
        value={inputValue ? inputValue.text : inputValueLocal.text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => {
          if (type === "calendar") {
            setIsOpen(true);
          } else if (inputValueLocal) {
            setIsOpen(true);
          }
          setIsFocused(true);
        }}
        onBlur={() => setIsFocused(false)}
        aria-autocomplete="list"
        placeholder={placeholder || "Search your item..."}
        className={cn(
          "w-full rounded-xs border border-gray-100 px-3 py-2 outline-none",
          isFocused &&
            "focus:border-[#61A9F9] focus:ring-0 focus:ring-[#61A9F9]",
          isHovered && "border-blue-200",
          highlightOnMatch &&
            FILTERED_ACTIVE.length > 0 &&
            "border-[#61A9F9] hover:border-[#61A9F9]"
        )}
      />

      {clearable && inputValueLocal.text !== "" && (
        <>
          <RiCloseLine
            onClick={() => {
              if (setInputValue) {
                setInputValue({
                  text: "",
                  value: 0,
                });
              }
              setInputValueLocal({
                text: "",
                value: 0,
              });
              setIsOpen(false);
              setHasInteracted(false);
            }}
            size={12}
            className={cn(
              "absolute top-[11px] z-20 right-9 hover:bg-gray-200 hover:rounded-xs cursor-pointer text-gray-400",
              highlightOnMatch &&
                FILTERED_ACTIVE.length > 0 &&
                "bg-[#61A9F9] text-white"
            )}
          />
          <span
            aria-label="divider"
            className="absolute top-1/2 -translate-y-1/2 border-r border-gray-400 min-h-[15px] w-px right-[31px] font-extralight text-xs text-gray-400"
          ></span>
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
            className={cn(
              "absolute text-gray-400 top-1/2 -translate-1/2 right-0.5",
              highlightOnMatch && isFocused && "text-[#61A9F9]",
              highlightOnMatch && FILTERED_ACTIVE.length > 0 && "text-[#61A9F9]"
            )}
          />
        ) : (
          <IconClosed
            onMouseEnter={() => setIsHovered(true)}
            size={18}
            className={cn(
              "absolute text-gray-400 top-1/2 -translate-1/2 right-0.5",
              isHovered && highlightOnMatch && FILTERED_ACTIVE.length > 0
                ? "hover:text-[#61A9F9]"
                : "",
              highlightOnMatch && FILTERED_ACTIVE.length > 0 && "text-[#61A9F9]"
            )}
          />
        )}
      </div>

      {isOpen &&
        children?.({
          isOpen,
          options: FILTERED_OPTIONS,
          highlightedIndex,
          setHighlightedIndex,
          setInputValue: (e) => {
            setInputValueLocal(e);
            if (setInputValue) {
              setInputValue(e);
            }
          },
          inputValue: inputValueLocal,
          setIsOpen,
          getFloatingProps,
          refs,
          floatingStyles,
          listRef,
        })}
    </div>
  );
}
