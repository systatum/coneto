import {
  RemixiconComponentType,
  RiCheckLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
} from "@remixicon/react";
import React, {
  ChangeEvent,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  forwardRef,
  useEffect,
  useState,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import { Button } from "./button";
import { Tooltip } from "./tooltip";
import { StatefulForm } from "./stateful-form";

export interface TextboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    "style"
  > {
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  actions?: ActionsProps[];
  dropdowns?: DropdownProps[];
  styles?: TextboxStylesProps;
  helper?: string;
}

export interface TextboxStylesProps {
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
  self?: CSSProp;
}

interface DropdownProps {
  options?: DropdownOptionProps[];
  caption?: string;
  onChange?: (id: string) => void;
  width?: string;
  styles?: DropdownStylesProps;
  withFilter?: boolean;
  render?: (props: {
    render?: (children?: ReactNode) => ReactNode;
    setCaption?: (caption?: string) => void;
  }) => ReactNode;
}

interface DropdownStylesProps {
  drawerStyle?: CSSProp;
  containerStyle?: CSSProp;
}

export interface DropdownOptionProps {
  text: string;
  value: string;
  icon?: RemixiconComponentType;
  iconColor?: string;
}

export interface ActionsProps {
  title?: string;
  icon?: RemixiconComponentType;
  iconColor?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  titleShowDelay?: number;
}

const Textbox = forwardRef<HTMLInputElement, TextboxProps>(
  (
    {
      label,
      showError,
      errorMessage,
      onChange,
      styles,
      type = "text",
      dropdowns,
      actions,
      helper,
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
        {dropdowns?.map((dropdown, index) => {
          return (
            <Button
              key={index}
              subMenu={({ list, render }) => {
                if (dropdown.render) {
                  return dropdown.render({ render });
                }

                const dropdownData = dropdown.options.map((prop) => ({
                  caption: prop.text,
                  icon: prop.icon,
                  iconColor: prop.iconColor,
                  onClick: () => dropdown.onChange(prop.value),
                }));

                return list(dropdownData, {
                  withFilter: dropdown.withFilter ?? false,
                });
              }}
              showSubMenuOn="self"
              variant="outline"
              styles={{
                containerStyle: css`
                  border-right: 0;
                  border-top-right-radius: 0;
                  border-bottom-right-radius: 0;
                  ${index > 0 &&
                  css`
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                  `}
                  ${dropdown.width &&
                  css`
                    width: ${dropdown.width};
                  `}

                ${dropdown.styles?.containerStyle}
                `,
                self: css`
                  font-size: 12px;
                  ${dropdown.width &&
                  css`
                    width: ${dropdown.width};
                  `}
                  ${dropdown.styles?.containerStyle}
                `,
                dropdownStyle: css`
                  min-width: 200px;
                  ${dropdown.styles?.drawerStyle}
                `,
              }}
            >
              {dropdown.caption}
            </Button>
          );
        })}

        <Input
          id={inputId}
          ref={ref}
          onChange={onChange}
          $dropdown={!!dropdowns}
          type={type === "password" && showPassword ? "text" : type}
          $error={showError}
          $style={styles?.self}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
        {actions &&
          actions.map((props, index) => {
            const { icon: Icon = RiCheckLine, titleShowDelay = 1250 } = props;
            const offsetBase = 8;
            const offsetEach = 22;
            const reverseIndex = actions.length - 1 - index;
            const offset =
              offsetBase +
              reverseIndex * offsetEach +
              (type === "password" ? offsetEach : 0) +
              (showError ? offsetEach : 0);

            return (
              <Button
                key={index}
                aria-label="action-icon"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation();
                  if (props.onClick) {
                    props.onClick(e);
                  }
                }}
                disabled={props.disabled}
                styles={{
                  containerStyle: css`
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: ${`${offset}px`};
                    z-index: 10;
                    height: 23px;
                  `,
                  self: css`
                    padding: 2px;
                    border-radius: 2px;
                    cursor: pointer;
                    background: transparent;
                    position: relative;
                    z-index: 10;
                    height: 23px;
                    color: ${showError
                      ? "#f87171"
                      : props.iconColor
                        ? props.iconColor
                        : "#6b7280"};

                    &:hover {
                      color: ${showError
                        ? "#ef4444"
                        : props.iconColor
                          ? props.iconColor
                          : "#374151"};
                    }
                  `,
                }}
              >
                <Tooltip
                  key={index}
                  styles={{
                    containerStyle: css`
                      cursor: pointer;
                      pointer-events: none;
                    `,
                    arrowStyle: (placement) => css`
                      ${placement === "bottom-start"
                        ? css`
                            margin-left: 2px;
                            margin-top: 6px;
                          `
                        : placement === "bottom-end"
                          ? css`
                              margin-right: 2px;
                              margin-top: 6px;
                            `
                          : placement === "top-start"
                            ? css`
                                margin-left: 2px;
                                margin-bottom: 6px;
                              `
                            : placement === "top-end"
                              ? css`
                                  margin-right: 2px;
                                  margin-bottom: 6px;
                                `
                              : null}
                    `,
                  }}
                  showDelayPeriod={titleShowDelay}
                  dialog={props.title}
                >
                  <Icon size={18} />
                </Tooltip>
              </Button>
            );
          })}
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
      <Container $style={styles?.containerStyle}>
        {label && (
          <StatefulForm.Label
            htmlFor={props.disabled ? null : inputId}
            style={styles?.labelStyle}
            helper={helper}
            label={label}
          />
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

const ErrorIconWrapper = styled.button`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  background: none;
  border: none;
  z-index: 10;
  cursor: default;
`;

const ErrorText = styled.span`
  color: #dc2626;
`;

export { Textbox };
