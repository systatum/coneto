import { RiCalendar2Line } from "@remixicon/react";
import { DrawerProps, Selectbox } from "./selectbox";
import { cn } from "./../lib/utils";
import Calendar, { BaseCalendarProps } from "./calendar";

type DateboxProps = BaseCalendarProps;
type CalendarDrawerProps = BaseCalendarProps & DrawerProps;

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
