import { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import styled, { css, CSSProp } from "styled-components";
import { motion } from "framer-motion";

export interface NavTabProps {
  tabs?: NavTabContentProps[];
  activeTab?: number;
  contentStyle?: CSSProp;
  containerStyle?: CSSProp;
  activeColor?: string;
}

export interface NavTabContentProps {
  id: number;
  title: string;
  content: ReactNode;
}

function NavTab({
  activeTab = 1,
  containerStyle,
  contentStyle,
  tabs,
  activeColor,
}: NavTabProps) {
  const [hovered, setHovered] = useState<string | null | number>(null);
  const CONTENT_TABS = tabs.map((data) => data.id);
  const NUMBER_ACTIVE_TAB = activeTab - 1;
  const [selected, setSelected] = useState<string | number>(
    CONTENT_TABS[NUMBER_ACTIVE_TAB]
  );
  const activeContent = tabs.filter((data) => data.id === selected);

  const activeId = hovered || activeTab;
  const tabRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [tabSizes, setTabSizes] = useState<{ width: number; left: number }[]>(
    []
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const hoverIndex = tabs.findIndex((item) => item.id === activeId);

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

  const hoverPosition = getHoverPosition();

  return (
    <NavTabWrapper $containerStyle={containerStyle}>
      <NavTabHeader ref={containerRef}>
        <motion.div
          layout
          style={{
            position: "absolute",
            bottom: "0px",
            zIndex: 0,
            height: "1px",
            borderRadius: "1px",
            backgroundColor: activeColor ?? "#999bd1",
            opacity: hovered ? 1 : 0,
          }}
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
        {tabs.map((data, index) => (
          <NavTabHeaderContent
            key={index}
            ref={setTabRef(index)}
            role="tab"
            onClick={() => setSelected(data.id)}
            $selected={selected === data.id}
            onMouseEnter={() => setHovered(data.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {data.title}
          </NavTabHeaderContent>
        ))}
      </NavTabHeader>
      <NavContent $contentStyle={contentStyle}>
        {activeContent.map((data, index) => (
          <Fragment key={index}>{data.content}</Fragment>
        ))}
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
  position: sticky;
  flex-direction: column;
  font-size: 14px;

  ${({ $containerStyle }) => $containerStyle}
`;

const NavTabHeader = styled.div<{
  $headerStyle?: CSSProp;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  background-color: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 4px -3px #5b5b5b;

  ${({ $headerStyle }) => $headerStyle}
`;

const NavTabHeaderContent = styled.div<{
  $selected?: boolean;
  $activeColor?: string;
}>`
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  font-weight: 500;

  ${({ $selected, $activeColor }) =>
    $selected &&
    css`
      border-bottom: 1px solid ${$activeColor ? $activeColor : "#999bd1"};
      color: ${$activeColor ? $activeColor : "#999bd1"};
    `}
`;

const NavContent = styled.div<{ $contentStyle?: CSSProp }>`
  padding: 4px;
  overflow-y: auto;
  max-height: 100vh;

  ${({ $contentStyle }) => $contentStyle}
`;

export { NavTab };
