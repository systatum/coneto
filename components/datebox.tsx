import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import React, {
  HTMLAttributes,
  CSSProperties,
  MutableRefObject,
  useState,
  useEffect,
  Ref,
} from "react";
import { Button } from "./button";
import { cn } from "../lib/utils";

interface DateboxProps {
  options?: string[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  setInputValue: (value: string) => void;
  inputValue: string;
  setIsOpen: (open: boolean) => void;
  getFloatingProps?: (
    userProps?: HTMLAttributes<HTMLUListElement>
  ) => HTMLAttributes<HTMLUListElement>;
  refs?: { setFloating: Ref<HTMLUListElement> };
  floatingStyles?: CSSProperties;
  listRef?: MutableRefObject<(HTMLLIElement | null)[]>;
  dayNames: string[];
  monthNames: string[];
  disableWeekend?: boolean;
  minDateOffset?: number;
  maxDateOffset?: number;
  format?: FormatProps;
}

type FormatProps = "mm/dd/yyyy" | "yyyy-mm-dd" | "dd/mm/yyyy";
type DateModeProps = "day" | "month" | "year";

export default function Datebox({
  highlightedIndex,
  setHighlightedIndex,
  setInputValue,
  inputValue,
  setIsOpen,
  getFloatingProps,
  refs,
  floatingStyles,
  listRef,
  dayNames,
  monthNames,
  disableWeekend,
  minDateOffset = 80,
  maxDateOffset = 50,
  format = "mm/dd/yyyy",
}: DateboxProps) {
  const STATE_DATE = inputValue !== "" ? new Date(inputValue) : new Date();
  const [currentDate, setCurrentDate] = useState(STATE_DATE);
  const [mode, setMode] = useState<DateModeProps>("day");

  if (!listRef.current) {
    listRef.current = [];
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days: Date[] = [];
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);

  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - (minDateOffset ?? 80),
    today.getMonth(),
    today.getDate()
  );
  const maxDate = new Date(
    today.getFullYear() + (maxDateOffset ?? 50),
    today.getMonth(),
    today.getDate()
  );

  const isYearInRange =
    currentDate.getFullYear() >= minDate.getFullYear() &&
    currentDate.getFullYear() <= maxDate.getFullYear();

  const moveToToday = () => {
    setCurrentDate(today);
    setMode("day");
    setHighlightedIndex(0);
  };

  const prevMonth = () => {
    const prev = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    if (prev < minDate) return;
    setCurrentDate(prev);
    setHighlightedIndex(0);
  };

  const nextMonth = () => {
    const next = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    if (next > maxDate) return;
    setCurrentDate(next);
    setHighlightedIndex(0);
  };

  const handleSelect = (date: Date) => {
    setInputValue(formatDate(date, format));
    setIsOpen(false);
  };

  const emptyCellsCount = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handleClickMode = (data: DateModeProps) => {
    if (data === "day") {
      setMode("month");
    } else if (data === "month") {
      setMode("year");
    }
  };

  useEffect(() => {
    if (inputValue) {
      const newDate = new Date(inputValue);
      if (!isNaN(newDate.getTime())) {
        let validDate = newDate;

        if (newDate < minDate) {
          validDate = minDate;
        } else if (newDate > maxDate) {
          validDate = maxDate;
        }

        setCurrentDate(validDate);
      }
    }
  }, [inputValue, format]);

