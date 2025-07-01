import { cn } from "./../lib/utils";
import { ChangeEvent, InputHTMLAttributes } from "react";

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
  ...props
}: RadioProps) {
  const id = `radio-${value}`;

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start px-2 py-1 gap-2 cursor-pointer border border-transparent",
        highlightOnChecked && checked
          ? "bg-blue-100"
          : "hover:bg-[rgb(231,242,252)] bg-white",
        highlightOnChecked && "py-3 px-3",
        containerClassName
      )}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="sr-only peer"
        {...(props as InputHTMLAttributes<HTMLInputElement>)}
        checked={checked}
      />
      <div
        className={cn(
          "mt-[5px] w-[14px] h-[14px] rounded-full border border-gray-600",
          "peer-checked:border-[5px] peer-checked:border-[#61A9F9]"
        )}
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
