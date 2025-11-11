import { css, CSSProp } from "styled-components";
import { Button } from "./button";
import { RiMoreFill } from "@remixicon/react";
import { TipMenuItemProps } from "./tip-menu";
import { ReactNode } from "react";

export type ContextMenuActionsProps = TipMenuItemProps;

export interface ContextMenuProps {
  actions: ContextMenuActionsProps[];
  children?: ReactNode;
  buttonStyle?: CSSProp;
  dropdownStyle?: CSSProp;
}

export default function ContextMenu({
  children,
  actions,
  buttonStyle,
  dropdownStyle,
}: ContextMenuProps) {
  if (actions.length === 1) {
    return actions.map((prop, index) => {
      const { icon: Icon } = prop;
      return (
        <Button
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            if (prop.onClick) {
              prop.onClick();
            }
          }}
          variant="ghost"
          title={prop.caption}
          aria-label="list-action-button"
          containerStyle={css`
            width: fit-content;
            height: fit-content;
          `}
          buttonStyle={css`
            padding: 8px;
            ${buttonStyle}
          `}
        >
          <Icon size={16} />
        </Button>
      );
    });
  }

  return (
    <Button
      containerStyle={css`
        width: fit-content;
        height: fit-content;
      `}
      dropdownStyle={css`
        margin-top: 2px;
        ${dropdownStyle}
      `}
      aria-label="list-action-button"
      variant="ghost"
      buttonStyle={css`
        padding: 8px;
        ${buttonStyle}
      `}
      showSubMenuOn="self"
      subMenu={({ list }) => list(actions)}
    >
      {children ?? <RiMoreFill size={16} />}
    </Button>
  );
}
