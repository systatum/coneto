import styled, { css, CSSProp } from "styled-components";
import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "./button";
import { List } from "./list";
import {
  FieldLane,
  FieldLaneDropdownOption,
  FieldLaneProps,
  FieldLaneStyles,
} from "./field-lane";
import { StatefulForm } from "./stateful-form";
import { useTheme } from "./../theme/provider";
import { MoneyboxThemeConfig } from "./../theme";
import { applyClassName } from "./../constants/classname";
import {
  autoUpdate,
  flip,
  offset,
  Placement,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { Combobox, ComboboxDrawerProps, ComboboxOption } from "./combobox";
import { SelectboxOption, SelectboxSelectedOptions } from "./selectbox";

export const MoneyboxSeparator = {
  Dot: "dot",
  Comma: "comma",
} as const;

export type MoneyboxSeparator =
  (typeof MoneyboxSeparator)[keyof typeof MoneyboxSeparator];

export interface MoneyboxCurrencyOption {
  id: string;
  name: string;
  symbol: string;
}

interface BaseMoneyboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name" | "placeholder" | "style"
  > {
  value?: string;
  currency?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  separator?: MoneyboxSeparator;
  showError?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  styles?: MoneyboxStyles;
  editableCurrency?: boolean;
  currencyOptions?: MoneyboxCurrencyOption[];
  mobile?: boolean;
  drawerHeight?: string;
  id?: string;
}

export interface MoneyboxStyles {
  self?: CSSProp;
  toggleStyle?: CSSProp;
  inputWrapperStyle?: CSSProp;
  drawerStyle?: CSSProp;
}

export type MoneyboxDropdownOption = FieldLaneDropdownOption;

const BaseMoneybox = forwardRef<HTMLInputElement, BaseMoneyboxProps>(
  (
    {
      value,
      currency = "IDR",
      name,
      onChange,
      placeholder,
      separator = "comma",
      showError,
      styles,
      onKeyDown,
      editableCurrency,
      id,
      disabled,
      currencyOptions = [
        { id: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
      ],
      mobile,
      drawerHeight,
      ...props
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const moneyboxTheme = currentTheme.moneybox;

    const moneyInputRef = useRef<HTMLInputElement>(null);
    const currencyInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => moneyInputRef.current!);

    const [selectedCurrency, setSelectedCurrency] = useState<string>(currency);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [interactionMode, setInteractionMode] = useState<
      "mouse" | "keyboard"
    >("keyboard");
    const [hasInteracted, setHasInteracted] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
      placement: "bottom-start" as Placement,
      open: isOpen,
      onOpenChange: setIsOpen,
      middleware: [offset(4), flip(), shift()],
      whileElementsMounted: autoUpdate,
    });

    const dismiss = useDismiss(context);
    const { getFloatingProps, getReferenceProps } = useInteractions([dismiss]);

    const FINAL_CURRENCY_OPTIONS: ComboboxOption[] = useMemo(
      () =>
        currencyOptions.map((currency) => ({
          text: `${currency.symbol} - ${currency.name}`,
          value: currency.id,
          render: (
            <>
              <span>{currency.name}</span>
              <span style={{ marginLeft: "auto" }}>{currency.symbol}</span>
            </>
          ),
        })),
      []
    );

    const FILTERED_CURRENCY_OPTIONS: ComboboxOption[] = useMemo(() => {
      if (!hasInteracted || !searchTerm) return FINAL_CURRENCY_OPTIONS;

      return FINAL_CURRENCY_OPTIONS.filter((option) => {
        const currency = currencyOptions.find(
          (currency) => currency.id === option.value
        );
        if (!currency) return false;
        return (
          currency.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }, [searchTerm, FINAL_CURRENCY_OPTIONS]);

    const listRef = useRef<(HTMLLIElement | null)[]>([]);

    // Keep the highlighted option visible while navigating the list.
    useEffect(() => {
      if (isOpen && listRef.current[highlightedIndex]) {
        listRef.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex, isOpen]);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      setInteractionMode("keyboard");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen) await setIsOpen(true);
        await setHighlightedIndex((prev) =>
          Math.min(prev + 1, FILTERED_CURRENCY_OPTIONS.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) await setIsOpen(true);
        await setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selectedOption = FILTERED_CURRENCY_OPTIONS[highlightedIndex];
        const selectedCurrency = currencyOptions.find(
          (currency) => currency.id === selectedOption.value
        );
        if (selectedCurrency) {
          await handleSelectCurrency(selectedCurrency.id);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        await setIsOpen(false);
      }
    };

    const handleToggleDropdown = () => {
      if (disabled) return;
      setSearchTerm("");
      setIsOpen((prev) => {
        const newState = !prev;
        if (newState) {
          setTimeout(() => currencyInputRef.current?.focus(), 0);
        }
        return newState;
      });
    };

    const [focus, setFocus] = useState(false);

    const [inputValue, setInputValue] = useState(() =>
      formatMoneyboxNumber(
        unformatMoneyboxNumber(value ?? "", separator),
        separator
      )
    );

    useEffect(() => {
      if (!focus && value !== undefined) {
        const formatted = formatMoneyboxNumber(
          unformatMoneyboxNumber(value, separator),
          separator
        );
        if (formatted !== inputValue) {
          setInputValue(formatted);
        }
      }
    }, [value, focus]);

    const selectionCurrency = editableCurrency
      ? currencyOptions.find((props) => props.id === currency)?.symbol
      : currency;

    const boxRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setInputValue(raw);

      const cleaned = unformatMoneyboxNumber(raw, separator);
      if (onChange) {
        const syntheticEvent = {
          target: {
            name,
            value: cleaned,
          },
        };
        onChange(syntheticEvent as ChangeEvent<HTMLInputElement>);
      }
    };

    const handleSelectCurrency = async (currency: string) => {
      if (disabled) return;

      await setSelectedCurrency(currency);
      await setIsOpen(false);
      await setSearchTerm("");
      await setHighlightedIndex(0);

      if (onChange) {
        const syntheticEvent = {
          target: {
            name: "currency",
            value: currency,
          },
        } as ChangeEvent<HTMLInputElement>;
        await onChange(syntheticEvent);
      }

      await moneyInputRef?.current?.focus();
    };

    return (
      <Box
        $theme={moneyboxTheme}
        onBlur={() => setFocus(false)}
        ref={boxRef}
        $disabled={disabled}
        $error={showError}
        $focus={focus}
        $style={styles?.inputWrapperStyle}
        {...getReferenceProps({
          ref: refs.setReference,
          tabIndex: -1,
          "aria-expanded": isOpen,
          "aria-haspopup": "listbox",
          role: "combobox",
          "aria-controls": "currency-listbox",
          "aria-activedescendant": isOpen
            ? `currency-option-${highlightedIndex}`
            : undefined,
        })}
      >
        <Button
          pressed={isOpen}
          aria-label="moneybox-currency-toggle"
          anchorRef={boxRef}
          variant="ghost"
          styles={{
            containerStyle: css`
              position: absolute;
              left: 8px;
              top: 50%;
              transform: translateY(-50%);

              ${!editableCurrency &&
              css`
                cursor: default;
              `}

              ${disabled &&
              css`
                cursor: not-allowed;
              `}
            `,
            self: css`
              height: 24px;
              width: 24px;
              padding: 0px;
              display: flex;
              font-size: 12px;
              ${(!editableCurrency || disabled) &&
              css`
                pointer-events: none;
                background-color: transparent;
                cursor: default;
              `}

              ${styles?.toggleStyle}
            `,
          }}
          onClick={handleToggleDropdown}
        >
          {selectionCurrency}
        </Button>
        <MoneyboxInput
          ref={moneyInputRef}
          $theme={moneyboxTheme}
          aria-label="moneybox-input"
          autoComplete="off"
          name={name}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onKeyDown={onKeyDown}
          id={id}
          type="text"
          $style={styles?.self}
          inputMode="decimal"
          $disabled={disabled}
          {...props}
        />

        {isOpen && (
          <Combobox.Drawer
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            refs={refs as unknown as ComboboxDrawerProps["refs"]}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
            interactionMode={interactionMode}
            setInteractionMode={setInteractionMode}
            selectedOptions={selectedCurrency}
            drawerHeight={drawerHeight}
            selectedOptionsLocal={{
              text: searchTerm,
              value: "",
            }}
            onChange={async (selectedOptions?: SelectboxSelectedOptions) => {
              const selectedCurrency = await currencyOptions.find(
                (currency) => currency.id === selectedOptions
              );
              if (selectedCurrency) {
                await handleSelectCurrency(selectedCurrency.id);
              }
              moneyInputRef.current?.focus();
            }}
            setSelectedOptionsLocal={(
              selectedOptionsLocal?: SelectboxOption
            ) => {
              setSearchTerm(selectedOptionsLocal?.text);
            }}
            setHasInteracted={setHasInteracted}
            options={FILTERED_CURRENCY_OPTIONS}
            navigableOptions={FILTERED_CURRENCY_OPTIONS}
            inputRef={currencyInputRef}
            mobile={mobile}
            withSearchbox
            floatingStyles={floatingStyles}
            getFloatingProps={getFloatingProps}
            listRef={listRef}
            handleKeyDown={handleKeyDown}
          />
        )}
      </Box>
    );
  }
);

export interface MoneyboxProps
  extends Omit<BaseMoneyboxProps, "styles" | "actions">,
    Omit<FieldLaneProps, "styles" | "type" | "actions"> {
  styles?: MoneyboxStyles & FieldLaneStyles;
}

const Moneybox = forwardRef<HTMLInputElement, MoneyboxProps>(
  ({ ...props }, ref) => {
    const {
      dropdowns,
      label,
      showError,
      styles,
      errorMessage,
      type,
      helper,
      disabled,
      labelGap,
      labelWidth,
      labelPosition,
      className,
      ...rest
    } = props ?? {};

    const {
      bodyStyle,
      containerStyle,
      controlStyle,
      labelStyle,
      ...moneyboxStyle
    } = styles ?? {};

    const inputId = StatefulForm.sanitizeId({
      prefix: "moneybox",
      name: props.name,
      id: props.id,
    });

    return (
      <FieldLane
        id={inputId}
        className={applyClassName("moneybox", className)}
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
        errorIconPosition="relative"
        required={rest.required}
        styles={{
          bodyStyle,
          controlStyle,
          containerStyle,
          labelStyle,
        }}
      >
        <BaseMoneybox
          {...rest}
          id={inputId}
          showError={showError}
          disabled={disabled}
          styles={{
            ...moneyboxStyle,
            inputWrapperStyle: css`
              ${dropdowns &&
              css`
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
              `}
              ${moneyboxStyle?.inputWrapperStyle}
            `,
          }}
          type={type}
          ref={ref}
        />
      </FieldLane>
    );
  }
);

const Box = styled.div<{
  $error?: boolean;
  $focus?: boolean;
  $style?: CSSProp;
  $disabled?: boolean;
  $theme: MoneyboxThemeConfig;
}>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  padding: 10px 12px;
  font-size: 0.75rem;
  border: 1px solid
    ${({ $error, $focus, $theme }) =>
      $error
        ? $theme.errorBorderColor
        : $focus
          ? $theme.focusedBorderColor
          : $theme.borderColor};

  border-radius: ${({ $theme }) => $theme.borderRadius};
  background-color: ${({ $theme }) => $theme.backgroundColor};

  position: relative;

  ${({ $disabled }) =>
    $disabled &&
    css`
      user-select: none;
      cursor: not-allowed;
      opacity: 0.5;
    `}

  ${({ $style }) => $style}
`;

const MoneyboxInput = styled.input<{
  $disabled?: boolean;
  $style?: CSSProp;
  $theme: MoneyboxThemeConfig;
}>`
  background: transparent;
  text-align: right;
  padding-left: 20px;
  outline: none;
  min-width: 0;
  flex: 1;
  font-size: ${({ $theme }) => $theme.fontSize};
  color: ${({ $theme, $disabled }) =>
    $disabled ? $theme.disabledTextColor : $theme.textColor};

  &::placeholder {
    color: ${({ $theme }) => $theme.placeholderColor};
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
      user-select: none;
      cursor: not-allowed;
    `}

  ${({ $style }) => $style}
`;

const unformatMoneyboxNumber = (
  val: string,
  separator: MoneyboxSeparator
): string => {
  if (!val) return "";

  if (separator === "dot") {
    const lastCommaIndex = val.lastIndexOf(",");

    if (lastCommaIndex === -1) {
      return val.replace(/\./g, "").replace(/[^\d]/g, "");
    } else {
      const integerPart = val
        .substring(0, lastCommaIndex)
        .replace(/\./g, "")
        .replace(/[^\d]/g, "");
      const decimalPart = val
        .substring(lastCommaIndex + 1)
        .replace(/[^\d]/g, "");
      return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    }
  } else {
    const lastDotIndex = val.lastIndexOf(".");

    if (lastDotIndex === -1) {
      return val.replace(/,/g, "").replace(/[^\d]/g, "");
    } else {
      const integerPart = val
        .substring(0, lastDotIndex)
        .replace(/,/g, "")
        .replace(/[^\d]/g, "");
      const decimalPart = val.substring(lastDotIndex + 1).replace(/[^\d]/g, "");
      return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    }
  }
};

const formatMoneyboxNumber = (
  val: string,
  separator: MoneyboxSeparator
): string => {
  if (!val) return "";

  const [intPart, decimalPart = ""] = val.split(".");

  if (separator === "dot") {
    const thousandSep = ".";
    const decimalSep = ",";
    const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep);
    return decimalPart
      ? `${intFormatted}${decimalSep}${decimalPart}`
      : intFormatted;
  } else {
    const thousandSep = ",";
    const decimalSep = ".";
    const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep);
    return decimalPart
      ? `${intFormatted}${decimalSep}${decimalPart}`
      : intFormatted;
  }
};

export { Moneybox, formatMoneyboxNumber };
