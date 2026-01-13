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

type SeparatorTypeProps = "dot" | "comma";

export interface CurrencyOptionsProps {
  id: string;
  name: string;
  symbol: string;
}

export interface MoneyboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name" | "placeholder" | "style"
  > {
  value?: string;
  currency?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  separator?: SeparatorTypeProps;
  showError?: boolean;
  errorMessage?: string;
  label?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  styles?: MoneyboxStylesProps;
  editableCurrency?: boolean;
  currencyOptions?: CurrencyOptionsProps[];
}
export interface MoneyboxStylesProps {
  self?: CSSProp;
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
}

const Moneybox = forwardRef<HTMLInputElement, MoneyboxProps>(
  (
    {
      value,
      currency = "IDR",
      name,
      label,
      onChange,
      placeholder,
      separator = "comma",
      errorMessage,
      showError,
      styles,
      onKeyDown,
      editableCurrency,
      currencyOptions = [
        { id: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
      ],
      ...props
    },
    ref
  ) => {
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
      <InputWrapper $style={styles?.containerStyle}>
        {label && <Label $style={styles?.labelStyle}>{label}</Label>}
        <InputContent>
          <Box
            onBlur={() => setFocus(false)}
            ref={boxRef}
            $disabled={props.disabled}
            $error={showError}
            $focus={focus}
            $style={styles?.self}
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
                  left: 4px;
                  top: 50%;
                  transform: translateY(-50%);
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
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                  font-size: 12px;
                  ${(!editableCurrency || props.disabled) &&
                  css`
                    pointer-events: none;
                    background-color: transparent;
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
                                  await onChange(syntheticEvent);

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
              aria-label="input-moneybox"
              autoComplete="off"
              ref={ref}
              name={name}
              value={inputValue}
              onChange={handleChange}
              placeholder={placeholder}
              onFocus={() => setFocus(true)}
              onKeyDown={onKeyDown}
              type="text"
              inputMode="decimal"
              $disabled={props.disabled}
              {...props}
            />
          </Box>
          {showError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        </InputContent>
      </InputWrapper>
    );
  }
);

const InputWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
  font-size: 0.75rem;
  position: relative;
  font-size: 0.75rem;

  ${({ $style }) => $style}
`;

const Label = styled.label<{ $style?: CSSProp }>`
  ${({ $style }) => $style}
`;

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Box = styled.div<{
  $error?: boolean;
  $focus?: boolean;
  $style?: CSSProp;
  $disabled?: boolean;
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
    ${({ $error, $focus }) =>
      $error ? "#ef4444" : $focus ? "#61A9F9" : "#d1d5db"};
  border-radius: 2px;
  position: relative;

  ${({ $disabled }) =>
    $disabled &&
    css`
      background-color: rgb(227 227 227);
      opacity: 0.5;
      cursor: not-allowed;
    `}

  ${({ $style }) => $style}
`;

const MoneyboxInput = styled.input<{ $disabled?: boolean }>`
  background: transparent;
  text-align: right;
  padding-left: 20px;
  outline: none;
  min-width: 0;
  flex: 1;
  font-size: 0.75rem;

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
      user-select: none;
      cursor: not-allowed;
    `}
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
`;

const unformatMoneyboxNumber = (
  val: string,
  separator: SeparatorTypeProps
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
  separator: SeparatorTypeProps
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
