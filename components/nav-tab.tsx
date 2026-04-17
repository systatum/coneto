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

export interface NavTabProps {
  tabs?: NavTabTab[];
  activeTab?: string;
  activeColor?: string;
  children?: ReactNode;
  actions?: NavTabAction[];
  styles?: NavTabStyles;
  size?: NavTabSize;
  onChange?: (activeTab: string) => void;
  active?: boolean;
}

export interface NavTabStyles {
  contentStyle?: CSSProp;
  containerStyle?: CSSProp;
  containerBoxStyle?: CSSProp;
  containerActionsStyle?: CSSProp;
  tabStyle?: CSSProp;
  barStyle?: CSSProp;
  underscoreStyle?: CSSProp;
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
  hidden?: boolean;
}

export interface NavTabSubItem {
  id: string;
  caption: string;
  icon?: FigureProps;
  onClick?: () => void;
  content?: ReactNode;
  hidden?: boolean;
  styles?: NavTabSubItemStyles;
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
}: NavTabProps) {
  const { currentTheme } = useTheme();
  const navTheme = currentTheme.navTab;

  const tooltipRefs = useRef<Array<TooltipRef | null>>([]);

  const [selectedLocal, setSelectedLocal] = useState<string>(activeTab);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [isTipMenuOpen, setIsTipMenuOpen] = useState<string | null>(null);

  const tabRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [tabSizes, setTabSizes] = useState<{ width: number; left: number }[]>(
    []
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const isControlled = activeTab !== undefined && onChange;
  const selected = isControlled ? activeTab : selectedLocal;

  const visibleTabs = useMemo(() => tabs.filter((tab) => !tab.hidden), [tabs]);

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
  const filteredTabs = tabs.filter(
    (tab) =>
      tab.id === selected ||
      tab.subItems
        ?.filter((item) => !item?.hidden)
        .some((item) => item.id === selected)
  );

  return (
    <NavTabContainer $style={styles?.containerStyle}>
      <NavTabBar $theme={navTheme} $style={styles?.barStyle}>
        <NavTabTabsSection
          aria-label="nav-tab-tabs-sections"
          $style={styles?.containerBoxStyle}
          ref={containerRef}
          $theme={navTheme}
        >
          <NavTabUnderscore
            aria-label="nav-tab-underscore"
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

          {visibleTabs.map((tab, index) => {
            return (
              <Tooltip
                ref={(el) => {
                  tooltipRefs.current[index] = el;
                }}
                key={tab.id}
                styles={{
                  arrowStyle: css`
                    opacity: 0;
                    background-color: transparent;
                  `,
                  containerStyle: css`
                    width: fit-content;
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
                  `,
                }}
                dialogPlacement="bottom-left"
                dialog={
                  <>
                    {tab.subItems &&
                      tab.subItems
                        ?.filter((item) => !item?.hidden)
                        ?.map((item, idx) => (
                          <NavTabTab
                            key={idx}
                            $theme={navTheme}
                            $style={item?.styles?.self}
                            onClick={() => {
                              if (item.content) {
                                setSelectedLocal(item.id);
                              }
                              if (onChange) {
                                onChange(item.id);
                              }
                              tooltipRefs.current.forEach((ref) => {
                                ref?.close();
                              });
                              if (item.onClick) {
                                item.onClick();
                              }
                            }}
                            $subMenu={true}
                          >
                            {item.icon && <Figure {...item.icon} />}
                            {item.caption}
                          </NavTabTab>
                        ))}
                  </>
                }
              >
                <NavTabTab
                  $theme={navTheme}
                  key={tab.id}
                  $size={size}
                  aria-label="nav-tab-tab"
                  $style={styles?.tabStyle}
                  ref={setTabRef(index)}
                  role="tab"
                  onClick={(e) => {
                    e.stopPropagation();
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
                  $selected={selected === tab.id}
                  $isAction={!!tab.actions}
                >
                  {tab.title}
                  {tab.actions &&
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

        {actions && (
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
                    {...action!}
                    styles={{
                      ...action?.styles,
                      self: css`
                        height: ${size === "sm" && "27px"};
                        border-width: 2px;

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
            ?.filter((item) => !item?.hidden)
            ?.find((subItem) => subItem.id === selected);
          if (selectedSubItem) {
            return <Fragment key={index}>{selectedSubItem.content}</Fragment>;
          }

          return <Fragment key={index}>{tab.content}</Fragment>;
        })}
        {children}
      </NavContent>
    </NavTabContainer>
  );
}

const NavTabContainer = styled.div<{
  $style?: CSSProp;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  position: fixed;
  flex-direction: column;
  font-size: 14px;
  top: 0;

  ${({ $style }) => $style}
`;

const NavTabTabsSection = styled.div<{
  $style?: CSSProp;
  $actions?: boolean;
  $theme: NavTabThemeConfig;
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
    `}

  ${({ $style }) => $style}
`;

const NavTabBar = styled.div<{
  $style?: CSSProp;
  $theme?: NavTabThemeConfig;
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

  ${({ $style }) => $style}
`;

const NavTabUnderscore = styled(motion.div)<{
  $activeColor?: string;
  $theme?: NavTabThemeConfig;
  $style?: CSSProp;
}>`
  position: absolute;
  bottom: 0;
  z-index: 1;
  height: 2px;
  border-radius: 1px;
  pointer-events: none;
  background-color: ${({ $activeColor, $theme }) =>
    $activeColor ?? $theme?.indicatorColor};

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
}>`
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

  ${({ $selected, $theme }) =>
    $selected &&
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

  ${({ $isAction, $isHovered }) =>
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
    `}

  &:hover {
    background-color: ${({ $theme }) => $theme.hoverBackgroundColor};
  }

  &:active:not(:has([aria-label="action-button"]:active)) {
    background-color: ${({ $theme }) => $theme.activeBackgroundColor};
    box-shadow: ${({ $theme }) => $theme.activeInsetShadow};
  }

  ${({ $style }) => $style};
`;

const NavContent = styled.div<{ $contentStyle?: CSSProp }>`
  padding: 16px;
  overflow-y: auto;

  ${({ $contentStyle }) => $contentStyle}
`;

export { NavTab };
