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
  InputHTMLAttributes,
  useMemo,
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
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCloseLine,
} from "@remixicon/react";
import styled, { css, CSSProp } from "styled-components";
import { isValidDateString } from "../lib/date";
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";
import { FigureProps } from "./figure";
import { StatefulForm } from "./stateful-form";
import { LoadingSpinner } from "./loading-spinner";

export type SelectboxSelectedOptions = number | string | number[] | string[];

interface BaseSelectboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "children"> {
  options?: OptionsProps[];
  selectedOptions?: SelectboxSelectedOptions;
  onChange?: (selectedOptions: SelectboxSelectedOptions) => void;
  placeholder?: string;
  iconOpened?: FigureProps["image"];
  iconClosed?: FigureProps["image"];
  type?: "calendar" | "default";
  clearable?: boolean;
  highlightOnMatch?: boolean;
  strict?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  multiple?: boolean;
  actions?: any[];
  id?: string;
  showError?: boolean;
  maxSelectableItems?: number | undefined;
  isLoading?: boolean;
  children?: (
    props: DrawerProps &
      InteractionModeProps & {
        options: OptionsProps[];
        handleKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
        selectedOptionsLocal: OptionsProps;
        setSelectedOptionsLocal: (value: OptionsProps) => void;
        setHasInteracted?: (value: boolean) => void;
        ref?: Ref<HTMLInputElement>;
        setConfirmedValue?: (option: OptionsProps | null) => void;
      }
  ) => ReactNode;
  styles?: SelectboxStylesProps;
  labels?: SelectboxLabelsProps;
}

export interface SelectboxLabelsProps {
  loadingText?: string;
}

interface BaseSelectboxStylesProps {
  selectboxStyle?: CSSProp;
  self?: CSSProp;
}

export interface SelectboxStylesProps
  extends FieldLaneStylesProps,
    BaseSelectboxStylesProps {}

export interface DrawerProps extends InteractionModeProps {
  highlightedIndex: number | null;
  setHighlightedIndex: (index: number | null) => void;
  setIsOpen: (open: boolean) => void;
  multiple?: boolean;
  getFloatingProps: (
    userProps?: HTMLAttributes<HTMLUListElement>
  ) => HTMLAttributes<HTMLUListElement>;
  refs: { setFloating: Ref<HTMLUListElement>; setReference: Ref<HTMLElement> };
  listRef: MutableRefObject<(HTMLLIElement | null)[]>;
  isOpen: boolean;
  floatingStyles: CSSProperties;
  onClick?: () => void;
}

interface InteractionModeProps {
  interactionMode: "keyboard" | "mouse";
  setInteractionMode: (props: "keyboard" | "mouse") => void;
}

export interface OptionsProps {
  text: string;
  render?: ReactNode;
  value: string | number;
}

