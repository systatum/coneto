import React, {
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import { motion } from "framer-motion";
import { RiArrowRightSLine } from "@remixicon/react";
import ContextMenu from "./context-menu";
import { TipMenuItemProps } from "./tip-menu";
import { Tooltip, TooltipRef } from "./tooltip";
import { ActionButton, ActionButtonProps } from "./action-button";
import { Figure, FigureProps } from "./figure";
import { useTheme } from "../theme/provider";
import { NavTabThemeConfig } from "./../theme";
import { applyClassName } from "./../constants/classname";

export interface NavTabProps {
  tabs?: NavTabTab[];
  activeTab?: string;
  activeColor?: string;
  children?: ReactNode;
  actions?: NavTabAction[];
  styles?: NavTabStyles;
  size?: NavTabSize;
  onChange?: (activeTab: string) => void;
  underlineable?: boolean;
  mobile?: boolean;
  className?: string;
  id?: string;
}

export interface NavTabStyles {
  contentStyle?: CSSProp;
  containerStyle?: CSSProp;
  containerBoxStyle?: CSSProp;
  containerActionsStyle?: CSSProp;
  tabStyle?: CSSProp;
  barStyle?: CSSProp;
  underscoreStyle?: CSSProp;
  iconStyle?: CSSProp;
  badgeStyle?: CSSProp;
  labelStyle?: CSSProp;
}

export interface NavTabAction extends ActionButtonProps {
  active?: boolean;
}

export const NavTabSize = {
  Small: "sm",
  Medium: "md",
};

export type NavTabSize = (typeof NavTabSize)[keyof typeof NavTabSize];

export interface NavTabTab {
  id: string;
  title: string;
  content?: ReactNode;
  onClick?: () => void;
  actions?: NavTabTabAction[];
  subItems?: NavTabSubItem[];
  icon?: NavTabTabBadge;
  hidden?: boolean;
  className?: string;
  withCircle?: boolean;
}

interface NavTabTabBadge extends FigureProps {}

export interface NavTabSubItem {
  id: string;
  caption: string;
  icon?: FigureProps;
  onClick?: () => void;
  content?: ReactNode;
  hidden?: boolean;
  styles?: NavTabSubItemStyles;
  className?: string;
}

export interface NavTabSubItemStyles {
  self?: CSSProp;
}
export interface NavTabTabAction extends Omit<TipMenuItemProps, "onClick"> {
  onClick: (id?: string) => void;
}

function NavTab({
  activeTab,
  styles,
  actions,
  tabs = [],
  activeColor,
  children,
  size = "md",
  onChange,
  className,
  underlineable = true,
  mobile,
  id,
}: NavTabProps) {
  const { currentTheme } = useTheme();
  const navTheme = currentTheme.navTab;

  const tooltipRefs = useRef<Array<TooltipRef | null>>([]);

  const [selectedLocal, setSelectedLocal] = useState<string>(activeTab);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [isTipMenuOpen, setIsTipMenuOpen] = useState<string | null>(null);

  const [openSubMenuId, setOpenSubMenuId] = useState<string | null>(null);
  const subMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggeredRef = useRef<boolean>(null);

  const clearSubMenuTimer = () => {
    if (subMenuTimeoutRef.current) {
      clearTimeout(subMenuTimeoutRef.current);
      subMenuTimeoutRef.current = null;
    }
  };

  const tabRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [tabSizes, setTabSizes] = useState<{ width: number; left: number }[]>(
    []
  );

  // mobile appearance
  const [maxTabWidth, setMaxTabWidth] = useState<number>(0);

  useEffect(() => {
    if (!mobile || !tabRefs.current.length) return;

    const calculateMaxWidth = () => {
      if (!mobile || !tabRefs.current.length) return;

      const widths: number[] = tabRefs.current.map(
        (el) => el?.getBoundingClientRect().width ?? 0
      );

      const largest: number = widths.length ? Math.max(...widths) : 0;

      setMaxTabWidth((prev) => (prev !== largest ? largest : prev));
    };

    calculateMaxWidth();
  }, [tabs, mobile]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const isControlled = activeTab !== undefined && onChange;
  const selected = isControlled ? activeTab : selectedLocal;

  const mobileActions: NavTabTab[] =
    actions?.map((action) => ({
      id: action?.id,
      title: action?.caption,
      badge: action?.icon,
      className: action?.className,
      onClick: action?.onClick,
      hidden: action?.hidden,
    })) ?? [];

  const visibleTabs = useMemo(
    () =>
      (mobile ? [...tabs, ...mobileActions] : tabs)?.filter(
        (tab) => !tab.hidden
      ),
    [tabs, mobileActions]
  );

  const getHoverPosition = () => {
    if (!isInitialized || tabSizes.length === 0) {
      return { left: 0, width: 0, opacity: 0 };
    }

    const targetIndex = visibleTabs.findIndex(
      (tab) =>
        tab.id === selected ||
        tab.subItems
          ?.filter((tab) => !tab?.hidden)
          ?.some((item) => item.id === selected)
    );

    if (targetIndex === -1 || !tabSizes[targetIndex]) {
      return { left: 0, width: 0, opacity: 0 };
    }

    const targetTab = visibleTabs[targetIndex];

    // Hide the underline instead of
    // moving it there — keep the position so it fades out in place rather
    // than sliding to (0,0) first.
    if (mobile && targetTab.withCircle) {
      return {
        left: tabSizes[targetIndex].left,
        width: tabSizes[targetIndex].width,
        opacity: 0,
      };
    }

    return {
      left: tabSizes[targetIndex].left,
      width: tabSizes[targetIndex].width,
      opacity: 1,
    };
  };

  useEffect(() => {
    const calculateTabSizes = () => {
      if (
        !tabRefs.current.length ||
        !containerRef.current ||
        visibleTabs.length === 0
      ) {
        return;
      }

      const parentRect = containerRef.current.getBoundingClientRect();
      const sizes = tabRefs.current.map((tabRef) => {
        if (!tabRef) return { width: 0, left: 0 };

        const rect = tabRef.getBoundingClientRect();
        return {
          width: rect.width,
          left: rect.left - parentRect.left,
        };
      });

      setTabSizes(sizes);
      setIsInitialized(true);
    };

    calculateTabSizes();

    const timeoutId = setTimeout(calculateTabSizes, 50);

    window.addEventListener("resize", calculateTabSizes);
    return () => {
      window.removeEventListener("resize", calculateTabSizes);
      clearTimeout(timeoutId);
    };
  }, [visibleTabs.length]);

  const setTabRef = (index: number) => (element: HTMLDivElement | null) => {
    tabRefs.current[index] = element;
  };

  const hoverPosition = getHoverPosition();
  const filteredTabs = tabs?.filter(
    (tab) =>
      tab.id === selected ||
      tab.subItems
        ?.filter((item) => !item?.hidden)
        .some((item) => item.id === selected)
  );

  // apply the hasCircleTab spacing to all tab drawers when any tab uses withCircle.
  const hasCircleTab = visibleTabs.some((tab) => tab.withCircle);

  return (
    <NavTabContainer
      id={id}
      className={applyClassName("nav-tab", className)}
      $style={styles?.containerStyle}
      $theme={navTheme}
      $mobile={mobile}
    >
      <NavTabBar
        aria-label="nav-tab-bar"
        $mobile={mobile}
        $theme={navTheme}
        $style={styles?.barStyle}
      >
        <NavTabTabsSection
          aria-label="nav-tab-tabs-sections"
          $style={styles?.containerBoxStyle}
          $mobile={mobile}
          ref={containerRef}
          $theme={navTheme}
        >
          {underlineable && (
            <NavTabUnderscore
              aria-label="nav-tab-underscore"
              $mobile={mobile}
              $activeColor={activeColor}
              $theme={navTheme}
              $style={styles?.underscoreStyle}
              initial={{
                left: 0,
                width: 0,
                opacity: 0,
              }}
              animate={{
                left: hoverPosition.left,
                width: hoverPosition.width,
                opacity: hoverPosition.opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
            />
          )}

          {visibleTabs.map((tab, index) => {
            return (
              <Tooltip
                open={mobile ? openSubMenuId === tab.id : undefined}
                ref={(el) => {
                  tooltipRefs.current[index] = el;
                }}
                onVisibilityChange={(next) => {
                  if (!next) {
                    setOpenSubMenuId((prev) => (prev === tab.id ? null : prev));
                  }
                }}
                anchorRef={mobile ? containerRef : null}
                id={tab.id}
                className={applyClassName("nav-tab-tab", tab?.className)}
                key={index}
                hideDialogOn={mobile ? "click" : "hover"}
                showDialogOn={mobile ? "click" : "hover"}
                styles={{
                  arrowStyle: css`
                    opacity: 0;
                    background-color: transparent;
                  `,
                  containerStyle: css`
                    width: fit-content;
                    ${mobile &&
                    css`
                      width: 100%;
                    `};
                    ${styles?.tabStyle}
                  `,
                  triggerStyle: css`
                    ${mobile &&
                    css`
                      width: 100%;
                    `};

                    ${styles?.tabStyle}
                  `,
                  drawerStyle: (placement) => css`
                    border-radius: 0px;
                    padding: 0px;
                    background-color: ${navTheme?.backgroundColor};
                    color: ${navTheme?.textColor};
                    opacity: 0;

                    ${placement?.startsWith("bottom")
                      ? css`
                          top: -4px;
                        `
                      : placement?.startsWith("top")
                        ? css`
                            bottom: -4px;
                          `
                        : null}

                    ${tab.subItems &&
                    css`
                      opacity: 1;
                    `}

                    ${mobile &&
                    css`
                      width: 99dvw;
                      left: 50%;
                      transform: translateX(-50%);
                      ${hasCircleTab &&
                      css`
                        bottom: 12px;
                      `};
                    `};
                  `,
                }}
                dialogPlacement={mobile ? "top-center" : "bottom-left"}
                dialog={
                  <>
                    {tab.subItems &&
                      tab.subItems
                        ?.filter((subItem) => !subItem?.hidden)
                        ?.map((subItem, idx) => {
                          return (
                            <NavTabTab
                              key={idx}
                              id={subItem?.id}
                              className={applyClassName(
                                "nav-tab-sub-item",
                                subItem?.className
                              )}
                              $mobile={mobile}
                              $theme={navTheme}
                              $style={css`
                                ${mobile &&
                                css`
                                  height: 80px;
                                  font-size: 16px;
                                `}

                                ${subItem?.styles?.self}
                              `}
                              onClick={() => {
                                if (subItem.content) {
                                  setSelectedLocal(subItem.id);
                                }
                                if (onChange && subItem.content) {
                                  onChange(subItem.id);
                                }
                                tooltipRefs.current.forEach((ref) => {
                                  ref?.close();
                                });

                                if (mobile) {
                                  setOpenSubMenuId(null);
                                }
                                if (subItem.onClick) {
                                  subItem.onClick();
                                }
                              }}
                              $subMenu={true}
                            >
                              {subItem.icon && <Figure {...subItem.icon} />}
                              {subItem.caption}
                            </NavTabTab>
                          );
                        })}
                  </>
                }
              >
                <NavTabTab
                  $theme={navTheme}
                  key={index}
                  $size={size}
                  aria-label="nav-tab-tab"
                  $style={styles?.tabStyle}
                  ref={setTabRef(index)}
                  role="tab"
                  onPointerDown={() => {
                    if (!tab.subItems) return;
                    longPressTriggeredRef.current = false;
                    subMenuTimeoutRef.current = setTimeout(() => {
                      longPressTriggeredRef.current = true;
                      setOpenSubMenuId(tab.id);
                    }, 400);
                  }}
                  onPointerUp={clearSubMenuTimer}
                  onPointerLeave={clearSubMenuTimer}
                  onPointerCancel={clearSubMenuTimer}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (longPressTriggeredRef.current) {
                      longPressTriggeredRef.current = false;
                      return;
                    }

                    setOpenSubMenuId(null);
                    setSelectedLocal(tab.id);
                    if (tab.onClick) {
                      tab.onClick();
                    }

                    if (onChange) {
                      onChange(tab.id);
                    }

                    tooltipRefs.current.forEach((ref, i) => {
                      if (i !== index) ref?.close();
                    });
                  }}
                  onMouseEnter={() => setIsHovered(tab.id)}
                  onMouseLeave={() => setIsHovered(null)}
                  $isHovered={isHovered === tab.id || isTipMenuOpen === tab.id}
                  $selected={selected === tab.id || openSubMenuId === tab.id}
                  $isAction={!!tab.actions}
                  $mobile={mobile}
                  $width={mobile ? maxTabWidth : undefined}
                  $tabsLength={visibleTabs?.length}
                  $withCircle={tab?.withCircle}
                >
                  {tab.icon &&
                    (() => {
                      const finalIcon: FigureProps = {
                        ...tab?.icon,
                        size: mobile ? (tab.icon.size ?? 24) : tab.icon.size,
                        styles: {
                          ...tab?.icon?.styles,
                          notificationBadgeStyle: css`
                            ${styles?.badgeStyle};
                            ${tab?.icon?.styles?.notificationBadgeStyle};
                          `,
                          self: css`
                            ${tab?.withCircle &&
                            css`
                              transform: translateY(10%);
                            `};
                            ${styles?.iconStyle};
                            ${tab?.icon?.styles?.self};
                          `,
                        },
                      };

                      if (mobile && tab.withCircle) {
                        return (
                          <CircleBadge
                            aria-label="nav-tab-circle"
                            $pressed={selected === tab.id}
                            $activeColor={activeColor}
                            $theme={navTheme}
                          >
                            <Figure {...finalIcon} />
                            <NavTabLabel
                              $style={css`
                                ${tab?.withCircle &&
                                css`
                                  transform: translateY(10%);
                                `};
                                ${styles?.labelStyle}
                              `}
                            >
                              {tab.title}
                            </NavTabLabel>
                          </CircleBadge>
                        );
                      }

                      return <Figure {...finalIcon} />;
                    })()}

                  {!(mobile && tab.withCircle) && (
                    <NavTabLabel $style={styles?.labelStyle}>
                      {tab.title}
                    </NavTabLabel>
                  )}

                  {!mobile &&
                    tab.actions &&
                    (() => {
                      const listActions = tab.actions;
                      const actionsWithIcons = listActions
                        ?.filter((action) => !action?.hidden)
                        ?.map((action) => ({
                          ...action,
                          icon: {
                            ...action?.icon,
                            image: action.icon?.image ?? RiArrowRightSLine,
                          },
                          onClick: (e?: React.MouseEvent) => {
                            e?.stopPropagation();
                            action.onClick?.(tab.id);
                            if (listActions.length > 1) {
                              setIsHovered(null);
                            }
                          },
                        }));

                      return (
                        <ContextMenu
                          iconSize={13}
                          actions={actionsWithIcons}
                          styles={{
                            self: css`
                              width: 16px;
                              height: 16px;
                              padding: 0;
                            `,
                            containerStyle: css`
                              opacity: 0;

                              ${(isHovered === tab.id ||
                                isTipMenuOpen === tab.id) &&
                              css`
                                opacity: 1;
                              `};

                              pointer-events: ${isHovered === tab.id ||
                              isTipMenuOpen === tab.id
                                ? "auto"
                                : "none"};
                              transition: all 0.3s ease-in-out;
                              width: fit-content;
                              position: absolute;
                              top: 50%;
                              right: 12px;
                              transform: translateY(-50%);
                              z-index: 8;
                            `,
                          }}
                          onOpen={(prop: boolean) => {
                            if (prop) {
                              setIsTipMenuOpen(tab.id);
                            } else {
                              setIsTipMenuOpen(null);
                            }
                          }}
                          open={isTipMenuOpen === tab.id}
                        />
                      );
                    })()}
                </NavTabTab>
              </Tooltip>
            );
          })}
        </NavTabTabsSection>

        {actions && !mobile && (
          <NavTabTabsSection
            aria-label="nav-tab-actions-wrapper"
            $actions={!!actions}
            $theme={navTheme}
            $style={css`
              gap: 6px;

              ${styles?.containerActionsStyle}
            `}
          >
            {actions
              .filter((action) => !action?.hidden)
              .map((action, index) => {
                return (
                  <ActionButton
                    key={index}
                    {...action}
                    styles={{
                      ...action?.styles,
                      self: css`
                        height: ${size === "sm" && "27px"};
                        border-bottom-width: 2px;

                        ${action.active &&
                        css`
                          border-bottom: 2px solid ${navTheme?.indicatorColor};
                        `}
                        ${action?.styles?.self}
                      `,
                    }}
                  />
                );
              })}
          </NavTabTabsSection>
        )}
      </NavTabBar>

      <NavContent $contentStyle={styles?.contentStyle}>
        {filteredTabs.map((tab, index) => {
          const selectedSubItem = tab.subItems
            ?.filter((subItem) => !subItem?.hidden)
            ?.find((subItem) => subItem.id === selected);
          if (selectedSubItem) {
            return <Fragment key={index}>{selectedSubItem.content}</Fragment>;
          }

          return <Fragment key={index}>{tab.content}</Fragment>;
        })}
        {children}
      </NavContent>
      {mobile && <NavTabSpacer />}
    </NavTabContainer>
  );
}

const NavTabContainer = styled.div<{
  $style?: CSSProp;
  $theme: NavTabThemeConfig;
  $mobile?: boolean;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  color: ${({ $theme }) => $theme.textColor};
  width: 100%;
  height: 100%;
  display: flex;
  position: fixed;
  flex-direction: column;
  font-size: 14px;
  top: 0;

  ${({ $style }) => $style}
`;

const NavTabLabel = styled.span<{ $style?: CSSProp }>`
  ${({ $style }) => $style}
`;

const NavTabTabsSection = styled.div<{
  $style?: CSSProp;
  $actions?: boolean;
  $theme: NavTabThemeConfig;
  $mobile?: boolean;
}>`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  position: relative;
  background-color: ${({ $theme }) => $theme.backgroundColor};

  ${({ $actions }) =>
    $actions &&
    css`
      justify-content: end;
      margin-right: 10px;
    `};

  ${({ $mobile }) =>
    $mobile &&
    css`
      justify-content: space-between;
      align-items: end;
    `};

  ${({ $style }) => $style}
`;

const NavTabSpacer = styled.div<{
  $height?: string;
}>`
  display: flex;
  background-color: transparent;
  width: 100%;

  @media (min-width: 768px) {
    display: block;
    min-width: ${({ $height }) => ($height ? `${$height}` : "48px")};
  }
`;

const NavTabBar = styled.div<{
  $style?: CSSProp;
  $theme?: NavTabThemeConfig;
  $mobile?: boolean;
}>`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  align-items: center;

  background-color: ${({ $theme }) => $theme.backgroundColor};
  border-bottom: 1px solid ${({ $theme }) => $theme.borderColor};
  box-shadow: ${({ $theme }) => $theme.boxShadow};

  ${({ $mobile }) =>
    $mobile &&
    css`
      position: fixed;
      bottom: 0;
      z-index: 20;
    `}

  ${({ $style }) => $style}
`;

const NavTabUnderscore = styled(motion.div)<{
  $activeColor?: string;
  $theme?: NavTabThemeConfig;
  $style?: CSSProp;
  $mobile?: boolean;
}>`
  position: absolute;
  z-index: 1;
  height: 2px;
  border-radius: 1px;
  pointer-events: none;
  background-color: ${({ $activeColor, $theme }) =>
    $activeColor ?? $theme?.indicatorColor};
  ${({ $mobile }) =>
    $mobile
      ? css`
          top: 0;
        `
      : css`
          bottom: 0;
        `}

  ${({ $style }) => $style}
`;

const NavTabTab = styled.div<{
  $selected?: boolean;
  $style?: CSSProp;
  $isHovered?: boolean;
  $isAction?: boolean;
  $subMenu?: boolean;
  $size?: NavTabSize;
  $theme?: NavTabThemeConfig;
  $mobile?: boolean;
  $width?: number;
  $tabsLength?: number;
  $withCircle?: boolean;
}>`
  color: ${({ $theme }) => $theme.textColor};
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  transition: color 0.2s ease;
  white-space: nowrap;
  gap: 8px;
  width: fit-content;
  justify-content: center;
  user-select: none;
  padding: ${({ $size }) => ($size === "md" ? "12px 12px" : "7px 12px")};

  ${({ $selected, $theme, $withCircle }) =>
    $selected &&
    !$withCircle &&
    css`
      background-color: ${$theme?.selectedBackgroundColor};
    `}

  ${({ $subMenu, $theme }) =>
    $subMenu &&
    css`
      justify-content: flex-start;
      width: 100%;
      min-width: 150px;
      border: 1px solid ${$theme?.borderColor};
      background-color: 1px solid ${$theme?.hoverBackgroundColor};
      color: 1px solid ${$theme?.textColor};
      padding-right: 40px;
    `}

  ${({ $isAction, $isHovered, $mobile }) =>
    !$mobile &&
    $isAction &&
    css`
      &::before,
      &::after {
        display: inline-block;
        flex-shrink: 0;
        content: "";
        height: 16px;
        transition: width 0.3s ease-in-out;
      }

      ${$isHovered
        ? css`
            &::before {
              width: 0px;
            }
            &::after {
              width: 16px;
            }
          `
        : css`
            &::before {
              width: 8px;
            }
            &::after {
              width: 8px;
            }
          `}
    `};

  ${({ $theme, $withCircle, $mobile }) => css`
    ${!$mobile &&
    css`
      &:hover {
        background-color: ${$theme.hoverBackgroundColor};
      }
    `}

    ${!$withCircle &&
    css`
      &:active:not(:has([aria-label="action-button"]:active)) {
        background-color: ${$theme.activeBackgroundColor};
        box-shadow: ${$theme.activeInsetShadow};
      }
    `}
  `}

  ${({ $mobile, $subMenu }) =>
    $mobile &&
    !$subMenu &&
    css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-top: 10px;
      padding-bottom: 16px;
      font-size: 12px;
    `};

  ${({ $mobile, $width, $tabsLength }) =>
    getTabWidth({
      mobile: $mobile,
      tabsLength: $tabsLength,
      width: $width,
    })};

  ${({ $withCircle }) =>
    $withCircle &&
    css`
      min-width: 85px;
    `}

  ${({ $style }) => $style};
`;

const getTabWidth = ({
  mobile,
  tabsLength,
  width,
}: {
  mobile: boolean;
  tabsLength: number;
  width?: number;
}) => {
  if (mobile && tabsLength >= 4) {
    return css`
      width: 100%;
    `;
  }

  if (mobile && width) {
    return css`
      width: ${width}px;
    `;
  }

  return "";
};

const CircleBadge = styled.span<{
  $theme?: NavTabThemeConfig;
  $activeColor?: string;
  $pressed?: boolean;
}>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  bottom: 4px;
  border-radius: 9999px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background-color: ${({ $theme, $activeColor }) =>
    $activeColor ?? $theme?.circleInactiveColor};

  &:active {
    background-color: ${({ $theme }) => $theme?.indicatorColor};
  }

  ${({ $pressed, $theme }) =>
    $pressed &&
    css`
      background-color: ${$theme?.indicatorColor};
    `};

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  color: white;

  @media (min-width: 450px) {
    width: 85px;
    height: 85px;
    bottom: 4px;
  }
`;

const NavContent = styled.div<{ $contentStyle?: CSSProp }>`
  padding: 16px;
  overflow-y: auto;

  ${({ $contentStyle }) => $contentStyle}
`;

export { NavTab };
