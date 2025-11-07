import {
  RemixiconComponentType,
  RiCheckLine,
  RiErrorWarningLine,
} from "@remixicon/react";
import {
  ChangeEvent,
  MutableRefObject,
  ReactElement,
  TextareaHTMLAttributes,
  forwardRef,
} from "react";
import styled, { css, CSSProp } from "styled-components";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
  style?: CSSProp;
  onActionClick?: () => void;
  onChange: (data: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  icon?: RemixiconComponentType;
  actionIcon?: boolean;
  autogrow?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      showError,
      errorMessage,
      rows,
      onChange,
      onActionClick,
      style,
      containerStyle,
      actionIcon,
      icon: Icon = RiCheckLine,
      autogrow,
      labelStyle,
      ...props
    },
    ref
  ) => {
    const inputId = `textarea-${props.name}`;

    const autoResize = (el: HTMLTextAreaElement | null) => {
      if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    };

    const inputElement: ReactElement = (
      <TextAreaWrapper>
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
              (ref as MutableRefObject<HTMLTextAreaElement | null>).current =
                el;
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
          $style={style}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
        {actionIcon && (
          <ActionButton
            type="button"
            aria-label="action-icon"
            onClick={(e) => {
              e.preventDefault();
              onActionClick?.();
            }}
            $error={showError}
          >
            <Icon size={18} />
          </ActionButton>
        )}
        {showError && errorMessage && (
          <RiErrorWarningLine
            size={18}
            style={{
              position: "absolute",
              top: "50%",
              right: "8px",
              transform: "translateY(-50%)",
              borderRadius: "9999px",
              background: "#dc2626",
              color: "white",
            }}
          />
        )}
      </TextAreaWrapper>
    );

    return (
      <Container $style={containerStyle}>
        {label && (
          <Label $style={labelStyle} htmlFor={inputId}>
            {label}
          </Label>
        )}
        <div>
          {inputElement}
          {showError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        </div>
      </Container>
    );
  }
);

const Container = styled.div<{ $style?: CSSProp }>`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  position: relative;

  ${({ $style }) => $style}
`;

const Label = styled.label<{ $style?: CSSProp }>`
  font-size: 0.75rem;
  ${({ $style }) => $style}
`;

const TextAreaWrapper = styled.div`
  position: relative;
  width: 100%;
`;

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
      ? `
    color: #991b1b;
    &:focus {
      border-color: #f87171;
      box-shadow: 0 0 0 1px #f87171;
    }
  `
      : `
    &:focus {
      border-color: #61A9F9;
      box-shadow: 0 0 0 1px #61A9F9;
    }
  `}
  ${({ $style }) => $style}
`;

const ActionButton = styled.button<{ $error?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: ${({ $error }) => ($error ? "30px" : "8px")};
  padding: 2px;
  border-radius: 2px;
  cursor: pointer;
  background: transparent;
  color: ${({ $error }) => ($error ? "#f87171" : "#6b7280")};

  &:hover {
    color: ${({ $error }) => ($error ? "#ef4444" : "#374151")};
  }
`;

const ErrorText = styled.span`
  color: #dc2626;
`;

export { Textarea };
