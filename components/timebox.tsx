import { useEffect, useState } from "react";
import { cn } from "./../lib/utils";
import rawDayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

rawDayjs.extend(utc);
rawDayjs.extend(timezone);
const dayjs = rawDayjs;

interface TimeboxProps {
  withSeconds?: boolean;
  onChange?: (value: string) => void;
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
    if (value === "") {
      if (type === "hour") setHour("");
      if (type === "minute") setMinute("");
      if (type === "second") setSecond("");
      return;
    }

    const number = parseInt(value, 10);
    if (isNaN(number)) return;

    if (type === "hour" && number <= 24) setHour(value);
    if (type === "minute" && number <= 59) setMinute(value);
    if (type === "second" && number <= 59) setSecond(value);

    const hh = type === "hour" ? value : hour;
    const mm = type === "minute" ? value : minute;
    const ss = type === "second" ? value : second;

    const formatted = [
      hh.padStart(2, "0"),
      mm.padStart(2, "0"),
      ...(withSeconds ? [ss.padStart(2, "0")] : []),
    ].join(":");

    onChange?.(formatted);
  };

  const handleFocus = (setter: (v: string) => void) => () => setter("");

  const inputClass = cn(
    "w-[50px] text-center border-none items-center px-1 py-1 bg-white border border-gray-300 focus:outline-none placeholder:text-center focus:bg-yellow-200 leading-[30px]",
    "appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
    editable && "hover:text-gray-500"
  );

  return (
    <div className="flex border border-gray-300 w-fit rounded-xs  items-center flex-row gap-1">
      <input
        type="number"
        placeholder="HH"
        disabled={!editable}
        value={hour}
        onChange={(e) => handleChange("hour", e.target.value)}
        onFocus={handleFocus(setHour)}
        min={0}
        max={24}
        className={cn(inputClass)}
      />
      <span>:</span>
      <input
        type="number"
        placeholder="MM"
        disabled={!editable}
        value={minute}
        onChange={(e) => handleChange("minute", e.target.value)}
        onFocus={handleFocus(setMinute)}
        min={0}
        max={59}
        className={cn(inputClass)}
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
            onFocus={handleFocus(setSecond)}
            min={0}
            max={59}
            className={cn(inputClass)}
          />
        </>
      )}
    </div>
  );
}
