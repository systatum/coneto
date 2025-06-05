import { RiCalendar2Line } from "@remixicon/react";
import { OptionsProps, Selectbox } from "./selectbox";
import Calendar from "./calendar";

interface DateboxProps {
  options?: OptionsProps[];
  inputValue: OptionsProps;
  setInputValue: (data: OptionsProps) => void;
  dayNames: OptionsProps[];
  monthNames: OptionsProps[];
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
        <Calendar
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
