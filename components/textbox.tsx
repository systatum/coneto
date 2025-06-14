import clsx from "clsx";
import {
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiSendPlaneFill,
} from "@remixicon/react";
import {
  ChangeEvent,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from "react";

export interface BaseTextboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  className?: string;
  classNameParent?: string;
  onSendClick?: () => void;
  onChange: (data: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export type TextboxProps =
  | (BaseTextboxProps &
      InputHTMLAttributes<HTMLInputElement> & {
        rows?: undefined;
      })
  | (BaseTextboxProps &
      TextareaHTMLAttributes<HTMLTextAreaElement> & {
        rows: number;
      });

export default function Textbox({
  label,
  showError,
  errorMessage,
  rows,
  onChange,
  onSendClick,
  className,
  classNameParent,
  type = "text",
  ...props
}: TextboxProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (showError) {
      setShowPassword(false);
    }
  }, [showError]);

  const inputId = `textbox-${props.name}`;

  if (type === "hidden") {
    return <input {...props} className="hidden" />;
  }

  const inputClass = clsx(
    "rounded-xs text-black px-2 w-full py-[7px] outline-none",
    showError
      ? "border border-red-500 focus:border-red-500 focus:ring-red-500 text-red-800"
      : "border border-gray-300 focus:ring-[#61A9F9] focus:border-[#61A9F9]",
    className
  );

  const inputElement =
    type === "message" ? (
      <div
        id={inputId}
        className={clsx("relative flex w-full items-center", className)}
      >
        <input
          onChange={onChange}
          type="text"
          className={clsx(
            "bg-background ring-offset-background placeholder:text-muted-foreground flex h-10 w-full rounded-xs border-gray-300 border px-3 py-2 pr-10 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-blue-600 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          )}
          placeholder={props.placeholder || "Type a message..."}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              props.onKeyDown?.(e);
            }
          }}
          {...props}
        />
        <button
          type="submit"
          className="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();

            const customEvent = new KeyboardEvent("keydown", {
              key: "Enter",
              code: "Enter",
              bubbles: true,
              cancelable: true,
            });

            const inputElement = (e.target as HTMLElement).closest("input");

            if (inputElement) {
              inputElement.dispatchEvent(customEvent);
            }

            onSendClick();
          }}
        >
          <RiSendPlaneFill className="mr-1" size={18} />
        </button>
      </div>
    ) : rows ? (
      <div className="relative w-full ring-0">
        <textarea
          id={inputId}
          onChange={onChange}
          rows={rows ?? 3}
          className={inputClass}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
        {showError && (
          <RiErrorWarningLine
            size={18}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-red-600 text-white"
          />
        )}
      </div>
    ) : (
      <div className="relative w-full ring-0">
        <input
          id={inputId}
          onChange={onChange}
          className={inputClass}
          type={type === "password" && showPassword ? "text" : type}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />

        {type === "password" && !showError && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-gray-500"
            tabIndex={-1}
          >
            {showPassword ? (
              <RiEyeOffLine size={18} />
            ) : (
              <RiEyeLine size={18} />
            )}
          </button>
        )}

        {showError && (
          <RiErrorWarningLine
            size={18}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-red-600 text-white"
          />
        )}
      </div>
    );

  return (
    <div
      className={clsx(`flex w-full flex-col gap-2 text-xs`, classNameParent)}
    >
      {label && <label htmlFor={inputId}>{label}</label>}
      <div className="flex flex-col gap-1 text-xs">
        {inputElement}
        {showError && <span className="text-red-600">{errorMessage}</span>}
      </div>
    </div>
  );
}
