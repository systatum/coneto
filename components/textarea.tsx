import {
  ChangeEvent,
  MutableRefObject,
  TextareaHTMLAttributes,
  forwardRef,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import { FieldLane, FieldLaneProps, FieldLaneStyles } from "./field-lane";
import { StatefulForm } from "./stateful-form";
import { useTheme } from "./../theme/provider";
import { TextareaThemeConfig } from "./../theme";

interface BaseTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {
  showError?: boolean;
  styles?: TextareaStyles;
  onChange?: (
    data: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  autogrow?: boolean;
  id?: string;
}

export interface TextareaStyles {
  self?: CSSProp;
}

const BaseTextarea = forwardRef<HTMLTextAreaElement, BaseTextareaProps>(
  ({ id, showError, rows, onChange, autogrow, styles, ...props }, ref) => {
    const { currentTheme } = useTheme();
    const textareaTheme = currentTheme?.textarea;

    return (
      <TextareaInput
        $theme={textareaTheme}
        $disabled={props?.disabled}
        $autogrow={autogrow}
        id={id}
        ref={(el) => {
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            (ref as MutableRefObject<HTMLTextAreaElement | null>).current = el;
          }
        }}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
        }}
        rows={rows ?? 3}
        $error={showError}
        $style={styles?.self}
        {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }
);

export interface TextareaProps
  extends Omit<BaseTextareaProps, "styles">,
    Omit<FieldLaneProps, "styles"> {
  styles?: TextareaStyles & FieldLaneStyles;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      prefix: "textarea",
      name: props.name,
      id: props.id,
    });

    return (
      <FieldLane
        id={inputId}
        labelGap={labelGap}
        labelWidth={labelWidth}
        labelPosition={labelPosition}
        dropdowns={dropdowns}
        showError={showError}
        errorMessage={errorMessage}
        label={label}
        actions={actions}
        type={type}
        helper={helper}
        disabled={disabled}
        required={rest.required}
        styles={{
          bodyStyle: styles?.bodyStyle,
          controlStyle: styles?.controlStyle,
          containerStyle: styles?.containerStyle,
          labelStyle: styles?.labelStyle,
        }}
      >
        <BaseTextarea
          {...rest}
          id={inputId}
          disabled={disabled}
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
          ref={ref}
        />
      </FieldLane>
    );
  }
);

const TextareaInput = styled.textarea<{
  $error?: boolean;
  $style?: CSSProp;
  $autogrow?: boolean;
  $disabled?: boolean;
  $theme?: TextareaThemeConfig;
}>`
  border-radius: 2px;
  font-size: 0.75rem;
  padding: 7px 8px;
  width: 100%;
  outline: none;
  z-index: 10;
  resize: none;

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      user-select: none;
    `};

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

  ${({ $autogrow }) =>
    $autogrow
      ? css`
          overflow: hidden;
          resize: none;
        `
      : css`
          overflow-y: auto;
          resize: vertical;
        `}

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ $theme }) =>
      $theme?.scrollbarThumbColor || "#3f3f46"};
    border-radius: 999px;
  }

  &::placeholder {
    color: ${({ $theme }) => $theme?.placeholderColor || "#9ca3af"};
  }

  ${({ $error, $theme }) =>
    $error
      ? css`
          &:focus {
            border-color: ${$theme?.errorBorderColor || "#f87171"};
            box-shadow: 0 0 0 1px ${$theme?.errorBorderColor || "#f87171"};
          }
        `
      : css`
          &:focus {
            border-color: ${$theme?.focusedBorderColor || "#61a9f9"};
            box-shadow: 0 0 0 1px ${$theme?.focusedBorderColor || "#61a9f9"};
          }
        `}

  ${({ $style }) => $style}
`;

export { Textarea };
