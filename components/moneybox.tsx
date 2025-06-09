import { cn } from "../lib/utils";
import { ChangeEvent, useMemo } from "react";

type MoneyTypeProps = "dollar" | "euro" | "yen" | "pound" | "rupiah";
type SeparatorTypeProps = "dot" | "comma";

interface MoneyboxProps {
  value: string;
  type?: MoneyTypeProps;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  separator?: SeparatorTypeProps;
  className?: string;
}

const CURRENCY_SYMBOL: Record<MoneyTypeProps, string> = {
  dollar: "$",
  euro: "€",
  yen: "¥",
  pound: "£",
  rupiah: "Rp",
};

export default function Moneybox({
  value,
  type = "dollar",
  name,
  onChange,
  placeholder,
  separator,
  className,
}: MoneyboxProps) {
  const currencySelected = CURRENCY_SYMBOL[type];

  const rawValue = typeof value === "number" ? String(value) : value;
  const cleaned = unformatNumber(rawValue);
  const formattedValue = useMemo(
    () => formatNumber(cleaned, separator),
    [cleaned, separator]
  );

  const classMoneyBox = cn(
    "w-full h-full border border-gray-300 text-sm rounded-xs py-[10px] px-3 items-center gap-3 justify-end flex",
    className
  );

  return (
    <div className={classMoneyBox}>
      <input
        name={name}
        value={formattedValue}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-transparent outline-none text-right flex-1"
        type="text"
      />

      <span>{currencySelected}</span>
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
