import styled, { css, CSSProp } from "styled-components";
import { ChangeEvent, InputHTMLAttributes } from "react";
import { StatefulForm } from "./stateful-form";
import { Figure, FigureProps } from "./figure";
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";
import { useTheme } from "./../theme/provider";

interface BaseRadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  value?: string;
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  highlightOnChecked?: boolean;
  styles?: BaseRadioStylesProps;
  showError?: boolean;
  errorMessage?: string;
  mode?: "radio" | "button";
  helper?: string;
  icon?: RadioIconProps;
}

export type RadioIconProps = FigureProps;

interface BaseRadioStylesProps {
  descriptionStyle?: CSSProp;
  self?: CSSProp;
  titleStyle?: CSSProp;
  inputWrapperStyle?: CSSProp;
  labelStyle?: CSSProp;
  textWrapperStyle?: CSSProp;
}

export interface RadioOptionProps {
  value?: string;
  label?: string;
  description?: string;
  icon?: RadioIconProps;
}

function BaseRadio({
  value,
  label,
  description,
  checked,
  onChange,
  name,
  highlightOnChecked,
  showError,
  styles,
  mode = "radio",
  icon,
  id,
  ...props
}: BaseRadioProps) {
  const { currentTheme } = useTheme();
  const radioTheme = currentTheme.radio;

  const resolvediconSize = icon?.size ?? (mode === "button" ? 25 : 16);

  console.log(radioTheme);

  return (
    <Label
      $isRadio={mode === "radio"}
      htmlFor={props.disabled ? null : id}
      $highlight={highlightOnChecked}
      $checked={checked}
      $style={styles?.textWrapperStyle}
      $hasDescription={!!description}
      $disabled={props.disabled}
      $backgroundColor={radioTheme.backgroundColor}
      $checkedBackgroundColor={radioTheme.checkedBackgroundColor}
      $highlightBackgroundColor={radioTheme.highlightBackgroundColor}
      $highlightHoverColor={radioTheme.highlightHoverColor}
      $checkedBorderColor={radioTheme.checkedBorderColor}
    >
      <InputWrapper
        $style={styles?.inputWrapperStyle}
        aria-label="radio-input-container"
        $isRadio={mode === "radio"}
      >
        <HiddenRadio
          type="radio"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          checked={checked}
          $disabled={props.disabled}
          readOnly
          {...props}
          $style={styles?.self}
          disabled={props.disabled}
        />
        <Circle
          $isRadio={mode === "radio"}
          $error={showError}
          $style={styles?.self}
          $borderColor={radioTheme.borderColor}
          $checkedBorderColor={radioTheme.checkedBorderColor}
          $backgroundColor={radioTheme.backgroundColor}
        />
        <Figure
          {...icon}
          aria-label={
            typeof icon?.image === "string" ? "radio-image" : "radio-icon"
          }
          size={resolvediconSize}
        />
        {label && (
          <LabelText
            aria-label="radio-label-wrapper"
            $style={styles?.labelStyle}
            $labelColor={radioTheme.labelColor}
          >
            {label}
          </LabelText>
        )}
      </InputWrapper>
      {description && (
        <DescriptionText
          $isRadio={mode === "radio"}
          $highlight={highlightOnChecked}
          $style={styles?.descriptionStyle}
          $descriptionColor={radioTheme.descriptionColor}
        >
          {description}
        </DescriptionText>
      )}
    </Label>
  );
}

export type RadioStylesProps = BaseRadioStylesProps & FieldLaneStylesProps;

export interface RadioProps
  extends Omit<BaseRadioProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns"> {
  styles?: RadioStylesProps;
}

function Radio({
  label,
  showError,
  styles,
  errorMessage,
  actions,
  helper,
  disabled,
  name,
  id,
  title,
  description,
  labelGap,
  labelWidth,
  labelPosition,
  ...rest
}: RadioProps) {
  console.log(styles);

  const inputId = StatefulForm.sanitizeId({
    id: id ? `${id}-${rest.value ?? "value"}` : null,
    prefix: `radio-${rest.value ?? "value"}`,
    name,
  });

  const {
    bodyStyle,
    controlStyle,
    containerStyle,
    titleStyle,
    ...baseRadiotyles
  } = styles ?? {};

  return (
    <FieldLane
      id={inputId}
      labelGap={labelGap}
      labelWidth={labelWidth}
      labelPosition={labelPosition}
      showError={showError}
      errorMessage={errorMessage}
      label={title}
      actions={actions}
      helper={helper}
      disabled={disabled}
      required={rest.required}
      styles={{
        bodyStyle: css`
          align-items: center;
          ${bodyStyle}
        `,
        controlStyle,
        containerStyle,
        labelStyle: titleStyle,
      }}
    >
      <BaseRadio
        {...rest}
        disabled={disabled}
        showError={showError}
        name={name}
        label={label}
        description={description}
        id={inputId}
        styles={baseRadiotyles}
      />
    </FieldLane>
  );
}

