import styled, { css, CSSProp } from "styled-components";
import { COLOR_STYLE_MAP } from "../constants/color-map";
import React, { ReactNode, useMemo, useState } from "react";
import { Button } from "./button";
import { Searchbox } from "./searchbox";
import { Figure, FigureProps } from "./figure";
import { useTheme } from "../theme/provider";
import { TipMenuThemeConfiguration } from "theme";

export type TipMenuItemVariantType = "sm" | "md";

export interface TipMenuProps {
  children?: ReactNode;
  subMenuList?: TipMenuItemProps[];
  setIsOpen?: () => void;
  variant?: TipMenuItemVariantType;
  withFilter?: boolean;
  styles?: TipMenuStylesProps;
}

export interface TipMenuStylesProps {
  self?: CSSProp;
}

function TipMenu({
  children,
  subMenuList,
  styles,
  setIsOpen,
  variant = "md",
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
          isDangerous={menu.isDangerous}
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
  isDangerous?: boolean;
  variant?: TipMenuItemVariantType;
  className?: string;
  hidden?: boolean;
}

function TipMenuItem({
  caption,
  icon,
  onClick,
  isDangerous = false,
  variant,
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
      aria-label="tip-menu-item"
      $isDangerous={isDangerous}
      onMouseDown={onClick}
      $theme={tipMenuTheme}
      className={className}
    >
      {icon && (
        <Figure
          {...icon}
          aria-label="tip-menu-icon"
          color={
            isDangerous
              ? "white"
              : (COLOR_STYLE_MAP[icon?.color] ?? icon?.color)
          }
        />
      )}
      <StyledCaption>{caption}</StyledCaption>
    </StyledTipMenuItem>
  );
}

const StyledTipMenuItem = styled.div<{
  $isDangerous: boolean;
  $variant?: TipMenuItemVariantType;
  $theme: TipMenuThemeConfiguration;
}>`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;

  background-color: ${({ $isDangerous, $theme }) =>
    $isDangerous ? $theme.dangerousBackgroundColor : $theme.backgroundColor};

  color: ${({ $isDangerous, $theme }) =>
    $isDangerous ? "white" : $theme.textColor};

  transition: background-color 0.2s;

  ${({ $variant }) =>
    $variant === "sm"
      ? css`
          gap: 8px;
          padding: 2px;
        `
      : css`
          gap: 12px;
          padding: 8px;
        `}

  &:hover {
    background-color: ${({ $isDangerous, $theme }) =>
      $isDangerous
        ? $theme.dangerousHoverBackgroundColor
        : $theme.hoverBackgroundColor};
  }

  &:active {
    background-color: ${({ $isDangerous, $theme }) =>
      $isDangerous
        ? $theme.dangerousActiveBackgroundColor
        : $theme.activeBackgroundColor};

    box-shadow: inset 0 0.5px 4px rgba(0, 0, 0, 0.2);
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px ${({ $theme }) => $theme.focusBorderColor};
  }
`;

const StyledCaption = styled.span`
  font-size: 0.875rem;
  white-space: nowrap;
`;

TipMenu.Item = TipMenuItem;
export { TipMenu };
