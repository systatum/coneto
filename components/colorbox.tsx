import { RiErrorWarningLine } from "@remixicon/react";
import { cn } from "./../lib/utils";
import { ChangeEvent, InputHTMLAttributes, useState } from "react";

export type ColorPickProps = "color-picker" | "color-text";

export interface ColorboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange: (e: ChangeEvent<HTMLInputElement>, data: ColorPickProps) => void;
  value?: string;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
}

function Colorbox({
  onChange,
  value,
  label,
  errorMessage,
  showError,
  className,
  containerClassName,
  placeholder,
  onClick,
  ...props
}: ColorboxProps) {
  const [hovered, setHovered] = useState(false);

  const inputId = `colorbox-${props.name}`;

  const inputElement = (
    <div
      className={cn(
        "relative w-full flex flex-row rounded-xs h-full items-center border",
        showError
          ? " border-red-500 focus:border-red-500 focus:ring-red-500 text-red-800"
          : hovered
            ? "ring-[#61A9F9] border-[#61A9F9]"
            : "border border-gray-300 ",
        className
      )}
    >
      <div className="relative">
        <div
          tabIndex={0}
          className={cn(
            "w-[24px] h-[24px] rounded-xs mx-[4px] my-[4px] border cursor-pointer overflow-hidden",
            showError ? "border-red-500" : "border-gray-300"
          )}
          style={{ backgroundColor: value }}
          onClick={() => {
            document.getElementById(inputId)?.click();
            setHovered(true);
          }}
          onBlur={() => {
            setHovered(false);
            if (onClick) {
              onClick();
            }
          }}
        ></div>

        <input
          {...props}
          id={inputId}
          type="color"
          value={value?.startsWith("#") ? value : `#${value}`}
          onChange={(e) => onChange(e, "color-picker")}
          className="sr-only absolute border border-transparent -bottom-1"
        />
      </div>

      <span
        className={cn(
          "flex-row w-full gap-1 border-l px-3 flex items-center h-[34px] py-[2px]",
          showError
            ? "border-red-500 text-red-500"
            : hovered
              ? "ring-[#61A9F9] border-[#61A9F9]"
              : "border-gray-300"
        )}
      >
        {value?.replace(/^#/, "").length > 0 && (
          <span className={showError ? "text-red-500" : "text-gray-600"}>
            #
          </span>
        )}
        <input
          {...props}
          type="text"
          value={value?.replace(/^#/, "")}
          onChange={(e) => {
            onChange(e, "color-text");
          }}
          className={cn(
            "w-full outline-none bg-transparent",
            showError ? "text-red-500" : "text-gray-800"
          )}
          placeholder={placeholder}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          maxLength={6}
          spellCheck={false}
        />
      </span>

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
      {label && <label>{label}</label>}
      <div className="flex flex-col w-full gap-1 text-xs">
        {inputElement}
        {showError && <span className="text-red-600">{errorMessage}</span>}
      </div>
    </div>
  );
}
export { Colorbox };
