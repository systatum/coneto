import { cn } from "./../lib/utils";
import { InputHTMLAttributes, useEffect, useRef } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  showError?: boolean;
  errorMessage?: string;
  className?: string;
  containerClassName?: string;
  titleClassName?: string;
  childClassName?: string;
  indeterminate?: boolean;
  description?: string;
  highlightOnChecked?: boolean;
}

export default function Checkbox({
  label,
  name,
  showError,
  className,
  description,
  containerClassName,
  titleClassName,
  childClassName,
  highlightOnChecked,
  errorMessage,
  indeterminate = false,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `checkbox-${name}-${props.value}`;

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
    containerClassName
  );

  const checkIconClass = cn(
    "absolute left-[3px] top-[3px] h-[10px] w-[10px] text-white transition-transform duration-150 pointer-events-none",
    childClassName
  );

  return (
    <div>
      <label
        htmlFor={inputId}
        className={cn(
          "flex gap-[6px] text-xs px-2 py-1",
          description ? "items-start" : "items-center",
          highlightOnChecked && props.checked
            ? "bg-blue-100"
            : "hover:bg-[rgb(231,242,252)] bg-white",
          highlightOnChecked &&
            "border border-transparent py-3 px-3 gap-2 cursor-pointer"
        )}
      >
        <div
          className={cn(
            "relative max-w-[16px] max-h-[16px]",
            description && "mt-1",
            className
          )}
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
              className={checkIconClass}
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
              className={cn(checkIconClass, "scale-0 peer-checked:scale-100")}
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
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <h2
                className={cn(
                  highlightOnChecked && "text-base font-medium",
                  titleClassName
                )}
              >
                {label}
              </h2>
            )}
            {description && (
              <span
                className={cn(highlightOnChecked && "text-sm text-gray-600")}
              >
                {description}
              </span>
            )}
          </div>
        )}
      </label>
      {showError && errorMessage && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
