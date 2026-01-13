import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckLine,
} from "@remixicon/react";
import { Fragment, ReactElement, useMemo, ReactNode } from "react";
import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Combobox } from "./combobox";
import { DrawerProps, OptionsProps } from "./selectbox";
import styled, { css, CSSProp } from "styled-components";
import {
  getValidMultipleDate,
  isValidDateString,
  isWeekend,
  removeWeekend,
} from "../lib/date";

export interface BaseCalendarProps {
  options?: OptionsProps[];
  selectedDates?: string[];
  setSelectedDates?: (data: string[]) => void;
  dayNames?: OptionsProps[];
  monthNames?: OptionsProps[];
  disableWeekend?: boolean;
  format?: FormatProps;
  yearPastReach?: number;
  futurePastReach?: number;
  onClick?: () => void;
  onCalendarPeriodChanged?: (data: Date) => void;
  styles?: CalendarStylesProps;
}

export interface CalendarStylesProps {
  style?: CSSProp;
  containerStyle?: CSSProp;
}

type CalendarProps = BaseCalendarProps &
  Partial<DrawerProps> & {
    label?: string;
    showError?: boolean;
    errorMessage?: string;
    footer?: ReactNode;
    todayButtonCaption?: string;
    selectabilityMode?: SelectabilityModeState;
  };

interface CalendarStateProps {
  open: boolean;
  month: string[];
  year: string[];
}

type CustomChangeEvent = {
  target: {
    name: string;
    value: string[];
  };
};

export type FormatProps = "mm/dd/yyyy" | "yyyy/mm/dd" | "dd/mm/yyyy";
export type DateBoxOpen = "open" | "month" | "year";
export type SelectabilityModeState = "single" | "multiple" | "ranged";

const DEFAULT_DAY_NAMES = [
  { text: "Su", value: "1" },
  { text: "Mo", value: "2" },
  { text: "Tu", value: "3" },
  { text: "We", value: "4" },
  { text: "Th", value: "5" },
  { text: "Fr", value: "6" },
  { text: "Sa", value: "7" },
];

const DEFAULT_MONTH_NAMES = [
  { text: "January", value: "1" },
  { text: "February", value: "2" },
  { text: "March", value: "3" },
  { text: "April", value: "4" },
  { text: "May", value: "5" },
  { text: "June", value: "6" },
  { text: "July", value: "7" },
  { text: "August", value: "8" },
  { text: "September", value: "9" },
  { text: "October", value: "10" },
  { text: "November", value: "11" },
  { text: "December", value: "12" },
];

