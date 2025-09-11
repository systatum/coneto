import {
  RemixiconComponentType,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckLine,
} from "@remixicon/react";
import { Fragment, ReactElement, useMemo, ReactNode } from "react";
import { useState, useEffect } from "react";
import { Button } from "./button";
import { Combobox } from "./combobox";
import { DrawerProps, OptionsProps } from "./selectbox";
import styled, { css, CSSProp } from "styled-components";

export interface BaseCalendarProps {
  options?: OptionsProps[];
  inputValue?: OptionsProps;
  setInputValue?: (data: OptionsProps) => void;
  dayNames?: OptionsProps[];
  monthNames?: OptionsProps[];
  disableWeekend?: boolean;
  format?: FormatProps;
  containerStyle?: CSSProp;
  style?: CSSProp;
  yearPastReach?: number;
  futurePastReach?: number;
  onClick?: () => void;
  onCalendarPeriodChanged?: (data: Date) => void;
  selectability?: SelectabilityState;
}

type CalendarProps = BaseCalendarProps &
  Partial<DrawerProps> & {
    label?: string;
    showError?: boolean;
    errorMessage?: string;
    footer?: ReactNode;
    todayButtonCaption?: string;
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

export type FormatProps = "mm/dd/yyyy" | "yyyy/mm/dd" | "dd/mm/yyyy";
export type DateBoxOpen = "open" | "month" | "year";
type SelectabilityState = "single" | "multiple" | "ranged";

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

function Calendar({
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
  style,
  label,
  showError,
  errorMessage,
  onClick,
  containerStyle,
  footer,
  todayButtonCaption = "Today",
  onCalendarPeriodChanged,
  selectability = "single",
}: CalendarProps) {
  const parsedDate = inputValue?.text ? new Date(inputValue.text) : new Date();
  const stateDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(stateDate);

  const currentMonth = monthNames.find(
    (data) => data.value === today.getMonth() + 1
  );
  const currentYear = today.getFullYear();

  const [calendarState, setCalendarState] = useState<CalendarStateProps>({
    open: false,
    month: currentMonth,
    year: { text: String(currentYear), value: currentYear },
  });

  const [inputValueLocal, setinputValueLocal] = useState(inputValue.text);
  const [startPicked, setStartPicked] = useState({
    picked: false,
    indexPicked: new Date(),
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
      const dateMonth = new Date(currentDate.getFullYear(), monthIndex, 1);
      setCurrentDate(dateMonth);
      if (onCalendarPeriodChanged) {
        onCalendarPeriodChanged(dateMonth);
      }
    } else if (name === "year") {
      const yearNumber = Number(value.value);
      if (!isNaN(yearNumber)) {
        const month = currentDate.getMonth();
        const day = Math.min(
          currentDate.getDate(),
          new Date(yearNumber, month + 1, 0).getDate()
        );
        const dateYear = new Date(yearNumber, month, day);
        setCurrentDate(dateYear);
        if (onCalendarPeriodChanged) {
          onCalendarPeriodChanged(dateYear);
        }
      }
    }
  };

  const dates = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const arr: Date[] = [];
    for (let i = 1; i <= lastDate; i++) arr.push(new Date(year, month, i));
    return arr;
  }, [currentDate]);

  const { yearOptions } = useMemo(() => {
    const t = new Date();
    const min = new Date(
      t.getFullYear() - (yearPastReach ?? 80),
      t.getMonth(),
      t.getDate()
    );
    const max = new Date(
      t.getFullYear() + (futurePastReach ?? 50),
      t.getMonth(),
      t.getDate()
    );
    const years = Array.from(
      { length: max.getFullYear() - min.getFullYear() + 1 },
      (_, i) => ({
        text: String(min.getFullYear() + i),
        value: min.getFullYear() + i,
      })
    );
    return { yearOptions: years };
  }, [yearPastReach, futurePastReach]);

  const prevMonth = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    [currentDate]
  );

  const nextMonth = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    [currentDate]
  );

  const handleClickPrevMonth = () => {
    if (onCalendarPeriodChanged) {
      onCalendarPeriodChanged(prevMonth);
    }
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
    if (onCalendarPeriodChanged) {
      onCalendarPeriodChanged(nextMonth);
    }
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
    if (onCalendarPeriodChanged) {
      onCalendarPeriodChanged(today);
    }
    setCurrentDate(today);
    if (setInputValue) {
      setInputValue({
        text: formatDate(today, format),
        value: formatDate(today, format),
      });
    }

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

  const handleSelect = async (date: Date) => {
    const dataFormatted = formatDate(date, format);
    let newValues: string[];

    if (selectability === "multiple") {
      await setinputValueLocal((prev) => {
        const values = prev ? prev.split(",") : [];

        if (values.includes(dataFormatted)) {
          newValues = values.filter((value) => value !== dataFormatted);
        } else {
          newValues = [...values, dataFormatted];
        }

        newValues = newValues.sort((a, b) => {
          const dateA = new Date(a);
          const dateB = new Date(b);
          return dateA.getTime() - dateB.getTime();
        });

        const finalValues = newValues.join(",");
        setInputValue({
          text: finalValues,
          value: finalValues,
        });

        return finalValues;
      });
    } else if (selectability === "ranged") {
      await setinputValueLocal((prev) => {
        const values = prev ? prev.split("-") : [];
        if (!startPicked.picked) {
          newValues = [dataFormatted];
          setStartPicked((prev) => ({ ...prev, picked: true }));
        } else {
          if (values.includes(dataFormatted)) {
            newValues = [];
          } else {
            newValues = [...values, dataFormatted];
          }
          setStartPicked({ picked: false, indexPicked: null });
        }

        newValues = newValues.sort((a, b) => {
          const dateA = new Date(a);
          const dateB = new Date(b);
          return dateA.getTime() - dateB.getTime();
        });
        const finalValues = newValues.join("-");

        setInputValue({
          text: finalValues,
          value: finalValues,
        });

        return finalValues;
      });
    }

    if (setInputValue && selectability === "single") {
      await setInputValue({
        text: formatDate(date, format),
        value: formatDate(date, format),
      });
    }

    if (setIsOpen && selectability === "ranged" && !startPicked.picked) {
      await setIsOpen(true);
    } else if (setIsOpen && selectability !== "multiple") {
      await setIsOpen(false);
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

        if (disableWeekend) {
          const day = validDate.getDay();
          if (day === 6) {
            validDate.setDate(validDate.getDate() - 1);
          } else if (day === 0) {
            validDate.setDate(validDate.getDate() + 1);
          }
        }

        if (onCalendarPeriodChanged) {
          onCalendarPeriodChanged(validDate);
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

  const inputElement: ReactElement = (
    <CalendarContainer
      $style={
        floatingStyles
          ? style
          : css`
              padding: 0.5rem;
              font-size: 0.875rem;
              min-width: 300px;
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
              background-color: white;
              border: 1px solid #d1d5db;
              border-radius: 0.125rem;
              width: 100%;
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
              list-style: none;
              outline: none;
              ${style}
            `
      }
    >
      <CalendarHeader>
        {!calendarState.open ? (
          <div
            style={{
              borderRadius: "2px",
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <CalendarButton
              aria-label="calendar-select-date"
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
            </CalendarButton>
          </div>
        ) : (
          <Fragment>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "4px",
              }}
            >
              <Combobox
                name="month"
                options={monthNames}
                inputValue={calendarState.month}
                placeholder={monthNames[0].text}
                containerStyle={css`
                  min-width: 90px;
                  max-width: 90px;
                `}
                setInputValue={(value) => {
                  onChangeValueDate({
                    target: { name: "month", value },
                  });
                }}
              />
              <Combobox
                name="year"
                options={yearOptions}
                inputValue={calendarState.year}
                placeholder={String(currentYear)}
                containerStyle={css`
                  min-width: 75px;
                  max-width: 75px;
                `}
                setInputValue={(value) => {
                  onChangeValueDate({
                    target: { name: "year", value },
                  });
                }}
              />
            </div>

            <CheckCalendar
              size={24}
              onClick={() => handleClickMode("open")}
              $style={{
                padding: "4px",
              }}
              aria-label="Select date"
            />
          </Fragment>
        )}
        {!calendarState.open && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent:
                selectability === "single" ? "flex-start" : "flex-end",
            }}
          >
            <ArrowLeft
              onClick={handleClickPrevMonth}
              size={24}
              aria-label="previous-month"
            />

            <ArrowRight
              onClick={handleClickNextMonth}
              size={24}
              aria-label="next-month"
            />
          </div>
        )}

        {selectability === "single" && (
          <Button
            onClick={handleMoveToToday}
            variant="outline"
            buttonStyle={css`
              border-color: #f3f4f6;
              width: 100%;
              max-height: 34px;
              max-width: 60px;
              font-size: 0.75rem;
              padding-left: 0.5rem;
              padding-right: 0.5rem;
              box-shadow: none;

              &:hover {
                background-color: #e5e7eb;
              }
            `}
          >
            {todayButtonCaption}
          </Button>
        )}
      </CalendarHeader>

      <>
        <GridDay>
          {dayNames.map((data, index) => (
            <div key={index}>{data.text}</div>
          ))}
        </GridDay>
        <GridDate>
          {Array(emptyCellsCount)
            .fill(null)
            .map((_, i) => (
              <li key={`empty-${i}`} />
            ))}
          {dates.map((date, i) => {
            const idx = i + emptyCellsCount + 1;
            const isHighlighted = idx === highlightedIndexChange;

            let isCurrentDate: boolean;
            let isDisabled: boolean;
            let isRangeStart: boolean;
            let isRangeEnd: boolean;
            let isInRange: boolean;
            let isHighlightedPicked: boolean;

            const selectedDates =
              selectability === "ranged"
                ? inputValueLocal
                    .split("-")
                    .filter(Boolean)
                    .map((d) => new Date(d))
                : selectability === "multiple"
                  ? inputValueLocal
                      .split(",")
                      .filter(Boolean)
                      .map((d) => new Date(d))
                  : [];

            if (selectability === "ranged") {
              if (startPicked.picked) {
                const selectedDate = selectedDates[0];
                isDisabled = date.getTime() < selectedDate.getTime();

                isRangeStart = date.getTime() === selectedDate.getTime();
                isHighlightedPicked =
                  date.getTime() >= selectedDate.getTime() &&
                  date.getTime() <= startPicked.indexPicked.getTime();
              }
              if (selectedDates.length === 2) {
                const [startDate, endDate] = selectedDates;
                isCurrentDate =
                  date.getTime() >= startDate.getTime() &&
                  date.getTime() <= endDate.getTime();
                isRangeStart = date.getTime() === startDate.getTime();
                isRangeEnd = date.getTime() === endDate.getTime();
                isInRange =
                  date.getTime() > startDate.getTime() &&
                  date.getTime() < endDate.getTime();

                isCurrentDate = isRangeStart || isRangeEnd || isInRange;
              } else {
                isCurrentDate = selectedDates.some(
                  (selected) =>
                    date.getDate() === selected.getDate() &&
                    date.getMonth() === selected.getMonth() &&
                    date.getFullYear() === selected.getFullYear()
                );
              }
            } else if (selectability === "multiple") {
              isCurrentDate = selectedDates.some(
                (selected) =>
                  date.getDate() === selected.getDate() &&
                  date.getMonth() === selected.getMonth() &&
                  date.getFullYear() === selected.getFullYear()
              );
            } else {
              const selectedDate = inputValue.text
                ? new Date(inputValue.text)
                : new Date();

              isCurrentDate =
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();
            }
            const isToday =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear();

            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            return (
              <DateCellWrapper
                key={date.toISOString()}
                ref={(el) => {
                  if (listRef?.current) {
                    listRef.current[idx] = el;
                  }
                }}
                role="option"
                aria-selected={isHighlighted}
                id={`option-${idx}`}
                onClick={async () => {
                  if ((isWeekend && disableWeekend) || isDisabled) {
                    return;
                  }

                  await handleSelect(date);
                  if (onClick) {
                    onClick();
                  }
                }}
                onMouseEnter={() => {
                  setHighlightedIndexChange(idx);
                  setStartPicked((prev) => ({ ...prev, indexPicked: date }));
                }}
                tabIndex={isHighlighted ? 0 : -1}
                $isHighlighted={isHighlighted}
                $isDisable={disableWeekend || isDisabled}
                $isWeekend={
                  disableWeekend ? isWeekend || isDisabled : isDisabled
                }
              >
                {selectability === "ranged" && (
                  <DataCellRange
                    $isInRange={
                      disableWeekend
                        ? !isWeekend &&
                          ((isCurrentDate && !startPicked.picked) ||
                            (isHighlightedPicked && !isDisabled))
                        : (isCurrentDate && !startPicked.picked) ||
                          (isHighlightedPicked && !isDisabled)
                    }
                    $isRangeStart={isRangeStart}
                    $isRangeEnd={
                      isRangeEnd || (isHighlighted && startPicked.picked)
                    }
                  />
                )}
                <DateCell
                  $style={
                    floatingStyles
                      ? css`
                          padding: 3px;
                        `
                      : css`
                          padding: 4px;
                          margin-bottom: 3px;
                        `
                  }
                  $isDisable={disableWeekend || isDisabled}
                  $isWeekend={
                    disableWeekend ? isWeekend || isDisabled : isDisabled
                  }
                  $isHighlighted={isHighlighted}
                  $isCurrentDate={
                    isCurrentDate ||
                    (selectability === "ranged" &&
                      isHighlighted &&
                      startPicked.picked &&
                      !isDisabled)
                  }
                  $isInRange={isInRange && selectability === "ranged"}
                  $isToday={isToday}
                >
                  {date.getDate()}

                  {isToday && <DateCellTodayDot />}
                </DateCell>
              </DateCellWrapper>
            );
          })}
        </GridDate>
      </>
      <>{footer}</>
    </CalendarContainer>
  );

  return (
    <Container $style={containerStyle}>
      {label && <label>{label}</label>}
      <InputContent>
        {inputElement}
        {showError && <ErrorText>{errorMessage}</ErrorText>}
      </InputContent>
    </Container>
  );
}

