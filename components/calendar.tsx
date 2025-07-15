import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckLine,
} from "@remixicon/react";
import { Fragment } from "react";
import { useState, useEffect } from "react";
import { Button } from "./button";
import { cn } from "../lib/utils";
import Combobox from "./combobox";
import { DrawerProps, OptionsProps } from "./selectbox";

export interface BaseCalendarProps {
  options?: OptionsProps[];
  inputValue?: OptionsProps;
  setInputValue?: (data: OptionsProps) => void;
  dayNames?: OptionsProps[];
  monthNames?: OptionsProps[];
  disableWeekend?: boolean;
  format?: FormatProps;
  containerClassName?: string;
  yearPastReach?: number;
  futurePastReach?: number;
}

type CalendarProps = BaseCalendarProps &
  Partial<DrawerProps> & {
    label?: string;
    showError?: boolean;
    errorMessage?: string;
  };

interface CalendarStateProps {
  open: boolean;
  month: OptionsProps;
  year: OptionsProps;
}

type CustomChangeEvent = {
  target: {
    name: string;
    value: OptionsProps;
  };
};

export type FormatProps = "mm/dd/yyyy" | "yyyy-mm-dd" | "dd/mm/yyyy";
export type DateBoxOpen = "open" | "month" | "year";

const DEFAULT_DAY_NAMES = [
  { text: "Su", value: 1 },
  { text: "Mo", value: 2 },
  { text: "Tu", value: 3 },
  { text: "We", value: 4 },
  { text: "Th", value: 5 },
  { text: "Fr", value: 6 },
  { text: "Sa", value: 7 },
];

const DEFAULT_MONTH_NAMES = [
  { text: "January", value: 1 },
  { text: "February", value: 2 },
  { text: "March", value: 3 },
  { text: "April", value: 4 },
  { text: "May", value: 5 },
  { text: "June", value: 6 },
  { text: "July", value: 7 },
  { text: "August", value: 8 },
  { text: "September", value: 9 },
  { text: "October", value: 10 },
  { text: "November", value: 11 },
  { text: "December", value: 12 },
];

