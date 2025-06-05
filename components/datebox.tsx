import { RiCalendar2Line } from "@remixicon/react";
import { FloatingUIProps, OptionsProps, Selectbox } from "./selectbox";
import { HTMLAttributes, CSSProperties, MutableRefObject, Ref } from "react";
import { cn } from "./../lib/utils";
import Calendar, { FormatProps } from "./calendar";

export interface BaseCalendarProps {
  options?: OptionsProps[];
  inputValue?: OptionsProps;
  setInputValue?: (data: OptionsProps) => void;
  dayNames?: OptionsProps[];
  monthNames?: OptionsProps[];
  disableWeekend?: boolean;
  format?: FormatProps;
  containerClassName?: string;
}

export type CalendarDrawerProps = BaseCalendarProps & FloatingUIProps;

type DateboxProps = BaseCalendarProps;

export default function Datebox(props: DateboxProps) {
  return (
    <Selectbox
      {...props}
      placeholder="mm/dd/yyyy"
      iconClosed={RiCalendar2Line}
      iconOpened={RiCalendar2Line}
      type="calendar"
      clearable
    >
      {(selectBoxProps) => <CalendarDrawer {...props} {...selectBoxProps} />}
    </Selectbox>
  );
}

function CalendarDrawer(props: CalendarDrawerProps) {
  const calendarClass = cn(
    "flex flex-col gap-1 bg-white border border-gray-300 rounded-xs w-full shadow-xs list-none outline-none",
    props.floatingStyles ? "p-2 z-[9999]" : "p-3 text-sm min-w-[300px]",
    props.containerClassName
  );
  return (
    <ul
      {...(props.getFloatingProps?.() ?? {})}
      ref={props.refs?.setFloating ?? null}
      style={{
        ...(props.floatingStyles ?? {}),
      }}
      tabIndex={-1}
      role="listbox"
      aria-label="Calendar"
      className={calendarClass}
    >
      <Calendar {...props} />
    </ul>
  );
}