const CalendarContainer = styled.div<{
  $style?: CSSProp;
}>`
  ${({ $style }) => $style}
`;

const CalendarButton = styled.button`
  width: fit-content;
  padding: 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  background-color: transparent;
  border: none;

  &:hover {
    background-color: #e5e7eb;
  }

  &:focus {
    outline: none;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  gap: 0.5rem;
`;

const GridDay = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.25rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
  user-select: none;
  pointer-events: none;
`;

const GridDate = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 2px;
  padding-bottom: 8px;
  width: 100%;
  overflow: hidden;
`;

const DateCellWrapper = styled.li<{
  $isHighlighted: boolean;
  $isDisable: boolean;
  $isWeekend?: boolean;
}>`
  display: flex;
  align-self: center;
  justify-content: center;
  text-align: center;
  position: relative;

  ${({ $isHighlighted, $isDisable, $isWeekend }) =>
    $isHighlighted &&
    (!$isDisable || !$isWeekend) &&
    css`
      cursor: pointer;
    `}
`;

const DateCell = styled.span<{
  $style?: CSSProp;
  $isDisable?: boolean;
  $isWeekend?: boolean;
  $isHighlighted?: boolean;
  $isCurrentDate?: boolean;
  $isToday?: boolean;
  $isInRange?: boolean;
}>`
  width: 27px;
  height: 27px;
  border-radius: 9999px;
  position: relative;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${({ $isDisable, $isWeekend }) =>
    $isDisable &&
    $isWeekend &&
    css`
      color: #d1d5db;
    `}

  ${({ $isWeekend, $isDisable }) =>
    $isWeekend &&
    !$isDisable &&
    css`
      color: #fca5a5;
    `}

  ${({ $isHighlighted }) =>
    $isHighlighted
      ? css`
          border-color: #61a9f9;
          color: #61a9f9;
        `
      : css`
          &:hover {
            background-color: #bfdbfe;
          }
          &:focus {
            outline: none;
            background-color: #bfdbfe;
          }
        `}

  ${({ $isHighlighted, $isDisable, $isWeekend }) =>
    $isHighlighted &&
    $isDisable &&
    $isWeekend &&
    css`
      background-color: white;
      color: #d1d5db;
      border-color: transparent;
      user-select: none;
      cursor: default;
    `}

  ${({ $isCurrentDate }) =>
    $isCurrentDate &&
    css`
      background-color: #61a9f9;
      color: white;
    `}

  ${({ $isToday, $isCurrentDate }) =>
    $isToday &&
    !$isCurrentDate &&
    css`
      color: #61a9f9;
    `};

  ${({ $isToday, $isHighlighted, $isCurrentDate }) =>
    $isToday && $isHighlighted && $isCurrentDate
      ? css`
          color: white;
        `
      : $isToday &&
        $isHighlighted &&
        css`
          color: #61a9f9;
        `};

  ${({ $isInRange, $isWeekend }) =>
    $isInRange && $isWeekend
      ? css`
          background-color: transparent;
          color: #d1d5db;
        `
      : $isInRange &&
        css`
          background-color: transparent;
          color: #61a9f9;
        `}

  ${({ $style }) => $style}
`;

