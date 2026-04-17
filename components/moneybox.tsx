import styled, { css, CSSProp } from "styled-components";
import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent,
  useEffect,
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
  id?: string;
}

export interface MoneyboxStyles {
  self?: CSSProp;
  inputWrapperStyle?: CSSProp;
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
      currencyOptions = [
        { id: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
      ],
      ...props
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const moneyboxTheme = currentTheme.moneybox;

    const [focus, setFocus] = useState(false);
    const [isTipMenuOpen, setIsTipMenuOpen] = useState(false);

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

    return (
      <Box
        $theme={moneyboxTheme}
        onBlur={() => setFocus(false)}
        ref={boxRef}
        $disabled={props.disabled}
        $error={showError}
        $focus={focus}
        $style={styles?.inputWrapperStyle}
      >
        <Button
          aria-label="currency"
          open={isTipMenuOpen}
          onOpen={(prop: boolean) => setIsTipMenuOpen(prop)}
          anchorRef={boxRef}
          showSubMenuOn="self"
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

              ${props.disabled &&
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
              ${(!editableCurrency || props.disabled) &&
              css`
                pointer-events: none;
                background-color: transparent;
                cursor: default;
              `}
            `,
          }}
          subMenu={
            editableCurrency && !props.disabled
              ? ({ show }) =>
                  show(
                    <List
                      styles={{
                        containerStyle: css`
                          gap: 0px;
                          border: 1px solid #d1d5db;
                          max-height: 200px;
                          overflow: auto;
                        `,
                      }}
                    >
                      {currencyOptions.map((props) => {
                        return (
                          <List.Item
                            onMouseDown={async () => {
                              const syntheticEvent = {
                                target: {
                                  name: "currency",
                                  value: props.id,
                                },
                              } as ChangeEvent<HTMLInputElement>;
                              if (onChange) {
                                await onChange(syntheticEvent);
                              }

                              await setIsTipMenuOpen(false);
                            }}
                            id={props.id}
                            title={props.name}
                            styles={{
                              rowStyle: css`
                                border-radius: 0px;
                                padding: 0.5rem 0.75rem;
                                transition: background-color 0ms;
                                overflow: hidden;
                              `,
                              titleStyle: css`
                                font-size: 12px;
                              `,
                            }}
                            rightSideContent={props.symbol}
                          />
                        );
                      })}
                    </List>,
                    {
                      drawerStyle: css`
                        background-color: white;
                        overflow: hidden;
                        border-radius: 2px;
                      `,
                    }
                  )
              : undefined
          }
        >
          {selectionCurrency}
        </Button>
        <MoneyboxInput
          $theme={moneyboxTheme}
          aria-label="input-moneybox"
          autoComplete="off"
          ref={ref}
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
          $disabled={props.disabled}
          {...props}
        />
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
      ...rest
    } = props;

    const inputId = StatefulForm.sanitizeId({
      prefix: "moneybox",
      name: props.name,
      id: props.id,
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
        errorIconPosition="relative"
        required={rest.required}
        styles={{
          bodyStyle: styles?.bodyStyle,
          controlStyle: styles?.controlStyle,
          containerStyle: styles?.containerStyle,
          labelStyle: styles?.labelStyle,
        }}
      >
        <BaseMoneybox
          {...rest}
          id={inputId}
          showError={showError}
          disabled={disabled}
          styles={{
            inputWrapperStyle: css`
              ${dropdowns &&
              css`
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
              `}
              ${styles?.inputWrapperStyle}
            `,
            self: styles?.self,
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
