import { RiCalendar2Line } from "@remixicon/react";
import { DrawerProps, Selectbox } from "./selectbox";
import { cn } from "./../lib/utils";
import Calendar, { BaseCalendarProps } from "./calendar";

export type DateboxProps = BaseCalendarProps & {
  label?: string;
  showError?: boolean;
  errorMessage?: string;
};
type CalendarDrawerProps = BaseCalendarProps & Partial<DrawerProps>;

export default function Datebox(props: DateboxProps) {
  return (
    <div className={cn(`flex w-full flex-col gap-2 text-xs`)}>
      {props.label && <label>{props.label}</label>}
      <div className="flex flex-col gap-1 text-xs">
        <Selectbox
          {...props}
          placeholder="mm/dd/yyyy"
          iconClosed={RiCalendar2Line}
          iconOpened={RiCalendar2Line}
          type="calendar"
          clearable
        >
          {(selectBoxProps) => (
            <CalendarDrawer {...props} {...selectBoxProps} />
          )}
        </Selectbox>
        {props.showError && (
          <span className="text-red-600">{props.errorMessage}</span>
        )}
      </div>
    </div>
  );
}

function CalendarDrawer(props: CalendarDrawerProps) {
  const calendarClass = cn(
    "flex flex-col gap-1 bg-white border border-gray-300 rounded-xs w-full shadow-xs list-none outline-none",
    "p-2 z-[9999] p-2 text-sm max-w-[300px] flex flex-col gap-2 bg-white border border-gray-300 rounded-xs w-full shadow-xs list-none outline-none",
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
      <Calendar {...props} label={null} />
    </ul>
  );
}