  return (
    <ul
      {...getFloatingProps()}
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
      }}
      tabIndex={-1}
      role="listbox"
      aria-label="Calendar"
      className="flex flex-col gap-1 bg-white border border-gray-300 rounded w-full p-2 shadow-xs z-[9999] list-none outline-none"
    >
      <div className="flex flex-row justify-between items-center mb-2 px-2">
        <div
          onClick={() => handleClickMode(mode)}
          className="font-semibold cursor-pointer w-full"
        >
          {mode === "day"
            ? currentDate.toLocaleString("default", {
                month: "short",
                year: "numeric",
              })
            : mode === "month"
              ? currentDate.toLocaleString("default", {
                  year: "numeric",
                })
              : ""}
        </div>
        {mode === "day" && (
          <div className="flex flex-row ml-2 w-full">
            <RiArrowLeftSLine
              onClick={prevMonth}
              size={20}
              aria-label="Previous Month"
              className="rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#61A9F9]"
            />

            <RiArrowRightSLine
              onClick={nextMonth}
              size={20}
              aria-label="Next Month"
              className="rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#61A9F9]"
            />
          </div>
        )}

        <Button
          onClick={moveToToday}
          variant="outline"
          className="border-gray-300 w-full max-w-[60px] text-xs p-1 px-2"
        >
          Today
        </Button>
      </div>
      {mode === "day" ? (
        <>
          <li>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-1 select-none pointer-events-none">
              {dayNames.map((data, index) => (
                <div key={index}>{data}</div>
              ))}
            </div>
          </li>
          <div className="w-full grid grid-cols-7 gap-[2px] pb-2">
            {Array(emptyCellsCount)
              .fill(null)
              .map((_, i) => (
                <li key={`empty-${i}`} />
              ))}
            {days.map((date, i) => {
              const idx = i + emptyCellsCount + 1;
              const isHighlighted = idx === highlightedIndex;
              const selectedDate = inputValue
                ? new Date(inputValue)
                : new Date();
              const isCurrentDate =
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();

              const isToday =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              return (
                <li
                  key={date.toISOString()}
                  ref={(el) => {
                    listRef.current[idx] = el;
                  }}
                  role="option"
                  aria-selected={isHighlighted}
                  id={`option-${idx}`}
                  onClick={() => {
                    if (isWeekend && disableWeekend) {
                      return;
                    }
                    handleSelect(date);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  tabIndex={isHighlighted ? 0 : -1}
                  className={`cursor-pointer flex self-center justify-center text-center`}
                >
                  <span
                    className={cn(
                      "w-6 h-6 p-1 rounded-full relative",
                      disableWeekend && isWeekend
                        ? "text-gray-300"
                        : isWeekend && "text-red-300",
                      isHighlighted
                        ? "bg-[#61A9F9] text-white"
                        : "hover:bg-blue-200 focus:outline-none focus:bg-blue-200",
                      isHighlighted &&
                        disableWeekend &&
                        isWeekend &&
                        "bg-white text-gray-300 cursor-default",
                      isCurrentDate
                        ? "bg-[#61A9F9] text-white"
                        : isToday && !isCurrentDate
                          ? "text-[#61A9F9]"
                          : "",
                      isToday && isHighlighted && "text-white"
                    )}
                  >
                    {date.getDate()}
                    {isToday && (
                      <div className="border-[#61A9F9] bg-[#61A9F9] absolute bottom-[1px] left-[10px] border w-[3px] h-[3px]"></div>
                    )}
                  </span>
                </li>
              );
            })}
          </div>
        </>
      ) : mode === "month" ? (
        <div className="grid grid-cols-4 gap-1">
          {monthNames.map((monthName, index) => {
            const currentYear = currentDate.getFullYear();

            const isSelectedMonth = currentDate.getMonth() === index;
            const isCurrentMonth =
              new Date().getMonth() === index &&
              new Date().getFullYear() === currentDate.getFullYear();
            const isBeforeMin =
              currentYear === minDate.getFullYear() &&
              index < minDate.getMonth();
            const isAfterMax =
              currentYear === maxDate.getFullYear() &&
              index > maxDate.getMonth();
            const isDisableMonth = isBeforeMin || isAfterMax;

            return (
              <li
                key={index}
                onClick={() => {
                  if (!isYearInRange || isDisableMonth) return;
                  setCurrentDate(new Date(currentDate.getFullYear(), index, 1));
                  setMode("day");
                }}
                className={cn(
                  "flex justify-center items-center",
                  isYearInRange ? "cursor-pointer" : "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "w-full text-center relative text-sm py-1",
                    isYearInRange
                      ? isSelectedMonth
                        ? "bg-[#61A9F9] text-white"
                        : "hover:bg-blue-200 focus:outline-none focus:bg-blue-200"
                      : "text-gray-400",
                    isCurrentMonth && !isSelectedMonth && "text-[#61A9F9]",
                    isDisableMonth && "text-gray-200"
                  )}
                >
                  {monthName}
                  {isCurrentMonth && !isSelectedMonth && isYearInRange && (
                    <div className="border-[#61A9F9] bg-[#61A9F9] absolute bottom-[1px] left-1/2 border w-[3px] h-[3px]"></div>
                  )}
                </span>
              </li>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1 max-h-[200px] overflow-y-auto scrollbar-thin">
          {Array.from(
            { length: maxDate.getFullYear() - minDate.getFullYear() + 1 },
            (_, i) => minDate.getFullYear() + i
          ).map((year) => {
            const isSelectedYear = currentDate.getFullYear() === year;
            const isCurrentYear = new Date().getFullYear() === year;
            const isInRange =
              year >= minDate.getFullYear() && year <= maxDate.getFullYear();

            return (
              <li
                key={year}
                onClick={() => {
                  if (!isInRange) return;
                  let validMonth = 0;
                  for (let m = 0; m < 12; m++) {
                    const beforeMin =
                      year === minDate.getFullYear() && m < minDate.getMonth();
                    const afterMax =
                      year === maxDate.getFullYear() && m > maxDate.getMonth();

                    if (!beforeMin && !afterMax) {
                      validMonth = m;
                      break;
                    }
                  }

                  setCurrentDate(
                    new Date(
                      year,
                      validMonth,
                      year === minDate.getFullYear() &&
                      validMonth === minDate.getMonth()
                        ? minDate.getDate()
                        : 1
                    )
                  );

                  setMode("month");
                }}
                className="flex justify-center items-center cursor-pointer"
              >
                <div
                  className={cn(
                    "w-full text-center text-sm py-1 relative",
                    isSelectedYear
                      ? "bg-[#61A9F9] text-white"
                      : "hover:bg-blue-200 focus:outline-none focus:bg-blue-200",
                    isCurrentYear && !isSelectedYear && "text-[#61A9F9]"
                  )}
                >
                  {year}
                  {isCurrentYear && !isSelectedYear && (
                    <div className="border-[#61A9F9] bg-[#61A9F9] absolute bottom-[1px] left-1/2 border w-[3px] h-[3px]"></div>
                  )}
                </div>
              </li>
            );
          })}
        </div>
      )}
    </ul>
  );
}

function formatDate(date: Date, format: FormatProps) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  switch (format) {
    case "yyyy-mm-dd":
      return `${year}-${month}-${day}`;
    case "dd/mm/yyyy":
      return `${day}/${month}/${year}`;
    case "mm/dd/yyyy":
    default:
      return `${month}/${day}/${year}`;
  }
}
