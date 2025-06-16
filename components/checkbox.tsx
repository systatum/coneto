import { cn } from "./../lib/utils";
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

  const inputClass = cn(
    "peer appearance-none border h-4 w-4 rounded-none outline-none cursor-pointer",
    {
      "bg-[#61A9F9] border-[#61A9F9]": indeterminate || props.checked,
      "bg-white border-gray-500": !indeterminate && !props.checked,
    },
    showError && "border-red-500 focus:border-red-500 focus:ring-red-500",
    classNameParent
  );
  return (
    <div>
      <label
        htmlFor={inputId}
        className="flex items-center gap-[6px] text-xs relative"
      >
        <input
          name={name}
          ref={inputRef}
          type="checkbox"
          id={inputId}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
          className={inputClass}
        />
        {indeterminate ? (
          <svg
            className={cn(
              "absolute left-[2px] top-[2px] h-3 w-3 text-white transition-transform duration-150 pointer-events-none",
              className
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="6" y1="12" x2="18" y2="12" />
          </svg>
        ) : (
          <svg
            className={cn(
              "absolute left-[2px] top-[2px] h-3 w-3 text-white scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none",
              className
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {label && <span>{label}</span>}
      </label>
      {showError && errorMessage && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
