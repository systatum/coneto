import { css, CSSProp } from "styled-components";
import {
  Button,
  ButtonVariants,
  ButtonSubMenu,
  ButtonShowSubMenuPosition,
} from "./button";
import { ReactNode } from "react";
import { FigureProps } from "./figure";
import { useTheme } from "./../theme/provider";

export type ActionButtonSubMenu = ButtonSubMenu;
export type ActionButtonShowSubMenuPosition = ButtonShowSubMenuPosition;

export interface ActionButtonProps {
  caption?: string;
  icon?: FigureProps;
  onClick?: () => void;
  styles?: ActionButtonStyles;
  subMenu?: (props: ActionButtonSubMenu) => ReactNode;
  disabled?: boolean;
  showSubMenuOn?: ActionButtonShowSubMenuPosition;
  variant?: ButtonVariants["variant"];
  className?: string;
  pressed?: boolean;
  hidden?: boolean;
}

export interface ActionButtonStyles {
  self?: CSSProp;
  toggleStyle?: CSSProp;
  dividerStyle?: CSSProp;
  dropdownStyle?: CSSProp;
}

export function ActionButton({
  caption,
  icon,
  onClick,
  styles,
  subMenu,
  disabled,
  showSubMenuOn = "caret",
  variant = "default",
  forTable,
  className,
  pressed,
  hidden,
}: ActionButtonProps & { forTable?: boolean }) {
  const { currentTheme } = useTheme();
  const actionButtonTheme = currentTheme.actionButton;

  if (hidden) {
    return;
  }
  return (
    <Button
      onMouseDown={(e) => {
        e.stopPropagation();
        if (onClick) {
          onClick();
        }
      }}
      aria-label="action-button"
      subMenu={subMenu}
      disabled={disabled}
      showSubMenuOn={showSubMenuOn}
      size="sm"
      tipMenuSize="sm"
      variant={variant}
      className={className}
      pressed={pressed}
      styles={{
        self: css`
          display: flex;
          flex-direction: row;
          gap: 0.25rem;
          align-items: center;
          cursor: pointer;
          border-radius: 6px;
          position: relative;

          ${subMenu &&
          showSubMenuOn === "caret" &&
          css`
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          `};

          ${variant === "default" &&
          !pressed &&
          css`
            background-color: transparent;
            color: ${actionButtonTheme.textColor};
            &:hover {
              background-color: ${actionButtonTheme.hoverBackgroundColor};
            }

            &:disabled {
              background-color: ${actionButtonTheme.disabledBackgroundColor};
              opacity: 0.5;
              cursor: not-allowed;
            }

            ${subMenu && showSubMenuOn === "caret"
              ? css`
                  border-top: 1px solid ${actionButtonTheme.borderColor};
                  border-left: 1px solid ${actionButtonTheme.borderColor};
                  border-bottom: 1px solid ${actionButtonTheme.borderColor};
                `
              : css`
                  border: 1px solid ${actionButtonTheme.borderColor};
                `}
          `}
          ${styles?.self}
        `,
        toggleStyle: css`
          ${subMenu &&
          css`
            display: flex;
            flex-direction: row;
            gap: 0.25rem;
            align-items: center;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
            position: relative;
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;

            ${variant === "default" &&
            css`
              background-color: transparent;
              color: #565555;
              border-top: 1px solid ${actionButtonTheme.toggleBorderColor};
              border-right: 1px solid ${actionButtonTheme.toggleBorderColor};
              border-bottom: 1px solid ${actionButtonTheme.toggleBorderColor};
              &:hover {
                background-color: ${actionButtonTheme.toggleHoverBackgroundColor};
              }

              &:disabled {
                background-color: ${actionButtonTheme.toggleBackgroundColor};
                opacity: 0.5;
                cursor: not-allowed;
              }
            `}
            ${styles?.toggleStyle}
          `}
        `,
        dividerStyle: css`
          border: 1px solid ${actionButtonTheme.dividerColor};
          ${subMenu && styles?.dividerStyle ? styles.dividerStyle : null}
        `,
        dropdownStyle: (placement) => css`
          ${forTable && placement?.startsWith("bottom")
            ? css`
                transform: translateY(-4px);
              `
            : placement?.startsWith("top")
              ? css`
                  transform: translateY(4px);
                `
              : null}

          width: 170px;
          ${subMenu && styles?.dropdownStyle ? styles.dropdownStyle : null}
        `,
      }}
      icon={icon}
    >
      {caption && caption}
    </Button>
  );
}
