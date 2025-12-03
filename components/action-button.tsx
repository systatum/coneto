import { RemixiconComponentType } from "@remixicon/react";
import { css, CSSProp } from "styled-components";
import { Button, SubMenuButtonProps } from "./button";
import { ReactNode } from "react";

export interface ActionButtonProps {
  caption?: string;
  icon?: RemixiconComponentType;
  iconSize?: number;
  onClick?: () => void;
  style?: CSSProp;
  dividerStyle?: CSSProp;
  dropdownStyle?: CSSProp;
  subMenu?: (props: SubMenuButtonProps) => ReactNode;
  disabled?: boolean;
  showSubMenuOn?: "caret" | "self";
}

export function ActionButton(props: ActionButtonProps) {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        if (props.onClick) {
          props.onClick();
        }
      }}
      aria-label="action-button"
      subMenu={props.subMenu}
      disabled={props.disabled}
      showSubMenuOn={props.showSubMenuOn}
      size="sm"
      tipMenuSize="sm"
      buttonStyle={css`
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
        align-items: center;
        cursor: pointer;
        background-color: transparent;
        color: #565555;
        ${props.subMenu && props.showSubMenuOn === "caret"
          ? css`
              border-top: 1px solid #e5e7eb;
              border-left: 1px solid #e5e7eb;
              border-bottom: 1px solid #e5e7eb;
            `
          : css`
              border: 1px solid #e5e7eb;
            `}
        border-radius: 6px;
        position: relative;

        &:hover {
          background-color: #e2e0e0;
        }

        &:disabled {
          background-color: rgb(227 227 227);
          opacity: 0.5;
          cursor: not-allowed;
        }
        ${props.style}
      `}
      toggleStyle={
        props.subMenu &&
        css`
          display: flex;
          flex-direction: row;
          gap: 0.25rem;
          align-items: center;
          cursor: pointer;
          color: #565555;
          padding: 0.25rem 0.5rem;
          background-color: transparent;
          position: relative;
          border-top: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;

          &:hover {
            background-color: #e2e0e0;
          }

          &:disabled {
            background-color: rgb(227 227 227);
            opacity: 0.5;
            cursor: not-allowed;
          }
          ${props.style}
        `
      }
      dividerStyle={css`
        border: 1px solid rgb(236 236 236);
        ${props.subMenu && props.dividerStyle ? props.dividerStyle : null}
      `}
      dropdownStyle={css`
        position: absolute;
        margin-top: 2px;
        z-index: 9999;
        width: 170px;
        ${props.subMenu && props.dropdownStyle ? props.dropdownStyle : null}
      `}
    >
      {props.icon && <props.icon size={props.iconSize ?? 14} />}

      {props.caption && props.caption}
    </Button>
  );
}
