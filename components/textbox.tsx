import {
  RemixiconComponentType,
  RiCheckLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiPencilFill,
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
  dormanted?: boolean;
  dormantedFontSize?: number;
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
      dormanted,
      dormantedFontSize = 17,
      icon: Icon = RiCheckLine,
      type = "text",
      ...props
    },
    ref
  ) => {
    const dormantedState = dormanted ? dormanted : false;

    const [dormantedLocal, setDormantedLocal] = useState(dormantedState);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState(false);
    const [labelHeight, setLabelHeight] = useState<number>(0);

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

    const iconSizeDormanted = dormantedFontSize * 1.05;

    const measureLabelHeight = (el: HTMLLabelElement | null) => {
      if (el) {
        const height = el.getBoundingClientRect().height;
        setLabelHeight(height);
      }
    };

    const inputElement: ReactElement = dormantedLocal ? (
      <label
        ref={measureLabelHeight}
        onClick={() => setDormantedLocal(false)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseEnter={() => setIsHovered(true)}
        className={cn(
          dormantedLocal
            ? "p-2 rounded-xs cursor-pointer duration-100 transform transition-all flex flex-row justify-between items-center w-fit relative gap-1 hover:bg-[#e9e9e9] border hover:border-[#e9e9e9] border-transparent"
            : ""
        )}
        style={
          dormanted && {
            fontSize: dormantedFontSize,
          }
        }
      >
        {props.value}
        <RiPencilFill
          className={cn(
            "duration-100 transform transition-all",
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          size={iconSizeDormanted}
        />
      </label>
    ) : rows ? (
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
            onClick={(e) => {
              e.preventDefault();
              if (onActionClick) {
                onActionClick();
              }
              if (dormanted) {
                setDormantedLocal(true);
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
      <div
        className={cn(
          "relative w-full ring-0",
          dormanted ? "h-full flex flex-col justify-center items-center" : ""
        )}
        style={
          dormanted && {
            minHeight: labelHeight,
          }
        }
      >
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
              if (dormanted) {
                setDormantedLocal(true);
              }
            }
          }}
          type={type === "password" && showPassword ? "text" : type}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
        {actionIcon && (
          <button
            type="submit"
            className={cn(
              "text-muted-foreground p-[2px]  w-fit rounded-xs transition-all duration-200 mr-1 absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer",
              !dormanted && "hover:bg-gray-300"
            )}
            onClick={(e) => {
              e.preventDefault();
              if (onActionClick) {
                onActionClick();
              }
              if (dormanted) {
                setDormantedLocal(true);
              }
            }}
          >
            <Icon
              className={cn(
                "hover:text-gray-800",
                dormanted && "hover:text-[#61A9F9]"
              )}
              size={18}
            />
          </button>
        )}
        {type === "password" && !showError && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-gray-500"
            tabIndex={-1}
          >
            {showPassword ? (
              <RiEyeOffLine className="hover:text-gray-600" size={18} />
            ) : (
              <RiEyeLine className="hover:text-gray-600" size={18} />
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
        className={cn(`flex w-full flex-col gap-2 text-xs`, containerClassName)}
      >
        {!dormanted && label && <label htmlFor={inputId}>{label}</label>}
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
