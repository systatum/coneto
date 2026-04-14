import { COLOR_STYLE_MAP } from "./../constants/color-map";
import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { TipMenu, TipMenuItemProps } from "./tip-menu";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import styled, { css, CSSProp } from "styled-components";
import { Figure, FigureProps } from "./figure";
import { useTheme } from "./../theme/provider";
import { ToolbarThemeConfig } from "./../theme";

export interface ToolbarProps {
  children: ReactNode;
  big?: boolean;
  styles?: ToolbarStyles;
}

export interface ToolbarStyles {
  self?: CSSProp;
}

export const ToolbarVariant = {
  Default: "default",
  Primary: "primary",
  Danger: "danger",
  Success: "success",
  Transparent: "transparent",
} as const;

export type ToolbarVariant =
  (typeof ToolbarVariant)[keyof typeof ToolbarVariant];

const useVariantToolbar = () => {
  const { currentTheme } = useTheme();
  const toolbarVariant = currentTheme?.toolbar ?? {};

  const VARIANT_COLORS: Record<ToolbarVariant, ToolbarThemeConfig> =
    Object.keys(toolbarVariant).reduce(
      (acc, key) => {
        const variant: ToolbarThemeConfig =
          toolbarVariant[key as ToolbarVariant];
        if (!variant) return acc;
        acc[key as ToolbarVariant] = {
          backgroundColor: variant.backgroundColor,
          textColor: variant.textColor,
          borderColor: variant.borderColor,
          hoverBackgroundColor: variant.hoverBackgroundColor,
          activeBackgroundColor: variant.activeBackgroundColor,
          focusBackgroundColor: variant.focusBackgroundColor,
          dividerColor: variant.dividerColor,
        };
        return acc;
      },
      {} as Record<ToolbarVariant, ToolbarThemeConfig>
    );

  return { VARIANT_COLORS };
};

function Toolbar({ children, styles, big }: ToolbarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const handleOpen = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (toolbarRef.current && !toolbarRef.current.contains(target)) {
        setOpenIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const childrenWithProps = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;

    if (child.type === React.Fragment) return child;

    if (child.type === Toolbar.Menu) {
      const menuChild = child as ReactElement<ToolbarMenuProps>;

      return cloneElement(menuChild, {
        isOpen: openIndex === index,
        setIsOpen: () => handleOpen(index),
        key: index,
        ...(big
          ? {
              ...menuChild.props,
              icon: {
                ...menuChild?.props?.icon,
                size: menuChild?.props?.icon?.size ?? 33,
              },
              styles: {
                ...menuChild.props.styles,
                triggerStyle: css`
                  padding-top: 13px;
                  padding-bottom: 13px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  ${menuChild.props.styles?.triggerStyle}
                `,
              },
            }
          : {}),
      });
    }

    return child;
  });

  return (
    <ToolbarWrapper ref={toolbarRef} $style={styles?.self}>
      {childrenWithProps}
    </ToolbarWrapper>
  );
}

export interface ToolbarMenuProps {
  caption?: string;
  icon?: FigureProps;
  openedIcon?: FigureProps["image"];
  closedIcon?: FigureProps["image"];
  subMenuList?: ToolbarSubMenuList[];
  isOpen?: boolean;
  setIsOpen?: (data?: boolean) => void;
  onClick?: () => void;
  styles?: ToolbarMenuStyles;
  variant?: ToolbarVariant;
  iconSize?: number;
}

export type ToolbarSubMenuList = TipMenuItemProps;

export interface ToolbarMenuStyles {
  dropdownStyle?: CSSProp;
  containerStyle?: CSSProp;
  triggerStyle?: CSSProp;
  toggleActiveStyle?: CSSProp;
}

