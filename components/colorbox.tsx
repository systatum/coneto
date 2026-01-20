import { RiErrorWarningLine } from "@remixicon/react";
import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
  useState,
} from "react";
import styled, { CSSProp } from "styled-components";
import { StatefulForm } from "./stateful-form";

export interface ColorboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "style"> {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  onClick?: () => void;
  styles?: ColorboxStylesProps;
  helper?: string;
}

export interface ColorboxStylesProps {
  self?: CSSProp;
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
}

const Colorbox = forwardRef<HTMLInputElement, ColorboxProps>(
  (
    {
      onChange,
      value,
      label,
      errorMessage,
      showError,
      placeholder,
      onClick,
      styles,
      helper,
      ...props
    },
    ref
  ) => {
    const [hovered, setHovered] = useState(false);

    const inputId = `colorbox-${props.name}`;

    const inputElement: ReactElement = (
      <ColorInputContainer
        $style={styles?.self}
        $hovered={hovered}
        $showError={!!showError}
      >
        <ColorBox
          tabIndex={0}
          $bgColor={value}
          $showError={!!showError}
          onClick={() => {
            document.getElementById(inputId)?.click();
            setHovered(true);
          }}
          onBlur={() => {
            setHovered(false);
            if (onClick) onClick();
          }}
        />

        <HiddenColorInput
          {...props}
          type="color"
          value={value}
          onChange={onChange}
        />

        <TextInputGroup $hovered={hovered} $showError={!!showError}>
          <Prefix $showError={!!showError}>#</Prefix>
          <TextInput
            {...props}
            type="text"
            id={inputId}
            ref={ref}
            value={value?.replace(/^#/, "")}
            onChange={(e) => {
              const cleanValue = e.target.value.replace(/#/g, "");

              const inputChangeEvent = {
                target: {
                  name: props.name,
                  value: `#${cleanValue}`,
                },
              } as ChangeEvent<HTMLInputElement>;
              onChange(inputChangeEvent);
            }}
            placeholder={placeholder}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            maxLength={6}
            spellCheck={false}
            $showError={!!showError}
          />
        </TextInputGroup>

        {showError && <StyledErrorIcon size={18} />}
      </ColorInputContainer>
    );

    return (
      <InputWrapper
        $containerStyle={styles?.containerStyle}
        $disabled={props.disabled}
      >
        {label && (
          <StatefulForm.Label
            htmlFor={props.disabled ? null : inputId}
            style={styles?.labelStyle}
            helper={helper}
            label={label}
          />
        )}
        <InputContent>
          {inputElement}
          {showError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        </InputContent>
      </InputWrapper>
    );
  }
);

const InputWrapper = styled.div<{
  $containerStyle?: CSSProp;
  $disabled?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  width: 100%;
  position: relative;

  ${({ $disabled }) => $disabled && `cursor: not-allowed; opacity: 0.5;`}
  ${({ $containerStyle }) => $containerStyle}
`;

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;

const ColorInputContainer = styled.div<{
  $hovered: boolean;
  $showError: boolean;
  $style?: CSSProp;
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 2px;
  height: 100%;
  width: 100%;
  border: 1px solid
    ${({ $showError, $hovered }) =>
      $showError ? "#ef4444" : $hovered ? "#61A9F9" : "#d1d5db"};

  ${({ $style }) => $style}
`;

const ColorBox = styled.div<{
  $bgColor?: string;
  $showError?: boolean;
}>`
  min-width: 24px;
  min-height: 24px;
  margin: 4px;
  border-radius: 2px;
  border: 1px solid ${({ $showError }) => ($showError ? "#ef4444" : "#d1d5db")};
  background-color: ${({ $bgColor }) => ($bgColor ? $bgColor : "#ffffff")};
  overflow: hidden;
  cursor: pointer;
`;

const HiddenColorInput = styled.input`
  position: absolute;
  bottom: -5px;
  border: 1px solid transparent;
  width: 1px;
  height: 1px;
  opacity: 0;
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
`;

const TextInputGroup = styled.span<{
  $hovered: boolean;
  $showError: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  height: 34px;
  padding: 2px 12px;
  border-left: 1px solid
    ${({ $showError, $hovered }) =>
      $showError ? "#ef4444" : $hovered ? "#61A9F9" : "#d1d5db"};
  width: 100%;
`;

const Prefix = styled.span<{ $showError: boolean }>`
  color: ${({ $showError }) => ($showError ? "#ef4444" : "#6b7280")};
`;

const TextInput = styled.input<{ $showError: boolean }>`
  flex: 1;
  width: 100%;
  overflow: scroll;

  background: transparent;
  border: none;
  outline: none;
  color: ${({ $showError }) => ($showError ? "#ef4444" : "#1f2937")};
`;

const StyledErrorIcon = styled(RiErrorWarningLine)`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background-color: #dc2626;
  color: white;
  border-radius: 9999px;
`;

export { Colorbox };