function Calendar({
  highlightedIndex,
  setHighlightedIndex,
  setSelectedDates,
  selectedDates,
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
  styles,
  footer,
  todayButtonCaption = "Today",
  onCalendarPeriodChanged,
  selectabilityMode = "single",
}: CalendarProps) {
  const today = new Date();
  const currentMonth = monthNames.find(
    (data) => Number(data.value) === today.getMonth() + 1
  );
  const currentYear = today.getFullYear();

  const initialValueState = () => {
    const raw = selectedDates?.[0];
    if (selectabilityMode === "ranged") {
      if (disableWeekend) {
        if (raw?.split("-")) {
          return isWeekend(today) ? "" : formatDate(today, format);
        }

        const value = raw?.split(", ") ?? [];
        const firstValue = value[0];
        const latestValue = value[value.length - 1];

        return `${firstValue}-${latestValue}`;
      }

      return isValidDateString(raw) ? raw : "";
    }

    if (selectabilityMode === "multiple") {
      let validDates = getValidMultipleDate(raw);

      if (disableWeekend) {
        validDates = removeWeekend(validDates);
      }

      return validDates.length > 0 ? validDates.join(", ") : "";
    }

    return isValidDateString(raw) ? raw : formatDate(today, format);
  };

  const normalized = initialValueState();

  const stateDate = useMemo(() => {
    if (!normalized) return new Date();

    const firstStr = normalized.includes(",")
      ? normalized.split(",")[0].trim()
      : normalized.includes("-")
        ? normalized.split("-")[0].trim()
        : normalized.trim();

    const d = new Date(firstStr);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [normalized]);

  const [currentDate, setCurrentDate] = useState(stateDate);

  const [calendarState, setCalendarState] = useState<CalendarStateProps>({
    open: false,
    month: [String(stateDate.getMonth() + 1)],
    year: [String(stateDate.getFullYear())],
  });

  const [selectedDatesLocal, setSelectedDatesLocal] =
    useState(initialValueState());

  const [startPicked, setStartPicked] = useState<{
    picked: boolean;
    indexPicked: Date | null;
  }>({ picked: false, indexPicked: null });

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

  const handleChangeValueDate = (name: string, value: string[]) => {
    setCalendarState((prev) => ({ ...prev, [name]: value }));

    if (name === "month") {
      const monthIndex = Number(value[0]) - 1;
      const dateMonth = new Date(currentDate.getFullYear(), monthIndex, 1);
      setCurrentDate(dateMonth);
      if (onCalendarPeriodChanged) {
        onCalendarPeriodChanged(dateMonth);
      }
    } else if (name === "year") {
      const yearNumber = Number(value[0]);
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
        value: String(min.getFullYear() + i),
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
      month: [String(prevMonth.getMonth() + 1)],
      year: [prevMonth.getFullYear().toString()],
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
      month: [String(nextMonth.getMonth() + 1)],
      year: [String(nextMonth.getFullYear())],
    }));
  };

  const handleMoveToToday = () => {
    if (onCalendarPeriodChanged) {
      onCalendarPeriodChanged(today);
    }
    setCurrentDate(today);
    if (setSelectedDates) {
      setSelectedDates([formatDate(today, format)]);
    }

    setHighlightedIndexChange(0);
    setCalendarState((prev) => ({
      ...prev,
      month: [String(currentMonth)],
      year: [String(currentYear)],
    }));
  };

  const handleSelect = async (date: Date, e?: React.MouseEvent) => {
    const formattedData = formatDate(date, format);
    let newValues: string[];

    if (selectabilityMode === "multiple") {
      await setSelectedDatesLocal((prev) => {
        const values = prev ? prev.split(", ") : [];

        if (e?.shiftKey && values.length > 0) {
          const lastDate = new Date(values[values.length - 1]);
          const start = lastDate.getTime() < date.getTime() ? lastDate : date;
          const end = lastDate.getTime() > date.getTime() ? lastDate : date;

          const range: string[] = [];
          let cursor = new Date(start);

          while (cursor.getTime() <= end.getTime()) {
            if (!disableWeekend || !isWeekend(cursor)) {
              range.push(formatDate(new Date(cursor), format));
            }
            cursor.setDate(cursor.getDate() + 1);
          }

          const unique = new Set([...values, ...range]);
          newValues = Array.from(unique).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
          );
        } else {
          if (values.includes(formattedData)) {
            newValues = values.filter((value) => value !== formattedData);
          } else {
            newValues = [...values, formattedData];
          }

          newValues = newValues.sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
          );
        }

        const finalValues = newValues.join(", ");
        if (setSelectedDates) {
          setSelectedDates([finalValues]);
        }

        return finalValues;
      });
    } else if (selectabilityMode === "ranged") {
      await setSelectedDatesLocal((prev) => {
        const values = prev ? prev.split("-") : [];
        if (!startPicked.picked) {
          newValues = [formattedData];
          setStartPicked((prev) => ({ ...prev, picked: true }));
        } else {
          if (values.includes(formattedData)) {
            newValues = [];
          } else {
            if (disableWeekend) {
              const startDate = new Date(values[0]);
              const endDate = date;
              const start =
                startDate.getTime() < endDate.getTime() ? startDate : endDate;
              const end =
                startDate.getTime() > endDate.getTime() ? startDate : endDate;

              const rangeValues: string[] = [];
              let cursor = new Date(start);

              while (cursor.getTime() <= end.getTime()) {
                if (!disableWeekend || !isWeekend(cursor)) {
                  rangeValues.push(formatDate(new Date(cursor), format));
                }
                cursor.setDate(cursor.getDate() + 1);
              }

              newValues = rangeValues;
            } else {
              newValues = [...new Set([...values, formattedData])];
            }
          }
          setStartPicked({ picked: false, indexPicked: null });
        }

        newValues = newValues.sort((a, b) => {
          const dateA = new Date(a);
          const dateB = new Date(b);
          return dateA.getTime() - dateB.getTime();
        });

        const finalValues = disableWeekend
          ? newValues.join(", ")
          : newValues.join("-");

        const firstValueLocal = newValues[0];
        const latestValueLocal = newValues[newValues.length - 1]
          ? `-${newValues[newValues.length - 1]}`
          : "";

        const newValuesLocal = `${firstValueLocal}${latestValueLocal}`;

        if (setSelectedDates) {
          setSelectedDates([finalValues]);
        }

        return newValuesLocal;
      });
    }

    if (selectabilityMode === "single") {
      if (setSelectedDates) {
        await setSelectedDates([formatDate(date, format)]);
      }
      await setSelectedDatesLocal(formatDate(date, format));
    }

    if (setIsOpen && selectabilityMode !== "single") {
      await setIsOpen(true);
    } else if (setIsOpen) {
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

  // for automaticly change when prop added disable weekend and today it's weekend
  useEffect(() => {
    if (selectedDates?.length > 0) {
      const newDate = new Date(selectedDates[0]);
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

        setSelectedDatesLocal(formatDate(validDate, format));

        if (selectedDates[0].length > 9) {
          if (setSelectedDates) {
            setSelectedDates([formatDate(validDate, format)]);
          }
        }
      }
    }
  }, [selectedDates?.[0], format]);

  const SELECTED_DATES = useMemo(() => {
    if (!selectedDatesLocal) return [];

    switch (selectabilityMode) {
      case "ranged":
        return selectedDatesLocal
          .split("-")
          .filter(Boolean)
          .map((dateStr) => {
            const date = new Date(dateStr.trim());
            return isNaN(date.getTime()) ? null : date;
          })
          .filter(Boolean);

      case "multiple":
        return selectedDatesLocal
          .split(", ")
          .filter(Boolean)
          .map((dateStr) => {
            const date = new Date(dateStr.trim());
            return isNaN(date.getTime()) ? null : date;
          })
          .filter(Boolean);

      case "single":
      default:
        if (selectedDatesLocal) {
          const date = new Date(selectedDatesLocal);
          return isNaN(date.getTime()) ? [] : [date];
        }
        return [];
    }
  }, [selectedDatesLocal, selectabilityMode]);

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
            <Button
              variant="transparent"
              styles={{
                self: css`
                  width: fit-content;
                  padding: 0.5rem;
                  font-size: 0.75rem;
                `,
              }}
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
            </Button>
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
                selectedOptions={calendarState.month}
                placeholder={monthNames[0].text}
                styles={{
                  containerStyle: css`
                    min-width: 90px;
                    max-width: 90px;
                  `,
                }}
                setSelectedOptions={(value) => {
                  onChangeValueDate({
                    target: { name: "month", value },
                  });
                }}
              />
              <Combobox
                name="year"
                options={yearOptions}
                selectedOptions={calendarState.year}
                placeholder={String(currentYear)}
                styles={{
                  containerStyle: css`
                    min-width: 75px;
                    max-width: 75px;
                  `,
                }}
                setSelectedOptions={(value) => {
                  onChangeValueDate({
                    target: { name: "year", value },
                  });
                }}
              />
            </div>

            <Button
              variant="transparent"
              styles={{
                containerStyle: css`
                  cursor: pointer;
                  transition: all 0.3s;
                  border-radius: 2px;
                  padding: 0px;
                  width: fit-content;
                  height: fit-content;
                `,
                self: css`
                  width: fit-content;
                  height: fit-content;
                  padding: 2px;
                `,
              }}
            >
              <RiCheckLine
                size={20}
                onClick={() => handleClickMode("open")}
                aria-label="select-date"
              />
            </Button>
          </Fragment>
        )}
        {!calendarState.open && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent:
                selectabilityMode === "single" ? "flex-start" : "flex-end",
            }}
          >
            <Button
              variant="transparent"
              styles={{
                containerStyle: css`
                  cursor: pointer;
                  transition: all 0.3s;
                  border-radius: 2px;
                  padding: 0px;
                  width: fit-content;
                  height: fit-content;
                `,
                self: css`
                  width: fit-content;
                  height: fit-content;
                  padding: 0px;
                `,
              }}
            >
              <RiArrowLeftSLine
                onClick={handleClickPrevMonth}
                size={24}
                aria-label="previous-month"
              />
            </Button>

            <Button
              variant="transparent"
              styles={{
                containerStyle: css`
                  cursor: pointer;
                  transition: all 0.3s;
                  border-radius: 2px;
                  padding: 0px;
                  width: fit-content;
                  height: fit-content;
                `,
                self: css`
                  width: fit-content;
                  height: fit-content;
                  padding: 0px;
                `,
              }}
            >
              <RiArrowRightSLine
                onClick={handleClickNextMonth}
                size={24}
                aria-label="next-month"
              />
            </Button>
          </div>
        )}

        {selectabilityMode === "single" && (
          <Button
            onClick={handleMoveToToday}
            variant="outline"
            aria-label="today-button"
            styles={{
              self: css`
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
              `,
            }}
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
            let isSameDate: boolean;

            if (selectabilityMode === "ranged") {
              if (startPicked.picked) {
                const selectedDate = SELECTED_DATES[0];
                isDisabled = date.getTime() < selectedDate.getTime();

                isRangeStart = date.getTime() === selectedDate.getTime();
                isHighlightedPicked =
                  date.getTime() >= selectedDate.getTime() &&
                  date.getTime() <= startPicked?.indexPicked?.getTime();
                isSameDate =
                  selectedDate.getTime() ===
                  startPicked?.indexPicked?.getTime();
              }

              if (SELECTED_DATES.length === 2) {
                const [startDate, endDate] = SELECTED_DATES;
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
                isCurrentDate = SELECTED_DATES.some(
                  (selected) =>
                    date.getDate() === selected.getDate() &&
                    date.getMonth() === selected.getMonth() &&
                    date.getFullYear() === selected.getFullYear()
                );
              }
            } else if (selectabilityMode === "multiple") {
              isCurrentDate = SELECTED_DATES.some(
                (selected) =>
                  date.getDate() === selected.getDate() &&
                  date.getMonth() === selected.getMonth() &&
                  date.getFullYear() === selected.getFullYear()
              );
            } else {
              const selectedDate = selectedDatesLocal
                ? new Date(selectedDatesLocal)
                : new Date();

              if (disableWeekend && !selectedDatesLocal) {
                const day = selectedDate.getDay();
                if (day === 6) {
                  selectedDate.setDate(selectedDate.getDate() - 1);
                } else if (day === 0) {
                  selectedDate.setDate(selectedDate.getDate() + 1);
                }
              }

              isCurrentDate =
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();
            }

            const isToday =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear();

            const isDateWeekend = isWeekend(date);

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
                onMouseDown={async (e) => {
                  e.preventDefault();

                  if ((isDateWeekend && disableWeekend) || isDisabled) {
                    return;
                  }

                  await handleSelect(date, e);
                  if (onClick) {
                    await onClick();
                  }
                }}
                onMouseEnter={() => {
                  setHighlightedIndexChange(idx);
                  setStartPicked((prev) => ({ ...prev, indexPicked: date }));
                }}
                tabIndex={isHighlighted ? 0 : -1}
                $isHighlighted={isHighlighted}
                $isDisabled={disableWeekend || isDisabled}
                $isWeekend={
                  disableWeekend ? isDateWeekend || isDisabled : isDisabled
                }
              >
                {selectabilityMode === "ranged" && (
                  <DataCellRange
                    $disableWeekend={disableWeekend}
                    $isPickingProcess={startPicked.picked}
                    $isInRange={
                      disableWeekend
                        ? !isDateWeekend &&
                          ((isCurrentDate && !startPicked.picked) ||
                            (isHighlightedPicked && !isDisabled))
                        : (isCurrentDate && !startPicked.picked) ||
                          (isHighlightedPicked && !isDisabled)
                    }
                    $isRangeStart={isRangeStart}
                    $isRangeEnd={
                      isRangeEnd || (isHighlighted && startPicked.picked)
                    }
                    $isSameDate={isSameDate}
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
                  $isDisabled={isDisabled}
                  $disableWeekend={disableWeekend}
                  $isWeekend={isDateWeekend}
                  $isHighlighted={isHighlighted}
                  $isCurrentDate={
                    isCurrentDate ||
                    (selectabilityMode === "ranged" &&
                      isHighlighted &&
                      startPicked.picked &&
                      !isDisabled)
                  }
                  $isInRange={isInRange && selectabilityMode === "ranged"}
                  $isToday={isToday}
                  $isPickingProcess={startPicked.picked}
                >
                  {date.getDate()}

                  {isToday && (
                    <DateCellTodayDot
                      aria-label="today-dot"
                      $isToday={isToday}
                      $isDisabled={isDisabled}
                      $isWeekend={isDateWeekend}
                      $isPickingProcess={startPicked.picked}
                      $disableWeekend={disableWeekend}
                      $isCurrentDate={isCurrentDate}
                    />
                  )}
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
    <Container $style={styles?.containerStyle}>
      {label && <label>{label}</label>}
      <InputContent>
        {inputElement}
        {showError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </InputContent>
    </Container>
  );
}

const CalendarContainer = styled.div<{
  $style?: CSSProp;
}>`
  ${({ $style }) => $style}
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
  $isDisabled: boolean;
  $isWeekend?: boolean;
}>`
  display: flex;
  align-self: center;
  justify-content: center;
  text-align: center;
  position: relative;
  height: 27px;

  ${({ $isHighlighted, $isDisabled, $isWeekend }) =>
    $isHighlighted &&
    (!$isDisabled || !$isWeekend) &&
    css`
      cursor: pointer;
    `}
`;

export const DateCell = styled.span<{
  $style?: CSSProp;
  $isDisabled?: boolean;
  $isWeekend?: boolean;
  $disableWeekend?: boolean;
  $isHighlighted?: boolean;
  $isCurrentDate?: boolean;
  $isToday?: boolean;
  $isInRange?: boolean;
  $isPickingProcess?: boolean;
}>`
  width: 27px;
  height: 27px;
  border-radius: 9999px;
  position: relative;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  ${({ $isDisabled, $isWeekend, $isPickingProcess }) =>
    ($isDisabled && $isWeekend) || ($isDisabled && $isPickingProcess)
      ? css`
          color: #d1d5db;
        `
      : null};

  ${({ $isWeekend, $isDisabled, $isToday }) =>
    $isWeekend && !$isDisabled && !$isToday
      ? css`
          color: #fca5a5;
        `
      : null};

  ${({ $isWeekend, $disableWeekend }) =>
    $isWeekend &&
    $disableWeekend &&
    css`
      color: #d1d5db;
    `}

  ${({ $isHighlighted, $isDisabled }) =>
    $isHighlighted && $isDisabled
      ? css`
          color: #d1d5db;
        `
      : $isHighlighted &&
        css`
          border-color: #61a9f9;
          color: #61a9f9;
        `};

  ${({ $isHighlighted, $isWeekend, $disableWeekend }) =>
    $isHighlighted && $isWeekend && $disableWeekend
      ? css`
          background-color: white;
          color: #d1d5db;
          border-color: transparent;
          user-select: none;
          cursor: default;
        `
      : null};

  ${({ $isCurrentDate }) =>
    $isCurrentDate
      ? css`
          background-color: #61a9f9;
          color: white;
        `
      : null};

  ${({
    $isToday,
    $isHighlighted,
    $isCurrentDate,
    $isPickingProcess,
    $isDisabled,
    $isWeekend,
    $disableWeekend,
  }) => {
    if (
      $isToday &&
      $isWeekend &&
      $isHighlighted &&
      $isCurrentDate &&
      $disableWeekend
    ) {
      return css`
        color: #61a9f9;
        background-color: transparent;
      `;
    }
    if ($isToday && $isHighlighted && $isCurrentDate) {
      return css`
        color: white;
      `;
    }
    if ($isToday && $isHighlighted && !$isWeekend) {
      return css`
        color: #61a9f9;
      `;
    }
    if ($isToday && !$isCurrentDate && $isPickingProcess && $isDisabled) {
      return css`
        color: #d1d5db;
      `;
    }
    if (
      $isHighlighted &&
      $isPickingProcess &&
      ($disableWeekend ? $isWeekend : "") &&
      $isCurrentDate
    ) {
      return css`
        color: #d1d5db;
        background-color: transparent;
      `;
    }

    if ($isToday && !$isCurrentDate && !$disableWeekend) {
      return css`
        color: #61a9f9;
      `;
    }
    return null;
  }};

  ${({ $isInRange, $disableWeekend, $isWeekend }) =>
    $isInRange && $disableWeekend && $isWeekend
      ? css`
          background-color: transparent;
          color: #d1d5db;
        `
      : $isInRange
        ? css`
            background-color: transparent;
            color: #61a9f9;
          `
        : null};

  ${({ $style }) => $style}
`;

const DataCellRange = styled.span<{
  $isInRange?: boolean;
  $isRangeStart?: boolean;
  $isRangeEnd?: boolean;
  $isSameDate?: boolean;
  $isPickingProcess?: boolean;
  $disableWeekend?: boolean;
}>`
  position: absolute;
  width: 45px;
  height: 25px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);

  ${({ $isInRange }) =>
    $isInRange &&
    css`
      background-color: #dbeafe;
    `};

  ${({ $isSameDate }) =>
    $isSameDate &&
    css`
      width: 0px;
      background-color: transparent;
    `};

  ${({ $isRangeStart }) =>
    $isRangeStart &&
    css`
      left: auto;
      right: 6px;
      width: 25px;
      border-radius: 9999;
      overflow: hidden;
      transform: translateX(50%) translateY(-50%);
    `};

  ${({ $isRangeEnd }) =>
    $isRangeEnd &&
    css`
      width: 25px;
      transform: translateX(-2%) translateY(-50%);
    `}
`;

const DateCellTodayDot = styled.div<{
  $isToday?: boolean;
  $isDisabled?: boolean;
  $isPickingProcess?: boolean;
  $disableWeekend?: boolean;
  $isWeekend?: boolean;
  $isCurrentDate?: boolean;
}>`
  position: absolute;
  bottom: 1px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 3px;
  background-color: #61a9f9;
  border: 1px solid #61a9f9;

  ${({
    $isDisabled,
    $isPickingProcess,
    $isToday,
    $disableWeekend,
    $isCurrentDate,
    $isWeekend,
  }) =>
    $isToday && $isPickingProcess && $isDisabled && !$isCurrentDate
      ? css`
          background-color: #d1d5db;
          border-color: #d1d5db;
        `
      : $isToday &&
        $disableWeekend &&
        !$isCurrentDate &&
        $isWeekend &&
        css`
          background-color: #d1d5db;
          border-color: #d1d5db;
        `}
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

export { Calendar };
