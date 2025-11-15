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
import { isValidDateString } from "./../constants/valid-date";

export interface SelectboxProps {
  options?: OptionsProps[];
  selectedOptions?: string[];
  setSelectedOptions?: (data: string[]) => void;
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
  maxSelectableItems?: number | undefined;
  children?: (
    props: DrawerProps & {
      options: OptionsProps[];
      handleKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
      selectedOptionsLocal: OptionsProps;
      setSelectedOptionsLocal: (value: OptionsProps) => void;
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
  render?: ReactNode;
  value: string;
}

const Selectbox = forwardRef<HTMLInputElement, SelectboxProps>(
  (
    {
      setSelectedOptions,
      selectedOptions,
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
      maxSelectableItems,
    },
    ref
  ) => {
    const initialState = options.find(
      (opt) => opt.value === selectedOptions?.[0]
    ) ?? {
      text: isValidDateString(selectedOptions?.[0]) ? selectedOptions?.[0] : "",
      value: "0",
    };

    const [selectedOptionsLocal, setSelectedOptionsLocal] =
      useState<OptionsProps>(initialState);

    useEffect(() => {
      if (selectedOptions?.length > 0 && !multiple) {
        setSelectedOptionsLocal(initialState);
      }
    }, [selectedOptions, multiple]);

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
            .includes(selectedOptionsLocal.text.toLowerCase())
        )
      : options;

    const activeValue = selectedOptionsLocal.text;
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
        setSelectedOptions([value]);
      }
      setSelectedOptionsLocal({ ...selectedOptionsLocal, text: value });
      setIsOpen(value.length > 0);
      setHighlightedIndex(0);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);

      const totalItems = (actions?.length ?? 0) + FILTERED_OPTIONS.length - 1;

      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !isOpen) {
        setIsOpen(true);
        e.preventDefault();
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
        if (!multiple) {
          const matched = options.find(
            (opt) => opt.text === selectedOptionsLocal.text
          );
          setHasInteracted(false);
          setConfirmedValue(matched);
        }
        if (highlightedIndex !== null) {
          if (highlightedIndex < (actions?.length || 0)) {
            actions?.[highlightedIndex]?.onClick?.();
            setIsOpen(false);
          } else {
            const selectedOption =
              FILTERED_OPTIONS[highlightedIndex - (actions?.length ?? 0)];

            if (multiple) {
              if (!selectedOptions.includes(selectedOption.value)) {
                if (
                  !maxSelectableItems ||
                  selectedOptions.length < maxSelectableItems
                ) {
                  setSelectedOptions([
                    ...selectedOptions,
                    selectedOption.value,
                  ]);
                }
              } else {
                setSelectedOptions(
                  selectedOptions.filter((val) => val !== selectedOption.value)
                );
              }
            } else {
              setSelectedOptions([selectedOption.value]);
              setSelectedOptionsLocal(selectedOption);
              setIsOpen(false);
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

    const multipleOptionsJoinedText = selectedOptions
      ?.map((val) => options.find((o) => o.value === val)?.text)
      .filter(Boolean)
      .join(", ");

    const inputValue = multiple
      ? multipleOptionsJoinedText
      : selectedOptionsLocal.text;

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
            if (type === "calendar" || selectedOptionsLocal) setIsOpen(true);
            setIsFocused(true);
          }}
          onMouseOver={() => {
            if (multiple) {
              setSelectedOptionsLocal({
                text: "",
                value: "",
              });
            }
          }}
          onBlur={() => {
            setIsFocused(false);
            setIsHovered(false);
            setHasInteracted(false);

            if (strict) {
              const matched = options.find(
                (opt) => opt.text === selectedOptionsLocal.text
              );
              if (matched) {
                setConfirmedValue(matched);
                setSelectedOptionsLocal(matched);
                if (multiple) {
                  setSelectedOptions?.(
                    selectedOptions?.includes(matched.value)
                      ? selectedOptions.filter((val) => val !== matched.value)
                      : [...selectedOptions, matched.value]
                  );
                } else {
                  setSelectedOptions?.([matched.value]);
                }
              } else if (confirmedValue) {
                setSelectedOptionsLocal(confirmedValue);
                if (multiple) {
                  setSelectedOptions?.(
                    selectedOptions?.includes(confirmedValue.value)
                      ? selectedOptions.filter(
                          (val) => val !== confirmedValue.value
                        )
                      : [...selectedOptions, confirmedValue.value]
                  );
                } else {
                  setSelectedOptions?.([confirmedValue.value]);
                }
              } else {
                const empty = { text: "", value: "0" };
                setSelectedOptionsLocal(empty);
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

        {clearable && selectedOptions?.length !== 0 && (
          <>
            <ClearIcon
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label="clearable-content"
              onClick={() => {
                setSelectedOptions?.([]);
                setSelectedOptionsLocal({ text: "", value: "0" });
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
            setSelectedOptionsLocal,
            selectedOptionsLocal,
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
