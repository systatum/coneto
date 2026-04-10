import styled, { css, CSSProp } from "styled-components";
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useRef,
} from "react";
import { StatefulForm } from "./stateful-form";
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";
import { useTheme } from "./../theme/provider";

type WithoutStyle<T> = Omit<T, "style">;

export interface CheckboxOptionProps {
  value: string;
  label: string;
  description: string;
}

interface BaseCheckboxProps
  extends WithoutStyle<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  > {
  label?: string;
  name?: string;
  showError?: boolean;
  errorMessage?: string;
  indeterminate?: boolean;
  description?: string;
  highlightOnChecked?: boolean;
  styles?: BaseCheckboxStylesProps;
  helper?: string;
}

interface BaseCheckboxStylesProps {
  self?: CSSProp;
  inputWrapperStyle?: CSSProp;
  titleStyle?: CSSProp;
  labelStyle?: CSSProp;
  iconStyle?: CSSProp;
  boxStyle?: CSSProp;
  descriptionStyle?: CSSProp;
}

function BaseCheckbox({
  label,
  name,
  showError,
  description,
  highlightOnChecked,
  indeterminate = false,
  styles,
  id,
  ...props
}: BaseCheckboxProps) {
  const { currentTheme } = useTheme();
  const checkboxTheme = currentTheme.checkbox;

  const inputRef = useRef<HTMLInputElement>(null);

  const isChecked = Boolean(props.checked);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <InputWrapper
      aria-label="input-wrapper-checkbox"
      htmlFor={props.disabled ? null : id}
      $hasDescription={!!description}
      $highlight={!!highlightOnChecked}
      $checked={isChecked}
      $style={styles?.inputWrapperStyle}
      $disabled={props.disabled}
      $backgroundColor={checkboxTheme?.backgroundColor}
      $checkedBorderColor={checkboxTheme?.checkedBorderColor}
      $highlightBackgroundColor={checkboxTheme?.highlightBackgroundColor}
      $highlightHoverColor={checkboxTheme?.highlightHoverColor}
    >
      <InputContainer aria-label="input-container-checkbox">
        <CheckboxBox
          $style={styles?.boxStyle}
          $highlight={!!highlightOnChecked}
        >
          <HiddenCheckbox
            ref={inputRef}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
            type="checkbox"
            name={name}
            id={id}
            aria-label="checkbox"
            checked={props.checked}
            onChange={props.onChange}
            $isError={showError}
            $indeterminate={indeterminate}
            $checked={isChecked}
            role="checkbox"
            $style={styles?.self}
            $disabled={props.disabled}
            disabled={props.disabled}
            $backgroundColor={checkboxTheme?.backgroundColor}
            $borderColor={checkboxTheme?.borderColor}
            $checkedBorderColor={checkboxTheme?.checkedBorderColor}
            $checkedBackgroundColor={checkboxTheme?.checkedBackgroundColor}
            readOnly
          />
          <Icon
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            $style={styles?.iconStyle}
            $visible={indeterminate || isChecked}
            $iconColor={checkboxTheme?.iconColor}
          >
            {indeterminate ? (
              <line x1="6" y1="12" x2="18" y2="12" />
            ) : (
              <polyline points="20 6 9 17 4 12" />
            )}
          </Icon>
        </CheckboxBox>

        {label && (
          <StatefulForm.Label
            aria-label="label"
            disabled={props?.disabled}
            styles={{
              self: css`
                ${checkboxTheme.labelColor};
                ${styles?.labelStyle}
              `,
            }}
            htmlFor={props.disabled ? null : id}
            label={label}
          />
        )}
      </InputContainer>

      {description && (
        <DescriptionText
          $descriptionColor={checkboxTheme.descriptionColor}
          $highlight={highlightOnChecked}
          $style={styles?.descriptionStyle}
        >
          {description}
        </DescriptionText>
      )}
    </InputWrapper>
  );
}

export type CheckboxStylesProps = BaseCheckboxStylesProps &
  FieldLaneStylesProps;

export interface CheckboxProps
  extends Omit<BaseCheckboxProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns"> {
  styles?: CheckboxStylesProps;
}

