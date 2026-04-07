import { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styled, { css, CSSProp } from "styled-components";
import { StatefulForm } from "./stateful-form";
import { Figure, FigureProps } from "./figure";
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";
import { CapsuleThemeConfiguration } from "./../theme";
import { useTheme } from "./../theme/provider";

export interface CapsuleContentProps {
  id: string;
  title?: string;
  content?: ReactNode;
  icon?: FigureProps;
}

interface BaseCapsuleProps {
  tabs: CapsuleContentProps[];
  activeTab?: string | null;
  onTabChange?: (id: string) => void;
  full?: boolean;
  activeBackgroundColor?: string;
  activeColor?: string;
  styles?: BaseCapsuleStylesProps;
  id?: string;
  name?: string;
  fontSize?: number;
  disabled?: boolean;
}

interface BaseCapsuleStylesProps {
  capsuleWrapperStyle?: CSSProp;
  tabStyle?: CSSProp;
}

function BaseCapsule({
  tabs,
  activeTab,
  onTabChange,
  full,
  activeBackgroundColor,
  activeColor,
  styles,
  id,
  fontSize = 12,
  disabled,
}: BaseCapsuleProps) {
  const { currentTheme } = useTheme();
  const capsuleTheme = currentTheme.capsule;

  const [hovered, setHovered] = useState<string | null>(null);

  const activeId = hovered || activeTab;
  const activeIndex = tabs.findIndex((item) => item.id === activeTab);
  const hoverIndex = tabs.findIndex((item) => item.id === activeId);

  const tabRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [tabSizes, setTabSizes] = useState<{ width: number; left: number }[]>(
    []
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length);

    while (tabRefs.current.length < tabs.length) {
      tabRefs.current.push(null);
    }
  }, [tabs]);

  useEffect(() => {
    if (!activeTab && tabs.length > 0) {
      onTabChange(tabs[0].id);
    }
  }, [activeTab, tabs, onTabChange]);

  useEffect(() => {
    const calculateTabSizes = () => {
      if (
        !tabRefs.current.length ||
        !tabRefs.current[0] ||
        !containerRef.current
      )
        return;

      const parentRect = containerRef.current.getBoundingClientRect();

      const sizes = tabRefs.current.map((tabRef) => {
        if (!tabRef) return { width: 0, left: 0 };

        const rect = tabRef.getBoundingClientRect();
        const tabWidth = rect.width;
        const bgWidth = tabWidth - 4;
        const leftOffset = (tabWidth - bgWidth) / 4;

        return {
          width: bgWidth,
          left: rect.left - parentRect.left + leftOffset,
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

  const getInitialPosition = () => {
    if (!isInitialized && tabs.length > 0) {
      if (activeIndex === 0) {
        return { left: 0, width: 60 };
      }
    }

    if (isInitialized && activeIndex !== -1 && tabSizes[activeIndex]) {
      return {
        left: tabSizes[activeIndex].left,
        width: tabSizes[activeIndex].width,
      };
    }

    return { left: 0, width: 60 };
  };

  const getHoverPosition = () => {
    if (!isInitialized && tabs.length > 0) {
      if (hoverIndex === 0) {
        return { left: 0, width: 60 };
      }
    }

    if (isInitialized && hoverIndex !== -1 && tabSizes[hoverIndex]) {
      return {
        left: tabSizes[hoverIndex].left,
        width: tabSizes[hoverIndex].width,
      };
    }

    return { left: 0, width: 60 };
  };

  const hoverPosition = getHoverPosition();
  const initialPosition = getInitialPosition();

  return (
    <CapsuleWrapper
      id={id}
      $theme={capsuleTheme}
      $disabled={disabled}
      aria-label="capsule"
      $containerStyle={styles?.capsuleWrapperStyle}
      $full={full}
      ref={containerRef}
      role="tablist"
    >
      <ActiveBackground
        aria-label="active-capsule-box"
        $style={styles?.tabStyle}
        $theme={capsuleTheme}
        $activeBackgroundColor={activeBackgroundColor}
        initial={{
          left: initialPosition.left,
          width: initialPosition.width,
        }}
        animate={{
          left: initialPosition.left,
          width: initialPosition.width,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 30,
        }}
      />

      <HoverBorder
        aria-label="hover-capsule-box"
        $style={styles?.tabStyle}
        $theme={capsuleTheme}
        $activeBackgroundColor={activeBackgroundColor}
        initial={{
          left: hoverPosition.left,
          width: hoverPosition.width,
        }}
        animate={{
          left: hoverPosition.left,
          width: hoverPosition.width,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 30,
        }}
      />

      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;

        return (
          <Tab
            $theme={capsuleTheme}
            $isActive={isActive}
            $activeColor={activeColor}
            $disabled={disabled}
            role="tab"
            key={index}
            ref={setTabRef(index)}
            $activeTabStyle={styles?.tabStyle}
            onMouseEnter={() => !disabled && setHovered(tab.id)}
            onMouseLeave={() => !disabled && setHovered(null)}
            onClick={() => !disabled && onTabChange(tab.id)}
            $fontSize={fontSize}
          >
            {tab.icon && (
              <Figure
                aria-label="capsule-icon"
                {...tab.icon}
                size={tab.icon?.size ?? 14}
              />
            )}
            {tab.title && tab.title}
          </Tab>
        );
      })}
    </CapsuleWrapper>
  );
}

export type CapsuleStylesProps = BaseCapsuleStylesProps & FieldLaneStylesProps;

export interface CapsuleProps
  extends Omit<BaseCapsuleProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns"> {
  styles?: CapsuleStylesProps;
}

function Capsule({
  label,
  showError,
  styles,
  errorMessage,
  actions,
  helper,
  disabled,
  name,
  id,
  labelPosition,
  labelGap,
  labelWidth,
  ...rest
}: CapsuleProps) {
  const inputId = StatefulForm.sanitizeId({
    prefix: "capsule",
    name,
    id,
  });

  return (
    <FieldLane
      id={inputId}
      showError={showError}
      errorMessage={errorMessage}
      labelPosition={labelPosition}
      labelWidth={labelWidth}
      labelGap={labelGap}
      label={label}
      actions={actions}
      helper={helper}
      disabled={disabled}
      required={rest.required}
      styles={{
        bodyStyle: styles?.bodyStyle,
        controlStyle: styles?.controlStyle,
        containerStyle: styles?.containerStyle,
        labelStyle: styles?.labelStyle,
      }}
    >
      <BaseCapsule
        {...rest}
        id={inputId}
        disabled={disabled}
        styles={{
          capsuleWrapperStyle: styles?.capsuleWrapperStyle,
          tabStyle: styles?.tabStyle,
        }}
      />
    </FieldLane>
  );
}

const CapsuleWrapper = styled.div<{
  $full?: boolean;
  $containerStyle?: CSSProp;
  $disabled?: boolean;
  $theme?: CapsuleThemeConfiguration;
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;

  padding-left: 0.1rem;
  padding-right: 0.1rem;
  border: 1px solid ${({ $theme }) => $theme?.borderColor};
  box-shadow: ${({ $theme }) => $theme?.boxShadow};

  ${({ $full, $theme }) =>
    $full
      ? css`
          width: 100%;
          background-color: ${$theme?.backgroundColor};
          border-top-width: 0px;
          border-left-width: 0px;
          border-right-width: 0px;
        `
      : css`
          width: fit-content;
          border-width: 1px;
          border-radius: 12px;
        `};

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      user-select: none;
    `};

  ${({ $containerStyle }) => $containerStyle}
`;

const ActiveBackground = styled(motion.div)<{
  $style?: CSSProp;
  $activeBackgroundColor?: string;
  $theme?: CapsuleThemeConfiguration;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 8px;
  z-index: 10;
  height: 25px;

  background-color: ${({ $activeBackgroundColor, $theme }) =>
    $activeBackgroundColor ?? $theme?.active?.backgroundColor};

  ${({ $style }) => $style}
`;

const HoverBorder = styled(motion.div)<{
  $style?: CSSProp;
  $activeBackgroundColor?: string;
  $theme?: CapsuleThemeConfiguration;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  border-radius: 8px;
  z-index: 0;
  height: 25px;
  border: 2px solid
    ${({ $activeBackgroundColor, $theme }) =>
      $activeBackgroundColor ?? $theme?.hover?.borderColor};

  ${({ $style }) => $style}
`;

const Tab = styled.div<{
  $isActive?: boolean;
  $activeTabStyle?: CSSProp;
  $fontSize?: number;
  $disabled?: boolean;
  $activeColor?: string;
  $theme?: CapsuleThemeConfiguration;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 10;
  cursor: pointer;
  padding: 0.25rem 1rem;
  text-align: center;
  font-weight: 500;
  transition: color 0.2s;
  margin-top: 4px;
  margin-bottom: 4px;
  gap: 4px;

  color: ${({ $isActive, $activeColor, $theme }) =>
    $isActive
      ? ($activeColor ?? $theme?.tab?.activeTextColor)
      : $theme?.tab?.textColor};

  font-size: ${({ $fontSize }) => `${$fontSize}px`};

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      user-select: none;
    `};

  ${({ $activeTabStyle }) => css`
    ${$activeTabStyle}
  `}
`;

export { Capsule };
