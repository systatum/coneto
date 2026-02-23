import styled, { css, CSSProp } from "styled-components";
import { COLOR_STYLE_MAP } from "../constants/color-map";
import React, { ReactNode, useMemo, useState } from "react";
import { Button } from "./button";
import { Searchbox } from "./searchbox";
import { Figure, FigureProps } from "./figure";

export type TipMenuItemVariantType = "sm" | "md";
export interface TipMenuProps {
  children?: ReactNode;
  subMenuList?: TipMenuItemProps[];
  style?: CSSProp;
  setIsOpen?: () => void;
  variant?: TipMenuItemVariantType;
  withFilter?: boolean;
}

export interface TipMenuItemProps {
  caption: string;
  icon: FigureProps;
  onClick?: (e?: React.MouseEvent) => void;
  isDangerous?: boolean;
  variant?: TipMenuItemVariantType;
}

function TipMenu({
  children,
  subMenuList,
  style,
  setIsOpen,
  variant = "md",
  withFilter,
}: TipMenuProps) {
  const [search, setSearch] = useState<string>("");
  const [isHasInteracted, setHasInteracted] = useState<boolean>(false);

  const filteredSubMenuList = useMemo(() => {
    const searchContent = search.toLowerCase().trim();
    return subMenuList?.filter((list) =>
      isHasInteracted
        ? list.caption.toLowerCase().includes(searchContent)
        : list
    );
  }, [search, subMenuList]);

  return (
    <Button.TipMenuContainer aria-label="tip-menu" style={style}>
      {withFilter && (
        <Searchbox
          autoFocus
          name="tip-menu-search"
          value={search}
          styles={{
            containerStyle: css`
              position: sticky;
              top: 0;
              background-color: white;
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

function TipMenuItem({
  caption,
  icon,
  onClick,
  isDangerous = false,
  variant,
}: TipMenuItemProps) {
  return (
    <StyledTipMenuItem
      $variant={variant}
      aria-label="tip-menu-item"
      $isDangerous={isDangerous}
      onMouseDown={onClick}
    >
      {icon && (
        <Figure
          {...icon}
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
}>`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${(props) => (props.$isDangerous ? "#ef4444" : "white")};
  color: ${(props) => (props.$isDangerous ? "white" : "black")};
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

  &:active {
    background-color: ${(props) => (props.$isDangerous ? "#ce375d" : "white")};
    box-shadow:
      inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
      inset 0 -0.5px 0.5px
        ${(props) => (props.$isDangerous ? "#ce375d" : "white")};
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px
      ${(props) => (props.$isDangerous ? "#ce375d" : "white")};
    transition: box-shadow 0.2s ease;
  }

  &:hover {
    background-color: ${(props) =>
      props.$isDangerous ? "#e71f29" : "#f2f2f2"};
    border-color: ${(props) =>
      props.$isDangerous ? "#e71f29" : "transparent"};
  }
`;

const StyledCaption = styled.span`
  font-size: 0.875rem;
  white-space: nowrap;
`;

TipMenu.Item = TipMenuItem;
export { TipMenu };