const BaseSelectbox = forwardRef<HTMLInputElement, BaseSelectboxProps>(
  (
    {
      onChange,
      selectedOptions,
      options = [],
      placeholder,
      children,
      type = "default",
      iconOpened: IconOpened = RiArrowDownSLine,
      iconClosed: IconClosed = RiArrowUpSLine,
      clearable = false,
      highlightOnMatch,
      strict,
      onKeyDown,
      onClick,
      styles,
      multiple,
      actions,
      maxSelectableItems,
      showError,
      id,
      autoComplete = "off",
      isLoading,
      labels,
      disabled,
      ...props
    },
    ref
  ) => {
    const finalOptions = useMemo(
      () => (Array.isArray(options) ? options : []),
      [options]
    );

    const finalSelectedOptions = useMemo(() => {
      if (Array.isArray(selectedOptions)) {
        return selectedOptions.map(String);
      }
      if (selectedOptions != null) {
        return [String(selectedOptions)];
      }
      return [];
    }, [selectedOptions]);

    const initialState = useMemo(
      () =>
        finalOptions.find(
          (opt) => String(opt.value) === finalSelectedOptions?.[0]
        ) ?? {
          text: isValidDateString(finalSelectedOptions?.[0])
            ? finalSelectedOptions?.[0]
            : "",
          value: typeof selectedOptions === "number" ? 0 : "0",
        },
      [finalOptions, finalSelectedOptions, selectedOptions]
    );

    const handleOnChange = (values: string[]) => {
      if (!onChange) return;

      if (Array.isArray(selectedOptions)) {
        onChange(castValue(values, selectedOptions));
        return;
      }

      onChange(castValue(values[0], selectedOptions));
    };

    const [selectedOptionsLocal, setSelectedOptionsLocal] =
      useState<OptionsProps>(initialState);

    useEffect(() => {
      if (
        finalSelectedOptions?.length > 0 &&
        finalSelectedOptions[0] !== "" &&
        !multiple
      ) {
        setSelectedOptionsLocal(initialState);
      }
    }, [finalSelectedOptions, multiple, initialState]);

    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(0);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [interactionMode, setInteractionMode] = useState<
      "keyboard" | "mouse"
    >("mouse");

    const [confirmedValue, setConfirmedValue] = useState<OptionsProps | null>(
      null
    );

    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<(HTMLLIElement | null)[]>([]);

    const FILTERED_OPTIONS = hasInteracted
      ? finalOptions.filter((opt) =>
          opt.text
            .toLowerCase()
            .includes(selectedOptionsLocal.text.toLowerCase())
        )
      : finalOptions;

    const activeValue = selectedOptionsLocal.text;
    const FILTERED_ACTIVE = finalOptions.some(
      (opt) => opt.text === activeValue
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
        handleOnChange([value]);
      }
      setSelectedOptionsLocal({ ...selectedOptionsLocal, text: value });
      setIsOpen(value.length > 0);
      setHighlightedIndex(0);
    };

    const justCommittedRef = useRef(false);

    const commitOrRevert = (
      selectedOption?: OptionsProps,
      currentLocal: OptionsProps = selectedOptionsLocal,
      currentConfirmed: OptionsProps | null = confirmedValue
    ) => {
      if (selectedOption) {
        const val = String(selectedOption.value);
        setConfirmedValue(selectedOption);
        setSelectedOptionsLocal(selectedOption);
        handleOnChange?.([val]);
        setIsOpen(false);
        return;
      }

      const matched = finalOptions.find(
        (opt) => opt.text === currentLocal.text
      );

      if (matched) {
        const val = String(matched.value);
        setConfirmedValue(matched);
        setSelectedOptionsLocal(matched);
        handleOnChange?.([val]);
        setIsOpen(false);
        return;
      }

      if (currentConfirmed) {
        setSelectedOptionsLocal(currentConfirmed);
        handleOnChange?.([String(currentConfirmed.value)]);
        return;
      }

      setSelectedOptionsLocal({ text: "", value: "0" });
      handleOnChange?.([]);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);

      const totalItems = (actions?.length ?? 0) + FILTERED_OPTIONS.length - 1;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setInteractionMode("keyboard");

        if (!isOpen) {
          setIsOpen(true);
        }

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
          setHasInteracted(false);
        }

        if (
          highlightedIndex !== null &&
          highlightedIndex < (actions?.length || 0)
        ) {
          actions?.[highlightedIndex]?.onClick?.();
          setIsOpen(false);
          return;
        }

        const selectedOption =
          highlightedIndex !== null
            ? FILTERED_OPTIONS[highlightedIndex - (actions?.length ?? 0)]
            : undefined;

        if (multiple) {
          if (selectedOption) {
            const val = String(selectedOption.value);
            if (!finalSelectedOptions.includes(val)) {
              if (
                !maxSelectableItems ||
                finalSelectedOptions.length < maxSelectableItems
              ) {
                handleOnChange([...finalSelectedOptions, val]);
              }
            } else {
              handleOnChange(finalSelectedOptions.filter((v) => v !== val));
            }
          }
        } else {
          justCommittedRef.current = true;
          commitOrRevert(selectedOption, selectedOptionsLocal, confirmedValue);
        }
      }

      if (e.key === "Escape") {
        setIsOpen(false);
        setHasInteracted(false);
        setIsFocused(false);

        if (strict && confirmedValue) {
          setSelectedOptionsLocal(confirmedValue);
        }

        if (!isOpen) {
          inputRef.current?.blur();
        }
      }
    };

    useEffect(() => {
      if (isOpen && listRef.current[highlightedIndex]) {
        listRef.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex, isOpen]);

    useEffect(() => {
      if (!isOpen && multiple) {
        setSelectedOptionsLocal({
          text: "",
          value: "",
        });
      }
    }, [isOpen]);

    const multipleOptionsJoinedText = finalSelectedOptions
      ?.map((val) => finalOptions.find((o) => o.value === val)?.text)
      .filter(Boolean)
      .join(", ");

    const inputValue = multiple
      ? multipleOptionsJoinedText
      : selectedOptionsLocal.text;

    const isClearable =
      clearable &&
      (multiple
        ? finalSelectedOptions?.length
        : selectedOptionsLocal?.text.length) !== 0;

    const { loadingText = "Loading..." } = labels ?? {};

    return (
      <Container
        $isLoading={isLoading}
        onBlur={() => {
          if (!isLoading) setIsHovered(false);
        }}
        onMouseEnter={() => {
          if (!isLoading) setIsHovered(true);
        }}
        onMouseLeave={() => {
          if (!isLoading) setIsHovered(false);
        }}
        role="combobox"
        $style={styles?.selectboxStyle}
        aria-expanded={isOpen}
        $disabled={disabled}
        onClick={() => {
          if (multiple) inputRef.current?.focus();
        }}
      >
        {isLoading && (
          <LoadingSpinner
            styles={{
              containerStyle: css`
                position: absolute;
                margin-left: 10px;
                top: 50%;
                transform: translateY(-50%);
                gap: 6px;
                background-color: rgba(255, 255, 255, 0.6);
              `,
              labelStyle: css`
                font-size: 14px;
              `,
            }}
            label={loadingText}
          />
        )}
        <Input
          {...props}
          autoComplete={autoComplete}
          $style={styles?.self}
          {...getReferenceProps()}
          data-type="selectbox"
          $hasError={showError}
          aria-label={id}
          id={id}
          $clearable={clearable}
          disabled={disabled || isLoading}
          $disabled={disabled || isLoading}
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
          value={isLoading ? "" : inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          readOnly={multiple}
          onMouseDown={() => {
            if (strict) {
              if (!isOpen) {
                setIsOpen(true);
              }
            } else {
              if (!isOpen && !isFocused) {
                setIsOpen(true);
              }
            }
          }}
          onFocus={() => {
            if (type === "calendar" || selectedOptionsLocal) setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setHasInteracted(false);

            if (strict && !multiple) {
              if (justCommittedRef.current) {
                justCommittedRef.current = false;
                return;
              }
              commitOrRevert(undefined, selectedOptionsLocal, confirmedValue);
            }
          }}
          placeholder={isLoading ? "" : placeholder || "Search your item..."}
          $focused={isFocused && !multiple}
          $hovered={isHovered && !multiple}
          $highlight={highlightOnMatch && FILTERED_ACTIVE}
        />

        {isClearable && (
          <>
            <ClearIcon
              aria-label="clearable-content"
              onMouseDown={() => {
                handleOnChange?.([]);
                setSelectedOptionsLocal({ text: "", value: "0" });
                setConfirmedValue(null);
                setHasInteracted(false);
              }}
              $highlight={highlightOnMatch && FILTERED_ACTIVE}
              size={16}
            />
            <Divider aria-label="divider" />
          </>
        )}

        <IconWrapper
          aria-label="selectbox-opener"
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
            setConfirmedValue,
            setIsOpen,
            getFloatingProps,
            refs,
            floatingStyles,
            listRef,
            setHasInteracted,
            handleKeyDown,
            interactionMode,
            setInteractionMode,
            ref: multiple ? inputRef : undefined,
          })}
      </Container>
    );
  }
);

