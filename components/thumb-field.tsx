import {
  RiErrorWarningLine,
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "@remixicon/react";
import { ChangeEvent, ReactElement, useRef, useState } from "react";
import styled, { css, CSSProp } from "styled-components";

export interface ThumbFieldProps {
  value?: boolean | null;
  onChange?: (data: ChangeEvent<HTMLInputElement>) => void;
  thumbsUpBackgroundColor?: string;
  thumbsDownBackgroundColor?: string;
  disabled?: boolean;
  name?: string;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  containerStyle?: CSSProp;
  triggerStyle?: CSSProp;
  style: CSSProp;
  id?: string;
}

export type ThumbFieldValue = "up" | "down" | "blank";

function ThumbField({
  onChange,
  thumbsUpBackgroundColor = "#61A9F9",
  thumbsDownBackgroundColor = "RGB(206, 55, 93)",
  value = null,
  name,
  disabled,
  errorMessage,
  label,
  showError,
  containerStyle,
  style,
  triggerStyle,
  id,
}: ThumbFieldProps) {
  const thumbStateValue = value === true ? "up" : value ? "down" : "blank";
  const [thumbValue, setThumbValue] =
    useState<ThumbFieldValue>(thumbStateValue);

  const thumbInputRef = useRef<HTMLInputElement>(null);

  const handleChangeValue = (data: ThumbFieldValue) => {
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

  const inputElement: ReactElement = (
    <InputGroup $style={style}>
      <input
        ref={thumbInputRef}
        name={name}
        type="hidden"
        value={
          thumbValue === "up" ? "true" : thumbValue === "down" ? "false" : ""
        }
      />

      <TriggerWrapper
        aria-label="thumb-up"
        onClick={() => handleChangeValue("up")}
        $triggerStyle={triggerStyle}
        $active={thumbValue === "up"}
        $activeColor={thumbsUpBackgroundColor}
        $showError={showError}
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
        $triggerStyle={triggerStyle}
        $active={thumbValue === "down"}
        $activeColor={thumbsDownBackgroundColor}
        $showError={showError}
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

  return (
    <InputWrapper $containerStyle={containerStyle} $disabled={disabled}>
      {label && <label htmlFor={id}>{label}</label>}
      <InputContent>
        {inputElement}
        {showError && <ErrorText>{errorMessage}</ErrorText>}
      </InputContent>
    </InputWrapper>
  );
}

const InputWrapper = styled.div<{
  $containerStyle?: CSSProp;
  $disabled?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  width: 100%;

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
    `}
  ${({ $containerStyle }) => $containerStyle}
`;

const InputGroup = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  ${({ $style }) => $style};
`;

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
`;

const TriggerWrapper = styled.div<{
  $triggerStyle?: CSSProp;
  $active?: boolean;
  $activeColor?: string;
  $showError?: boolean;
}>`
  cursor: pointer;
  display: flex;
  align-items: center;

  svg {
    transition: opacity 0.2s ease;
    ${({ $active, $activeColor }) =>
      $active &&
      css`
        color: ${$activeColor};
      `}
    ${({ $showError }) =>
      $showError &&
      css`
        color: #dc2626;
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
