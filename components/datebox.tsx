import { RiCalendar2Line } from "@remixicon/react";
import { DrawerProps, OptionsProps, Selectbox } from "./selectbox";
import {
  Calendar,
  BaseCalendarProps,
  SelectabilityModeState,
} from "./calendar";
import styled, { css, CSSProp } from "styled-components";
import { forwardRef, ReactNode } from "react";
import { StatefulForm } from "./stateful-form";

export type DateboxProps = BaseCalendarProps & {
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  calendarFooter?: ReactNode;
  calendarTodayButtonCaption?: string;
  calendarSelectabilityMode?: SelectabilityModeState;
  placeholder?: string;
  styles?: DateboxStylesProps;
  helper?: string;
};

export interface DateboxStylesProps {
  labelStyle?: CSSProp;
  selectboxStyle?: CSSProp;
  containerStyle?: CSSProp;
}

type CalendarDrawerProps = BaseCalendarProps &
  Partial<
    DrawerProps & {
      selectedOptionsLocal?: OptionsProps;
      setSelectedOptionsLocal?: (data: OptionsProps) => void;
      calendarFooter?: ReactNode;
      calendarTodayButtonCaption?: string;
      calendarSelectabilityMode?: SelectabilityModeState;
      showError?: boolean;
    }
  >;

const Datebox = forwardRef<HTMLInputElement, DateboxProps>((props, ref) => {
  const {
    selectedDates,
    setSelectedDates,
    errorMessage,
    placeholder = "mm/dd/yyyy",
    styles,
    helper,
    ...rest
  } = props;

  return (
    <InputWrapper $style={styles?.containerStyle} $disabled={props.disabled}>
      {props.label && (
        <StatefulForm.Label
          style={styles?.labelStyle}
          helper={helper}
          label={props.label}
        />
      )}
      <InputContent>
        <Selectbox
          {...rest}
          ref={ref}
          selectedOptions={selectedDates}
          setSelectedOptions={setSelectedDates}
          styles={{
            self: css`
              ${styles?.selectboxStyle}
              ${props.showError &&
              css`
                border-color: #f87171;
              `}
            `,
          }}
          placeholder={placeholder}
          iconClosed={RiCalendar2Line}
          iconOpened={RiCalendar2Line}
          type="calendar"
          clearable
        >
          {(selectBoxProps) => {
            return (
              <CalendarDrawer
                {...rest}
                {...selectBoxProps}
                styles={{
                  containerStyle: styles?.self,
                }}
                setSelectedDates={setSelectedDates}
                selectedDates={selectedDates}
              />
            );
          }}
        </Selectbox>
        {props.showError && errorMessage && (
          <ErrorText>{errorMessage}</ErrorText>
        )}
      </InputContent>
    </InputWrapper>
  );
});

const InputWrapper = styled.div<{
  $style?: CSSProp;
  $disabled?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  width: 100%;
  position: relative;

  ${({ $disabled }) => $disabled && `cursor: not-allowed; opacity: 0.5;`}
  ${({ $style }) => $style}
`;

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
`;

function CalendarDrawer(props: CalendarDrawerProps) {
  return (
    <CalendarWrapper
      {...(props.getFloatingProps?.() ?? {})}
      ref={props.refs?.setFloating ?? null}
      style={{
        ...(props.floatingStyles ?? {}),
        borderColor: props.showError ? "#dc2626" : "",
      }}
      tabIndex={-1}
      role="listbox"
      aria-label="Calendar"
    >
      <Calendar
        {...props}
        footer={props.calendarFooter}
        setSelectedDates={(data: string[]) => {
          if (props.setSelectedDates) {
            props.setSelectedDates(data);
          }
          props.setSelectedOptionsLocal({
            text: data[0],
            value: data[0],
          });
        }}
        todayButtonCaption={props.calendarTodayButtonCaption}
        selectabilityMode={props.calendarSelectabilityMode}
        label={null}
      />
    </CalendarWrapper>
  );
}

const CalendarWrapper = styled.ul<{
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.125rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 300px;
  min-width: 300px;
  list-style: none;
  outline: none;
  z-index: 9999;

  ${({ $style }) => $style}
`;

export { Datebox };
