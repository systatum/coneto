import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import {
  ChangeEvent,
  InputHTMLAttributes,
  forwardRef,
  useEffect,
  useState,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import { Button } from "./button";
import {
  FieldLaneAction,
  FieldLane,
  FieldLaneProps,
  FieldLaneStyles,
} from "./field-lane";
import { StatefulForm } from "./stateful-form";
import { useTheme } from "./../theme/provider";
import { TextboxThemeConfig } from "./../theme";

interface BaseTextboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    "style"
  > {
  showError?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  styles?: TextboxStyles;
}

export interface TextboxStyles {
  self?: CSSProp;
}

export type TextboxAction = FieldLaneAction;

const BaseTextbox = forwardRef<HTMLInputElement, BaseTextboxProps>(
  ({ showError, onChange, styles, type = "text", id, ...props }, ref) => {
    const { currentTheme } = useTheme();
    const textboxTheme = currentTheme?.textbox;

    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
      if (showError) {
        setShowPassword(false);
      }
    }, [showError]);

    return (
      <>
        <Input
          id={id}
          ref={ref}
          $theme={textboxTheme}
          onChange={onChange}
          type={type === "password" && showPassword ? "text" : type}
          $error={showError}
          $style={styles?.self}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
          $disabled={props?.disabled}
          disabled={props?.disabled}
          autoComplete={type === "password" ? "off" : props.autoComplete}
        />

        {type === "password" && (
          <Button
            type="button"
            disabled={props?.disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="toggle-password"
            styles={{
              containerStyle: css`
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: ${showError ? "30px" : "8px"};
                z-index: 10;
              `,
              self: css`
                padding: 2px;
                border-radius: 2px;
                cursor: pointer;
                background: transparent;
                z-index: 10;
                height: 25px;
                color: ${showError
                  ? textboxTheme?.errorTextColor || "#f87171"
                  : textboxTheme?.placeholderColor || "#6b7280"};

                &:hover {
                  color: ${showError
                    ? textboxTheme?.errorBorderColor || "#ef4444"
                    : textboxTheme?.textColor || "#374151"};
                }
              `,
            }}
          >
            {showPassword ? (
              <RiEyeLine size={22} />
            ) : (
              <RiEyeOffLine size={22} />
            )}
          </Button>
        )}
      </>
    );
  }
);

export interface TextboxProps
  extends Omit<BaseTextboxProps, "styles">,
    Omit<FieldLaneProps, "styles" | "id" | "type"> {
  styles?: TextboxStyles & FieldLaneStyles;
}

const Textbox = forwardRef<HTMLInputElement, TextboxProps>(
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
      labelPosition,
      labelGap,
      labelWidth,
      ...rest
    } = props;

    const inputId = StatefulForm.sanitizeId({
      prefix: "textbox",
      name: props.name,
      id: props.id,
    });

    return (
      <FieldLane
        id={inputId}
        dropdowns={dropdowns}
        showError={showError}
        errorMessage={errorMessage}
        label={label}
        actions={actions}
        type={type}
        helper={helper}
        labelGap={labelGap}
        labelWidth={labelWidth}
        labelPosition={labelPosition}
        disabled={disabled}
        required={rest.required}
        styles={{
          bodyStyle: styles?.bodyStyle,
          controlStyle: styles?.controlStyle,
          containerStyle: styles?.containerStyle,
          labelStyle: styles?.labelStyle,
        }}
      >
        <BaseTextbox
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
          type={type}
          ref={ref}
        />
      </FieldLane>
    );
  }
);

const Input = styled.input<{
  $error?: boolean;
  $style?: CSSProp;
  $disabled?: boolean;
  $theme: TextboxThemeConfig;
}>`
  border-radius: 2px;
  font-size: 0.75rem;
  padding: 7px 8px;
  width: 100%;
  outline: none;
  z-index: 10;
  min-height: 34px;

  background-color: ${({ $theme }) => $theme?.backgroundColor || "#ffffff"};

  border: 1px solid
    ${({ $theme, $error, $disabled }) =>
      $disabled
        ? $theme?.disabledBorderColor || "#d1d5db"
        : $error
          ? $theme?.errorBorderColor || "#f87171"
          : $theme?.borderColor || "#d1d5db"};

  color: ${({ $theme, $error, $disabled }) =>
    $disabled
      ? $theme?.disabledTextColor || "#9ca3af"
      : $error
        ? $theme?.errorTextColor || "#991b1b"
        : $theme?.textColor || "#1f2937"};

  &::placeholder {
    color: ${({ $theme }) => $theme?.placeholderColor || "#9ca3af"};
  }

  ${({ $theme, $error }) =>
    $error
      ? css`
          &:focus {
            border-color: ${$theme?.errorBorderColor || "#f87171"};
            box-shadow: 0 0 0 0.5px ${$theme?.errorBorderColor || "#f87171"};
          }
        `
      : css`
          &:focus {
            border-color: ${$theme?.focusedBorderColor || "#61a9f9"};
            box-shadow: 0 0 0 0.5px ${$theme?.focusedBorderColor || "#61a9f9"};
          }
        `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      user-select: none;
      pointer-events: none;
    `};

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px
      ${({ $theme }) => $theme?.backgroundColor} inset;
    -webkit-text-fill-color: ${({ $theme }) => $theme?.textColor};
    transition: background-color 5000s ease-in-out 0s;
  }

  ${({ $style }) => $style}
`;

export { Textbox };
