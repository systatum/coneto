import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckLine,
} from "@remixicon/react";
import {
  HTMLAttributes,
  CSSProperties,
  MutableRefObject,
  useState,
  useEffect,
  Ref,
  ChangeEvent,
} from "react";
import { Button } from "./button";
import { cn } from "../lib/utils";

import Combobox from "./combobox";

interface CalendarDrawerProps {
  options?: string[];
  highlightedIndex?: number;
  setHighlightedIndex?: (index: number) => void;
  setInputValue: (value: string) => void;
  inputValue: string;
  setIsOpen?: (open: boolean) => void;
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
  className?: string;
}

interface OpenBoxProps {
  open: boolean;
  month: string;
  year: string;
}

type FormatProps = "mm/dd/yyyy" | "yyyy-mm-dd" | "dd/mm/yyyy";
type DateBoxOpen = "open" | "month" | "year";

function CalendarDrawer({
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
  className,
}: CalendarDrawerProps) {
  const STATE_DATE = inputValue !== "" ? new Date(inputValue) : new Date();
  const [currentDate, setCurrentDate] = useState(STATE_DATE);

  const monthCurrent = STATE_DATE.toLocaleString("default", {
    month: "short",
  });
  const yearCurrent = STATE_DATE.toLocaleString("default", {
    year: "numeric",
  });

  const [isBoxOpen, setIsBoxOpen] = useState<OpenBoxProps>({
    open: false,
    month: monthCurrent.toUpperCase(),
    year: yearCurrent,
  });

  const [highlightedIndexInternal, setHighlightedIndexInternal] = useState(0);
  const highlightedIndexChange = highlightedIndex ?? highlightedIndexInternal;

  const setHighlightedIndexChange = (index: number) => {
    if (setHighlightedIndex) {
      setHighlightedIndex(index);
    } else {
      setHighlightedIndexInternal(index);
    }
  };

  if (listRef && !listRef.current) {
    listRef.current = [];
  }

  const onChangeValueDate = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsBoxOpen((prev) => ({ ...prev, [name]: value }));
    if (name === "month") {
      const monthIndex = monthNames.findIndex(
        (month) => month.toLowerCase() === value.toLowerCase()
      );
      setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    } else if (name === "year") {
      const yearNumber = parseInt(value, 10);
      if (!isNaN(yearNumber)) {
        const month = currentDate.getMonth();
        const day = Math.min(
          currentDate.getDate(),
          new Date(yearNumber, month + 1, 0).getDate()
        );
        setCurrentDate(new Date(yearNumber, month, day));
      }
    }
  };

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

  const yearOptions = Array.from(
    { length: maxDate.getFullYear() - minDate.getFullYear() + 1 },
    (_, i) => String(minDate.getFullYear() + i)
  );

  const moveToToday = () => {
    setCurrentDate(today);
    setInputValue(formatDate(today, format));
    setHighlightedIndexChange(0);
    setIsBoxOpen((prev) => ({
      ...prev,
      month: monthCurrent.toUpperCase(),
      year: yearCurrent,
    }));
  };

  const prevClickDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

  const nextClickDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );

  const isLimitedPrev = prevClickDate < minDate;
  const isLimitedNext = nextClickDate > maxDate;

  const prevMonth = () => {
    if (isLimitedPrev) return;
    setCurrentDate(prevClickDate);
    setHighlightedIndexChange(0);
    setIsBoxOpen((prev) => ({
      ...prev,
      month: prevClickDate
        .toLocaleString("default", { month: "short" })
        .toUpperCase(),
      year: prevClickDate.getFullYear().toString(),
    }));
  };

  const nextMonth = () => {
    if (isLimitedNext) return;
    setCurrentDate(nextClickDate);
    setHighlightedIndexChange(0);
    setIsBoxOpen((prev) => ({
      ...prev,
      month: nextClickDate
        .toLocaleString("default", { month: "short" })
        .toUpperCase(),
      year: nextClickDate.getFullYear().toString(),
    }));
  };

  const handleSelect = (date: Date) => {
    setInputValue(formatDate(date, format));
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  const emptyCellsCount = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handleClickMode = (data: DateBoxOpen) => {
    if (data === "open") {
      setIsBoxOpen((prev) => ({
        ...prev,
        open: !isBoxOpen.open,
      }));
    }
  };

  useEffect(() => {
    if (inputValue) {
      const newDate = new Date(inputValue);
      if (!isNaN(newDate.getTime())) {
        let validDate = newDate;

        if (validDate < minDate) {
          validDate = minDate;
        } else if (validDate > maxDate) {
          validDate = maxDate;
        }

        if (disableWeekend) {
          const day = validDate.getDay();
          if (day === 6) {
            validDate.setDate(validDate.getDate() - 1);
          } else if (day === 0) {
            validDate.setDate(validDate.getDate() + 1);
          }
        }

        setCurrentDate(validDate);
        if (inputValue.length > 9) {
          setInputValue(formatDate(validDate, format));
        }
      }
    }
  }, [inputValue, format]);

  const calendarClass = cn(
    "flex flex-col gap-1 bg-white border border-gray-300 rounded-xs w-full shadow-xs list-none outline-none",
    floatingStyles ? "p-2 z-[9999]" : "p-3 text-sm min-w-[300px]",
    className
  );

  return (
    <ul
      {...(getFloatingProps?.() ?? {})}
      ref={refs?.setFloating ?? null}
      style={{
        ...(floatingStyles ?? {}),
      }}
      tabIndex={-1}
      role="listbox"
      aria-label="Calendar"
      className={calendarClass}
    >
      <div className={cn("flex flex-row items-center mb-2 px-2")}>
        <div
          onClick={() => {
            if (!isBoxOpen.open) {
              handleClickMode("open");
            }
          }}
          className="font-semibold cursor-pointer w-full"
        >
          {!isBoxOpen.open ? (
            <div className="rounded-xs hover:bg-gray-200 w-fit px-2 py-2">
              {currentDate
                .toLocaleString("default", {
                  month: "short",
                  year: "numeric",
                })
                .toUpperCase()}
            </div>
          ) : (
            <div className="flex flex-row gap-1 w-full">
              <Combobox
                options={monthNames}
                inputValue={isBoxOpen.month}
                placeholder="JAN"
                classNameContainer="min-w-[60px] max-w-[70px]"
                setInputValue={(value) => {
                  onChangeValueDate({
                    target: { name: "month", value },
                  } as ChangeEvent<HTMLInputElement>);
                }}
              />
              <Combobox
                options={yearOptions}
                inputValue={isBoxOpen.year}
                placeholder="2025"
                classNameContainer="min-w-[70px] max-w-[80px]"
                setInputValue={(value) => {
                  onChangeValueDate({
                    target: { name: "year", value },
                  } as ChangeEvent<HTMLInputElement>);
                }}
              />
              <Button
                variant="outline"
                className="border-gray-100 w-full shadow-none max-h-[34px] max-w-[38px] text-xs px-2"
                onClick={() => handleClickMode("open")}
              >
                <RiCheckLine size={20} />
              </Button>
            </div>
          )}
        </div>
        {!isBoxOpen.open && (
          <div className="flex flex-row ml-2 w-full">
            <RiArrowLeftSLine
              onClick={prevMonth}
              size={24}
              aria-label="Previous Month"
              className={cn(
                "rounded-xs focus:outline-none focus:ring-2 focus:ring-[#61A9F9]",
                isLimitedPrev
                  ? "text-gray-200"
                  : "cursor-pointer hover:bg-gray-200"
              )}
            />

            <RiArrowRightSLine
              onClick={nextMonth}
              size={24}
              aria-label="Next Month"
              className={cn(
                "rounded-xs focus:outline-none focus:ring-2 focus:ring-[#61A9F9]",
                isLimitedNext
                  ? "text-gray-200"
                  : "cursor-pointer hover:bg-gray-200"
              )}
            />
          </div>
        )}

        <Button
          onClick={moveToToday}
          variant="outline"
          className="border-gray-100 w-full hover:bg-gray-200 shadow-none max-h-[34px] max-w-[60px] text-xs px-2"
        >
          Today
        </Button>
      </div>

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
            const isHighlighted = idx === highlightedIndexChange;
            const selectedDate = inputValue ? new Date(inputValue) : new Date();
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
                  if (listRef?.current) {
                    listRef.current[idx] = el;
                  }
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
                onMouseEnter={() => setHighlightedIndexChange(idx)}
                tabIndex={isHighlighted ? 0 : -1}
                className={cn(
                  `flex self-center justify-center text-center`,
                  isHighlighted &&
                    (!disableWeekend || !isWeekend) &&
                    "cursor-pointer"
                )}
              >
                <span
                  className={cn(
                    "w-6 h-6 rounded-full relative border border-transparent",
                    floatingStyles ? "p-[3px]" : "p-[2px]",
                    disableWeekend && isWeekend
                      ? "text-gray-300"
                      : isWeekend && "text-red-300",
                    isHighlighted
                      ? "border-[#61A9F9] border text-[#61A9F9]"
                      : "hover:bg-blue-200 focus:outline-none focus:bg-blue-200",
                    isHighlighted &&
                      disableWeekend &&
                      isWeekend &&
                      "bg-white text-gray-300 border-transparent select-none cursor-default",
                    isCurrentDate
                      ? "bg-[#61A9F9] text-white"
                      : isToday && !isCurrentDate
                        ? "text-[#61A9F9]"
                        : isToday && isHighlighted && "text-white"
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

const Calendar = CalendarDrawer;
export { Calendar, CalendarDrawer };
