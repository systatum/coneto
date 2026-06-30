import { RiCalendar2Line } from "@remixicon/react";
import {
  DrawerProps,
  SelectboxOption,
  Selectbox,
  SelectboxLabels,
  SelectboxStyles,
} from "./selectbox";
import {
  Calendar,
  BaseCalendarProps,
  CalendarSelectabilityMode,
  CalendarStyles,
} from "./calendar";
import styled, { css, CSSProp } from "styled-components";
import { forwardRef, ReactNode } from "react";
import { FieldLaneDropdownOption, FieldLaneProps } from "./field-lane";
import { StatefulForm } from "./stateful-form";
import { useTheme } from "./../theme/provider";
import { applyClassName } from "./../constants/classname";
import { CalendarThemeConfig } from "theme";
import { createPortal } from "react-dom";

type BaseDateboxProps = Omit<BaseCalendarProps, "selectabilityMode"> & {
  name?: string;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  calendarFooter?: ReactNode;
  calendarTodayButtonCaption?: string;
  calendarSelectabilityMode?: CalendarSelectabilityMode;
  placeholder?: string;
  styles?: DateboxStyles;
  helper?: string;
  id?: string;
  isLoading?: boolean;
  mobile?: boolean;
  labels?: SelectboxLabels;
};

export type DateboxStyles = SelectboxStyles;

type CalendarDrawerProps = BaseCalendarProps &
  Partial<
    DrawerProps & {
      selectedOptionsLocal?: SelectboxOption;
      mobile?: boolean;
      setSelectedOptionsLocal?: (option: SelectboxOption) => void;
      calendarFooter?: ReactNode;
      calendarTodayButtonCaption?: string;
      calendarSelectabilityMode?: CalendarSelectabilityMode;
      showError?: boolean;
    }
  >;

export type DateboxDropdownOption = FieldLaneDropdownOption;

export interface DateboxProps
  extends BaseDateboxProps,
    Omit<FieldLaneProps, "styles" | "id" | "type" | "children" | "actions"> {}

const Datebox = forwardRef<HTMLInputElement, DateboxProps>((props, ref) => {
  const {
    selectedDates,
    onChange,
    placeholder = "mm/dd/yyyy",
    styles,
    helper,
    dropdowns,
    showError,
    name,
    monthNames,
    dayNames,
    calendarFooter,
    disableWeekend,
    calendarSelectabilityMode,
    id,
    labelGap,
    labelWidth,
    labelPosition,
    isLoading,
    labels,
    className,
    ...rest
  } = props;

  const inputId = StatefulForm.sanitizeId({
    prefix: "datebox",
    name,
    id,
  });

  const {
    bodyStyle,
    controlStyle,
    selectboxStyle,
    labelStyle,
    containerStyle,
    self,
  } = styles ?? {};

  return (
    <Selectbox
      {...rest}
      ref={ref}
      labels={labels}
      labelGap={labelGap}
      labelWidth={labelWidth}
      className={applyClassName("datebox", className)}
      labelPosition={labelPosition}
      id={inputId}
      showError={showError}
      dropdowns={dropdowns}
      selectedOptions={selectedDates}
      onChange={onChange}
      helper={helper}
      disabled={props.disabled}
      required={rest.required}
      isLoading={isLoading}
      styles={{
        controlStyle,
        bodyStyle,
        labelStyle,
        self: css`
          ${dropdowns &&
          css`
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
          `}

          ${selectboxStyle}
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
            dayNames={dayNames}
            monthNames={monthNames}
            calendarFooter={calendarFooter}
            disableWeekend={disableWeekend}
            calendarSelectabilityMode={calendarSelectabilityMode}
            styles={{
              self,
              containerStyle,
            }}
            onChange={onChange}
            selectedDates={selectedDates}
          />
        );
      }}
    </Selectbox>
  );
});

function CalendarDrawer(props: CalendarDrawerProps) {
  const { mobile, styles, ...rest } = props ?? {};
  const { currentTheme } = useTheme();
  const calendarTheme = currentTheme?.calendar;

  const { self, containerStyle } = styles ?? {};

  const calendarStyle: CalendarStyles = {
    ...props.styles,
    self: css`
      ${mobile &&
      css`
        width: 300px;
        left: 50%;
      `}
      ${self}
    `,
    controlStyle: css`
      ${mobile &&
      css`
        justify-content: center;
      `}
    `,
  };

  return createPortal(
    <CalendarWrapper
      {...(props.getFloatingProps?.() ?? {})}
      ref={props.refs?.setFloating ?? null}
      style={
        !mobile
          ? {
              ...(props.floatingStyles ?? {}),
            }
          : {}
      }
      $mobile={mobile}
      $showError={props?.showError}
      $theme={calendarTheme}
      tabIndex={-1}
      role="listbox"
      aria-label="calendar"
      $style={containerStyle}
    >
      <Calendar
        {...rest}
        styles={calendarStyle}
        footer={props.calendarFooter}
        onChange={(data: string[]) => {
          if (props.onChange) {
            props.onChange(data);
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
    </CalendarWrapper>,
    document.body
  );
}

const CalendarWrapper = styled.ul<{
  $style?: CSSProp;
  $theme?: CalendarThemeConfig;
  $mobile?: boolean;
  $showError?: boolean;
}>`
  list-style: none;
  margin: 0;
  padding: 0;
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
  z-index: 9992999;

  ${({ $theme, $showError, $mobile }) => css`
    background-color: ${$theme?.backgroundColor};
    border-color: ${$showError ? "#dc2626" : $theme?.borderColor};
    ${$mobile &&
    css`
      position: fixed;
      bottom: 20px;
      min-width: 96dvw;
      left: 50%;
      transform: translateX(-50%);
      padding: 20px;
      border-radius: 14px;
      border: 1px solid ${$theme?.mobileBackgroundColor};
      background-color: ${$theme?.mobileBackgroundColor};
      box-shadow: ${$theme?.boxShadow};
    `};
  `};

  ${({ $style }) => $style}
`;

export { Datebox };
