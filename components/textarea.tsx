import { RemixiconComponentType, RiCheckLine } from "@remixicon/react";
import {
  ChangeEvent,
  MutableRefObject,
  TextareaHTMLAttributes,
  forwardRef,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import {
  FieldLaneActionsProps,
  FieldLane,
  FieldLaneProps,
  FieldLaneStylesProps,
} from "./field-lane";

export interface BaseTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {
  showError?: boolean;
  styles?: TextareaStylesProps;
  onChange?: (
    data: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  icon?: RemixiconComponentType;
  autogrow?: boolean;
  inputId?: string;
}

export type TextareaActionsProps = FieldLaneActionsProps;

interface TextareaStylesProps {
  self?: CSSProp;
}

const BaseTextarea = forwardRef<HTMLTextAreaElement, BaseTextareaProps>(
  (
    {
      inputId,
      showError,
      rows,
      onChange,
      icon: Icon = RiCheckLine,
      autogrow,
      styles,
      ...props
    },
    ref
  ) => {
    const autoResize = (el: HTMLTextAreaElement | null) => {
      if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    };

    return (
      <TextareaInput
        $autogrow={autogrow}
        id={inputId}
        ref={(el) => {
          if (autogrow) {
            autoResize(el);
          }
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            (ref as MutableRefObject<HTMLTextAreaElement | null>).current = el;
          }
        }}
        onChange={(e) => {
          if (autogrow) {
            autoResize(e.target);
          }
          onChange(e);
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
  extends Omit<BaseTextareaProps, "styles" | "inputId">,
    Omit<FieldLaneProps, "styles" | "inputId"> {
  styles?: TextareaStylesProps & FieldLaneStylesProps;
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
      ...rest
    } = props;
    const inputId = `textarea-${props?.name}`;

    const DropdownProps = dropdowns?.map((props) => ({
      ...props,
      styles: {
        ...props?.styles,
        self: css`
          height: 100%;
          ${props?.styles?.self}
        `,
      },
    }));

    return (
      <FieldLane
        inputId={inputId}
        dropdowns={DropdownProps}
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
        <BaseTextarea
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
          {...rest}
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
}>`
  border-radius: 2px;
  font-size: 0.75rem;
  padding: 7px 8px;
  width: 100%;
  outline: none;
  border: 1px solid ${({ $error }) => ($error ? "#f87171" : "#d1d5db")};

  resize: none;

  ${({ $autogrow }) =>
    $autogrow &&
    css`
      overflow: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }
    `}

  ${({ $error }) =>
    $error
      ? css`
          color: #991b1b;
          &:focus {
            border-color: #f87171;
            box-shadow: 0 0 0 1px #f87171;
          }
        `
      : css`
          &:focus {
            border-color: #61a9f9;
            box-shadow: 0 0 0 1px #61a9f9;
          }
        `}
  ${({ $style }) => $style}
`;

export { Textarea };