function Checkbox({
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
}: CheckboxProps) {
  const inputId = StatefulForm.sanitizeId({
    prefix: "checkbox",
    name,
    id,
  });

  const {
    bodyStyle,
    controlStyle,
    containerStyle,
    titleStyle,
    ...CheckboxStyles
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
      label={title}
      required={rest.required}
      errorIconPosition="none"
      styles={{
        bodyStyle: css`
          min-height: 0px;
          ${bodyStyle}
        `,
        controlStyle,
        containerStyle: css`
          width: fit-content;
          ${containerStyle}
        `,
        labelStyle: titleStyle,
      }}
    >
      <BaseCheckbox
        {...rest}
        id={inputId}
        disabled={disabled}
        showError={showError}
        styles={CheckboxStyles}
        label={label}
        name={name}
        description={description}
      />
    </FieldLane>
  );
}

const InputWrapper = styled.label<{
  $hasDescription: boolean;
  $highlight: boolean;
  $checked: boolean;
  $backgroundColor?: string;
  $highlightBackgroundColor?: string;
  $highlightHoverColor?: string;
  $checkedBorderColor?: string;
  $style?: CSSProp;
  $disabled?: boolean;
}>`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  background-color: ${({
    $highlight,
    $checked,
    $backgroundColor,
    $highlightBackgroundColor,
  }) =>
    $highlight && $checked
      ? ($highlightBackgroundColor ?? $backgroundColor ?? "#DBEAFE")
      : "transparent"};

  padding: ${({ $highlight }) => ($highlight ? "12px" : "0")};
  cursor: ${({ $highlight }) => ($highlight ? "pointer" : "default")};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({
      $highlight,
      $highlightHoverColor,
      $highlightBackgroundColor,
    }) =>
      $highlight
        ? ($highlightHoverColor ?? $highlightBackgroundColor ?? "#E7F2FC")
        : "none"};
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
      user-select: none;
    `}

  ${({ $style }) => $style}
`;

const CheckboxBox = styled.div<{ $highlight: boolean; $style?: CSSProp }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $style }) => $style}
`;

const HiddenCheckbox = styled.input<{
  $isError?: boolean;
  $checked?: boolean;
  $indeterminate?: boolean;
  $backgroundColor?: string;
  $checkedBackgroundColor?: string;
  $borderColor?: string;
  $checkedBorderColor?: string;
  $style?: CSSProp;
  $disabled?: boolean;
}>`
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 0;
  outline: none;
  background-color: ${({
    $indeterminate,
    $checked,
    $backgroundColor,
    $checkedBackgroundColor,
  }) =>
    $indeterminate || $checked
      ? ($checkedBackgroundColor ?? "#61A9F9")
      : ($backgroundColor ?? "#ffffff")};
  border: 1px solid
    ${({ $indeterminate, $checked, $borderColor, $checkedBorderColor }) =>
      $indeterminate || $checked
        ? ($checkedBorderColor ?? "#61A9F9")
        : ($borderColor ?? "#6b7280")};

  ${({ $disabled }) =>
    $disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;
        `}

  ${({ $isError }) =>
    $isError &&
    css`
      border-color: #f87171;
      &:focus {
        border-color: #f87171;
        box-shadow: 0 0 0 1px #f87171;
      }
    `}
  ${({ $style }) => $style};
`;

const Icon = styled.svg<{
  $visible?: boolean;
  $iconColor?: string;
  $style?: CSSProp;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  color: ${({ $iconColor }) => $iconColor ?? "white"};
  transform: ${({ $visible }) =>
    $visible
      ? "translate(-50%, -50%) scale(1)"
      : "translate(-50%, -50%) scale(0)"};
  height: 60%;
  width: 60%;
  transition: transform 150ms;
  pointer-events: none;
  ${({ $style }) => $style};
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
`;

const DescriptionText = styled.span<{
  $highlight?: boolean;
  $descriptionColor?: string;
  $style?: CSSProp;
}>`
  ${({ $highlight }) =>
    $highlight &&
    css`
      font-size: 14px;
    `}
  margin-left: 24px;
  color: ${({ $descriptionColor }) => $descriptionColor ?? "#4b5563"};
  ${({ $style }) => $style};
`;

export { Checkbox };
