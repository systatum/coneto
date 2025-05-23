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

export default function Checkbox({
  label,
  name,
  showError,
  className,
  classNameParent,
  errorMessage,
  ...props
}: BaseCheckboxesProps) {
  const inputId = `checkbox-${name}`;

  const inputClass = clsx(
    "h-4 w-4 border border-gray-300 rounded-none bg-white outline-none cursor-pointer",
    showError
      ? "border border-red-500 focus:border-red-500 focus:ring-red-500 text-red-800"
      : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500",
    className
  );

  return (
    <div className={clsx(classNameParent)}>
      <label
        htmlFor={inputId}
        className="flex items-center gap-[6px] py-[7px] text-xs"
      >
        <input
          type="checkbox"
          id={inputId}
          className={inputClass}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
        <span>{label}</span>
      </label>
      {showError && errorMessage && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
