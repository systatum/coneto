import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import { FieldLane, FieldLaneProps, FieldLaneStyles } from "./field-lane";
import { StatefulForm } from "./stateful-form";
import { ColorboxThemeConfig } from "theme";
import { useTheme } from "./../theme/provider";

interface BaseColorboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "style"> {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  showError?: boolean;
  onClick?: () => void;
  styles?: BaseColorboxStyles;
  id?: string;
}

export interface BaseColorboxStyles {
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
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const colorboxTheme = currentTheme?.colorbox;

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
        $theme={colorboxTheme}
        $disabled={disabled}
        $style={styles?.self}
        $hovered={hovered}
        $showError={!!showError}
        onBlur={() => {
          setHovered(false);
        }}
      >
        <ColorBox
          $theme={colorboxTheme}
          $disabled={disabled}
          onClick={() => {
            setHovered(true);
            document.getElementById(id)?.click();
            if (onClick) onClick();
          }}
          tabIndex={0}
          $bgColor={value}
          $showError={!!showError}
        />

        <HiddenColorInput
          {...props}
          disabled={disabled}
          id={id}
          type="color"
          value={value}
          onChange={handleColorChange}
        />

        <TextInputGroup
          $disabled={disabled}
          $hovered={hovered}
          $theme={colorboxTheme}
          $showError={!!showError}
        >
          <Prefix $theme={colorboxTheme} $showError={!!showError}>
            #
          </Prefix>
          <TextInput
            {...props}
            $theme={colorboxTheme}
            $disabled={disabled}
            type="text"
            ref={ref}
            disabled={disabled}
            value={value?.replace(/^#/, "")}
            onChange={(e) => {
              const cleanValue = e.target.value.replace(/#/g, "");

              const inputChangeEvent = {
                target: {
                  name: props.name,
                  value: `#${cleanValue}`,
                },
              } as ChangeEvent<HTMLInputElement>;
              if (onChange) {
                onChange(inputChangeEvent);
              }
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

export type ColorboxStyles = BaseColorboxStyles & FieldLaneStyles;
export interface ColorboxProps
  extends Omit<BaseColorboxProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type"> {
  styles?: ColorboxStyles;
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
      labelGap,
      labelWidth,
      labelPosition,
      ...rest
    } = props;

    const inputId = StatefulForm.sanitizeId({
      prefix: "colorbox",
      name: props.name,
      id: props.id,
    });

    return (
      <FieldLane
        id={inputId}
        dropdowns={dropdowns}
        showError={showError}
        labelGap={labelGap}
        labelWidth={labelWidth}
        labelPosition={labelPosition}
        errorMessage={errorMessage}
        label={label}
        actions={actions}
        type={type}
        helper={helper}
        disabled={disabled}
        required={rest.required}
        styles={{
          containerStyle: styles?.containerStyle,
          labelStyle: styles?.labelStyle,
        }}
      >
        <BaseColorbox
          {...rest}
          id={inputId}
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
        />
      </FieldLane>
    );
  }
);

const ColorInputContainer = styled.div<{
  $hovered: boolean;
  $showError: boolean;
  $style?: CSSProp;
  $disabled?: boolean;
  $theme: ColorboxThemeConfig;
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 2px;
  width: 100%;
  height: 34px;

  background-color: ${({ $theme }) => $theme?.backgroundColor};

  border: 1px solid
    ${({ $theme, $showError, $hovered, $disabled }) =>
      $disabled
        ? $theme.disabledBorderColor
        : $showError
          ? $theme.errorBorderColor
          : $hovered
            ? $theme.focusedBorderColor
            : $theme.borderColor};

  ${({ $disabled }) =>
    $disabled &&
    css`
      user-select: none;
      cursor: not-allowed;
    `};

  ${({ $style }) => $style}
`;

const ColorBox = styled.div<{
  $bgColor?: string;
  $showError?: boolean;
  $disabled?: boolean;
  $theme: ColorboxThemeConfig;
}>`
  min-width: 24px;
  min-height: 24px;
  margin: 4px;
  border-radius: 2px;
  border: 1px solid
    ${({ $theme, $showError, $disabled }) =>
      $disabled
        ? $theme.disabledBorderColor
        : $showError
          ? $theme.errorBorderColor
          : $theme.borderColor};
  background-color: ${({ $bgColor }) => ($bgColor ? $bgColor : "#ffffff")};
  overflow: hidden;
  cursor: pointer;

  ${({ $disabled }) =>
    $disabled &&
    css`
      user-select: none;
      cursor: not-allowed;
    `};
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
  $disabled?: boolean;
  $theme: ColorboxThemeConfig;
}>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0px 12px;
  height: 100%;
  min-height: 34px;

  background-color: ${({ $theme }) => $theme?.backgroundColor};

  border: 1px solid
    ${({ $theme, $showError, $hovered, $disabled }) =>
      $disabled
        ? $theme.disabledBorderColor
        : $showError
          ? $theme.errorBorderColor
          : $hovered
            ? $theme.focusedBorderColor
            : $theme.borderColor};

  width: 100%;
`;

const Prefix = styled.span<{
  $showError: boolean;
  $theme: ColorboxThemeConfig;
}>`
  color: ${({ $theme, $showError }) =>
    $showError ? $theme.errorTextColor : $theme.prefixColor};
`;

const TextInput = styled.input<{
  $showError: boolean;
  $disabled?: boolean;
  $theme: ColorboxThemeConfig;
}>`
  flex: 1;
  width: 100%;
  overflow: scroll;

  background: transparent;
  border: none;
  outline: none;

  ${({ $disabled }) =>
    $disabled &&
    css`
      user-select: none;
      cursor: not-allowed;
    `};

  color: ${({ $theme, $disabled, $showError }) =>
    $disabled
      ? $theme.disabledTextColor
      : $showError
        ? $theme.errorTextColor
        : $theme.textColor};
`;

export { Colorbox };