const DataCellRange = styled.span<{
  $isInRange?: boolean;
  $isRangeStart?: boolean;
  $isRangeEnd?: boolean;
}>`
  position: absolute;
  width: 45px;
  height: 18px;
  top: 47%;
  left: 0;
  transform: translateY(-50%);

  ${({ $isInRange }) =>
    $isInRange &&
    css`
      background-color: #dbeafe;
    `}

  ${({ $isRangeStart }) =>
    $isRangeStart &&
    css`
      left: auto;
      right: 0;
      width: 25px;
      transform: translateX(50%) translateY(-50%);
    `}

  ${({ $isRangeEnd }) =>
    $isRangeEnd &&
    css`
      width: 25px;
      transform: translateX(-25%) translateY(-50%);
    `}
`;

const DateCellTodayDot = styled.div`
  position: absolute;
  bottom: 1px;
  left: 10px;
  width: 3px;
  height: 3px;
  background-color: #61a9f9;
  border: 1px solid #61a9f9;
`;

const Container = styled.div<{ $style?: CSSProp }>`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  position: relative;

  ${({ $style }) => $style}
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
`;

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;

function formatDate(date: Date, format: FormatProps) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  switch (format) {
    case "yyyy/mm/dd":
      return `${year}/${month}/${day}`;
    case "dd/mm/yyyy":
      return `${day}/${month}/${year}`;
    case "mm/dd/yyyy":
    default:
      return `${month}/${day}/${year}`;
  }
}

const StyledIcon = (icon: RemixiconComponentType) => styled(icon)<{
  $style?: CSSProp;
}>`
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &:hover {
    background-color: #e5e7eb;
  }

  &:focus {
    outline: none;
  }
  ${({ $style }) => $style}
`;

const ArrowLeft = StyledIcon(RiArrowLeftSLine);
const ArrowRight = StyledIcon(RiArrowRightSLine);
const CheckCalendar = StyledIcon(RiCheckLine);

export { Calendar };
