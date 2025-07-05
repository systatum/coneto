import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { cn } from "./../lib/utils";

interface TimeboxProps {
  withSeconds?: boolean;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  value?: string;
  name?: string;
}

export function Timebox({
  withSeconds = false,
  onChange,
  editable = true,
  containerClassName,
  inputClassName,
  disabled,
  label,
  errorMessage,
  showError,
  value,
  name,
}: TimeboxProps) {
  const stateValue = !editable ? value : "";

  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [second, setSecond] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (stateValue) {
      const [hh, mm, ss] = stateValue.split(":");
      setHour(hh || "00");
      setMinute(mm || "00");
      setSecond(ss || "00");
    }
  }, [stateValue]);

  const handleChange = (type: "hour" | "minute" | "second", value: string) => {
    const newDigit = value.slice(-1);
    const isDelete = value === "";
    const isInvalid = newDigit === "" || isNaN(Number(newDigit));

    const setters = { hour: setHour, minute: setMinute, second: setSecond };
    const values = { hour, minute, second };
    const maxValues = { hour: 24, minute: 59, second: 59 };

    if (isDelete) {
      setters[type]("");
    } else if (!isInvalid) {
      const oldVal = values[type];
      const newVal = oldVal.length >= 2 ? newDigit : oldVal + newDigit;
      if (parseInt(newVal, 10) > maxValues[type]) return;
      setters[type](newVal);
      values[type] = newVal;
    } else {
      return;
    }

    const hh = type === "hour" ? (isDelete ? "" : values.hour) : hour;
    const mm = type === "minute" ? (isDelete ? "" : values.minute) : minute;
    const ss = type === "second" ? (isDelete ? "" : values.second) : second;

    const formatted = [
      (hh || "0").padStart(2, "0"),
      (mm || "0").padStart(2, "0"),
      (ss || "0").padStart(2, "0"),
    ].join(":");

    onChange?.({
      target: {
        name,
        value: formatted,
      },
    } as ChangeEvent<HTMLInputElement>);
  };

  const inputClass = cn(
    "w-[50px] text-center border-none items-center px-1 py-1 text-sm bg-white border border-gray-300 focus:outline-none placeholder:text-center",
    "appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
    disabled && "cursor-not-allowed opacity-50",
    inputClassName
  );

  const inputElement: ReactElement = (
    <div
      className={cn(
        "flex border border-gray-300 w-fit rounded-xs items-center flex-row",
        isFocused && "ring-[#61A9F9] border-[#61A9F9]",
        showError && "ring-red-600 border-red-600",
        containerClassName
      )}
    >
      <input
        type="number"
        placeholder="HH"
        disabled={!editable || disabled}
        value={hour}
        onChange={(e) => handleChange("hour", e.target.value)}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        min={0}
        max={24}
        className={inputClass}
      />
      <span className="-translate-y-[1px]">:</span>
      <input
        type="number"
        placeholder="MM"
        disabled={!editable || disabled}
        value={minute}
        onChange={(e) => handleChange("minute", e.target.value)}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        min={0}
        max={59}
        className={inputClass}
      />
      {withSeconds && (
        <>
          <span className="-translate-y-[1px]">:</span>
          <input
            type="number"
            placeholder="SS"
            disabled={!editable || disabled}
            value={second}
            onChange={(e) => handleChange("second", e.target.value)}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            min={0}
            max={59}
            className={inputClass}
          />
        </>
      )}
    </div>
  );

  const inputId = `textbox-${name}`;

  return (
    <div
      className={cn(
        `flex w-full flex-col gap-2 text-xs`,
        disabled && "cursor-not-allowed opacity-50",
        containerClassName
      )}
    >
      {label && <label htmlFor={inputId}>{label}</label>}
      <div className="flex flex-col gap-1 text-xs">
        {inputElement}
        {showError && <span className="text-red-600">{errorMessage}</span>}
      </div>
    </div>
  );
}
