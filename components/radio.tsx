import styled, { css, CSSProp } from "styled-components";
import { ChangeEvent, InputHTMLAttributes } from "react";

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
  showError?: boolean;
  errorMessage?: string;
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
  descriptionStyle,
  showError,
  errorMessage,
  ...props
}: RadioProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = `radio-${value}`;

  return (
    <Label
      htmlFor={id}
      $highlight={highlightOnChecked}
      $checked={checked}
      $style={containerStyle}
      $hasDescription={!!description}
    >
      <TextContainer>
        <HiddenRadio
          type="radio"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          checked={checked}
          {...props}
        />
        <Circle />
        {label && <LabelText $style={labelStyle}>{label}</LabelText>}
      </TextContainer>
      {description && (
        <DescriptionText
          $highlight={highlightOnChecked}
          $style={descriptionStyle}
        >
          {description}
        </DescriptionText>
      )}
      {showError && <ErrorText>{errorMessage}</ErrorText>}
    </Label>
  );
}

const Label = styled.label<{
  $highlight?: boolean;
  $checked?: boolean;
  $style?: CSSProp;
  $hasDescription?: boolean;
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

  &:hover {
    background-color: ${({ $highlight }) => ($highlight ? "#E7F2FC" : "none")};
  }

  ${({ $style }) => $style}
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const Circle = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  border: 1px solid #4b5563;

  input:checked + & {
    border-width: 5px;
    border-color: #61a9f9;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;

const LabelText = styled.div<{ $style?: CSSProp }>`
  font-size: 14px;
  ${({ $style }) => $style}
`;

const ErrorText = styled.span`
  margin-top: 4px;
  color: #dc2626;
`;

const DescriptionText = styled.span<{ $highlight?: boolean; $style?: CSSProp }>`
  ${({ $highlight }) =>
    $highlight &&
    css`
      font-size: 14px;
    `}
  color: #4b5563;
  margin-left: 24px;
  ${({ $style }) => $style};
`;

export { Radio };
