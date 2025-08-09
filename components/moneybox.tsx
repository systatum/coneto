import styled, { CSSProp } from "styled-components";
import {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  useEffect,
  useState,
} from "react";

type SeparatorTypeProps = "dot" | "comma";

export interface MoneyboxProps {
  value?: string;
  currency?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  separator?: SeparatorTypeProps;
  showError?: boolean;
  errorMessage?: string;
  label?: string;
  style?: CSSProp;
  InputWrapperStyle?: CSSProp;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const Moneybox = forwardRef<HTMLInputElement, MoneyboxProps>(
  (
    {
      value,
      currency = "$",
      name,
      label,
      onChange,
      placeholder,
      separator = "comma",
      errorMessage,
      showError,
      style,
      InputWrapperStyle,
      onKeyDown,
    },
    ref
  ) => {
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
      <InputWrapper $style={InputWrapperStyle}>
        {label && <Label>{label}</Label>}
        <InputContent>
          <Box $error={showError} $focus={focus} $style={style}>
            <Currency>{currency}</Currency>
            <MoneyboxInput
              autoComplete="off"
              ref={ref}
              name={name}
              value={inputValue}
              onChange={handleChange}
              placeholder={placeholder}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              onKeyDown={onKeyDown}
              type="text"
              inputMode="decimal"
            />
          </Box>
          {showError && <ErrorText>{errorMessage}</ErrorText>}
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
  ${({ $style }) => $style}
`;

const Label = styled.label`
  font-size: 0.75rem;
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
  ${({ $style }) => $style}
`;

const Currency = styled.span`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
`;

const MoneyboxInput = styled.input`
  background: transparent;
  text-align: right;
  padding-left: 12px;
  outline: none;
  min-width: 0;
  flex: 1;
  font-size: 0.75rem;
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
