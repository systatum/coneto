import styled, { css, CSSProp } from "styled-components";
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useRef,
} from "react";

type WithoutStyle<T> = Omit<T, "style">;

export interface CheckboxProps
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
  containerStyle?: CSSProp;
  inputStyle?: CSSProp;
  labelStyle?: CSSProp;
  iconStyle?: CSSProp;
  wrapperStyle?: CSSProp;
  descriptionStyle?: CSSProp;
  errorStyle?: CSSProp;
}

function Checkbox({
  label,
  name,
  showError,
  description,
  highlightOnChecked,
  errorMessage,
  indeterminate = false,
  containerStyle,
  inputStyle,
  labelStyle,
  iconStyle,
  wrapperStyle,
  descriptionStyle,
  errorStyle,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `checkbox-${name}-${props.value}`;
  const isChecked = Boolean(props.checked);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <Label
      htmlFor={props.disabled ? null : inputId}
      $hasDescription={!!description}
      $highlight={!!highlightOnChecked}
      $checked={isChecked}
      $style={containerStyle}
      $disabled={props.disabled}
    >
      <InputContainer aria-label="input-container-checkbox">
        <CheckboxBox $style={wrapperStyle} $highlight={!!highlightOnChecked}>
          <HiddenCheckbox
            ref={inputRef}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
            type="checkbox"
            name={name}
            id={inputId}
            checked={props.checked}
            onChange={props.onChange}
            $isError={showError}
            $indeterminate={indeterminate}
            $checked={isChecked}
            $style={inputStyle}
            $disabled={props.disabled}
            disabled={props.disabled}
            readOnly
          />
          <Icon
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            $style={iconStyle}
            $visible={indeterminate || isChecked}
          >
            {indeterminate ? (
              <line x1="6" y1="12" x2="18" y2="12" />
            ) : (
              <polyline points="20 6 9 17 4 12" />
            )}
          </Icon>
        </CheckboxBox>

        {label && (
          <LabelText $highlight={highlightOnChecked} $style={labelStyle}>
            {label}
          </LabelText>
        )}
      </InputContainer>

      {description && (
        <DescriptionText
          $highlight={highlightOnChecked}
          $style={descriptionStyle}
        >
          {description}
        </DescriptionText>
      )}
      {showError && <ErrorText $style={errorStyle}>{errorMessage}</ErrorText>}
    </Label>
  );
}

const Label = styled.label<{
  $hasDescription: boolean;
  $highlight: boolean;
  $checked: boolean;
  $style?: CSSProp;
  $disabled?: boolean;
}>`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  background-color: ${({ $highlight, $checked }) =>
    $highlight && $checked ? "#DBEAFE" : "white"};
  border: ${({ $highlight }) =>
    $highlight ? "1px solid transparent" : "none"};
  padding: ${({ $highlight }) => ($highlight ? "12px" : "0")};
  cursor: ${({ $highlight }) => ($highlight ? "pointer" : "default")};
  transition: background-color 0.2s;

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
      user-select: none;
    `}

  ${({ $style }) => $style};

  &:hover {
    background-color: ${({ $highlight }) =>
      $highlight ? "rgb(231,242,252)" : "white"};
  }
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
  $style?: CSSProp;
  $disabled?: boolean;
}>`
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 0;
  outline: none;
  background-color: ${({ $indeterminate, $checked }) =>
    $indeterminate || $checked ? "#61A9F9" : "#ffffff"};
  border: 1px solid
    ${({ $indeterminate, $checked }) =>
      $indeterminate || $checked ? "#61A9F9" : "#6b7280"};

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

const Icon = styled.svg<{ $visible?: boolean; $style?: CSSProp }>`
  position: absolute;
  top: 50%;
  left: 50%;
  color: white;
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
`;

const LabelText = styled.span<{ $highlight?: boolean; $style?: CSSProp }>`
  ${({ $highlight }) =>
    $highlight &&
    css`
      font-size: 14px;
    `}
  ${({ $style }) => $style};
`;

const DescriptionText = styled.span<{ $highlight?: boolean; $style?: CSSProp }>`
  ${({ $highlight }) =>
    $highlight &&
    css`
      font-size: 14px;
    `}
  margin-left: 24px;

  color: #4b5563;
  ${({ $style }) => $style};
`;

const ErrorText = styled.span<{ $style?: CSSProp }>`
  margin-top: 4px;
  color: #dc2626;
  ${({ $style }) => $style}
`;

export { Checkbox };
