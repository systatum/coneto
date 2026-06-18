import { css, CSSProp } from "styled-components";
import { Button, ButtonProps } from "./button";
import { RiMoreFill } from "@remixicon/react";
import { TipMenuItemProps } from "./tip-menu";
import { useTheme } from "./../theme";

export type ContextMenuAction = TipMenuItemProps & {
  mobile?: boolean;
};

export interface ContextMenuProps {
  actions: ContextMenuAction[];
  onOpen?: (prop: boolean) => void;
  focusBackgroundColor?: string;
  activeBackgroundColor?: string;
  hoverBackgroundColor?: string;
  maxActionsBeforeCollapsing?: number;
  iconSize?: number;
  open?: boolean;
  styles?: ContextMenuStyles;
  className?: string;
}

export interface ContextMenuStyles {
  containerStyle?: CSSProp;
  self?: CSSProp;
  dropdownStyle?: CSSProp;
}

export default function ContextMenu({
  actions,
  styles,
  activeBackgroundColor,
  hoverBackgroundColor,
  focusBackgroundColor,
  maxActionsBeforeCollapsing = 1,
  onOpen,
  open,
  iconSize = 16,
}: ContextMenuProps) {
  const { currentTheme } = useTheme();
  const buttonTheme = currentTheme?.button;

  const buttonProps: ButtonProps = {
    variant: "ghost",
    activeBackgroundColor: activeBackgroundColor,
    styles: {
      self: css`
        padding: 8px;
        width: 32px;
        height: 32px;

        ${focusBackgroundColor &&
        css`
          &:focus-visible {
            background-color: ${focusBackgroundColor};
          }
        `}

        ${hoverBackgroundColor &&
        css`
          &:hover {
            background-color: ${hoverBackgroundColor};
          }
        `}
      ${styles?.self}
      `,
      containerStyle: css`
        width: fit-content;
        height: fit-content;
        ${styles?.containerStyle}
      `,
      dropdownStyle: css`
        margin-top: 2px;
        ${styles?.dropdownStyle}
      `,
    },
  };

  if (actions.length <= maxActionsBeforeCollapsing) {
    return actions.map((action, index) => {
      const resolvedIconSize = action.icon?.size ?? iconSize;
      const variant = action?.variant;

      const resolvedActiveBackgroundColor = variant
        ? buttonTheme?.[variant]?.activeBackgroundColor
        : activeBackgroundColor;
      const resolvedFocusBackgroundColor = variant
        ? buttonTheme?.[variant]?.focusBackgroundColor
        : focusBackgroundColor;
      const resolvedHoverBackgroundColor = variant
        ? buttonTheme?.[variant]?.hoverBackgroundColor
        : hoverBackgroundColor;

      const resolvedButtonProps = {
        ...buttonProps,
        activeBackgroundColor: resolvedActiveBackgroundColor,
        styles: {
          self: css`
            padding: 8px;
            width: 32px;
            height: 32px;

            ${resolvedFocusBackgroundColor &&
            css`
              &:focus-visible {
                background-color: ${resolvedFocusBackgroundColor};
              }
            `};

            ${resolvedHoverBackgroundColor &&
            css`
              &:hover {
                background-color: ${resolvedHoverBackgroundColor};
              }
            `};
            ${styles?.self}
          `,
          containerStyle: css`
            width: fit-content;
            height: fit-content;
            ${styles?.containerStyle}
          `,
          dropdownStyle: css`
            margin-top: 2px;
            ${styles?.dropdownStyle}
          `,
        },
      };

      return (
        <Button
          {...resolvedButtonProps}
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            if (action.onClick) {
              action.onClick(e);
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          mobile={action.mobile}
          onOpen={onOpen}
          title={action.caption}
          aria-label="action-button"
          icon={{
            ...action.icon,
            image: action.icon?.image,
            size: resolvedIconSize,
          }}
        />
      );
    });
  }

  return (
    <Button
      {...buttonProps}
      aria-label="action-button"
      showSubMenuOn="self"
      onOpen={onOpen}
      open={open}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      subMenu={({ list }) => list(actions)}
      icon={{
        image: RiMoreFill,
        size: iconSize,
      }}
    />
  );
}
