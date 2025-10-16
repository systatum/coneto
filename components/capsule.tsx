import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styled, { css, CSSProp } from "styled-components";

export interface CapsuleContentProps {
  id: string;
  title: string;
  content?: ReactNode;
}

export interface CapsuleProps {
  activeTab: string | null;
  tabs: CapsuleContentProps[];
  setActiveTab?: (data: string) => void;
  containerStyle?: CSSProp;
  label?: string;
  labelStyle?: CSSProp;
  description?: string;
  tabStyle?: CSSProp;
  full?: boolean;
  activeBackgroundColor?: string;
  showError?: boolean;
  errorMessage?: string;
}

function Capsule({
  tabs,
  activeTab,
  setActiveTab,
  containerStyle,
  tabStyle,
  full,
  activeBackgroundColor = "oklch(54.6% .245 262.881)",
  label,
  labelStyle,
  showError,
  errorMessage,
}: CapsuleProps) {
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
      setActiveTab(tabs[0].id);
    }
  }, [activeTab, tabs, setActiveTab]);

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

  const getInitialPosition = () => {
    if (!isInitialized && tabs.length > 0) {
      if (activeIndex === 0) {
        return { left: 4, width: 60 };
      }
    }

    if (isInitialized && activeIndex !== -1 && tabSizes[activeIndex]) {
      return {
        left: tabSizes[activeIndex].left,
        width: tabSizes[activeIndex].width - 3,
      };
    }

    return { left: 4, width: 60 };
  };

  const getHoverPosition = () => {
    if (!isInitialized && tabs.length > 0) {
      if (hoverIndex === 0) {
        return { left: 4, width: 60 };
      }
    }

    if (isInitialized && hoverIndex !== -1 && tabSizes[hoverIndex]) {
      return {
        left: tabSizes[hoverIndex].left,
        width: tabSizes[hoverIndex].width - 3,
      };
    }

    return { left: 4, width: 60 };
  };

  const hoverPosition = getHoverPosition();
  const initialPosition = getInitialPosition();

  const inputElement: ReactElement = (
    <CapsuleWrapper
      $containerStyle={containerStyle}
      $full={full}
      ref={containerRef}
      role="tablist"
    >
      <ActiveBackground
        layout
        $style={tabStyle}
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
        layout
        $style={tabStyle}
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

      {tabs.map((data, index) => {
        const isActive = activeTab === data.id;

        return (
          <Tab
            $isActive={isActive}
            role="tab"
            key={index}
            ref={setTabRef(index)}
            $activeTabStyle={tabStyle}
            onMouseEnter={() => setHovered(data.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActiveTab(data.id)}
          >
            {data.title}
          </Tab>
        );
      })}
    </CapsuleWrapper>
  );

  return (
    <Container $style={containerStyle}>
      {label && (
        <Label $style={labelStyle} htmlFor="capsule">
          {label}
        </Label>
      )}
      <div>
        {inputElement}
        {showError && <ErrorText>{errorMessage}</ErrorText>}
      </div>
    </Container>
  );
}

const CapsuleWrapper = styled.div<{
  $full?: boolean;
  $containerStyle?: CSSProp;
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  border-color: #ebebeb;
  box-shadow:
    0 1px 4px -3px #5b5b5b,
    0 1px 1px rgba(0, 0, 0, 0.05);

  ${({ $full }) =>
    $full
      ? css`
          width: 100%;
          background-color: white;
          border-bottom-width: 1px;
        `
      : css`
          width: fit-content;
          border-width: 1px;
          border-radius: 0.75rem;
        `}

  ${({ $containerStyle }) => $containerStyle}
`;

const Container = styled.div<{ $style?: CSSProp }>`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  position: relative;

  ${({ $style }) => $style}
`;

const Label = styled.label<{ $style?: CSSProp }>`
  font-size: 0.75rem;
  ${({ $style }) => $style}
`;

const ErrorText = styled.span`
  color: #dc2626;
`;

const ActiveBackground = styled(motion.div)<{
  $style?: CSSProp;
  $activeBackgroundColor?: string;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  border-radius: 12px;
  z-index: 10;
  height: 25px;
  background-color: ${({ $activeBackgroundColor }) => $activeBackgroundColor};
  ${({ $style }) => $style}
`;

const HoverBorder = styled(motion.div)<{
  $style?: CSSProp;
  $activeBackgroundColor?: string;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  border-radius: 12px;
  z-index: 0;
  height: 25px;
  border: 2px solid ${({ $activeBackgroundColor }) => $activeBackgroundColor};
  ${({ $style }) => $style}
`;

const Tab = styled.div<{
  $isActive?: boolean;
  $activeTabStyle?: CSSProp;
}>`
  z-index: 10;
  cursor: pointer;
  padding: 0.3rem 1rem;
  padding-left: 12px;
  text-align: center;
  font-weight: 500;
  transition: color 0.2s;

  ${({ $isActive }) =>
    $isActive
      ? css`
          color: white;
        `
      : css`
          color: #111827;
        `}

  ${({ $isActive, $activeTabStyle }) =>
    !$isActive &&
    css`
      ${$activeTabStyle}
    `}
`;

export { Capsule };
