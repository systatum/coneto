import { cn } from "../lib/utils";
import { ChangeEvent, useMemo, useState } from "react";

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
}

function Moneybox({
  value,
  currency = "$",
  name,
  label,
  onChange,
  placeholder,
  separator,
  className,
  errorMessage,
  showError,
  containerClassName,
}: MoneyboxProps) {
  const [focus, setFocus] = useState(false);

  const rawValue = typeof value === "number" ? String(value) : value;
  const cleaned = unformatNumber(rawValue);
  const formattedValue = useMemo(
    () => formatNumber(cleaned, separator),
    [cleaned, separator]
  );

  const classMoneyBox = cn(
    "w-full h-full border text-xs rounded-xs py-[10px] px-3 items-center gap-3 justify-end flex",
    showError
      ? "border-red-500 text-red-800"
      : focus
        ? "border-[#61A9F9]"
        : "border-gray-300",
    className
  );

  const inputElement = (
    <div className={classMoneyBox}>
      <span>{currency}</span>
      <input
        name={name}
        value={formattedValue}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="bg-transparent outline-none text-right flex-1"
        type="text"
      />
    </div>
  );

  return (
    <div
      className={cn(`flex w-full flex-col gap-2 text-xs`, containerClassName)}
    >
      {label && <label>{label}</label>}
      <div className="flex flex-col gap-1 text-xs">
        {inputElement}
        {showError && <span className="text-red-600">{errorMessage}</span>}
      </div>
    </div>
  );
}

const unformatNumber = (val: string): string => val.replace(/[^\d]/g, "");

const formatNumber = (val: string, separator: SeparatorTypeProps): string => {
  const parts = val.split(".");
  const num = parts[0];
  const sep = separator === "dot" ? "." : ",";

  return (
    num.replace(/\B(?=(\d{3})+(?!\d))/g, sep) + (parts[1] ? "." + parts[1] : "")
  );
};

export { Moneybox };
