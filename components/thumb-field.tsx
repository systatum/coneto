import {
  RiErrorWarningLine,
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "@remixicon/react";
import { ChangeEvent, useRef, useState } from "react";
import styled, { css, CSSProp } from "styled-components";
import { StatefulForm } from "./stateful-form";
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";
import { useTheme } from "./../theme/provider";
import { ThumbFieldThemeConfig } from "./../theme";

interface BaseThumbFieldProps {
  value?: boolean | null;
  onChange?: (data: ChangeEvent<HTMLInputElement>) => void;
  thumbsUpBackgroundColor?: string;
  thumbsDownBackgroundColor?: string;
  disabled?: boolean;
  name?: string;
  styles?: BaseThumbFieldStylesProps;
  id?: string;
  showError?: boolean;
}

interface BaseThumbFieldStylesProps {
  triggerWrapperStyle?: CSSProp;
  triggerStyle?: CSSProp;
}

export type ThumbFieldValue = "up" | "down" | "blank";

function BaseThumbField({
  onChange,
  thumbsUpBackgroundColor,
  thumbsDownBackgroundColor,
  value = null,
  name,
  disabled,
  showError,
  styles,
  id,
}: BaseThumbFieldProps) {
  const { currentTheme } = useTheme();
  const thumbFieldTheme = currentTheme.thumbField;

  const inputId = StatefulForm.sanitizeId({
    prefix: "thumbfield",
    name,
    id,
  });

  const thumbStateValue = value === true ? "up" : value ? "down" : "blank";
  const [thumbValue, setThumbValue] =
    useState<ThumbFieldValue>(thumbStateValue);

  const thumbInputRef = useRef<HTMLInputElement>(null);

  const handleChangeValue = (data: ThumbFieldValue) => {
    if (disabled) return;

    if (thumbValue !== data) {
      setThumbValue(data);
    }

    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: data === "up" ? true : data === "down" ? false : "",
        },
      } as ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <InputGroup $style={styles?.triggerWrapperStyle}>
      <input
        aria-label="thumbfield-input"
        ref={thumbInputRef}
        name={name}
        type="hidden"
        id={inputId}
        disabled={disabled}
        value={
          thumbValue === "up" ? "true" : thumbValue === "down" ? "false" : ""
        }
      />

      <TriggerWrapper
        aria-label="thumb-up"
        onClick={() => handleChangeValue("up")}
        $triggerStyle={styles?.triggerStyle}
        $active={thumbValue === "up"}
        $activeColor={thumbsUpBackgroundColor ?? thumbFieldTheme?.thumbsUpColor}
        $showError={showError}
        $disabled={disabled}
        $theme={thumbFieldTheme}
      >
        {thumbValue === "up" ? (
          <RiThumbUpFill size={24} />
        ) : (
          <RiThumbUpLine size={24} />
        )}
      </TriggerWrapper>

      <TriggerWrapper
        aria-label="thumb-down"
        onClick={() => handleChangeValue("down")}
        $triggerStyle={styles?.triggerStyle}
        $active={thumbValue === "down"}
        $activeColor={
          thumbsDownBackgroundColor ?? thumbFieldTheme?.thumbsDownColor
        }
        $showError={showError}
        $disabled={disabled}
        $theme={thumbFieldTheme}
      >
        {thumbValue === "down" ? (
          <RiThumbDownFill size={24} />
        ) : (
          <RiThumbDownLine size={24} />
        )}
      </TriggerWrapper>

      {showError && (
        <ErrorIconWrapper>
          <RiErrorWarningLine size={24} />
        </ErrorIconWrapper>
      )}
    </InputGroup>
  );
}

export type ThumbFieldStylesProps = BaseThumbFieldStylesProps &
  FieldLaneStylesProps;

export interface ThumbFieldProps
  extends Omit<BaseThumbFieldProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns"> {
  styles?: ThumbFieldStylesProps;
}

function ThumbField({
  label,
  showError,
  styles,
  errorMessage,
  actions,
  helper,
  disabled,
  name,
  id,
  labelGap,
  labelWidth,
  labelPosition,
  ...rest
}: ThumbFieldProps) {
  const inputId = StatefulForm.sanitizeId({
    prefix: "ThumbField",
    name,
    id,
  });

  const {
    bodyStyle,
    controlStyle,
    containerStyle,
    labelStyle,
    ...thumbFieldStyles
  } = styles ?? {};

  return (
    <FieldLane
      id={inputId}
      labelGap={labelGap}
      labelWidth={labelWidth}
      labelPosition={labelPosition}
      showError={showError}
      errorMessage={errorMessage}
      actions={actions}
      helper={helper}
      disabled={disabled}
      label={label}
      errorIconPosition="none"
      required={rest.required}
      styles={{
        bodyStyle,
        controlStyle,
        containerStyle,
        labelStyle,
      }}
    >
      <BaseThumbField
        {...rest}
        disabled={disabled}
        id={inputId}
        styles={thumbFieldStyles}
        showError={showError}
      />
    </FieldLane>
  );
}

const InputGroup = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  ${({ $style }) => $style};
`;

const TriggerWrapper = styled.div<{
  $triggerStyle?: CSSProp;
  $active?: boolean;
  $activeColor?: string;
  $showError?: boolean;
  $disabled?: boolean;
  $theme?: ThumbFieldThemeConfig;
}>`
  display: flex;
  align-items: center;

  svg {
    transition: opacity 0.2s ease;
    ${({ $active, $activeColor }) =>
      $active &&
      css`
        color: ${$activeColor};
      `}

    ${({ $showError, $theme }) =>
      $showError &&
      css`
        color: ${$theme?.errorColor};
      `};

    ${({ $disabled }) =>
      $disabled
        ? css`
            cursor: not-allowed;
          `
        : css`
            cursor: pointer;
          `}
  }

  ${({ $triggerStyle }) => $triggerStyle}
`;

const ErrorIconWrapper = styled.div`
  background-color: #dc2626;
  color: white;
  border-radius: 50%;
  padding: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export { ThumbField };
