import clsx from "clsx";
import { Search, X } from "lucide-react";
import { ChangeEvent, InputHTMLAttributes } from "react";

interface BaseSearchBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value: string;
  className?: string;
  onChange: (data: ChangeEvent<HTMLInputElement>) => void;
}

export default function Searchbox({
  name,
  value,
  className,
  onChange,
  ...props
}: BaseSearchBoxProps) {
  const inputId = `textbox-${name}`;

  const inputClass = clsx(
    "rounded-3xl text-black px-9 bg-white text-xs w-full py-[8px] outline-none",
    "border border-gray-300 border-2 focus:ring-[#61A9F9] focus:border-[#61A9F9]",
    className
  );

  return (
    <div className="relative w-full ring-0">
      <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2" />

      <input
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        className={inputClass}
        {...(props as InputHTMLAttributes<HTMLInputElement>)}
      />

      <X
        role="button"
        aria-label="Clear search input"
        onClick={() => {
          const event = {
            target: {
              name,
              value: "",
            },
          } as ChangeEvent<HTMLInputElement>;
          onChange(event);
        }}
        size={14}
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
      />
    </div>
  );
}