export default function Calendar({
  highlightedIndex,
  setHighlightedIndex,
  setInputValue,
  inputValue,
  setIsOpen,
  floatingStyles,
  listRef,
  dayNames = DEFAULT_DAY_NAMES,
  monthNames = DEFAULT_MONTH_NAMES,
  disableWeekend,
  yearPastReach = 80,
  futurePastReach = 50,
  format = "mm/dd/yyyy",
  className,
  label,
  showError,
  errorMessage,
}: CalendarProps) {
  const parsedDate = inputValue?.text ? new Date(inputValue.text) : new Date();
  const stateDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(stateDate);

  const currentMonth = monthNames.find(
    (data) => data.value === stateDate.getMonth() + 1
  );
  const currentYear = stateDate.getFullYear();

  const [calendarState, setCalendarState] = useState<CalendarStateProps>({
    open: false,
    month: currentMonth,
    year: { text: String(currentYear), value: currentYear },
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

  const onChangeValueDate = (e: CustomChangeEvent) => {
    const { name, value } = e.target;
    handleChangeValueDate(name, value);
  };

  const handleChangeValueDate = (name: string, value: OptionsProps) => {
    setCalendarState((prev) => ({ ...prev, [name]: value }));

    if (name === "month") {
      const monthIndex = Number(value.value) - 1;
      setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    } else if (name === "year") {
      const yearNumber = Number(value.value);
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

  const getDatesInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const dates: Date[] = [];
    const lastDate = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDate; i++) {
      dates.push(new Date(year, month, i));
    }
    return dates;
  };

  const dates = getDatesInMonth(currentDate);

  const minDate = new Date(
    today.getFullYear() - (yearPastReach ?? 80),
    today.getMonth(),
    today.getDate()
  );
  const maxDate = new Date(
    today.getFullYear() + (futurePastReach ?? 50),
    today.getMonth(),
    today.getDate()
  );

  const yearOptions = Array.from(
    { length: maxDate.getFullYear() - minDate.getFullYear() + 1 },
    (_, i) => {
      const year = minDate.getFullYear() + i;
      return {
        text: String(year),
        value: year,
      };
    }
  );

  const prevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

  const nextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );

  const handleClickPrevMonth = () => {
    setCurrentDate(prevMonth);
    setHighlightedIndexChange(0);
    setCalendarState((prev) => ({
      ...prev,
      month: {
        text: prevMonth
          .toLocaleString("default", { month: "short" })
          .toUpperCase(),
        value: prevMonth.getMonth() + 1,
      },
      year: {
        text: prevMonth.getFullYear().toString(),
        value: prevMonth.getFullYear(),
      },
    }));
  };

  const handleClickNextMonth = () => {
    setCurrentDate(nextMonth);
    setHighlightedIndexChange(0);
    setCalendarState((prev) => ({
      ...prev,
      month: {
        text: nextMonth
          .toLocaleString("default", { month: "short" })
          .toUpperCase(),
        value: nextMonth.getMonth() + 1,
      },
      year: {
        text: nextMonth.getFullYear().toString(),
        value: nextMonth.getFullYear(),
      },
    }));
  };

  const handleMoveToToday = () => {
    setCurrentDate(today);
    setInputValue({
      text: formatDate(today, format),
      value: formatDate(today, format),
    });

    setHighlightedIndexChange(0);
    setCalendarState((prev) => ({
      ...prev,
      month: {
        value: currentMonth.value,
        text: currentMonth.text.toUpperCase(),
      },
      year: {
        text: String(currentYear),
        value: currentYear,
      },
    }));
  };

  const handleSelect = (date: Date) => {
    setInputValue({
      text: formatDate(date, format),
      value: formatDate(date, format),
    });
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
      setCalendarState((prev) => ({
        ...prev,
        open: !calendarState.open,
      }));
    }
  };

  useEffect(() => {
    if (inputValue) {
      const newDate = new Date(inputValue.text);
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
        if (inputValue.text.length > 9) {
          setInputValue({
            text: formatDate(validDate, format),
            value: formatDate(validDate, format),
          });
        }
      }
    }
  }, [inputValue.text, format]);

  const calendarClass = cn(
    floatingStyles
      ? ""
      : "p-2 text-sm min-w-[300px] flex flex-col gap-2 bg-white border border-gray-300 rounded-xs w-full shadow-xs list-none outline-none",
    className
  );

  const inputElement = (
    <div className={calendarClass}>
      <div
        className={cn(
          "flex flex-row font-semibold justify-between w-full items-center mb-2 px-2 gap-2"
        )}
      >
        {!calendarState.open ? (
          <div className="rounded-xs w-full flex items-center">
            <span
              className="w-fit hover:bg-gray-200 cursor-pointer text-xs px-2 py-2"
              onClick={() => {
                if (!calendarState.open) {
                  handleClickMode("open");
                }
              }}
            >
              {currentDate
                .toLocaleString("default", {
                  month: "short",
                  year: "numeric",
                })
                .toUpperCase()}
            </span>
          </div>
        ) : (
          <Fragment>
            <Combobox
              options={monthNames}
              inputValue={calendarState.month}
              placeholder={monthNames[0].text}
              containerClassName="min-w-[70px] max-w-[70px]"
              setInputValue={(value) => {
                onChangeValueDate({
                  target: { name: "month", value },
                });
              }}
            />
            <Combobox
              options={yearOptions}
              inputValue={calendarState.year}
              placeholder={String(currentYear)}
              containerClassName="min-w-[75px] max-w-[75px]"
              setInputValue={(value) => {
                onChangeValueDate({
                  target: { name: "year", value },
                });
              }}
            />

            <RiCheckLine
              size={24}
              onClick={() => handleClickMode("open")}
              className="rounded-xs focus:outline-none cursor-pointer p-1 hover:bg-gray-200"
              aria-label="Select date"
            />
          </Fragment>
        )}
        {!calendarState.open && (
          <div className="flex flex-row w-full">
            <RiArrowLeftSLine
              onClick={handleClickPrevMonth}
              size={24}
              aria-label="Previous Month"
              className="rounded-xs focus:outline-none cursor-pointer hover:bg-gray-200"
            />

            <RiArrowRightSLine
              onClick={handleClickNextMonth}
              size={24}
              aria-label="Next Month"
              className="rounded-xs focus:outline-none cursor-pointer hover:bg-gray-200"
            />
          </div>
        )}

        <Button
          onClick={handleMoveToToday}
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
              <div key={index}>{data.text}</div>
            ))}
          </div>
        </li>
        <div className="w-full grid grid-cols-7 gap-[2px] pb-2">
          {Array(emptyCellsCount)
            .fill(null)
            .map((_, i) => (
              <li key={`empty-${i}`} />
            ))}
          {dates.map((date, i) => {
            const idx = i + emptyCellsCount + 1;
            const isHighlighted = idx === highlightedIndexChange;
            const selectedDate = inputValue.text
              ? new Date(inputValue.text)
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
    </div>
  );

  return (
    <div className={cn(`flex w-full flex-col gap-2 text-xs`)}>
      {label && <label>{label}</label>}
      <div className="flex flex-col gap-1 text-xs">
        {inputElement}
        {showError && <span className="text-red-600">{errorMessage}</span>}
      </div>
    </div>
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
