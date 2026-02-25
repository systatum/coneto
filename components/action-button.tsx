import { css, CSSProp } from "styled-components";
import { Button, ButtonVariants, SubMenuButtonProps } from "./button";
import { ReactNode } from "react";
import { Figure, FigureProps } from "./figure";

export interface ActionButtonProps {
  caption?: string;
  icon?: FigureProps;
  onClick?: () => void;
  styles?: ActionButtonStylesProps;
  subMenu?: (props: SubMenuButtonProps) => ReactNode;
  disabled?: boolean;
  showSubMenuOn?: "caret" | "self";
  variant?: ButtonVariants["variant"];
}

export interface ActionButtonStylesProps {
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
  showSubMenuOn,
  variant = "default",
  forTable,
}: ActionButtonProps & { forTable?: boolean }) {
  return (
    <Button
      onClick={(e) => {
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
      styles={{
        self: css`
          display: flex;
          flex-direction: row;
          gap: 0.25rem;
          align-items: center;
          cursor: pointer;
          border-radius: 6px;
          position: relative;

          ${variant === "default" &&
          css`
            background-color: transparent;
            color: #565555;
            &:hover {
              background-color: #e2e0e0;
            }

            &:disabled {
              background-color: rgb(227 227 227);
              opacity: 0.5;
              cursor: not-allowed;
            }

            ${subMenu && showSubMenuOn === "caret"
              ? css`
                  border-top: 1px solid #e5e7eb;
                  border-left: 1px solid #e5e7eb;
                  border-bottom: 1px solid #e5e7eb;
                `
              : css`
                  border: 1px solid #e5e7eb;
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
              border-top: 1px solid #e5e7eb;
              border-right: 1px solid #e5e7eb;
              border-bottom: 1px solid #e5e7eb;
              &:hover {
                background-color: #e2e0e0;
              }

              &:disabled {
                background-color: rgb(227 227 227);
                opacity: 0.5;
                cursor: not-allowed;
              }
            `}
            ${styles?.toggleStyle}
          `}
        `,
        dividerStyle: css`
          border: 1px solid rgb(236 236 236);
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
    >
      {icon && (
        <Figure
          {...icon}
          aria-label="action-button-icon"
          size={icon?.size ?? 14}
        />
      )}
      {caption && caption}
    </Button>
  );
}
