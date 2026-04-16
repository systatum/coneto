import styled, { css, CSSProp } from "styled-components";
import { COLOR_STYLE_MAP } from "../constants/color-map";
import React, { ReactNode, useMemo, useState } from "react";
import { Button } from "./button";
import { Searchbox } from "./searchbox";
import { Figure, FigureProps } from "./figure";
import { useTheme } from "../theme/provider";
import { TipMenuThemeConfig } from "./../theme";

export const TipMenuVariant = {
  Default: "default",
  Primary: "primary",
  Danger: "danger",
  Success: "success",
} as const;

export type TipMenuVariant =
  (typeof TipMenuVariant)[keyof typeof TipMenuVariant];

export const TipMenuSize = {
  Small: "sm",
  Medium: "md",
} as const;

export type TipMenuSize = (typeof TipMenuSize)[keyof typeof TipMenuSize];

export interface TipMenuProps {
  children?: ReactNode;
  subMenuList?: TipMenuItemProps[];
  setIsOpen?: () => void;
  variant?: TipMenuVariant;
  size?: TipMenuSize;
  withFilter?: boolean;
  styles?: TipMenuStyles;
}

export interface TipMenuStyles {
  self?: CSSProp;
}

function TipMenu({
  children,
  subMenuList,
  styles,
  setIsOpen,
  variant = "default",
  size = "md",
  withFilter,
}: TipMenuProps) {
  const [search, setSearch] = useState<string>("");
  const [isHasInteracted, setHasInteracted] = useState<boolean>(false);

  const filteredSubMenuList = useMemo(() => {
    const searchContent = search.toLowerCase().trim();
    return subMenuList
      ?.filter((list): list is TipMenuItemProps => Boolean(list))
      ?.filter((list) =>
        isHasInteracted
          ? list.caption.toLowerCase().includes(searchContent)
          : list
      );
  }, [search, subMenuList]);

  return (
    <Button.TipMenuContainer
      aria-label="tip-menu"
      styles={{ self: styles?.self }}
    >
      {withFilter && (
        <Searchbox
          autoFocus
          name="tip-menu-search"
          value={search}
          styles={{
            containerStyle: css`
              position: sticky;
              top: 0;
              z-index: 30;
              height: 38px;
              padding-right: 5px;
              padding-left: 5px;
            `,
            iconStyle: css`
              left: 16px;
            `,
            self: css`
              max-height: 35px;
              margin-top: 7px;
              margin-bottom: 7px;
              padding-bottom: 7px;
              padding-top: 7px;
            `,
          }}
          onChange={(e) => {
            setHasInteracted(true);
            setSearch(e.target.value);
          }}
        />
      )}
      {filteredSubMenuList?.map((menu, index) => (
        <TipMenu.Item
          key={index}
          variant={menu.variant ?? variant}
          caption={menu.caption}
          icon={menu.icon}
          size={menu.size ?? size}
          className={menu.className}
          hidden={menu.hidden}
          onClick={(e) => {
            e.stopPropagation();

            if (menu.onClick) {
              menu.onClick();
            }
            setIsOpen?.();
          }}
        />
      ))}
      {children}
    </Button.TipMenuContainer>
  );
}

export interface TipMenuItemProps {
  caption: string;
  icon?: FigureProps;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: TipMenuVariant;
  size?: TipMenuSize;
  className?: string;
  hidden?: boolean;
}

function TipMenuItem({
  caption,
  icon,
  onClick,
  variant,
  size,
  className,
  hidden,
}: TipMenuItemProps) {
  const { currentTheme } = useTheme();
  const tipMenuTheme = currentTheme.tipmenu;

  if (hidden) {
    return;
  }

  return (
    <StyledTipMenuItem
      $variant={variant}
      $size={size}
      aria-label="tip-menu-item"
      onMouseDown={onClick}
      $theme={tipMenuTheme}
      className={className}
    >
      {icon && <Figure {...icon} aria-label="tip-menu-icon" />}
      <StyledCaption>{caption}</StyledCaption>
    </StyledTipMenuItem>
  );
}

const StyledTipMenuItem = styled.div<{
  $variant?: TipMenuVariant;
  $theme: Record<TipMenuVariant, TipMenuThemeConfig>;
  $size?: TipMenuSize;
}>`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;

  background-color: ${({ $theme, $variant }) =>
    $theme[$variant]?.backgroundColor};
  color: ${({ $theme, $variant }) => $theme[$variant]?.textColor};
  transition: background-color 0.2s;

  ${({ $size }) =>
    $size === "sm"
      ? css`
          gap: 8px;
          padding: 2px;
        `
      : css`
          gap: 12px;
          padding: 8px;
        `};

  &:hover {
    background-color: ${({ $theme, $variant }) =>
      $theme[$variant]?.hoverBackgroundColor};
  }

  &:active {
    background-color: ${({ $theme, $variant }) =>
      $theme[$variant]?.activeBackgroundColor};

    box-shadow: inset 0 0.5px 4px rgba(0, 0, 0, 0.2);
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px
      ${({ $theme, $variant }) => $theme[$variant]?.focusBackgroundColor};
  }
`;

const StyledCaption = styled.span`
  font-size: 0.875rem;
  white-space: nowrap;
`;

TipMenu.Item = TipMenuItem;
export { TipMenu };
