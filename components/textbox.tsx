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
  FieldLaneActionsProps,
  FieldLane,
  FieldLaneProps,
  FieldLaneStylesProps,
} from "./field-lane";

interface BaseTextboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    "style"
  > {
  showError?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  styles?: TextboxStylesProps;
  inputId?: string;
}

export interface TextboxStylesProps {
  self?: CSSProp;
}

export type TextareaActions = FieldLaneActionsProps;

const BaseTextbox = forwardRef<HTMLInputElement, BaseTextboxProps>(
  ({ showError, onChange, styles, type = "text", inputId, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
      if (showError) {
        setShowPassword(false);
      }
    }, [showError]);

    return (
      <>
        <Input
          id={inputId}
          ref={ref}
          onChange={onChange}
          type={type === "password" && showPassword ? "text" : type}
          $error={showError}
          $style={styles?.self}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
          autoComplete={type === "password" ? "off" : props.autoComplete}
        />

        {type === "password" && (
          <Button
            type="button"
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
                color: ${showError ? "#f87171" : "#6b7280"};
                &:hover {
                  color: ${showError ? "#ef4444" : "#374151"};
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
  extends Omit<BaseTextboxProps, "styles" | "inputId">,
    Omit<FieldLaneProps, "styles" | "inputId" | "type"> {
  styles?: TextboxStylesProps & FieldLaneStylesProps;
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
      ...rest
    } = props;
    const inputId = `textbox-${props?.name}`;

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
        <BaseTextbox
          {...rest}
          inputId={inputId}
          showError={showError}
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
}>`
  border-radius: 2px;
  font-size: 0.75rem;
  padding: 7px 8px;
  width: 100%;
  outline: none;
  z-index: 10;
  height: 36px;

  border: 1px solid ${({ $error }) => ($error ? "#f87171" : "#d1d5db")};
  ${({ $error }) =>
    $error
      ? css`
          color: #991b1b;
          &:focus {
            border-color: #f87171;
            box-shadow: 0 0 0 0.5px #f87171;
          }
        `
      : css`
          &:focus {
            border-color: #61a9f9;
            box-shadow: 0 0 0 0.5px #61a9f9;
          }
        `}

  ${({ $style }) => $style}
`;

export { Textbox };
