import {
  RemixiconComponentType,
  RiCheckLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
} from "@remixicon/react";
import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactElement,
  RefObject,
  forwardRef,
  useEffect,
  useState,
} from "react";
import styled, { CSSProp } from "styled-components";

export interface TextboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    "style"
  > {
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
}

const Textbox = forwardRef<HTMLInputElement, TextboxProps>(
  (
    {
      label,
      showError,
      errorMessage,
      onChange,
      onActionClick,
      style,
      containerStyle,
      actionIcon,
      labelStyle,
      icon: Icon = RiCheckLine,
      type = "text",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
      if (showError) {
        setShowPassword(false);
      }
    }, [showError]);

    const inputId = `textbox-${props.name}`;

    if (type === "hidden") {
      return <input {...props} hidden />;
    }

    const inputElement: ReactElement = (
      <InputWrapper>
        <Input
          id={inputId}
          ref={ref as RefObject<HTMLInputElement>}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") onActionClick?.();
          }}
          type={type === "password" && showPassword ? "text" : type}
          $error={showError}
          $style={style}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
        {actionIcon && (
          <ActionButton
            type="submit"
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
        {type === "password" && (
          <PasswordToggleButton
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            $error={showError}
            aria-label="toggle-password"
          >
            {showPassword ? (
              <RiEyeOffLine size={22} />
            ) : (
              <RiEyeLine size={22} />
            )}
          </PasswordToggleButton>
        )}
        {showError && (
          <ErrorIconWrapper>
            <RiErrorWarningLine
              size={17}
              style={{
                borderRadius: "9999px",
                background: "#dc2626",
                color: "white",
              }}
            />
          </ErrorIconWrapper>
        )}
      </InputWrapper>
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
          {showError && <ErrorText>{errorMessage}</ErrorText>}
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

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Input = styled.input<{ $error?: boolean; $style?: CSSProp }>`
  border-radius: 2px;
  font-size: 0.75rem;
  padding: 7px 8px;
  width: 100%;
  outline: none;
  border: 1px solid ${({ $error }) => ($error ? "#f87171" : "#d1d5db")};
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

const PasswordToggleButton = styled.button<{ $error?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: ${({ $error }) => ($error ? "30px" : "8px")};
  cursor: pointer;
  color: ${({ $error }) => ($error ? "#f87171" : "#6b7280")};

  &:hover {
    color: ${({ $error }) => ($error ? "#ef4444" : "#4b5563")};
  }
`;

const ErrorIconWrapper = styled.button`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  background: none;
  border: none;
`;

const ErrorText = styled.span`
  color: #dc2626;
`;

export { Textbox };
