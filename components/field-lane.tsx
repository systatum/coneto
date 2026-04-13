import { RiCheckLine, RiErrorWarningLine } from "@remixicon/react";
import React, { ReactElement, ReactNode } from "react";
import styled, { css, CSSProp } from "styled-components";
import { Button } from "./button";
import { StatefulForm } from "./stateful-form";
import { Tooltip } from "./tooltip";
import { Figure, FigureProps } from "./figure";
import { useTheme } from "./../theme/provider";
import { FieldLaneThemeConfig } from "./../theme";

export interface FieldLaneProps {
  label?: string;
  showError?: boolean;
  errorIconPosition?: "absolute" | "relative" | "none";
  errorMessage?: string;
  dropdowns?: FieldLaneDropdownProps[];
  styles?: FieldLaneStyles;
  helper?: string;
  disabled?: boolean;
  children?: ReactNode;
  id?: string;
  actions?: FieldLaneAction[];
  type?: string;
  labelPosition?: "top" | "left";
  labelWidth?: string;
  labelGap?: number;
  required?: boolean;
}

export interface FieldLaneStyles {
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
  controlStyle?: CSSProp;
  bodyStyle?: CSSProp;
}

export interface FieldLaneAction {
  title?: string;
  icon?: FigureProps;
  iconColor?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  titleShowDelay?: number;
  hidden?: boolean;
}

export interface FieldLaneDropdownProps {
  disabled?: boolean;
  options?: FieldLaneDropdownsOption[];
  caption?: string;
  onChange?: (id: string) => void;
  width?: string;
  styles?: FieldLaneDropdownStyles;
  withFilter?: boolean;
  render?: (props: {
    render?: (children?: ReactNode) => ReactNode;
    setCaption?: (caption?: string) => void;
  }) => ReactNode;
  hidden?: boolean;
}

export interface FieldLaneDropdownStyles {
  drawerStyle?: CSSProp;
  containerStyle?: CSSProp;
  self?: CSSProp;
}

export interface FieldLaneDropdownsOption {
  text: string;
  value: string;
  icon?: FigureProps;
}

