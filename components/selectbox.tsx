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
  forwardRef,
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
import styled, { css, CSSProp } from "styled-components";

export interface SelectboxProps {
  options?: OptionsProps[];
  selectionOptions?: string[];
  setSelectionOptions?: (data: string[]) => void;
  placeholder?: string;
  iconOpened?: RemixiconComponentType;
  iconClosed?: RemixiconComponentType;
  type?: "calendar" | "default";
  clearable?: boolean;
  containerStyle?: CSSProp;
  selectboxStyle?: CSSProp;
  highlightOnMatch?: boolean;
  strict?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  multiple?: boolean;
  actions?: any[];
  children?: (
    props: DrawerProps & {
      options: OptionsProps[];
      handleKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
      selectionOptionsLocal: OptionsProps;
      setSelectionOptionsLocal: (value: OptionsProps) => void;
      setHasInteracted?: (value: boolean) => void;
      ref?: Ref<HTMLInputElement>;
    }
  ) => ReactNode;
}

export interface DrawerProps {
  highlightedIndex: number | null;
  setHighlightedIndex: (index: number | null) => void;
  setIsOpen: (open: boolean) => void;
  multiple?: boolean;
  getFloatingProps: (
    userProps?: HTMLAttributes<HTMLUListElement>
  ) => HTMLAttributes<HTMLUListElement>;
  refs: { setFloating: Ref<HTMLUListElement>; setReference: Ref<HTMLElement> };
  floatingStyles: CSSProperties;
  listRef: MutableRefObject<(HTMLLIElement | null)[]>;
  isOpen: boolean;
  style?: CSSProp;
  onClick?: () => void;
}

export interface OptionsProps {
  text: string;
  value: string;
}

