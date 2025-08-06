import styled, { CSSProp } from "styled-components";
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
    <div>
      <Label
        htmlFor={inputId}
        $hasDescription={!!description}
        $highlight={!!highlightOnChecked}
        $checked={isChecked}
        $style={containerStyle}
      >
        <CheckboxBox $hasDescription={!!description} $style={wrapperStyle}>
          <HiddenCheckbox
            ref={inputRef}
            type="checkbox"
            name={name}
            id={inputId}
            checked={props.checked}
            onChange={props.onChange}
            $isError={showError}
            $indeterminate={indeterminate}
            $checked={isChecked}
            $style={inputStyle}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
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

        {(label || description) && (
          <TextContainer>
            {label && (
              <LabelText $highlight={highlightOnChecked} $style={labelStyle}>
                {label}
              </LabelText>
            )}
            {description && (
              <DescriptionText $highlight={highlightOnChecked}>
                {description}
              </DescriptionText>
            )}
          </TextContainer>
        )}
      </Label>

      {showError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </div>
  );
}

const Label = styled.label<{
  $hasDescription: boolean;
  $highlight: boolean;
  $checked: boolean;
  $style?: CSSProp;
}>`
  display: flex;
  gap: 6px;
  font-size: 12px;
  align-items: ${({ $hasDescription }) =>
    $hasDescription ? "flex-start" : "center"};
  background-color: ${({ $highlight, $checked }) =>
    $highlight && $checked ? "#DBEAFE" : "white"};
  border: ${({ $highlight }) =>
    $highlight ? "1px solid transparent" : "none"};
  padding: ${({ $highlight }) => ($highlight ? "12px" : "0")};
  cursor: ${({ $highlight }) => ($highlight ? "pointer" : "default")};
  transition: background-color 0.2s;
  ${({ $style }) => $style};

  &:hover {
    background-color: ${({ $highlight }) =>
      $highlight ? "rgb(231,242,252)" : "white"};
  }
`;

const CheckboxBox = styled.div<{ $hasDescription: boolean; $style?: CSSProp }>`
  position: relative;
  max-width: 16px;
  max-height: 16px;
  ${({ $hasDescription }) => $hasDescription && "margin-top: 4px;"}
  ${({ $style }) => $style}
`;

const HiddenCheckbox = styled.input<{
  $isError?: boolean;
  $checked?: boolean;
  $indeterminate?: boolean;
  $style?: CSSProp;
}>`
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 0;
  cursor: pointer;
  outline: none;
  background-color: ${({ $indeterminate, $checked }) =>
    $indeterminate || $checked ? "#61A9F9" : "#ffffff"};
  border: 1px solid
    ${({ $indeterminate, $checked }) =>
      $indeterminate || $checked ? "#61A9F9" : "#6b7280"};

  ${({ $isError }) =>
    $isError &&
    `
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
  left: 3px;
  top: 3px;
  height: 10px;
  width: 10px;
  color: white;
  transition: transform 150ms;
  pointer-events: none;
  transform: ${({ $visible }) => ($visible ? "scale(1)" : "scale(0)")};
  ${({ $style }) => $style};
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelText = styled.span<{ $highlight?: boolean; $style?: CSSProp }>`
  ${({ $highlight }) =>
    $highlight &&
    `
    font-size: 16px;
    font-weight: 500;
  `}
  ${({ $style }) => $style};
`;

const DescriptionText = styled.span<{ $highlight?: boolean; $style?: CSSProp }>`
  ${({ $highlight }) =>
    $highlight &&
    `
    font-size: 14px;
    color: #4B5563;
  `}
  ${({ $style }) => $style};
`;

const ErrorText = styled.p`
  margin-top: 4px;
  font-size: 12px;
  color: #dc2626;
`;

export { Checkbox };
