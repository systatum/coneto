import styled, { CSSProp } from "styled-components";
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
  ...props
}: RadioProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = `radio-${value}`;

  return (
    <Label
      htmlFor={id}
      $highlight={highlightOnChecked}
      $checked={checked}
      $style={containerStyle}
    >
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
      <TextContainer>
        {label && <LabelText>{label}</LabelText>}
        {description && <DescriptionText>{description}</DescriptionText>}
      </TextContainer>
    </Label>
  );
}

const Label = styled.label<{
  $highlight?: boolean;
  $checked?: boolean;
  $style?: CSSProp;
}>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
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
  margin-top: 5px;
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  border: 1px solid #4b5563;

  input:checked + & {
    border-width: 5px;
    border-color: #61a9f9;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelText = styled.div`
  font-weight: 500;
`;

const DescriptionText = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
`;

export { Radio };
