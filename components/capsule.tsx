import { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styled, { css, CSSProp } from "styled-components";

export interface TabFieldsProps {
  id: string | number;
  title: string;
  content?: ReactNode;
}

export interface TabProps {
  view: string | null | number;
  fields: TabFieldsProps[];
  setView: (data: string | number) => void;
  containerStyle?: CSSProp;
  styleActiveTab?: CSSProp;
  full?: boolean;
  activeBackgroundColor?: string;
}

function Capsule({
  fields,
  view,
  setView,
  containerStyle,
  styleActiveTab,
  full,
  activeBackgroundColor = "oklch(54.6% .245 262.881)",
}: TabProps) {
  const [hovered, setHovered] = useState<string | null | number>(null);

  const activeId = hovered || view;
  const activeIndex = fields.findIndex((item) => item.id === view);
  const hoverIndex = fields.findIndex((item) => item.id === activeId);

  const tabRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [tabSizes, setTabSizes] = useState<{ width: number; left: number }[]>(
    []
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, fields.length);

    while (tabRefs.current.length < fields.length) {
      tabRefs.current.push(null);
    }
  }, [fields]);

  useEffect(() => {
    if (!view && fields.length > 0) {
      setView(fields[0].id);
    }
  }, [view, fields, setView]);

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
  }, [fields.length]);

  const setTabRef = (index: number) => (element: HTMLDivElement | null) => {
    tabRefs.current[index] = element;
  };

  const getInitialPosition = () => {
    if (!isInitialized && fields.length > 0) {
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
    if (!isInitialized && fields.length > 0) {
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

  return (
    <CapsuleWrapper
      $containerStyle={containerStyle}
      $full={full}
      ref={containerRef}
      role="tablist"
    >
      <motion.div
        layout
        style={{
          position: "absolute",
          top: "4px",
          borderRadius: "12px",
          bottom: "4px",
          zIndex: 10,
          height: "25px",
          backgroundColor: activeBackgroundColor,
        }}
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

      <motion.div
        layout
        style={{
          position: "absolute",
          top: "4px",
          borderRadius: "12px",
          bottom: "4px",
          zIndex: 0,
          height: "25px",
          border: `2px solid ${activeBackgroundColor}`,
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

      {fields.map((data, index) => {
        const isActive = view === data.id;

        return (
          <Tab
            $isActive={isActive}
            $styleActiveTab={styleActiveTab}
            role="tab"
            key={index}
            ref={setTabRef(index)}
            onMouseEnter={() => setHovered(data.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setView(data.id)}
          >
            {data.title}
          </Tab>
        );
      })}
    </CapsuleWrapper>
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

const Tab = styled.div<{
  $isActive?: boolean;
  $styleActiveTab?: CSSProp;
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

  ${({ $isActive, $styleActiveTab }) =>
    !$isActive &&
    css`
      ${$styleActiveTab}
    `}
`;

export { Capsule };
