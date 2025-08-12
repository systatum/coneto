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
  inputValue?: OptionsProps;
  setInputValue?: (data: OptionsProps) => void;
  placeholder?: string;
  iconOpened?: RemixiconComponentType;
  iconClosed?: RemixiconComponentType;
  type?: "calendar" | "default";
  clearable?: boolean;
  containerStyle?: CSSProp;
  highlightOnMatch?: boolean;
  strict?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClick?: () => void;
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
  style?: CSSProp;
  onClick?: () => void;
}

export interface OptionsProps {
  text: string;
  value?: string | number;
}

const Selectbox = forwardRef<HTMLInputElement, SelectboxProps>(
  (
    {
      setInputValue,
      inputValue,
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
    },
    ref
  ) => {
    const selectboxState = inputValue || { text: "", value: 0 };
    const [inputValueLocal, setInputValueLocal] =
      useState<OptionsProps>(selectboxState);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
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
      setInputValue?.({ ...inputValue, text: value });
      setInputValueLocal({ ...inputValueLocal, text: value });
      setIsOpen(value.length > 0);
      setHighlightedIndex(0);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        setHighlightedIndex((prev) =>
          Math.min(prev + 1, FILTERED_OPTIONS.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = FILTERED_OPTIONS[highlightedIndex];
        if (selected) {
          setInputValue?.(selected);
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

    return (
      <Container role="combobox" $style={containerStyle} aria-expanded={isOpen}>
        <Input
          {...getReferenceProps()}
          data-type="selectbox"
          ref={(el) => {
            refs.setReference(el);
            inputRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref)
              (ref as MutableRefObject<HTMLInputElement | null>).current = el;
          }}
          type="text"
          value={inputValue ? inputValue.text : inputValueLocal.text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (type === "calendar" || inputValueLocal) setIsOpen(true);
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            if (strict) {
              const matched = options.find(
                (opt) => opt.text === inputValueLocal.text
              );
              if (matched) {
                setConfirmedValue(matched);
                setInputValueLocal(matched);
                setInputValue?.(matched);
              } else if (confirmedValue) {
                setInputValueLocal(confirmedValue);
                setInputValue?.(confirmedValue);
              } else {
                const empty = { text: "", value: 0 };
                setInputValueLocal(empty);
                setInputValue?.(empty);
              }
            }
          }}
          placeholder={placeholder || "Search your item..."}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          $focused={isFocused}
          $hovered={isHovered}
          $highlight={highlightOnMatch && FILTERED_ACTIVE.length > 0}
        />

        {clearable && inputValueLocal.text !== "" && (
          <>
            <ClearIcon
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label="clearable-content"
              onClick={() => {
                setInputValue?.({ text: "", value: 0 });
                setInputValueLocal({ text: "", value: 0 });
                setIsOpen(false);
                setHasInteracted(false);
              }}
              $highlight={highlightOnMatch && FILTERED_ACTIVE.length > 0}
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
          onClick={() => {
            setIsOpen((prev) => {
              const newState = !prev;
              if (newState && inputRef.current) inputRef.current.focus();
              return newState;
            });
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
                highlightOnMatch && FILTERED_ACTIVE.length > 0
                  ? "#61a9f9"
                  : "#9ca3af"
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
            setInputValue: (e) => {
              setInputValueLocal(e);
              setInputValue?.(e);
            },
            inputValue: inputValue || inputValueLocal,
            onClick,
            setIsOpen,
            getFloatingProps,
            refs,
            floatingStyles,
            listRef,
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
}>`
  width: 100%;
  border-radius: 2px;
  border: 1px solid #f3f4f6;
  padding: 0.5rem 0.75rem;
  outline: none;

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
