import { RiCheckLine, RiErrorWarningLine } from "@remixicon/react";
import React, { ReactElement, ReactNode } from "react";
import styled, { css, CSSProp } from "styled-components";
import { Button } from "./button";
import { StatefulForm } from "./stateful-form";
import { Tooltip } from "./tooltip";
import { Figure, FigureProps } from "./figure";
import { FalsyOr } from "./../lib/falsy";

export interface FieldLaneProps {
  label?: string;
  showError?: boolean;
  errorIconPosition?: "absolute" | "relative" | "none";
  errorMessage?: string;
  dropdowns?: DropdownProps[];
  styles?: FieldLaneStylesProps;
  helper?: string;
  disabled?: boolean;
  children?: ReactNode;
  id?: string;
  actions?: FieldLaneActionsProps[];
  type?: string;
  required?: boolean;
}

export interface FieldLaneStylesProps {
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
  controlStyle?: CSSProp;
  bodyStyle?: CSSProp;
}

export type FieldLaneActionsProps = FalsyOr<FieldLaneInternalActionsProps>;

interface FieldLaneInternalActionsProps {
  title?: string;
  icon?: FigureProps;
  iconColor?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  titleShowDelay?: number;
}

export type DropdownProps = FalsyOr<DropdownInternalProps>;

interface DropdownInternalProps {
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

export interface DropdownStylesProps {
  drawerStyle?: CSSProp;
  containerStyle?: CSSProp;
  self?: CSSProp;
}

export interface DropdownOptionProps {
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
  required,
}: FieldLaneProps) {
  const filteredActions =
    actions?.filter((action): action is FieldLaneInternalActionsProps =>
      Boolean(action)
    ) ?? [];

  const hasActions = filteredActions.length > 0;

  const inputElement: ReactElement = (
    <InputWrapper $style={styles?.controlStyle}>
      {dropdowns
        ?.filter((dropdown): dropdown is DropdownInternalProps =>
          Boolean(dropdown)
        )
        ?.map((dropdown, index) => {
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
                  border-right: 0;
                  border-top-right-radius: 0;
                  border-bottom-right-radius: 0;
                  border-color: #d1d5db;
                  ${showError &&
                  css`
                    border-color: #f87171;
                  `}

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
                  color: black;
                  height: 100%;

                  ${dropdown.width &&
                  css`
                    width: ${dropdown.width};
                  `}
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
    <Container
      $disabled={disabled}
      $style={css`
        ${!children &&
        css`
          width: fit-content;
          border-right: 1px solid #d1d5db;
        `}
        ${styles?.containerStyle}
      `}
    >
      <Body $disabled={disabled} $style={styles?.bodyStyle}>
        {label && (
          <StatefulForm.Label
            required={required}
            htmlFor={disabled ? null : id}
            styles={{ self: styles?.labelStyle }}
            helper={helper}
            label={label}
          />
        )}

        {inputElement}
      </Body>

      {showError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
}

const Container = styled.div<{ $style?: CSSProp; $disabled?: boolean }>`
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

const Body = styled.div<{ $style?: CSSProp; $disabled?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 34px;
  gap: 0.5rem;

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
      user-select: none;
    `}

  ${({ $style }) => $style}
`;

const InputWrapper = styled.div<{ $style?: CSSProp }>`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  height: 100%;

  ${({ $style }) => $style}
`;

const ErrorIconWrapper = styled.div<{
  $position?: FieldLaneProps["errorIconPosition"];
}>`
  ${({ $position }) =>
    $position === "absolute"
      ? css`
          margin-left: 0px;
          position: absolute;
          top: 50%;
          right: 8px;
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
`;

const ErrorText = styled.span`
  color: #dc2626;
`;

export { FieldLane };
