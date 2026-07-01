import styled, { css, CSSProp } from "styled-components";
import { useTheme } from "./../theme/provider";
import { Button, ButtonSubMenu } from "./button";
import { Tooltip } from "./tooltip";
import { BaseAction } from "../constants/action";
import { applyClassName } from "./../constants/classname";
import { ReactNode } from "react";
import { TipMenuItemProps } from "./tip-menu";

export const SeparatorTextFloat = {
  Left: "left",
  Right: "right",
} as const;

export type SeparatorTextFloat =
  (typeof SeparatorTextFloat)[keyof typeof SeparatorTextFloat];

export interface SeparatorProps {
  title?: string;
  textFloat?: SeparatorTextFloat;
  depth?: string;
  styles?: SeparatorStyles;
  actions?: SeparatorAction[];
  className?: string;
  id?: string;
}

export interface SeparatorStyles {
  containerStyle?: CSSProp;
  titleStyle?: CSSProp;
  lineStyle?: CSSProp;
}

function Separator({
  title,
  styles,
  textFloat = "left",
  depth = "20px",
  actions,
  className,
  id,
}: SeparatorProps) {
  const { currentTheme } = useTheme();
  const separatorTheme = currentTheme.separator;

  return (
    <SeparatorContainer
      id={id}
      className={applyClassName("separator", className)}
      aria-label="separator-container"
      $style={styles?.containerStyle}
      $color={separatorTheme.containerColor}
    >
      <Line
        aria-label="separator-line"
        $style={styles?.lineStyle}
        $color={separatorTheme.lineColor}
        $lineShadow={separatorTheme.lineShadow}
      />
      <Title
        $style={styles?.titleStyle}
        $textFloat={textFloat}
        $depth={depth}
        $color={separatorTheme.titleColor}
        $backgroundColor={separatorTheme.backgroundTitleColor}
      >
        {title}
      </Title>

      {actions?.map((action, index) => {
        const base = 20;
        const gap = 30;
        const offset = base + index * gap;

        return (
          <SeparatorAction
            key={index}
            {...action}
            alwaysShow={action?.alwaysShow ?? true}
            styles={{
              ...action?.styles,
              arrowStyle: css`
                ${textFloat === "right"
                  ? css`
                      right: 9px;
                    `
                  : css`
                      left: 9px;
                    `}

                ${action?.styles?.arrowStyle}
              `,
              containerStyle: css`
                ${textFloat === "right"
                  ? css`
                      left: ${offset}px;
                    `
                  : css`
                      right: ${offset}px;
                    `}
              `,
            }}
          />
        );
      })}
    </SeparatorContainer>
  );
}

const SeparatorContainer = styled.div<{ $style?: CSSProp; $color?: string }>`
  &,
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  position: relative;
  width: 100%;
  display: flex;
  height: 24px;
  align-items: center;
  color: ${({ $color }) => $color};

  ${({ $style }) => $style}
`;

const Line = styled.span<{
  $style?: CSSProp;
  $color?: string;
  $lineShadow?: string;
}>`
  position: absolute;
  width: 100%;
  height: 2px;
  border-radius: 0.125rem;
  background-color: ${({ $color }) => $color};
  box-shadow: ${({ $lineShadow }) => $lineShadow};

  ${({ $style }) => $style}
`;

const Title = styled.span<{
  $textFloat: "left" | "right";
  $depth: string;
  $style?: CSSProp;
  $color?: string;
  $backgroundColor?: string;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  padding: 0 0.5rem;
  font-weight: 500;
  color: ${({ $color }) => $color};

  ${({ $textFloat, $depth }) =>
    $textFloat === "left" ? `left: ${$depth};` : `right: ${$depth};`}

  ${({ $style }) => $style}
`;

export interface SeparatorAction extends BaseAction {
  alwaysShow?: boolean;
  styles?: SeparatorActionStyles;
  id?: string;
  className?: string;
  subMenu?: (props: SeparatorActionSubMenu) => ReactNode;
}

export type SeparatorActionSubMenu = ButtonSubMenu;
export type SeparatorActionSubMenuList = TipMenuItemProps;

export interface SeparatorActionStyles {
  self?: CSSProp;
  containerStyle?: CSSProp;
  captionDrawerStyle?: CSSProp;
  arrowStyle?: CSSProp;
}

function SeparatorAction({
  icon,
  alwaysShow,
  caption,
  hidden,
  onClick,
  styles,
  disabled,
  subMenu,
  className,
  id,
}: SeparatorAction) {
  const { currentTheme } = useTheme();
  const separatorTheme = currentTheme?.separator;

  if (hidden) {
    return;
  }

  return (
    <Tooltip
      id={id}
      className={applyClassName("separator-action", className)}
      dialog={caption}
      styles={{
        arrowStyle: styles?.arrowStyle,
        containerStyle: css`
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 20px;

          transition:
            opacity 0.2s ease,
            transform 0.2s ease;

          ${!alwaysShow &&
          css`
            opacity: 0;
            pointer-events: none;
          `}

          ${SeparatorContainer}:hover & {
            opacity: 1;
            pointer-events: auto;
          }

          ${styles?.containerStyle}
        `,
        drawerStyle: styles?.captionDrawerStyle,
      }}
    >
      <Button
        id={id}
        variant="outline-default"
        icon={icon}
        aria-label="separator-action"
        subMenu={subMenu}
        showSubMenuOn="self"
        onMouseDown={(e) => onClick?.(e)}
        disabled={disabled}
        styles={{
          containerStyle: css`
            border-radius: 9999px;
          `,
          self: css`
            border-radius: 9999px;
            height: 24px;
            width: 24px;
            padding: 2px;
            background-color: ${separatorTheme?.backgroundTitleColor};
            &:hover {
              color: inherit;
            }
            ${styles?.self}
          `,
        }}
      />
    </Tooltip>
  );
}

export { Separator };
