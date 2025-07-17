import { cn } from "./../lib/utils";
import {
  RiErrorWarningLine,
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "@remixicon/react";
import { ChangeEvent, ReactElement, useRef, useState } from "react";

export interface ThumbFieldProps {
  value?: boolean | null;
  onChange?: (data: ChangeEvent<HTMLInputElement>) => void;
  thumbsUpBackgroundColor?: string;
  thumbsDownBackgroundColor?: string;
  disabled?: boolean;
  name?: string;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  containerClassName?: string;
  triggerClassName?: string;
  className?: string;
  id?: string;
}

export type ThumbFieldValue = "up" | "down" | "blank";

function ThumbField({
  onChange,
  thumbsUpBackgroundColor = "#61A9F9",
  thumbsDownBackgroundColor = "RGB(206, 55, 93)",
  value = null,
  name,
  disabled,
  errorMessage,
  label,
  showError,
  containerClassName,
  triggerClassName,
  className,
  id,
}: ThumbFieldProps) {
  const thumbStateValue = value === true ? "up" : value ? "down" : "blank";
  const [thumbValue, setThumbValue] =
    useState<ThumbFieldValue>(thumbStateValue);

  const thumbInputRef = useRef<HTMLInputElement>(null);

  const handleChangeValue = (data: ThumbFieldValue) => {
    if (thumbValue !== data) {
      setThumbValue(data);
    }

    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: data === "up" ? true : data === "down" ? false : "",
        },
      } as ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  };

  const triggerClass = cn(
    "hover:text-gray-600",
    showError && "text-red-600",
    triggerClassName
  );

  const inputElement: ReactElement = (
    <div className={cn("flex flex-row gap-2 items-center", className)}>
      <input
        ref={thumbInputRef}
        name={name}
        type="hidden"
        value={
          thumbValue === "up" ? "true" : thumbValue === "down" ? "false" : ""
        }
      />
      <div
        aria-label="thumb-up"
        onClick={() => {
          handleChangeValue("up");
        }}
        className="cursor-pointer"
      >
        {thumbValue === "up" ? (
          <RiThumbUpFill
            size={24}
            className={triggerClass}
            style={{
              color: thumbsUpBackgroundColor,
            }}
          />
        ) : (
          <RiThumbUpLine size={24} className={triggerClass} />
        )}
      </div>
      <div
        aria-label="thumb-down"
        onClick={() => {
          handleChangeValue("down");
        }}
        className="cursor-pointer"
      >
        {thumbValue === "down" ? (
          <RiThumbDownFill
            size={24}
            className={triggerClass}
            style={{
              color: thumbsDownBackgroundColor,
            }}
          />
        ) : (
          <RiThumbDownLine size={24} className={triggerClass} />
        )}
      </div>
      {showError && (
        <RiErrorWarningLine
          size={24}
          className="rounded-full bg-red-600 text-white"
        />
      )}
    </div>
  );

  return (
    <div
      className={cn(
        `flex w-full flex-col gap-2 text-xs`,
        disabled && "cursor-not-allowed opacity-50",
        containerClassName
      )}
    >
      {label && <label htmlFor={id}>{label}</label>}
      <div className="flex flex-col gap-1 text-xs">
        {inputElement}

        {showError && <span className="text-red-600">{errorMessage}</span>}
      </div>
    </div>
  );
}

export { ThumbField };
