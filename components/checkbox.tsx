import clsx from "clsx";
import { InputHTMLAttributes, useEffect, useRef } from "react";

interface BaseCheckboxesProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  showError?: boolean;
  errorMessage?: string;
  className?: string;
  classNameParent?: string;
  indeterminate?: boolean;
}

export default function Checkbox({
  label,
  name,
  showError,
  className,
  classNameParent,
  errorMessage,
  indeterminate = false,
  ...props
}: BaseCheckboxesProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `checkbox-${name}`;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const inputClass = clsx(
    "h-4 w-4 border border-gray-300 rounded-none bg-white outline-none cursor-pointer",
    "accent-gray-500",
    showError
      ? "border border-red-500 focus:border-red-500 focus:ring-red-500 text-red-800"
      : "border border-gray-300 focus:ring-gray-500 focus:border-gray-500",
    className
  );

  return (
    <div className={clsx(classNameParent)}>
      <label htmlFor={inputId} className="flex items-center gap-[6px] text-xs">
        <input
          ref={inputRef}
          type="checkbox"
          id={inputId}
          className={inputClass}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
        {label && <span>{label}</span>}
      </label>
      {showError && errorMessage && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
