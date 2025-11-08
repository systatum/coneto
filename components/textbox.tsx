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
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  actions?: ActionsProps[];
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

interface ActionsProps {
  icon?: RemixiconComponentType;
  iconColor?: string;
  isDangerous?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const Textbox = forwardRef<HTMLInputElement, TextboxProps>(
  (
    {
      label,
      showError,
      errorMessage,
      onChange,
      style,
      containerStyle,
      labelStyle,
      type = "text",
      dropdown,
      dropdownToggleStyle,
      actions,
      ...props
    },
    ref
  ) => {
    console.log(type);

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
              ${dropdownToggleStyle}
            `}
          >
            {selectionCaption && selectionCaption.text}
          </Button>
        )}
        <Input
          id={inputId}
          ref={ref}
          onChange={onChange}
          $dropdown={!!dropdown}
          type={type === "password" && showPassword ? "text" : type}
          $error={showError}
          $style={style}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
        {actions &&
          actions.map((props, index) => {
            const Icon = (props.icon = RiCheckLine);
            const offsetBase = 8;
            const offsetEach = 22;
            const offset =
              offsetBase +
              index * offsetEach +
              (type === "password" ? offsetEach : 0) +
              (showError ? offsetEach : 0);

            return (
              <ActionButton
                type="submit"
                aria-label="action-icon"
                onClick={(e) => {
                  e.preventDefault();
                  if (props.onClick) {
                    props.onClick(e);
                  }
                }}
                style={{ right: `${offset}px` }}
                $error={showError}
              >
                <Icon size={18} />
              </ActionButton>
            );
          })}
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
  z-index: 10;
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
  z-index: 10;
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
  z-index: 10;
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
  z-index: 10;
`;

const ErrorText = styled.span`
  color: #dc2626;
`;

export { Textbox };
