import styled, { css, CSSProp } from "styled-components";
import { ChangeEvent, InputHTMLAttributes } from "react";
import { RemixiconComponentType } from "@remixicon/react";

export interface RadioProps {
  value: string;
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  highlightOnChecked?: boolean;
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
  descriptionStyle?: CSSProp;
  inputStyle?: CSSProp;
  errorStyle?: CSSProp;
  showError?: boolean;
  errorMessage?: string;
  mode?: "radio" | "button";
  icon?: RemixiconComponentType;
  iconSize?: number;
  iconColor?: string;
  inputContainer?: CSSProp;
}

export interface RadioOptionsProps {
  value?: string;
  label?: string;
  description?: string;
  iconSize?: number;
  iconColor?: string;
  icon?: RemixiconComponentType;
}

function Radio({
  value,
  label,
  description,
  checked,
  onChange,
  name,
  highlightOnChecked,
  containerStyle,
  labelStyle,
  inputContainer,
  descriptionStyle,
  showError,
  errorMessage,
  inputStyle,
  errorStyle,
  icon: Icon,
  iconSize,
  iconColor,
  mode = "radio",
  ...props
}: RadioProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = `radio-${value}`;

  return (
    <Label
      $isRadio={mode === "radio"}
      htmlFor={props.disabled ? null : id}
      $highlight={highlightOnChecked}
      $checked={checked}
      $style={containerStyle}
      $hasDescription={!!description}
      $disabled={props.disabled}
    >
      <InputContainer
        $style={inputContainer}
        aria-label="input-container-radio"
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
          disabled={props.disabled}
        />
        <Circle
          $isRadio={mode === "radio"}
          $error={showError}
          $style={inputStyle}
        />
        {Icon && <Icon size={iconSize ?? 11} color={iconColor ?? "black"} />}
        {label && <LabelText $style={labelStyle}>{label}</LabelText>}
      </InputContainer>
      {description && (
        <DescriptionText
          $isRadio={mode === "radio"}
          $highlight={highlightOnChecked}
          $style={descriptionStyle}
        >
          {description}
        </DescriptionText>
      )}
      {showError && errorMessage && (
        <ErrorText $style={errorStyle}>{errorMessage}</ErrorText>
      )}
    </Label>
  );
}

const Label = styled.label<{
  $highlight?: boolean;
  $checked?: boolean;
  $style?: CSSProp;
  $hasDescription?: boolean;
  $disabled?: boolean;
  $isRadio?: boolean;
}>`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  font-size: 12px;
  border: 1px solid transparent;
  background-color: ${({ $highlight, $checked }) =>
    $highlight && $checked ? "#DBEAFE" : "#fff"};
  padding: ${({ $highlight }) => ($highlight ? "0.75rem" : "0")};
  width: 100%;

  &:hover {
    background-color: ${({ $highlight }) => ($highlight ? "#E7F2FC" : "none")};
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

const HiddenRadio = styled.input<{ $disabled?: boolean }>`
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
`;

const Circle = styled.div<{
  $style?: CSSProp;
  $error?: boolean;
  $isRadio?: boolean;
}>`
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  border: 1px solid #4b5563;

  ${({ $error }) =>
    $error &&
    css`
      border-color: #dc2626;
    `}

  ${({ $style }) => $style}
  input:checked + & {
    border-width: 5px;
    border-color: #61a9f9;
  }

  ${({ $isRadio }) =>
    !$isRadio &&
    css`
      display: none;
    `}
`;

const InputContainer = styled.div<{ $style?: CSSProp; $isRadio?: boolean }>`
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

const LabelText = styled.div<{ $style?: CSSProp }>`
  font-size: 14px;
  ${({ $style }) => $style}
`;

const ErrorText = styled.span<{ $style?: CSSProp }>`
  margin-top: 4px;
  color: #dc2626;
  ${({ $style }) => $style}
`;

const DescriptionText = styled.span<{
  $highlight?: boolean;
  $style?: CSSProp;
  $isRadio?: boolean;
}>`
  ${({ $highlight }) =>
    $highlight &&
    css`
      font-size: 14px;
    `}
  color: #4b5563;

  ${({ $isRadio }) =>
    $isRadio &&
    css`
      margin-left: 24px;
    `}
  ${({ $style }) => $style};
`;

export { Radio };
