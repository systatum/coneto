import {
  RemixiconComponentType,
  RiCheckLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
} from "@remixicon/react";
import {
  ChangeEvent,
  InputHTMLAttributes,
  MutableRefObject,
  ReactElement,
  RefObject,
  TextareaHTMLAttributes,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { cn } from "./../lib/utils";

export interface BaseTextboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  className?: string;
  containerClassName?: string;
  onActionClick?: () => void;
  onChange: (data: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  icon?: RemixiconComponentType;
  actionIcon?: boolean;
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

const Textbox = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextboxProps
>(
  (
    {
      label,
      showError,
      errorMessage,
      rows,
      onChange,
      onActionClick,
      className,
      containerClassName,
      actionIcon,
      icon: Icon = RiCheckLine,
      type = "text",
      ...props
    },
    ref
  ) => {
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

    const autoResize = (el: HTMLTextAreaElement | null) => {
      if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    };

    const inputClass = cn(
      "rounded-xs border text-xs text-black px-2 w-full py-[7px] outline-none",
      showError
        ? "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-800"
        : "border-gray-300 focus:ring-[#61A9F9] focus:border-[#61A9F9]",
      className
    );

    const inputElement: ReactElement = rows ? (
      <div className="relative w-full ring-0">
        <textarea
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          id={inputId}
          ref={(el) => {
            autoResize(el);
            if (typeof ref === "function") {
              ref(el);
            } else if (ref) {
              (ref as MutableRefObject<HTMLTextAreaElement | null>).current =
                el;
            }
          }}
          onChange={(e) => {
            autoResize(e.target);
            onChange(e);
          }}
          rows={rows ?? 3}
          className={inputClass}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
        {actionIcon && (
          <button
            type="button"
            className="text-muted-foreground p-1 bg-gray-300 absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
            aria-label="action-icon"
            onClick={(e) => {
              e.preventDefault();
              if (onActionClick) {
                onActionClick();
              }
            }}
          >
            <Icon className="mr-1 text-black" size={18} />
          </button>
        )}
        {showError && (
          <RiErrorWarningLine
            size={18}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-red-600 text-white"
          />
        )}
      </div>
    ) : (
      <div className="relative flex flex-row w-full ring-0">
        <input
          id={inputId}
          ref={ref as RefObject<HTMLInputElement>}
          onChange={onChange}
          className={inputClass}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (onActionClick) {
                onActionClick();
              }
            }
          }}
          type={type === "password" && showPassword ? "text" : type}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
        {actionIcon && (
          <button
            type="submit"
            aria-label="action-icon"
            className={cn(
              "text-muted-foreground p-[2px]  w-fit rounded-xs transition-all duration-200 mr-1 absolute top-1/2 -translate-y-1/2 cursor-pointer",
              showError
                ? "right-[30px] text-red-500 hover:text-red-600"
                : "right-2"
            )}
            onClick={(e) => {
              e.preventDefault();
              if (onActionClick) {
                onActionClick();
              }
            }}
          >
            <Icon className="hover:text-gray-800" size={18} />
          </button>
        )}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-600",
              showError
                ? "right-[30px] text-red-500 hover:text-red-600"
                : "right-2"
            )}
            tabIndex={-1}
            aria-label="action-icon"
          >
            {showPassword ? (
              <RiEyeOffLine size={22} />
            ) : (
              <RiEyeLine size={22} />
            )}
          </button>
        )}
        {showError && (
          <button className="absolute right-2 top-1/2 -translate-y-1/2">
            <RiErrorWarningLine
              size={17}
              className=" rounded-full bg-red-600 text-white"
            />
          </button>
        )}
      </div>
    );

    return (
      <div
        className={cn(`flex w-full flex-col gap-2 text-xs`, containerClassName)}
      >
        {label && <label htmlFor={inputId}>{label}</label>}
        <div className="flex flex-col gap-1 text-xs">
          {inputElement}
          {showError && <span className="text-red-600">{errorMessage}</span>}
        </div>
      </div>
    );
  }
);

Textbox.displayName = "Textbox";

export { Textbox };
