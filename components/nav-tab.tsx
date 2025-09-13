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
  id: number | string;
  title: string;
  content: ReactNode;
}

function NavTab({
  activeTab = 1,
  containerStyle,
  contentStyle,
  tabs = [],
  activeColor = "rgb(59, 130, 246)",
}: NavTabProps) {
  const [selected, setSelected] = useState<number | string>(activeTab);

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

    const targetIndex = tabs.findIndex((tab) => tab.id === selected);

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
  const activeContent = tabs.filter((data) => data.id === selected);

  return (
    <NavTabWrapper $containerStyle={containerStyle}>
      <NavTabHeader ref={containerRef}>
        <motion.div
          style={{
            position: "absolute",
            bottom: "0px",
            zIndex: 1,
            height: "2px",
            borderRadius: "1px",
            backgroundColor: activeColor,
          }}
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

        {tabs.map((data, index) => (
          <NavTabHeaderContent
            key={data.id}
            ref={setTabRef(index)}
            role="tab"
            onClick={() => setSelected(data.id)}
            $selected={selected === data.id}
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
  height: auto;
  display: flex;
  flex-direction: row;
  position: relative;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 4px -3px #5b5b5b;

  ${({ $headerStyle }) => $headerStyle}
`;

const NavTabHeaderContent = styled.div<{
  $selected?: boolean;
}>`
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  transition: color 0.2s ease;
  white-space: nowrap;

  ${({ $selected }) =>
    $selected &&
    css`
      background-color: rgb(243 244 246 / 50%);
    `}

  &:hover {
    background-color: rgb(243 244 246 / 50%);
  }

  &:active {
    background-color: rgb(243 244 246 / 80%);
    box-shadow:
      inset 0 0.5px 4px rgb(243 244 246 / 100%),
      inset 0 -0.5px 0.5px rgb(243 244 246 / 80%);
  }
`;

const NavContent = styled.div<{ $contentStyle?: CSSProp }>`
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 60px);

  ${({ $contentStyle }) => $contentStyle}
`;

export { NavTab };
