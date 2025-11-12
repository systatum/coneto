import { css, CSSProp } from "styled-components";
import { Button, ButtonProps } from "./button";
import { RiMoreFill } from "@remixicon/react";
import { TipMenuItemProps } from "./tip-menu";
import { ReactNode } from "react";

export type ContextMenuActionsProps = TipMenuItemProps;

export interface ContextMenuProps {
  actions: ContextMenuActionsProps[];
  children?: ReactNode;
  containerStyle?: CSSProp;
  buttonStyle?: CSSProp;
  dropdownStyle?: CSSProp;
  focusBackgroundColor?: string;
  activeBackgroundColor?: string;
  hoverBackgroundColor?: string;
}

export default function ContextMenu({
  children,
  actions,
  buttonStyle,
  dropdownStyle,
  containerStyle,
  activeBackgroundColor,
  hoverBackgroundColor,
  focusBackgroundColor,
}: ContextMenuProps) {
  const buttonProps: ButtonProps = {
    buttonStyle: css`
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

    ${buttonStyle}
    `,
    variant: "ghost",
    containerStyle: css`
      width: fit-content;
      height: fit-content;
      ${containerStyle}
    `,
    dropdownStyle: css`
      margin-top: 2px;
      ${dropdownStyle}
    `,
    activeBackgroundColor: activeBackgroundColor,
  };

  if (actions.length === 1) {
    return actions.map((prop, index) => {
      const { icon: Icon } = prop;
      return (
        <Button
          {...buttonProps}
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            if (prop.onClick) {
              prop.onClick(e);
            }
          }}
          title={prop.caption}
          aria-label="list-action-button"
        >
          <Icon size={16} />
        </Button>
      );
    });
  }

  return (
    <Button
      {...buttonProps}
      aria-label="list-action-button"
      showSubMenuOn="self"
      subMenu={({ list }) => list(actions)}
    >
      {children ?? <RiMoreFill size={16} />}
    </Button>
  );
}
