import clsx from "clsx";
import { InputHTMLAttributes } from "react";

interface BaseCheckboxesProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  showError?: boolean;
  errorMessage?: string;
  className?: string;
  classNameParent?: string;
}

export default function Checkboxes({
  label,
  name,
  showError,
  className,
  classNameParent,
  ...props
}: BaseCheckboxesProps) {
  const inputId = `checkbox-${name}`;

  const inputClass = clsx(
    "h-4 w-4 border border-gray-300 rounded-none bg-white outline-none cursor-pointer",
    showError
      ? "border border-red-500 focus:border-red-500 focus:ring-red-500 text-red-800"
      : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500",
    className,
  );

  return (
    <label
      htmlFor={inputId}
      className={clsx(
        "flex items-center gap-[6px] py-[7px] text-xs",
        classNameParent,
      )}
    >
      <input
        id={inputId}
        className={inputClass}
        {...(props as InputHTMLAttributes<HTMLInputElement>)}
      />
      <span className="pt-[1px]">{label}</span>
    </label>
  );
}
