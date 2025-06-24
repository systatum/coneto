import { cn } from "./../lib/utils";
import { ChangeEvent } from "react";

export interface RadioProps {
  value: string;
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  highlightOnChecked?: boolean;
  containerClassName?: string;
}

export default function Radio({
  value,
  label,
  description,
  checked,
  onChange,
  name,
  highlightOnChecked,
  containerClassName,
}: RadioProps) {
  const id = `radio-${value}`;

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start px-2 py-3 gap-2 cursor-pointer border border-transparent",
        highlightOnChecked && checked
          ? "border-[rgb(64,142,232)] bg-blue-100"
          : "hover:bg-[rgb(231,242,252)] bg-white",
        containerClassName
      )}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-[5px] appearance-none w-[14px] h-[14px] checked:border-[5px] border border-gray-600 rounded-full checked:accent-[#61A9F9] checked:border-[#61A9F9]"
      />
      <div className="flex flex-col">
        {label && <div className="font-medium">{label}</div>}
        {description && (
          <div className={cn("text-sm text-gray-600")}>{description}</div>
        )}
      </div>
    </label>
  );
}