const Selectbox = forwardRef<HTMLInputElement, SelectboxProps>(
  (
    {
      setSelectionOptions,
      selectionOptions,
      options = [],
      placeholder,
      children,
      type = "default",
      iconOpened: IconOpened = RiArrowDownSLine,
      iconClosed: IconClosed = RiArrowUpSLine,
      clearable = false,
      containerStyle,
      highlightOnMatch,
      strict,
      onKeyDown,
      onClick,
      selectboxStyle,
      multiple,
      actions,
    },
    ref
  ) => {
    const initialState: OptionsProps = { text: "", value: "0" };
    const [selectionOptionsLocal, setSelectionOptionsLocal] =
      useState<OptionsProps>(initialState);

    useEffect(() => {
      if (selectionOptions?.length > 0) {
        setSelectionOptionsLocal({
          text: String(selectionOptions[0]),
          value: String(selectionOptions[0]),
        });
      } else {
        setSelectionOptionsLocal(initialState);
      }
    }, [selectionOptions]);

    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(0);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [confirmedValue, setConfirmedValue] = useState<OptionsProps | null>(
      null
    );

    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<(HTMLLIElement | null)[]>([]);

    const FILTERED_OPTIONS = hasInteracted
      ? options.filter((opt) =>
          opt.text
            .toLowerCase()
            .includes(selectionOptionsLocal.text.toLowerCase())
        )
      : options;

    const activeValue = selectionOptionsLocal.text;
    const FILTERED_ACTIVE = options.some((opt) => opt.text === activeValue);

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
      setHasInteracted(true);
      let value = e.target.value;
      if (type === "calendar") {
        value = value.replace(/\D/g, "");
        if (value.length > 2 && value.length <= 4) {
          value = value.slice(0, 2) + "/" + value.slice(2);
        } else if (value.length > 4) {
          value =
            value.slice(0, 2) +
            "/" +
            value.slice(2, 4) +
            "/" +
            value.slice(4, 8);
        }
      }
      setSelectionOptionsLocal({ ...selectionOptionsLocal, text: value });
      setIsOpen(value.length > 0);
      setHighlightedIndex(0);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);

      const totalItems = (actions?.length ?? 0) + FILTERED_OPTIONS.length - 1;

      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !isOpen) {
        setIsOpen(true);
        e.preventDefault();
        return;
      }

      if (e.key === "ArrowDown") {
        if (highlightedIndex < totalItems) {
          setHighlightedIndex(highlightedIndex + 1);
        }
        e.preventDefault();
      }

      if (e.key === "ArrowUp") {
        if (highlightedIndex > 0) {
          setHighlightedIndex(highlightedIndex - 1);
        }
        e.preventDefault();
      }
      if (e.key === "Enter") {
        if (highlightedIndex !== null) {
          if (highlightedIndex < (actions?.length || 0)) {
            actions?.[highlightedIndex]?.onClick?.();
            setIsOpen(false);
          } else {
            const selectedOption =
              FILTERED_OPTIONS[highlightedIndex - (actions?.length ?? 0)];

            if (selectedOption) {
              if (multiple) {
                setSelectionOptions(
                  selectionOptions.includes(selectedOption.value)
                    ? selectionOptions.filter((v) => v !== selectedOption.value)
                    : [...selectionOptions, selectedOption.value]
                );
              } else {
                setSelectionOptions([selectedOption.value]);
                setSelectionOptionsLocal(selectedOption);
                setIsOpen(false);
              }
            }
          }
        }
      }

      if (e.key === "Escape") {
        setIsOpen(false);
        setHasInteracted(false);
      }
    };

    useEffect(() => {
      if (isOpen && listRef.current[highlightedIndex]) {
        listRef.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex, isOpen]);

    const contentMultiple = selectionOptions
      .map((val) => options.find((o) => o.value === val)?.text)
      .filter(Boolean)
      .join(", ");

    const inputValue = multiple ? contentMultiple : selectionOptionsLocal.text;

    return (
      <Container
        onBlur={() => {
          setIsHovered(false);
        }}
        role="combobox"
        $style={containerStyle}
        aria-expanded={isOpen}
        onClick={() => {
          if (multiple) inputRef.current?.focus();
        }}
      >
        <Input
          $style={selectboxStyle}
          {...getReferenceProps()}
          data-type="selectbox"
          $clearable={clearable}
          ref={(el) => {
            refs.setReference(el);
            if (!multiple) {
              inputRef.current = el;
            }
            if (typeof ref === "function") ref(el);
            else if (ref)
              (ref as MutableRefObject<HTMLInputElement | null>).current = el;
          }}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          readOnly={multiple}
          onFocus={() => {
            if (type === "calendar" || selectionOptionsLocal) setIsOpen(true);
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setIsHovered(false);
            setHasInteracted(false);

            if (strict) {
              const matched = options.find(
                (opt) => opt.text === selectionOptionsLocal.text
              );
              if (matched) {
                setConfirmedValue(matched);
                setSelectionOptionsLocal(matched);
                if (multiple) {
                  setSelectionOptions?.(
                    selectionOptions.includes(matched.value)
                      ? selectionOptions.filter((val) => val !== matched.value)
                      : [...selectionOptions, matched.value]
                  );
                } else {
                  setSelectionOptions?.([matched.value]);
                }
              } else if (confirmedValue) {
                setSelectionOptionsLocal(confirmedValue);
                if (multiple) {
                  setSelectionOptions?.(
                    selectionOptions.includes(confirmedValue.value)
                      ? selectionOptions.filter(
                          (val) => val !== confirmedValue.value
                        )
                      : [...selectionOptions, confirmedValue.value]
                  );
                } else {
                  setSelectionOptions?.([confirmedValue.value]);
                }
              } else {
                const empty = { text: "", value: "0" };
                setSelectionOptionsLocal(empty);
              }
            }
          }}
          placeholder={placeholder || "Search your item..."}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          $focused={isFocused && !multiple}
          $hovered={isHovered && !multiple}
          $highlight={highlightOnMatch && FILTERED_ACTIVE}
        />

        {clearable && selectionOptions.length !== 0 && (
          <>
            <ClearIcon
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label="clearable-content"
              onClick={() => {
                setSelectionOptions?.([]);
                setSelectionOptionsLocal({ text: "", value: "0" });
                setHasInteracted(false);
              }}
              $highlight={highlightOnMatch && FILTERED_ACTIVE}
              size={16}
            />
            <Divider
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label="divider"
            />
          </>
        )}

        <IconWrapper
          onClick={async () => {
            await setIsOpen((prev) => {
              const newState = !prev;
              if (newState && inputRef.current) inputRef.current?.focus();
              return newState;
            });
            if (multiple) {
              await inputRef.current?.focus();
            }
          }}
        >
          {isOpen ? (
            <IconOpened
              size={18}
              color={highlightOnMatch && isFocused ? "#61a9f9" : "#9ca3af"}
            />
          ) : (
            <IconClosed
              onMouseEnter={() => setIsHovered(true)}
              size={18}
              color={
                highlightOnMatch && FILTERED_ACTIVE ? "#61a9f9" : "#9ca3af"
              }
            />
          )}
        </IconWrapper>

        {isOpen &&
          children?.({
            isOpen,
            options: FILTERED_OPTIONS,
            highlightedIndex,
            setHighlightedIndex,
            setSelectionOptionsLocal,
            selectionOptionsLocal,
            onClick,
            setIsOpen,
            getFloatingProps,
            refs,
            floatingStyles,
            listRef,
            setHasInteracted,
            handleKeyDown,
            ref: multiple ? inputRef : undefined,
          })}
      </Container>
    );
  }
);

const Container = styled.div<{ $style?: CSSProp }>`
  position: relative;
  width: 100%;
  font-size: 12px;
  ${({ $style }) => $style}
`;

const Input = styled.input<{
  $highlight?: boolean;
  $focused?: boolean;
  $hovered?: boolean;
  $style?: CSSProp;
  $clearable?: boolean;
}>`
  width: 100%;
  border-radius: 2px;
  border: 1px solid #f3f4f6;
  padding: 0.5rem 0.75rem;
  outline: none;
  padding-right: ${({ $clearable }) => ($clearable ? "50px" : "24px")};

  ${({ $focused }) =>
    $focused &&
    css`
      border-color: #61a9f9;
    `}

  ${({ $highlight, $hovered }) =>
    ($highlight || $hovered) &&
    css`
      border-color: #61a9f9;
    `}
  ${({ $style }) => $style}
`;

const ClearIcon = styled(RiCloseLine)<{ $highlight?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 36px;
  z-index: 20;
  cursor: pointer;
  color: ${({ $highlight }) => ($highlight ? "#fff" : "#9ca3af")};
  background-color: ${({ $highlight }) =>
    $highlight ? "#61a9f9" : "transparent"};
  border-radius: 2px;
  padding: 2px;

  &&:hover {
    background-color: #e5e7eb !important;
  }
`;

const Divider = styled.span`
  position: absolute;
  top: 50%;
  right: 31px;
  transform: translateY(-50%);
  width: 1px;
  min-height: 15px;
  border-right: 1px solid #9ca3af;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  cursor: pointer;
`;

export { Selectbox };
