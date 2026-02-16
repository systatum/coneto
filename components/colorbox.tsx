import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";

export interface BaseColorboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "style"> {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  showError?: boolean;
  onClick?: () => void;
  styles?: ColorboxStylesProps;
  inputId?: string;
}

export interface ColorboxStylesProps {
  self?: CSSProp;
}

const BaseColorbox = forwardRef<HTMLInputElement, BaseColorboxProps>(
  (
    {
      onChange,
      value,
      showError,
      placeholder,
      onClick,
      styles,
      inputId,
      ...props
    },
    ref
  ) => {
    const [hovered, setHovered] = useState(false);

    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleColorChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
          if (onChange) {
            onChange({
              target: {
                name: props.name,
                value: newValue,
              },
            } as ChangeEvent<HTMLInputElement>);
          }
        }, 2);
      },
      [onChange, props.name]
    );

    return (
      <ColorInputContainer
        $style={styles?.self}
        $hovered={hovered}
        $showError={!!showError}
        onBlur={() => {
          setHovered(false);
        }}
      >
        <ColorBox
          onClick={() => {
            document.getElementById(inputId)?.click();
            setHovered(true);
            if (onClick) onClick();
          }}
          tabIndex={0}
          $bgColor={value}
          $showError={!!showError}
        />

        <HiddenColorInput
          {...props}
          id={inputId}
          type="color"
          value={value}
          onChange={handleColorChange}
        />

        <TextInputGroup $hovered={hovered} $showError={!!showError}>
          <Prefix $showError={!!showError}>#</Prefix>
          <TextInput
            {...props}
            type="text"
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
      </ColorInputContainer>
    );
  }
);

export interface ColorboxProps
  extends Omit<BaseColorboxProps, "styles" | "inputId">,
    Omit<FieldLaneProps, "styles" | "inputId" | "type"> {
  styles?: ColorboxStylesProps & FieldLaneStylesProps;
}

const Colorbox = forwardRef<HTMLInputElement, ColorboxProps>(
  ({ ...props }, ref) => {
    const {
      dropdowns,
      label,
      showError,
      styles,
      errorMessage,
      actions,
      type,
      helper,
      disabled,
      ...rest
    } = props;

    const inputId = `colorbox-${props.name}`;

    return (
      <FieldLane
        inputId={inputId}
        dropdowns={dropdowns}
        showError={showError}
        errorMessage={errorMessage}
        label={label}
        actions={actions}
        type={type}
        helper={helper}
        disabled={disabled}
        styles={{
          containerStyle: styles?.containerStyle,
          labelStyle: styles?.labelStyle,
        }}
      >
        <BaseColorbox
          inputId={inputId}
          showError={showError}
          disabled={disabled}
          styles={{
            self: css`
              ${dropdowns &&
              css`
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
              `}
              ${styles?.self}
            `,
          }}
          ref={ref}
          {...rest}
        />
      </FieldLane>
    );
  }
);

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
      $showError ? "#f87171" : $hovered ? "#61A9F9" : "#d1d5db"};

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
  border: 1px solid ${({ $showError }) => ($showError ? "#f87171" : "#d1d5db")};
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
      $showError ? "#f87171" : $hovered ? "#61A9F9" : "#d1d5db"};
  width: 100%;
`;

const Prefix = styled.span<{ $showError: boolean }>`
  color: ${({ $showError }) => ($showError ? "#f87171" : "#6b7280")};
`;

const TextInput = styled.input<{ $showError: boolean }>`
  flex: 1;
  width: 100%;
  overflow: scroll;

  background: transparent;
  border: none;
  outline: none;
  color: ${({ $showError }) => ($showError ? "#f87171" : "#1f2937")};
`;

export { Colorbox };
