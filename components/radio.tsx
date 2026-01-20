import styled, { css, CSSProp } from "styled-components";
import { ChangeEvent, InputHTMLAttributes, ReactElement } from "react";
import { RemixiconComponentType } from "@remixicon/react";
import { StatefulForm } from "./stateful-form";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  value?: string;
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  highlightOnChecked?: boolean;
  styles?: RadioStylesProps;
  showError?: boolean;
  errorMessage?: string;
  mode?: "radio" | "button";
  icon?: RemixiconComponentType;
  iconSize?: number;
  iconColor?: string;
  helper?: string;
}

interface RadioStylesProps {
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
  descriptionStyle?: CSSProp;
  self?: CSSProp;
  errorStyle?: CSSProp;
  titleStyle?: CSSProp;
  inputContainerStyle?: CSSProp;
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
  title,
  description,
  checked,
  onChange,
  name,
  highlightOnChecked,
  showError,
  errorMessage,
  icon: Icon,
  iconSize,
  iconColor,
  styles,
  helper,
  mode = "radio",
  ...props
}: RadioProps) {
  const id = `radio-${name}-${value}`;

  const inputElement: ReactElement = (
    <Label
      $isRadio={mode === "radio"}
      htmlFor={props.disabled ? null : id}
      $highlight={highlightOnChecked}
      $checked={checked}
      $style={styles?.containerStyle}
      $hasDescription={!!description}
      $disabled={props.disabled}
    >
      <InputContainer
        $style={styles?.inputContainerStyle}
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
        />
        {Icon && (
          <Icon
            aria-label="radio-icon"
            size={iconSize ? iconSize : mode === "button" ? 25 : 16}
            style={{ color: iconColor ?? "black" }}
          />
        )}
        {label && (
          <LabelText
            aria-label="radio-label-wrapper"
            $style={styles?.labelStyle}
          >
            {label}
          </LabelText>
        )}
      </InputContainer>
      {description && (
        <DescriptionText
          $isRadio={mode === "radio"}
          $highlight={highlightOnChecked}
          $style={styles?.descriptionStyle}
        >
          {description}
        </DescriptionText>
      )}
      {showError && errorMessage && (
        <ErrorText $style={styles?.errorStyle}>{errorMessage}</ErrorText>
      )}
    </Label>
  );

  return (
    <Container $style={styles?.containerStyle}>
      {title && (
        <StatefulForm.Label
          htmlFor={props.disabled ? null : id}
          aria-label="radio-title-wrapper"
          style={styles?.titleStyle}
          helper={helper}
          label={title}
        />
      )}
      {inputElement}
    </Container>
  );
}

const Container = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  width: 100%;

  ${({ $style }) => $style}
`;

const Title = styled.label<{ $style?: CSSProp }>`
  font-size: 0.75rem;
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;

  ${({ $style }) => $style}
`;

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
