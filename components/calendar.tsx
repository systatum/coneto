import {
  RemixiconComponentType,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckLine,
} from "@remixicon/react";
import { Fragment, ReactElement, ReactNode } from "react";
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

  const handleSelect = (date: Date) => {
    if (setInputValue) {
      setInputValue({
        text: formatDate(date, format),
        value: formatDate(date, format),
      });
    }
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
                  if (isWeekend && disableWeekend) {
                    return;
                  }
                  await handleSelect(date);
                  if (onClick) {
                    onClick();
                  }
                }}
                onMouseEnter={() => setHighlightedIndexChange(idx)}
                tabIndex={isHighlighted ? 0 : -1}
                $isHighlighted={isHighlighted}
                $disableWeekend={disableWeekend}
                $isWeekend={isWeekend}
              >
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
                  $disableWeekend={disableWeekend}
                  $isWeekend={isWeekend}
                  $isHighlighted={isHighlighted}
                  $isCurrentDate={isCurrentDate}
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
`;

const DateCellWrapper = styled.li<{
  $isHighlighted: boolean;
  $disableWeekend: boolean;
  $isWeekend: boolean;
}>`
  display: flex;
  align-self: center;
  justify-content: center;
  text-align: center;

  ${({ $isHighlighted, $disableWeekend, $isWeekend }) =>
    $isHighlighted &&
    (!$disableWeekend || !$isWeekend) &&
    css`
      cursor: pointer;
    `}
`;

const DateCell = styled.span<{
  $style?: CSSProp;
  $disableWeekend?: boolean;
  $isWeekend?: boolean;
  $isHighlighted?: boolean;
  $isCurrentDate?: boolean;
  $isToday?: boolean;
}>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  position: relative;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${({ $disableWeekend, $isWeekend }) =>
    $disableWeekend &&
    $isWeekend &&
    css`
      color: #d1d5db;
    `}

  ${({ $isWeekend, $disableWeekend }) =>
    $isWeekend &&
    !$disableWeekend &&
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

  ${({ $isHighlighted, $disableWeekend, $isWeekend }) =>
    $isHighlighted &&
    $disableWeekend &&
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
    `}
    
  
  ${({ $isToday, $isHighlighted, $isCurrentDate }) =>
    $isToday && $isHighlighted && $isCurrentDate
      ? css`
          color: white;
        `
      : $isToday &&
        $isHighlighted &&
        css`
          color: #61a9f9;
        `}

  ${({ $style }) => $style}
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
    case "yyyy-mm-dd":
      return `${year}-${month}-${day}`;
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
