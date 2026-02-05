import { RiCalendar2Line } from "@remixicon/react";
import {
  DrawerProps,
  OptionsProps,
  Selectbox,
  SelectboxStylesProps,
} from "./selectbox";
import {
  Calendar,
  BaseCalendarProps,
  SelectabilityModeState,
} from "./calendar";
import styled, { css, CSSProp } from "styled-components";
import { forwardRef, ReactNode } from "react";
import { FieldLaneProps } from "./field-lane";

export type BaseDateboxProps = BaseCalendarProps & {
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

export type DateboxStylesProps = SelectboxStylesProps;

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

export interface DateboxProps
  extends Omit<BaseDateboxProps, "inputId">,
    Omit<
      FieldLaneProps,
      "styles" | "inputId" | "type" | "children" | "actions"
    > {}

const Datebox = forwardRef<HTMLInputElement, DateboxProps>((props, ref) => {
  const {
    selectedDates,
    setSelectedDates,
    errorMessage,
    placeholder = "mm/dd/yyyy",
    styles,
    helper,
    dropdowns,
    showError,
    ...rest
  } = props;

  const inputId = `datebox-${props.label}`;

  return (
    <Selectbox
      {...rest}
      ref={ref}
      errorIconPosition="relative"
      id={inputId}
      showError={showError}
      selectedOptions={selectedDates}
      setSelectedOptions={setSelectedDates}
      helper={helper}
      disabled={props.disabled}
      styles={{
        ...styles,
        self: css`
          border: 1px solid #d1d5db;
          &:focus {
            border-color: ${showError ? "#f87171" : "#61a9f9"};
          }
          ${dropdowns &&
          css`
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
          `}

          ${styles?.selectboxStyle}
          ${showError &&
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
