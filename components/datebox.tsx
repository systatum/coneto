import { RiCalendar2Line } from "@remixicon/react";
import { Selectbox } from "./selectbox";
import { Calendar } from "./calendar";

interface DateboxProps {
  options?: string[];
  inputValue: string;
  setInputValue: (data: string) => void;
  dayNames: string[];
  monthNames: string[];
}

export default function Datebox({
  dayNames,
  inputValue,
  monthNames,
  setInputValue,
  options,
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
        <Calendar
          dayNames={dayNames}
          monthNames={monthNames}
          disableWeekend={true}
          format="mm/dd/yyyy"
          {...props}
        />
      )}
    </Selectbox>
  );
}
