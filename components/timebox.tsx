import { ChangeEvent, useEffect, useState } from "react";
import { cn } from "./../lib/utils";
import rawDayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

rawDayjs.extend(utc);
rawDayjs.extend(timezone);
const dayjs = rawDayjs;

interface TimeboxProps {
  withSeconds?: boolean;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean;
  timezone?: string;
}

export function Timebox({
  withSeconds = false,
  timezone = "Asia/Jakarta",
  onChange,
  editable = true,
}: TimeboxProps) {
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [second, setSecond] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  const syncTime = (time: string) => {
    const now = dayjs().tz(time);
    const hh = now.format("HH");
    const mm = now.format("mm");
    const ss = now.format("ss");

    setHour(hh);
    setMinute(mm);
    setSecond(ss);
  };

  useEffect(() => {
    if (!editable) {
      syncTime(timezone);

      const interval = setInterval(() => {
        syncTime(timezone);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [editable]);

  const handleChange = (type: "hour" | "minute" | "second", value: string) => {
    const newDigit = value.slice(-1);
    if (value === "") {
      if (type === "hour") setHour("");
      if (type === "minute") setMinute("");
      if (type === "second") setSecond("");
      return;
    }

    if (newDigit === "" || isNaN(Number(newDigit))) return;

    let newVal = "";
    let max = 0;

    if (type === "hour") {
      newVal = hour.length >= 2 ? newDigit : hour + newDigit;
      max = 24;
      if (parseInt(newVal, 10) > max) return;
      setHour(newVal);
    }

    if (type === "minute") {
      newVal = minute.length >= 2 ? newDigit : minute + newDigit;
      max = 59;
      if (parseInt(newVal, 10) > max) return;
      setMinute(newVal);
    }

    if (type === "second") {
      newVal = second.length >= 2 ? newDigit : second + newDigit;
      max = 59;
      if (parseInt(newVal, 10) > max) return;
      setSecond(newVal);
    }

    const hh = type === "hour" ? newVal : hour;
    const mm = type === "minute" ? newVal : minute;
    const ss = type === "second" ? newVal : second;

    const formatted = [
      hh.padStart(2, "0"),
      mm.padStart(2, "0"),
      ...(withSeconds ? [ss.padStart(2, "0")] : []),
    ].join(":");

    const valueTime = {
      target: {
        name: "timebox",
        value: formatted,
      },
    } as ChangeEvent<HTMLInputElement>;
    onChange?.(valueTime);
  };

  const inputClass = cn(
    "w-[50px] text-center border-none items-center px-1 py-1 text-sm bg-white border border-gray-300 focus:outline-none placeholder:text-center",
    "appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
    editable && "hover:text-gray-500"
  );

  console.log(hour);

  return (
    <div
      className={cn(
        "flex border border-gray-300 w-fit rounded-xs  items-center flex-row",
        isFocused && "ring-[#61A9F9] border-[#61A9F9]"
      )}
    >
      <input
        type="number"
        placeholder="HH"
        disabled={!editable}
        value={hour}
        onChange={(e) => handleChange("hour", e.target.value)}
        onFocus={() => {
          setHour("");
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        min={0}
        max={24}
        className={inputClass}
      />
      <span>:</span>
      <input
        type="number"
        placeholder="MM"
        disabled={!editable}
        value={minute}
        onChange={(e) => handleChange("minute", e.target.value)}
        onFocus={() => {
          setMinute("");
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
          <span>:</span>
          <input
            type="number"
            placeholder="SS"
            disabled={!editable}
            value={second}
            onChange={(e) => handleChange("second", e.target.value)}
            onFocus={() => {
              setSecond("");
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
}
