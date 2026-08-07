import {
  RiErrorWarningLine,
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "@remixicon/react";
import { ChangeEvent, ReactNode, useRef, useState } from "react";
import styled, { css, CSSProp } from "styled-components";
import { StatefulForm } from "./stateful-form";
import { FieldLane, FieldLaneProps, FieldLaneStyles } from "./field-lane";
import { useTheme } from "./../theme/provider";
import { ThumbFieldThemeConfig } from "./../theme";
import { applyClassName } from "./../constants/classname";

interface BaseThumbFieldProps {
  value?: boolean | null;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  thumbsUpBackgroundColor?: string;
  thumbsDownBackgroundColor?: string;
  disabled?: boolean;
  name?: string;
  styles?: BaseThumbFieldStyles;
  id?: string;
  showError?: boolean;
  thumbText?: ThumbFieldThumbText;
}

export interface ThumbFieldThumbText {
  up?: ReactNode;
  down?: ReactNode;
}

interface BaseThumbFieldStyles {
  triggerWrapperStyle?: CSSProp;
  triggerUpStyle?: CSSProp;
  triggerDownStyle?: CSSProp;
  thumbUpTextStyle?: CSSProp;
  thumbDownTextStyle?: CSSProp;
}

const ThumbFieldValue = {
  Up: "up",
  Down: "down",
  Blank: "blank",
} as const;

type ThumbFieldValue = (typeof ThumbFieldValue)[keyof typeof ThumbFieldValue];

function BaseThumbField({
  onChange,
  thumbsUpBackgroundColor,
  thumbsDownBackgroundColor,
  value = null,
  name,
  disabled,
  showError,
  thumbText,
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

  const thumbValue =
    value === true
      ? ThumbFieldValue.Up
      : value === false
        ? ThumbFieldValue.Down
        : ThumbFieldValue.Blank;

  const thumbInputRef = useRef<HTMLInputElement>(null);

  const handleChangeValue = (value: ThumbFieldValue) => {
    if (disabled) return;

    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value:
            value === ThumbFieldValue.Up
              ? true
              : value === ThumbFieldValue.Down
                ? false
                : "",
        },
      } as ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <InputGroup aria-label="thumb-field" $style={styles?.triggerWrapperStyle}>
      <input
        aria-label="thumbfield-input"
        ref={thumbInputRef}
        name={name}
        type="hidden"
        id={inputId}
        disabled={disabled}
        value={
          thumbValue === ThumbFieldValue.Up
            ? "true"
            : thumbValue === ThumbFieldValue.Down
              ? "false"
              : ""
        }
      />

      <TriggerWrapper
        aria-label="thumb-up"
        onClick={() => handleChangeValue(ThumbFieldValue.Up)}
        $triggerStyle={styles?.triggerUpStyle}
        $active={thumbValue === ThumbFieldValue.Up}
        $activeColor={thumbsUpBackgroundColor ?? thumbFieldTheme?.thumbsUpColor}
        $showError={showError}
        $disabled={disabled}
        $theme={thumbFieldTheme}
      >
        {thumbValue === ThumbFieldValue.Up ? (
          <RiThumbUpFill size={24} />
        ) : (
          <RiThumbUpLine size={24} />
        )}
        {thumbText?.up && (
          <ThumbText
            aria-label="thumb-up-text"
            $style={styles?.thumbUpTextStyle}
          >
            {thumbText?.up}
          </ThumbText>
        )}
      </TriggerWrapper>

      <TriggerWrapper
        aria-label="thumb-down"
        onClick={() => handleChangeValue(ThumbFieldValue.Down)}
        $triggerStyle={styles?.triggerDownStyle}
        $active={thumbValue === ThumbFieldValue.Down}
        $activeColor={
          thumbsDownBackgroundColor ?? thumbFieldTheme?.thumbsDownColor
        }
        $showError={showError}
        $disabled={disabled}
        $theme={thumbFieldTheme}
      >
        {thumbValue === ThumbFieldValue.Down ? (
          <RiThumbDownFill size={24} />
        ) : (
          <RiThumbDownLine size={24} />
        )}
        {thumbText?.down && (
          <ThumbText
            aria-label="thumb-down-text"
            $style={styles?.thumbDownTextStyle}
          >
            {thumbText?.down}
          </ThumbText>
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

export type ThumbFieldStyles = BaseThumbFieldStyles & FieldLaneStyles;

export interface ThumbFieldProps
  extends Omit<BaseThumbFieldProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns" | "actions"> {
  styles?: ThumbFieldStyles;
}

function ThumbField({
  label,
  showError,
  styles,
  errorMessage,
  helper,
  disabled,
  name,
  id,
  labelGap,
  labelWidth,
  labelPosition,
  className,
  mobile,
  labelIcon,
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
      labelIcon={labelIcon}
      mobile={mobile}
      labelWidth={labelWidth}
      labelPosition={labelPosition}
      showError={showError}
      errorMessage={errorMessage}
      helper={helper}
      disabled={disabled}
      label={label}
      errorIconPosition="none"
      className={applyClassName("thumb-field", className)}
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
        name={name}
        id={inputId}
        styles={thumbFieldStyles}
        showError={showError}
      />
    </FieldLane>
  );
}

const ThumbText = styled.span<{ $style?: CSSProp }>`
  font-size: 14px;

  ${({ $style }) => $style}
`;

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
  flex-direction: row;
  gap: 4px;

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
