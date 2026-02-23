import { css, CSSProp } from "styled-components";
import { Button, ButtonProps } from "./button";
import { RiMoreFill } from "@remixicon/react";
import { TipMenuItemProps } from "./tip-menu";
import { ReactNode } from "react";
import { Figure } from "./figure";

export type ContextMenuActionsProps = TipMenuItemProps;

export interface ContextMenuProps {
  actions: ContextMenuActionsProps[];
  onOpen?: (prop: boolean) => void;
  children?: ReactNode;
  focusBackgroundColor?: string;
  activeBackgroundColor?: string;
  hoverBackgroundColor?: string;
  maxActionsBeforeCollapsing?: number;
  iconSize?: number;
  open?: boolean;
  styles?: ContextMenuStylesProps;
}

export interface ContextMenuStylesProps {
  containerStyle?: CSSProp;
  self?: CSSProp;
  dropdownStyle?: CSSProp;
}

export default function ContextMenu({
  children,
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
    return actions.map((action, index) => (
      <Button
        {...buttonProps}
        key={index}
        onClick={(e) => {
          e.stopPropagation();
          if (action.onClick) {
            action.onClick(e);
          }
        }}
        onOpen={onOpen}
        title={action.caption}
        aria-label="action-button"
      >
        {action.icon && (
          <Figure
            {...action.icon}
            size={iconSize ?? action.icon.size}
            color={action?.icon?.color ?? "black"}
          />
        )}
      </Button>
    ));
  }

  return (
    <Button
      {...buttonProps}
      aria-label="action-button"
      showSubMenuOn="self"
      onOpen={onOpen}
      open={open}
      subMenu={({ list }) => list(actions)}
    >
      {children ?? <Figure image={RiMoreFill} size={iconSize} />}
    </Button>
  );
}
