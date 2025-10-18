import { RiCalendar2Line } from "@remixicon/react";
import { DrawerProps, Selectbox } from "./selectbox";
import {
  Calendar,
  BaseCalendarProps,
  SelectabilityModeState,
} from "./calendar";
import styled, { css, CSSProp } from "styled-components";
import { forwardRef, ReactNode } from "react";

export type DateboxProps = BaseCalendarProps & {
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  labelStyle?: CSSProp;
  selectboxStyle?: CSSProp;
  calendarFooter?: ReactNode;
  calendarTodayButtonCaption?: string;
  calendarSelectabilityMode?: SelectabilityModeState;
};

type CalendarDrawerProps = BaseCalendarProps &
  Partial<
    DrawerProps & {
      calendarFooter?: ReactNode;
      calendarTodayButtonCaption?: string;
      calendarSelectabilityMode?: SelectabilityModeState;
    }
  >;

const Datebox = forwardRef<HTMLInputElement, DateboxProps>((props, ref) => {
  return (
    <InputWrapper $disabled={props.disabled}>
      {props.label && <Label $style={props.labelStyle}>{props.label}</Label>}
      <InputContent>
        <Selectbox
          {...props}
          ref={ref}
          selectboxStyle={css`
            ${props.selectboxStyle}
            ${props.showError &&
            css`
              border-color: #f87171;
            `}
          `}
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
        {props.showError && <ErrorText>{props.errorMessage}</ErrorText>}
      </InputContent>
    </InputWrapper>
  );
});

const InputWrapper = styled.div<{
  $containerStyle?: CSSProp;
  $disabled?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  width: 100%;
  position: relative;

  ${({ $disabled }) => $disabled && `cursor: not-allowed; opacity: 0.5;`}
`;

const Label = styled.label<{ $style?: CSSProp }>`
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
      }}
      tabIndex={-1}
      role="listbox"
      aria-label="Calendar"
    >
      <Calendar
        {...props}
        footer={props.calendarFooter}
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
