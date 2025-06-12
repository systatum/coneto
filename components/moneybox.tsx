import { cn } from "../lib/utils";
import { ChangeEvent, useMemo, useState } from "react";

type SeparatorTypeProps = "dot" | "comma";

interface MoneyboxProps {
  value: string;
  currency?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  separator?: SeparatorTypeProps;
  className?: string;
}

export default function Moneybox({
  value,
  currency = "dollar",
  name,
  onChange,
  placeholder,
  separator,
  className,
}: MoneyboxProps) {
  const [focus, setFocus] = useState(false);

  const rawValue = typeof value === "number" ? String(value) : value;
  const cleaned = unformatNumber(rawValue);
  const formattedValue = useMemo(
    () => formatNumber(cleaned, separator),
    [cleaned, separator]
  );

  const classMoneyBox = cn(
    "w-full h-full border text-sm rounded-xs py-[10px] px-3 items-center gap-3 justify-end flex",
    focus ? "border-[#61A9F9]" : "border-gray-300",
    className
  );

  return (
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