const Label = styled.label<{
  $highlight?: boolean;
  $checked?: boolean;
  $style?: CSSProp;
  $hasDescription?: boolean;
  $disabled?: boolean;
  $isRadio?: boolean;
  $backgroundColor?: string;
  $checkedBackgroundColor?: string;
  $highlightBackgroundColor?: string;
  $highlightHoverColor?: string;
  $checkedBorderColor?: string;
}>`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  font-size: 12px;
  background-color: ${({
    $highlight,
    $checked,
    $backgroundColor,
    $checkedBackgroundColor,
    $highlightBackgroundColor,
  }) => {
    if ($highlight && $checked)
      return (
        $highlightBackgroundColor ||
        $checkedBackgroundColor ||
        $backgroundColor ||
        "transparent"
      );
    return $backgroundColor || "transparent";
  }};

  padding: ${({ $highlight }) => ($highlight ? "0.75rem" : "0")};
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({
      $highlight,
      $checked,
      $highlightHoverColor,
      $highlightBackgroundColor,
      $checkedBackgroundColor,
      $backgroundColor,
    }) => {
      if ($highlight) {
        if ($highlightHoverColor) return $highlightHoverColor;
        return $checked
          ? $highlightBackgroundColor ||
              $checkedBackgroundColor ||
              $backgroundColor
          : $highlightBackgroundColor || $backgroundColor;
      }
      return $backgroundColor;
    }};
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
      user-select: none;
    `}

  ${({ $isRadio }) =>
    !$isRadio &&
    css`
      justify-content: center;
      align-items: center;
    `}

  ${({ $style }) => $style}
`;

const HiddenRadio = styled.input<{ $disabled?: boolean; $style?: CSSProp }>`
  position: absolute;
  opacity: 0;
  pointer-events: none;

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
      user-select: none;
    `}

  ${({ $style }) => $style}
`;

const Circle = styled.div<{
  $style?: CSSProp;
  $error?: boolean;
  $isRadio?: boolean;
  $borderColor?: string;
  $checkedBorderColor?: string;
  $backgroundColor?: string;
}>`
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  border: 1px solid ${({ $borderColor }) => $borderColor || "#4b5563"};
  background-color: ${({ $backgroundColor }) =>
    $backgroundColor || "transparent"};

  ${({ $error }) =>
    $error &&
    css`
      border-color: #dc2626;
    `}

  input:checked + & {
    border-width: 5px;
    border-color: ${({ $checkedBorderColor }) =>
      $checkedBorderColor || "#61a9f9"};
  }

  ${({ $isRadio }) =>
    !$isRadio &&
    css`
      display: none;
    `}

  ${({ $style }) => $style}
`;

const InputWrapper = styled.div<{ $style?: CSSProp; $isRadio?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;

  ${({ $isRadio }) =>
    $isRadio
      ? css`
          flex-direction: row;
        `
      : css`
          flex-direction: column;
        `}

  ${({ $style }) => $style}
`;

const LabelText = styled.div<{ $style?: CSSProp; $labelColor?: string }>`
  font-size: 14px;
  color: ${({ $labelColor }) => $labelColor || "#000"};
  ${({ $style }) => $style}
`;

const DescriptionText = styled.span<{
  $highlight?: boolean;
  $style?: CSSProp;
  $isRadio?: boolean;
  $descriptionColor?: string;
}>`
  ${({ $highlight }) =>
    $highlight &&
    css`
      font-size: 14px;
    `}
  color: ${({ $descriptionColor }) => $descriptionColor || "#4b5563"};

  ${({ $isRadio }) =>
    $isRadio &&
    css`
      margin-left: 24px;
    `}
  ${({ $style }) => $style};
`;

export { Radio };
