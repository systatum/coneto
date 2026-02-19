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
import { RemixiconComponentType } from "@remixicon/react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import styled, { css, CSSProp } from "styled-components";

export interface ToolbarProps {
  children: ReactNode;
  style?: CSSProp;
  big?: boolean;
}

export interface ToolbarMenuProps {
  caption?: string;
  icon?: RemixiconComponentType;
  openedIcon?: RemixiconComponentType;
  closedIcon?: RemixiconComponentType;
  iconColor?: string;
  subMenuList?: TipMenuItemProps[];
  isOpen?: boolean;
  setIsOpen?: (data?: boolean) => void;
  onClick?: () => void;
  styles?: ToolbarMenuSylesProps;
  variant?: ToolbarVariantType;
  iconSize?: number;
}

export interface ToolbarMenuSylesProps {
  dropdownStyle?: CSSProp;
  containerStyle?: CSSProp;
  triggerStyle?: CSSProp;
  toggleActiveStyle?: CSSProp;
}

type ToolbarVariantType = "default" | "primary" | "danger" | "none";

const VARIANT_CLASS_MAP = {
  base: {
    default: css`
      background-color: white;
      &:hover {
        border-color: #ececec;
      }
    `,
    primary: css`
      background-color: rgb(86, 154, 236);
      &:hover {
        border-color: #5286c9;
      }
    `,
    danger: css`
      background-color: rgb(206, 55, 93);
      &:hover {
        border-color: #c00000;
      }
    `,
  },
  hover: {
    default: css`
      background-color: #f5f5f5;
    `,
    primary: css`
      background-color: rgb(64, 142, 232);
    `,
    danger: css`
      background-color: rgb(200, 53, 50);
    `,
  },
  active: {
    default: css`
      &:active {
        background-color: #e8e8e8;
        box-shadow:
          inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
          inset 0 -0.5px 0.5px #e8e8e8;
      }
    `,
    primary: css`
      &:active {
        background-color: rgb(54, 132, 222);
        box-shadow:
          inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
          inset 0 -0.5px 0.5px rgb(54, 132, 222);
      }
    `,
    danger: css`
      &:active {
        background-color: rgb(176, 40, 45);
        box-shadow:
          inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
          inset 0 -0.5px 0.5px rgb(176, 40, 45);
      }
    `,
  },
  focusVisible: {
    default: css`
      &:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 2px #666666;
        transition: box-shadow 0.2s ease-in-out;
        border-radius: inherit;
        z-index: 40;
      }
    `,
    primary: css`
      &:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 2px #1e5bb5;
        transition: box-shadow 0.2s ease-in-out;
        border-radius: inherit;
        z-index: 40;
      }
    `,
    danger: css`
      &:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 2px #8a1620;
        transition: box-shadow 0.2s ease-in-out;
        border-radius: inherit;
        z-index: 40;
      }
    `,
  },
};

const VARIANT_ACTIVE = {
  background: {
    default: css`
      background-color: #e8e8e8;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-shadow:
          inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
          inset 0 -0.5px 0.5px #e8e8e8;
        border-radius: inherit;
        pointer-events: none;
      }
    `,
    primary: css`
      background-color: rgb(54, 132, 222);
      position: relative;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-shadow:
          inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
          inset 0 -0.5px 0.5px rgb(54, 132, 222);
        border-radius: inherit;
        pointer-events: none;
      }
    `,
    danger: css`
      background-color: rgb(176, 40, 45);
      position: relative;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-shadow:
          inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
          inset 0 -0.5px 0.5px rgb(176, 40, 45);
        border-radius: inherit;
        pointer-events: none;
      }
    `,
  },
  border: {
    default: css`
      border-color: #ececec;
    `,
    primary: css`
      border-color: #5286c9;
    `,
    danger: css`
      border-color: #c00000;
    `,
  },
};

function Toolbar({ children, style, big }: ToolbarProps) {
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
              iconSize: 33,
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
    <ToolbarWrapper ref={toolbarRef} $style={style}>
      {childrenWithProps}
    </ToolbarWrapper>
  );
}

function ToolbarMenu({
  caption,
  icon: Icon,
  openedIcon: OpenedIcon = RiArrowDownSLine,
  closedIcon: ClosedIcon = RiArrowUpSLine,
  iconColor = "gray",
  subMenuList,
  isOpen,
  setIsOpen,
  onClick,
  styles,
  iconSize = 20,
  variant = "default",
}: ToolbarMenuProps) {
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

  const menuBase = VARIANT_CLASS_MAP.base[variant];
  const menuHover = VARIANT_CLASS_MAP.hover[variant];
  const menuActive = VARIANT_CLASS_MAP.active[variant];
  const menuFocusVisible = VARIANT_CLASS_MAP.focusVisible[variant];
  const menuBorderActive = VARIANT_ACTIVE.border[variant];
  const menuBackgroundActive = VARIANT_ACTIVE.background[variant];

  return (
    <ToolbarContainer
      aria-label="toolbar-menu"
      ref={containerRef}
      $style={styles?.containerStyle}
    >
      <MenuWrapper
        ref={refs.setReference}
        $style={css`
          ${menuBase};
          ${variant !== "default" ? "color: white;" : "color: #4b5563"};
          ${isOpen && menuBorderActive};
        `}
      >
        {(Icon || caption) && (
          <>
            <TriggerButton
              type="button"
              aria-label={`toolbar-menu-button`}
              onMouseEnter={() => setHovered("main")}
              onMouseLeave={() => setHovered("original")}
              onClick={handleMainClick}
              $style={css`
                ${hovered === "main" && menuHover};
                ${isOpen && menuBorderActive};
                ${menuFocusVisible};
                ${menuActive};
                ${styles?.triggerStyle}
              `}
            >
              {Icon && (
                <Icon
                  aria-label="toolbar-icon"
                  size={iconSize}
                  style={{ color: COLOR_STYLE_MAP[iconColor] }}
                />
              )}
              {caption && <Caption $hasIcon={!!Icon}>{caption}</Caption>}
            </TriggerButton>
            {subMenuList && caption && (
              <Divider
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
              ${hovered === "dropdown" && menuHover};
              ${isOpen && menuBackgroundActive};
              ${isOpen && menuBorderActive};
              ${menuActive};
              ${menuFocusVisible};
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
            style={styles?.dropdownStyle}
            subMenuList={subMenuList}
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

const ToolbarContainer = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  margin-right: 0.25rem;
  position: relative;
  ${(props) => props.$style}
`;

const MenuWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid transparent;
  position: relative;
  user-select: none;
  overflow: hidden;
  cursor: pointer;
  border-radius: 0.3rem;
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
  animation-duration: 200ms;
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

const Divider = styled.span<{ $style?: CSSProp }>`
  position: absolute;
  right: 35px;
  top: 50%;
  transform: translateY(-50%);
  height: 100%;
  width: 1px;
  border-width: 0.5px;
  color: #bdbdbd;
  z-index: 10;
  transition: height 150ms ease-in-out;

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
