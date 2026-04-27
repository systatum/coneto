import styled, { css, CSSProp } from "styled-components";
import React, { ReactNode, useMemo, useRef, useState } from "react";
import { Button } from "./button";
import { Searchbox } from "./searchbox";
import { Figure, FigureProps } from "./figure";
import { useTheme } from "../theme/provider";
import { TipMenuThemeConfig } from "./../theme";
import { Tooltip, TooltipRef } from "./tooltip";
import { RiArrowRightSFill } from "@remixicon/react";
import { BaseAction } from "../constants/action";

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

export type TipMenuSubMenuList = TipMenuItemProps;

export interface TipMenuProps {
  children?: ReactNode;
  subMenuList?: TipMenuSubMenuList[];
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
      styles={{
        self: styles?.self,
      }}
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
          id={menu.id}
          variant={menu.variant ?? variant}
          caption={menu.caption}
          icon={menu.icon}
          size={menu.size ?? size}
          styles={menu.styles}
          subMenuList={menu.subMenuList}
          hidden={menu.hidden}
          disabled={menu.disabled}
          className={menu.className}
          setIsOpen={setIsOpen}
          onClick={(e) => {
            e.stopPropagation();

            if (menu.onClick) {
              menu.onClick();
            }

            if (!menu?.disabled) {
              setIsOpen?.();
            }
          }}
        />
      ))}
      {children}
    </Button.TipMenuContainer>
  );
}

export interface TipMenuItemProps extends BaseAction {
  variant?: TipMenuVariant;
  size?: TipMenuSize;
  subMenuList?: TipMenuItemProps[];
  styles?: TipMenuItemStyles;
  className?: string;
}

export interface TipMenuItemStyles {
  containerStyle?: CSSProp;
  self?: CSSProp;
}

function TipMenuItem({
  caption,
  icon,
  onClick,
  variant,
  size,
  hidden,
  subMenuList,
  styles,
  disabled,
  setIsOpen,
  id,
  className,
}: TipMenuItemProps & {
  setIsOpen?: () => void;
}) {
  const { currentTheme } = useTheme();
  const tipMenuTheme = currentTheme.tipmenu;
  const tooltipRef = useRef<TooltipRef>(null);

  if (hidden) {
    return;
  }

  const tipMenuElement = (
    <TipMenuItemWrapper
      id={id}
      $variant={variant}
      $size={size}
      aria-label="tip-menu-item"
      onMouseDown={(e) => {
        if (disabled) return;
        onClick?.(e);
      }}
      className={className}
      $theme={tipMenuTheme}
      $disabled={disabled}
      $style={styles?.containerStyle}
    >
      <TipMenuItemContent $size={size} $style={styles?.self}>
        {icon && <Figure {...icon} aria-label="tip-menu-icon" />}
        <StyledCaption>{caption}</StyledCaption>
      </TipMenuItemContent>

      {subMenuList && (
        <Figure aria-label="tip-menu-item-arrow" image={RiArrowRightSFill} />
      )}
    </TipMenuItemWrapper>
  );

  if (subMenuList && subMenuList?.length > 0) {
    return (
      <Tooltip
        ref={tooltipRef}
        dialogPlacement="right-center"
        safeAreaAriaLabels={["tip-menu"]}
        styles={{
          containerStyle: css`
            width: 100%;
          `,
          triggerStyle: css`
            width: 100%;
          `,
          drawerStyle: (placement) => css`
            padding: 0px;
            ${disabled &&
            css`
              display: none;
            `}
            ${placement?.startsWith("right")
              ? css`
                  right: 9px;
                `
              : css`
                  left: 9px;
                `}
          `,
          arrowStyle: css`
            display: none;
          `,
        }}
        dialog={
          <TipMenu
            subMenuList={subMenuList}
            variant={variant}
            size={size}
            setIsOpen={() => {
              tooltipRef.current?.close();
              setIsOpen?.();
            }}
          />
        }
      >
        {tipMenuElement}
      </Tooltip>
    );
  }

  return tipMenuElement;
}

const TipMenuItemWrapper = styled.div<{
  $variant?: TipMenuVariant;
  $theme: Record<TipMenuVariant, TipMenuThemeConfig>;
  $size?: TipMenuSize;
  $style?: CSSProp;
  $disabled?: boolean;
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

  ${({ $disabled, $theme, $variant }) =>
    !$disabled &&
    css`
      &:hover {
        background-color: ${$theme[$variant]?.hoverBackgroundColor};
      }

      &:active {
        background-color: ${$theme[$variant]?.activeBackgroundColor};

        box-shadow: inset 0 0.5px 4px rgba(0, 0, 0, 0.2);
      }

      &:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 2px ${$theme[$variant]?.focusBackgroundColor};
      }
    `}

  ${({ $disabled, $theme, $variant }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
      filter: grayscale(80%) brightness(1.1) contrast(1);
      color: ${$theme?.[$variant]?.disabledTextColor};
    `}

  ${({ $style }) => $style}
`;

const TipMenuItemContent = styled.div<{
  $size?: TipMenuSize;
  $style?: CSSProp;
}>`
  display: flex;
  align-items: center;
  width: 100%;

  ${({ $size }) =>
    $size === "sm"
      ? css`
          gap: 8px;
        `
      : css`
          gap: 12px;
        `};

  ${({ $style }) => $style}
`;

const StyledCaption = styled.span`
  font-size: 0.875rem;
  white-space: nowrap;
`;

TipMenu.Item = TipMenuItem;
export { TipMenu };