export interface SelectboxProps
  extends Omit<BaseSelectboxProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "actions" | "children"> {
  styles?: SelectboxStylesProps;
}

const Selectbox = forwardRef<HTMLInputElement, SelectboxProps>(
  ({ ...props }, ref) => {
    const {
      dropdowns,
      label,
      showError,
      styles,
      errorMessage,
      actions,
      type,
      helper,
      disabled,
      name,
      errorIconPosition,
      id,
      labelGap,
      labelWidth,
      labelPosition,
      ...rest
    } = props;
    const inputId = StatefulForm.sanitizeId({
      prefix: "selectbox",
      name,
      id,
    });

    return (
      <FieldLane
        id={inputId}
        labelGap={labelGap}
        labelWidth={labelWidth}
        labelPosition={labelPosition}
        dropdowns={dropdowns}
        showError={showError}
        errorMessage={errorMessage}
        label={label}
        type={type}
        helper={helper}
        disabled={disabled}
        errorIconPosition={errorIconPosition}
        required={rest.required}
        styles={{
          bodyStyle: styles?.bodyStyle,
          controlStyle: styles?.controlStyle,
          containerStyle: styles?.containerStyle,
          labelStyle: styles?.labelStyle,
        }}
      >
        <BaseSelectbox
          {...rest}
          id={inputId}
          actions={actions}
          showError={showError}
          disabled={disabled}
          styles={{
            self: css`
              ${dropdowns &&
              css`
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
              `}
              ${styles?.self}
            `,
          }}
          type={type}
          ref={ref}
        />
      </FieldLane>
    );
  }
);

export function castValue<T extends SelectboxSelectedOptions>(
  value: any,
  original: T
): T {
  if (Array.isArray(original)) {
    if (Array.isArray(value)) {
      return value.map((v) =>
        typeof original[0] === "number" ? Number(v) : String(v)
      ) as T;
    }
    return [value] as T;
  }

  if (typeof original === "number") {
    return Number(value) as T;
  }

  return String(value) as T;
}

const Container = styled.div<{
  $style?: CSSProp;
  $isLoading?: boolean;
  $disabled?: boolean;
}>`
  position: relative;
  width: 100%;
  font-size: 12px;

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      user-select: none;
      pointer-events: none;
      opacity: 0.5;
    `};

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      user-select: none;
      pointer-events: none;
    `};

  ${({ $style }) => $style}
`;

const Input = styled.input<{
  $highlight?: boolean;
  $focused?: boolean;
  $hovered?: boolean;
  $style?: CSSProp;
  $clearable?: boolean;
  $hasError?: boolean;
  $disabled?: boolean;
}>`
  width: 100%;
  border-radius: 2px;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  outline: none;
  height: 34px;
  padding-right: ${({ $clearable }) => ($clearable ? "50px" : "24px")};

  ${({ $highlight, $hovered, $hasError, $focused }) =>
    $hasError
      ? css`
          border-color: #ef4444;
        `
      : $highlight || $hovered || $focused
        ? css`
            border-color: #61a9f9;
          `
        : css`
            border-color: #d1d5db;
          `};

  ${({ $disabled }) =>
    $disabled &&
    css`
      user-select: none;
      pointer-events: none;
      background-color: rgba(255, 255, 255, 0.6);
    `};

  &:focus {
    border-color: #61a9f9;
    box-shadow: 0 0 0 1px #61a9f9;
  }

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