function ToolbarMenu({
  caption,
  icon,
  openedIcon: OpenedIcon = RiArrowDownSLine,
  closedIcon: ClosedIcon = RiArrowUpSLine,
  subMenuList,
  isOpen,
  setIsOpen,
  onClick,
  styles,
  variant = "default",
}: ToolbarMenuProps) {
  const { VARIANT_COLORS } = useVariantToolbar();
  const toolbarTheme = VARIANT_COLORS[variant];

  const [hovered, setHovered] = useState<"main" | "original" | "dropdown">(
    "original"
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles, update } = useFloating({
    open: isOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip({ padding: 40 }), shift()],
    placement: "bottom-start",
  });

  useEffect(() => {
    if (isOpen) update();
  }, [isOpen, update]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen?.(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleClickOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen?.();
  };
  const handleMainClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick?.();
    if (isOpen) setIsOpen(false);
  };

  const filteredSubMenuList =
    subMenuList?.filter((menu): menu is ToolbarSubMenuList => Boolean(menu)) ??
    [];

  const toolbarButtonStyle = (
    colors: ToolbarThemeConfig,
    isOpen?: boolean
  ) => css`
    position: relative;
    background-color: ${colors.backgroundColor};
    color: ${colors.textColor};
    transition: background-color 0.2s ease;

    ${!isOpen &&
    css`
      &:hover {
        background-color: ${!isOpen
          ? colors.hoverBackgroundColor
          : colors.activeBackgroundColor};
      }
    `}

    &:active {
      background-color: ${colors.activeBackgroundColor};
      box-shadow:
        inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
        inset 0 -0.5px 0.5px ${colors.activeBackgroundColor};
    }

    &:focus-visible {
      outline: none;
      border-radius: inherit;
      z-index: 40;
      box-shadow: inset 0 0 0 2px ${colors.focusBackgroundColor};
    }

    ${isOpen &&
    css`
      background-color: ${colors.activeBackgroundColor};
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-shadow:
          inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
          inset 0 -0.5px 0.5px ${colors.activeBackgroundColor};
        border-radius: inherit;
        pointer-events: none;
      }
    `}
  `;

  return (
    <ToolbarContainer aria-label="toolbar-menu" ref={containerRef}>
      <MenuWrapper
        ref={refs.setReference}
        $style={css`
          ${styles?.containerStyle};
        `}
        $variant={variant}
        $theme={toolbarTheme}
      >
        {(icon || caption) && (
          <>
            <TriggerButton
              type="button"
              aria-label={`toolbar-menu-button`}
              onMouseEnter={() => setHovered("main")}
              onMouseLeave={() => setHovered("original")}
              onClick={handleMainClick}
              $style={css`
                ${toolbarButtonStyle(toolbarTheme)};
                ${styles?.triggerStyle}
              `}
            >
              {icon && (
                <Figure
                  aria-label="toolbar-icon"
                  {...icon}
                  color={COLOR_STYLE_MAP[icon?.color] ?? icon?.color}
                  size={icon?.size ?? 20}
                />
              )}
              {caption && <Caption $hasIcon={!!icon?.image}>{caption}</Caption>}
            </TriggerButton>
            {subMenuList && caption && (
              <Divider
                $theme={toolbarTheme}
                $style={css`
                  height: ${hovered === "original" && !isOpen ? "80%" : "100%"};
                `}
              />
            )}
          </>
        )}
        {subMenuList && (
          <ToggleButton
            aria-label="toolbar-menu-toggle"
            onMouseEnter={() => setHovered("dropdown")}
            onMouseLeave={() => setHovered("original")}
            onClick={handleClickOpen}
            $style={css`
              ${toolbarButtonStyle(toolbarTheme, isOpen)}
              ${styles?.triggerStyle};
              ${isOpen && styles?.toggleActiveStyle};
            `}
          >
            {isOpen ? (
              <OpenedIcon
                size={20}
                style={variant === "default" ? { color: "#9ca3af" } : undefined}
              />
            ) : (
              <ClosedIcon
                size={20}
                style={variant === "default" ? { color: "#9ca3af" } : undefined}
              />
            )}
          </ToggleButton>
        )}
      </MenuWrapper>

      {isOpen && subMenuList && (
        <div
          ref={refs.setFloating}
          style={{ ...floatingStyles, zIndex: 9999 }}
          onMouseEnter={() => setHovered("dropdown")}
          onMouseLeave={() => setHovered("original")}
        >
          <TipMenu
            setIsOpen={() => {
              setIsOpen(false);
              setHovered("original");
            }}
            styles={{ self: styles?.dropdownStyle }}
            subMenuList={filteredSubMenuList}
          />
        </div>
      )}
    </ToolbarContainer>
  );
}

const ToolbarWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  width: 100%;
  flex-direction: row;
  ${(props) => props.$style}
`;

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 0.25rem;
  position: relative;
`;

const MenuWrapper = styled.div<{
  $style?: CSSProp;
  $theme?: ToolbarThemeConfig;
  $variant?: ToolbarVariant;
}>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid transparent;
  position: relative;
  user-select: none;
  border-radius: 0.3rem;
  overflow: hidden;
  cursor: pointer;

  border: 1px solid
    ${({ $theme, $variant }) =>
      $variant === "transparent"
        ? "transparent"
        : ($theme?.hoverBackgroundColor ?? "transparent")};

  ${(props) => props.$style}
`;

const TriggerButton = styled.button<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  height: 100%;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.8rem;
  padding-right: 0.8rem;

  cursor: pointer;
  ${(props) => props.$style}
`;

const ToggleButton = styled.button<{ $style?: CSSProp }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  height: 100%;
  max-width: 36px;
  position: relative;
  cursor: pointer;

  ${(props) => props.$style}
`;

const Divider = styled.span<{ $style?: CSSProp; $theme: ToolbarThemeConfig }>`
  position: absolute;
  right: 35px;
  top: 50%;
  transform: translateY(-50%);
  height: 100%;
  width: 1px;
  border-width: 0.5px;
  z-index: 20;
  transition: height 150ms ease-in-out;
  border-color: ${({ $theme }) => $theme?.dividerColor};

  ${(props) => props.$style}
`;

const Caption = styled.span<{ $hasIcon?: boolean }>`
  font-size: 0.875rem;
  display: ${({ $hasIcon }) => ($hasIcon ? "none" : "flex")};

  @media (min-width: 768px) {
    display: flex;
  }
`;

Toolbar.Menu = ToolbarMenu;
export { Toolbar };
