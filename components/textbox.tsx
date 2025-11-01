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
  forwardRef,
  useEffect,
  useState,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import { Button } from "./button";
import { TipMenuItemProps } from "./tip-menu";

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
  dropdown?: DropdownProps;
  dropdownToggleStyle?: CSSProp;
}

interface DropdownProps {
  options: DropdownOptionProps[];
  selectedOption: string;
  onChange: (id: string) => void;
  withFilter?: boolean;
}

interface DropdownOptionProps {
  text: string;
  value: string;
  icon?: RemixiconComponentType;
  iconColor?: string;
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
      dropdown,
      dropdownToggleStyle,
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

    const selectionCaption =
      dropdown?.options.find(
        (data) => data.value === dropdown.selectedOption
      ) ?? dropdown?.options[0];

    const inputElement: ReactElement = (
      <InputWrapper>
        {dropdown && (
          <Button
            subMenu={({ list }) => {
              const dropdownData = dropdown.options.map((prop) => {
                const subMenuList: TipMenuItemProps = {
                  caption: prop.text,
                  icon: prop.icon,
                  iconColor: prop.iconColor,
                  onClick: () => {
                    dropdown.onChange(prop.value);
                  },
                };
                return subMenuList;
              });
              return list(dropdownData, {
                withFilter: dropdown.withFilter ?? false,
              });
            }}
            showSubMenuOn="self"
            variant="outline"
            containerStyle={css`
              border-right: 0px;
              border-top-right-radius: 0px;
              border-bottom-right-radius: 0px;
              ${dropdownToggleStyle}
            `}
            buttonStyle={css`
              font-size: 12px;
            `}
          >
            {selectionCaption && selectionCaption.text}
          </Button>
        )}
        <Input
          id={inputId}
          ref={ref}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") onActionClick?.();
          }}
          $dropdown={!!dropdown}
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

const Input = styled.input<{
  $error?: boolean;
  $style?: CSSProp;
  $dropdown: boolean;
}>`
  border-radius: 2px;
  font-size: 0.75rem;
  padding: 7px 8px;
  width: 100%;
  outline: none;
  border: 1px solid ${({ $error }) => ($error ? "#f87171" : "#d1d5db")};
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

  ${({ $dropdown }) =>
    $dropdown &&
    css`
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
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
