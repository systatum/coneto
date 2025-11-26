import { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import styled, { css, CSSProp } from "styled-components";
import { motion } from "framer-motion";
import { RemixiconComponentType, RiArrowRightSLine } from "@remixicon/react";
import { Button, SubMenuButtonProps } from "./button";
import ContextMenu from "./context-menu";
import { TipMenuItemProps } from "./tip-menu";
import { Tooltip, TooltipRef } from "./tooltip";

export interface NavTabProps {
  tabs?: NavTabContentProps[];
  activeTab?: string;
  contentStyle?: CSSProp;
  containerStyle?: CSSProp;
  containerBoxStyle?: CSSProp;
  containerRowStyle?: CSSProp;
  containerActionsStyle?: CSSProp;
  boxStyle?: CSSProp;
  activeColor?: string;
  children?: ReactNode;
  actions?: NavTabActionsProps[];
}

export interface NavTabActionsProps {
  title?: string;
  icon?: RemixiconComponentType;
  onClick?: () => void;
  style?: CSSProp;
  dividerStyle?: CSSProp;
  dropdownStyle?: CSSProp;
  subMenu?: (props: SubMenuButtonProps) => React.ReactNode;
  disabled?: boolean;
  showSubMenuOn?: "caret" | "self";
}

export interface NavTabContentProps {
  id: string;
  title: string;
  content?: ReactNode;
  onClick?: () => void;
  actions?: SubMenuNavTab[];
  subItems?: NavTabSubItemsContentProps[];
}

export interface NavTabSubItemsContentProps {
  id: string;
  caption: string;
  icon?: RemixiconComponentType;
  iconColor?: string;
  onClick?: () => void;
  content?: ReactNode;
}

export interface SubMenuNavTab extends Omit<TipMenuItemProps, "onClick"> {
  onClick: (id?: string) => void;
}

function NavTab({
  activeTab = "1",
  containerStyle,
  contentStyle,
  boxStyle,
  containerBoxStyle,
  containerRowStyle,
  actions,
  containerActionsStyle,
  tabs = [],
  activeColor = "rgb(59, 130, 246)",
  children,
}: NavTabProps) {
  const tooltipRefs = useRef<Array<TooltipRef | null>>([]);

  const [selected, setSelected] = useState<string>(activeTab);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const tabRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [tabSizes, setTabSizes] = useState<{ width: number; left: number }[]>(
    []
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const getHoverPosition = () => {
    if (!isInitialized || tabSizes.length === 0) {
      return { left: 0, width: 0, opacity: 0 };
    }

    const targetIndex = tabs.findIndex(
      (tab) =>
        tab.id === selected ||
        tab.subItems?.some((item) => item.id === selected)
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
        tabs.length === 0
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
  }, [tabs.length]);

  const setTabRef = (index: number) => (element: HTMLDivElement | null) => {
    tabRefs.current[index] = element;
  };

  const hoverPosition = getHoverPosition();
  const activeContent = tabs.filter(
    (tab) =>
      tab.id === selected || tab.subItems?.some((item) => item.id === selected)
  );

  return (
    <NavTabWrapper $containerStyle={containerStyle}>
      <NavTabRowWrapper $style={containerRowStyle}>
        <NavTabHeader $style={containerBoxStyle} ref={containerRef}>
          <NavTabList
            aria-label="nav-tab-list"
            $activeColor={activeColor}
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

          {tabs.map((props, index) => {
            return (
              <Tooltip
                ref={(el) => {
                  tooltipRefs.current[index] = el;
                }}
                key={props.id}
                arrowStyle={css`
                  opacity: 0;
                  background-color: transparent;
                `}
                drawerStyle={css`
                  border-radius: 0px;
                  padding: 0px;
                  background-color: white;
                  color: black;
                  opacity: 0;

                  ${props.subItems &&
                  css`
                    opacity: 1;
                  `}
                `}
                dialogPlacement="bottom-left"
                dialog={
                  <>
                    {props.subItems &&
                      props.subItems.map((item, idx) => (
                        <NavTabItem
                          key={idx}
                          onClick={() => {
                            if (item.content) {
                              setSelected(item.id);
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
                          {item.icon && (
                            <item.icon size={16} color={item.iconColor} />
                          )}
                          {item.caption}
                        </NavTabItem>
                      ))}
                  </>
                }
              >
                <NavTabItem
                  aria-label="nav-tab-item"
                  key={props.id}
                  $boxStyle={boxStyle}
                  ref={setTabRef(index)}
                  role="tab"
                  onClick={(e) => {
                    setSelected(props.id);
                    if (props.onClick) {
                      props.onClick();
                    }

                    tooltipRefs.current.forEach((ref, i) => {
                      if (i !== index) ref?.close();
                    });
                  }}
                  onMouseEnter={() => setIsHovered(props.id)}
                  onMouseLeave={() => setIsHovered(null)}
                  $isHovered={isHovered === props.id}
                  $selected={selected === props.id}
                  $isAction={!!props.actions}
                >
                  {props.title}
                  {isHovered === props.id &&
                    props.actions &&
                    (() => {
                      const list = props.actions;
                      const actionsWithIcons = list.map((item) => ({
                        ...item,
                        icon: item.icon ?? RiArrowRightSLine,
                        onClick: (e?: React.MouseEvent) => {
                          e?.stopPropagation();
                          item.onClick?.(props.id);
                          if (list.length > 1) {
                            setIsHovered(null);
                          }
                        },
                      }));

                      return (
                        <ContextMenu
                          iconSize={13}
                          focusBackgroundColor="#d4d4d4"
                          hoverBackgroundColor="#d4d4d4"
                          activeBackgroundColor="#d4d4d4"
                          actions={actionsWithIcons}
                          buttonStyle={css`
                            width: 16px;
                            height: 16px;
                            padding: 0;
                          `}
                          containerStyle={css`
                            ${isHovered === props.id
                              ? css`
                                  opacity: 1;
                                `
                              : css`
                                  opacity: 0;
                                `}
                            pointer-events: ${isHovered === props.id
                              ? "auto"
                              : "none"};
                            transition: all 0.3s ease-in-out;
                            width: fit-content;
                            position: absolute;
                            top: 50%;
                            right: 12px;
                            transform: translateY(-50%);
                            z-index: 8;
                          `}
                        />
                      );
                    })()}
                </NavTabItem>
              </Tooltip>
            );
          })}
        </NavTabHeader>

        {actions && (
          <NavTabHeader $actions={!!actions} $style={containerActionsStyle}>
            {actions.map((props, index) => (
              <ActionButton key={index} {...props} />
            ))}
          </NavTabHeader>
        )}
      </NavTabRowWrapper>

      <NavContent $contentStyle={contentStyle}>
        {activeContent.map((props, index) => {
          const selectedItemContent = props.subItems?.find(
            (item) => item.id === selected
          );
          if (selectedItemContent) {
            return <Fragment>{selectedItemContent.content}</Fragment>;
          }

          return <Fragment key={index}>{props.content}</Fragment>;
        })}
        {children}
      </NavContent>
    </NavTabWrapper>
  );
}

const NavTabWrapper = styled.div<{
  $containerStyle?: CSSProp;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  position: fixed;
  flex-direction: column;
  font-size: 14px;
  top: 0;

  ${({ $containerStyle }) => $containerStyle}
`;

const NavTabHeader = styled.div<{
  $style?: CSSProp;
  $actions?: boolean;
}>`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  position: relative;
  background-color: white;

  ${({ $actions }) =>
    $actions &&
    css`
      justify-content: end;
      margin-right: 10px;
    `}

  ${({ $style }) => $style}
`;

const NavTabRowWrapper = styled.div<{
  $style?: CSSProp;
}>`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 4px -3px #5b5b5b;
  align-items: center;

  ${({ $style }) => $style}
`;

const NavTabList = styled(motion.div)<{
  $activeColor?: string;
}>`
  position: absolute;
  bottom: 0;
  z-index: 1;
  height: 2px;
  border-radius: 1px;
  pointer-events: none;
  background-color: ${({ $activeColor }) => $activeColor};
`;

const NavTabItem = styled.div<{
  $selected?: boolean;
  $boxStyle?: CSSProp;
  $isHovered?: boolean;
  $isAction?: boolean;
  $subMenu?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 12px;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  transition: color 0.2s ease;
  white-space: nowrap;
  gap: 8px;
  width: fit-content;
  justify-content: center;
  user-select: none;

  ${({ $selected }) =>
    $selected &&
    css`
      background-color: rgb(243 244 246 / 50%);
    `}

  ${({ $subMenu }) =>
    $subMenu &&
    css`
      justify-content: flex-start;
      min-width: 120px;
      border: 1px solid #f3f3f3;
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
    background-color: rgb(243 244 246 / 50%);
  }

  &:active:not(:has([aria-label="list-action-button"]:active)) {
    background-color: rgb(243 244 246 / 80%);
    box-shadow:
      inset 0 0.5px 4px rgb(243 244 246 / 100%),
      inset 0 -0.5px 0.5px rgb(243 244 246 / 80%);
  }

  ${({ $boxStyle }) => $boxStyle};
`;

const NavContent = styled.div<{ $contentStyle?: CSSProp }>`
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 60px);

  ${({ $contentStyle }) => $contentStyle}
`;

function ActionButton(props: NavTabActionsProps) {
  return (
    <Button
      onClick={props.onClick}
      subMenu={props.subMenu}
      disabled={props.disabled}
      showSubMenuOn={props.showSubMenuOn}
      size="sm"
      tipMenuSize="sm"
      buttonStyle={css`
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
        align-items: center;
        cursor: pointer;
        background-color: transparent;
        color: #565555;
        ${props.subMenu && props.showSubMenuOn === "caret"
          ? css`
              border-top: 1px solid #f3f3f3;
              border-left: 1px solid #f3f3f3;
              border-bottom: 1px solid #f3f3f3;
            `
          : css`
              border: 1px solid #f3f3f3;
            `}
        border-radius: 6px;
        position: relative;

        &:hover {
          background-color: rgb(245, 245, 245);
        }

        &:disabled {
          background-color: rgb(227 227 227);
          opacity: 0.5;
          cursor: not-allowed;
        }
        ${props.style}
      `}
      toggleStyle={
        props.subMenu &&
        css`
          display: flex;
          flex-direction: row;
          gap: 0.25rem;
          align-items: center;
          cursor: pointer;
          color: #565555;
          padding: 0.25rem 0.5rem;
          background-color: transparent;
          position: relative;
          border-top: 1px solid #f3f3f3;
          border-right: 1px solid #f3f3f3;
          border-bottom: 1px solid #f3f3f3;
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;

          &:hover {
            background-color: rgb(245, 245, 245);
          }

          &:disabled {
            background-color: rgb(227 227 227);
            opacity: 0.5;
            cursor: not-allowed;
          }
          ${props.style}
        `
      }
      dividerStyle={css`
        border: 1px solid rgb(236 236 236);
        ${props.subMenu && props.dividerStyle ? props.dividerStyle : null}
      `}
      dropdownStyle={css`
        position: absolute;
        margin-top: 2px;
        z-index: 9999;
        width: 170px;
        ${props.subMenu && props.dropdownStyle ? props.dropdownStyle : null}
      `}
    >
      {props.icon && <props.icon size={14} />}
      <span
        style={{
          fontSize: "14px",
        }}
      >
        {props.title}
      </span>
    </Button>
  );
}

export { NavTab };