function FieldLane({
  label,
  showError,
  errorMessage,
  styles,
  dropdowns,
  helper,
  children,
  disabled,
  id,
  actions,
  type,
  errorIconPosition = "absolute",
  labelPosition = "top",
  labelGap,
  labelWidth,
  required,
}: FieldLaneProps) {
  const { currentTheme } = useTheme();
  const fieldLaneTheme = currentTheme.fieldLane;

  const filteredActions = Array.isArray(actions)
    ? actions?.filter((action) => !action?.hidden)
    : [];

  const hasActions = filteredActions.length > 0;

  const inputElement: ReactElement = (
    <InputWrapper
      htmlFor={disabled ? null : id}
      aria-label="field-lane-control"
      $style={styles?.controlStyle}
    >
      {Array.isArray(dropdowns) &&
        dropdowns
          ?.filter((dropdown) => !dropdown?.hidden)
          ?.map((dropdown, index) => {
            return (
              <Button
                key={index}
                disabled={dropdown?.disabled}
                subMenu={({ list, render }) => {
                  if (dropdown.render) {
                    return dropdown.render({ render });
                  }

                  const dropdownData = dropdown.options.map((prop) => ({
                    caption: prop.text,
                    icon: prop.icon,
                    onClick: () => dropdown.onChange(prop.value),
                  }));

                  return list(dropdownData, {
                    withFilter: dropdown.withFilter ?? false,
                  });
                }}
                showSubMenuOn="self"
                variant="outline-default"
                styles={{
                  containerStyle: css`
                    align-self: stretch;
                    border-right: 0;
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                    border-color: ${fieldLaneTheme?.buttonBorderColor};

                    ${showError &&
                    css`
                      border-color: ${fieldLaneTheme?.buttonErrorBorderColor};
                    `}

                    ${index > 0 &&
                    css`
                      border-top-left-radius: 0;
                      border-bottom-left-radius: 0;
                    `};

                    ${dropdown?.disabled &&
                    css`
                      opacity: 0.5;
                    `}

                    ${dropdown.width &&
                    css`
                      width: ${dropdown.width};
                    `};

                    ${dropdown.styles?.containerStyle};
                  `,
                  self: css`
                    font-size: 12px;
                    color: ${fieldLaneTheme?.buttonTextColor};
                    &:hover {
                      color: ${fieldLaneTheme?.buttonTextColor};
                    }

                    ${!children &&
                    css`
                      border-right: 1px solid
                        ${fieldLaneTheme?.buttonBorderColor};
                    `}

                    ${dropdown.width &&
                    css`
                      width: ${dropdown.width};
                    `};

                    height: 100%;

                    ${dropdown.styles?.self};
                  `,
                  dropdownStyle: (placement) => css`
                    min-width: 200px;
                    ${placement?.startsWith("bottom")
                      ? css`
                          margin-top: -4px;
                        `
                      : css`
                          margin-bottom: 4px;
                        `}
                    ${dropdown.styles?.drawerStyle}
                  `,
                }}
              >
                {dropdown.caption}
              </Button>
            );
          })}

      {children}

      {hasActions &&
        filteredActions.map((props, index) => {
          const { icon, titleShowDelay = 1250 } = props;
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
              displayLabel="flex"
              aria-label="action-icon"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                if ((!disabled || !props?.disabled) && props.onClick) {
                  props.onClick(e);
                }
              }}
              disabled={disabled ? disabled : props.disabled}
              styles={{
                containerStyle: css`
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  right: ${`${offset}px`};
                  z-index: 10;
                `,
                self: css`
                  padding: 2px;
                  border-radius: 2px;
                  cursor: pointer;
                  background: transparent;
                  position: relative;
                  z-index: 10;
                  padding: 2px;
                  height: fit-content;

                  color: ${showError
                    ? fieldLaneTheme?.errorBackground
                    : props.iconColor
                      ? props.iconColor
                      : fieldLaneTheme?.actionColor};

                  &:hover {
                    color: ${showError
                      ? fieldLaneTheme?.errorForeground
                      : props.iconColor
                        ? props.iconColor
                        : fieldLaneTheme?.actionHoverColor};
                  }
                `,
              }}
            >
              <Tooltip
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if ((!disabled || !props?.disabled) && props.onClick) {
                    props.onClick(e);
                  }
                }}
                styles={{
                  containerStyle: css`
                    cursor: pointer;
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
                {icon && (
                  <Figure
                    {...icon}
                    image={icon?.image ?? RiCheckLine}
                    size={icon?.size ?? 18}
                  />
                )}
              </Tooltip>
            </Button>
          );
        })}

      {showError && (
        <ErrorIconWrapper $position={errorIconPosition}>
          <RiErrorWarningLine
            size={20}
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
    <Container
      $disabled={disabled}
      $style={css`
        ${styles?.containerStyle}
      `}
    >
      <Body
        aria-label="field-lane-wrapper"
        $labelPosition={labelPosition}
        $disabled={disabled}
        $style={styles?.bodyStyle}
        $labelGap={labelGap}
        $theme={fieldLaneTheme}
      >
        {label && (
          <StatefulForm.Label
            labelWidth={labelWidth}
            labelPosition={labelPosition}
            required={required}
            htmlFor={disabled ? null : id}
            styles={{
              self: css`
                color: ${disabled
                  ? fieldLaneTheme?.disabledTextColor
                  : fieldLaneTheme?.textColor};

                ${styles?.labelStyle};
              `,
            }}
            helper={helper}
            label={label}
          />
        )}

        {inputElement}
      </Body>

      {showError && errorMessage && (
        <ErrorText $theme={fieldLaneTheme}>{errorMessage}</ErrorText>
      )}
    </Container>
  );
}

const Container = styled.div<{
  $style?: CSSProp;
  $disabled?: boolean;
}>`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  font-size: 0.75rem;
  position: relative;
  height: 100%;

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
    `}

  ${({ $style }) => $style}
`;

const Body = styled.div<{
  $style?: CSSProp;
  $disabled?: boolean;
  $labelPosition?: FieldLaneProps["labelPosition"];
  $labelGap?: number;
  $theme?: FieldLaneThemeConfig;
}>`
  position: relative;
  display: flex;
  flex-direction: ${({ $labelPosition }) =>
    $labelPosition === "top" ? "column" : "row"};
  width: 100%;
  height: 100%;
  min-height: 34px;
  gap: ${({ $labelGap }) => `${$labelGap ? `${$labelGap}px` : "0.5rem"}`};

  ${({ $disabled, $theme }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: ${$theme?.disabledOpacity ?? 0.5};
      user-select: none;
    `}

  ${({ $style }) => $style}
`;

const InputWrapper = styled.label<{ $style?: CSSProp }>`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  height: 100%;

  ${({ $style }) => $style}
`;

const ErrorIconWrapper = styled.div<{
  $position?: FieldLaneProps["errorIconPosition"];
  $theme?: FieldLaneThemeConfig;
}>`
  ${({ $position }) =>
    $position === "absolute"
      ? css`
          margin-left: 0px;
          position: absolute;
          top: 50%;
          right: 7px;
          transform: translateY(-50%);
          border: none;
          z-index: 10;
        `
      : $position === "relative"
        ? css`
            position: relative;
            margin-left: 4px;
          `
        : css`
            display: none;
          `};

  cursor: default;
  svg {
    background: ${({ $theme }) => $theme?.errorBackground ?? "#dc2626"};
    color: ${({ $theme }) => $theme?.errorForeground ?? "#fff"};
    border-radius: 9999px;
  }
`;

const ErrorText = styled.span<{ $theme?: FieldLaneThemeConfig }>`
  color: ${({ $theme }) => $theme?.errorColor ?? "#dc2626"};
`;

export { FieldLane };
