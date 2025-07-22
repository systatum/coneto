import { cn } from "../lib/utils";
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
  className?: string;
  containerClassName?: string;
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
      className,
      errorMessage,
      showError,
      containerClassName,
      onKeyDown,
    },
    ref
  ) => {
    const [focus, setFocus] = useState(false);

    const [inputValue, setInputValue] = useState(() =>
      formatNumber(unformatNumber(value ?? "", separator), separator)
    );

    useEffect(() => {
      if (!focus && value !== undefined) {
        const formatted = formatNumber(
          unformatNumber(value, separator),
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

      const cleaned = unformatNumber(raw, separator);
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

    const classMoneyBox = cn(
      "w-full h-full border text-xs rounded-xs py-[10px] px-3 items-center gap-3 justify-end flex",
      showError
        ? "border-red-500 text-red-800"
        : focus
          ? "border-[#61A9F9]"
          : "border-gray-300",
      className
    );

    return (
      <div
        className={cn("flex w-full flex-col gap-2 text-xs", containerClassName)}
      >
        {label && <label>{label}</label>}
        <div className="flex flex-col gap-1 text-xs">
          <div className={classMoneyBox}>
            <span className="absolute left-2 top-1/2 -translate-y-1/2">
              {currency}
            </span>
            <input
              ref={ref}
              name={name}
              value={inputValue}
              onChange={handleChange}
              placeholder={placeholder}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              onKeyDown={onKeyDown}
              className="bg-transparent truncate outline-none text-right pl-3 min-w-0 flex-1"
              type="text"
              inputMode="decimal"
            />
          </div>
          {showError && <span className="text-red-600">{errorMessage}</span>}
        </div>
      </div>
    );
  }
);

const unformatNumber = (val: string, separator: SeparatorTypeProps): string => {
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

const formatNumber = (val: string, separator: SeparatorTypeProps): string => {
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

export { Moneybox, formatNumber };
