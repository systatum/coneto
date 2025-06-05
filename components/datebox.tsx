import { RiCalendar2Line } from "@remixicon/react";
import { Selectbox } from "./selectbox";
import { CalendarDrawer } from "./calendar";

interface DateboxProps {
  options?: string[];
  inputValue: string;
  setInputValue: (data: string) => void;
  dayNames: string[];
  monthNames: string[];
  disableWeekend?: boolean;
}

export default function Datebox({
  dayNames,
  inputValue,
  monthNames,
  setInputValue,
  options,
  disableWeekend,
}: DateboxProps) {
  return (
    <Selectbox
      options={options}
      inputValue={inputValue}
      setInputValue={setInputValue}
      placeholder="mm/dd/yyyy"
      iconClosed={RiCalendar2Line}
      iconOpened={RiCalendar2Line}
      type="calendar"
      clearable
    >
      {(props) => (
        <CalendarDrawer
          dayNames={dayNames}
          monthNames={monthNames}
          format="mm/dd/yyyy"
          disableWeekend={disableWeekend}
          {...props}
        />
      )}
    </Selectbox>
  );
}
