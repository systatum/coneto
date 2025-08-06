import {
  Children,
  isValidElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Separator } from "./separator";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { Grid, GridPresetKey } from "./grid";
import styled, { CSSProp } from "styled-components";

interface LaunchpadProps {
  children: ReactNode;
  containerStyle?: CSSProp;
  maxSection?: number;
}

interface LaunchpadSectionProps {
  children: ReactNode;
  title?: string;
  containerStyle?: CSSProp;
  gridStyle?: CSSProp;
  separatorStyle?: CSSProp;
  gridPreset?: GridPresetKey;
}

interface LaunchpadSectionItemProps {
  href: string;
  iconUrl: string;
  label: string;
  containerStyle?: CSSProp;
  iconStyle?: CSSProp;
}

function Launchpad({
  children,
  containerStyle,
  maxSection = 3,
}: LaunchpadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [page, setPage] = useState(0);

  const allSections = Children.toArray(children).filter(isValidElement);
  const totalPages = Math.ceil(allSections.length / maxSection);

  const groupedSections = Array.from({ length: totalPages }, (_, i) =>
    allSections.slice(i * maxSection, (i + 1) * maxSection)
  );

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDragEnd = (
    _: MouseEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const threshold = containerWidth * 0.03;

    const isSwipeLeft = info.offset.x < -threshold;
    const isSwipeRight = info.offset.x > threshold;

    const isFastSwipeLeft = info.velocity.x < -300;
    const isFastSwipeRight = info.velocity.x > 300;

    const swipeDelta =
      isSwipeLeft || isFastSwipeLeft
        ? 1
        : isSwipeRight || isFastSwipeRight
          ? -1
          : 0;

    const nextPage = Math.max(0, Math.min(page + swipeDelta, totalPages - 1));

    setPage(nextPage);
  };

  const targetX = -page * containerWidth;

  const x = useMotionValue(0);
  const dragControls = useDragControls();

  return (
    <LaunchpadContainer
      ref={containerRef}
      onPointerDown={(e) => dragControls.start(e)}
      $containerStyle={containerStyle}
    >
      <motion.div
        drag={"x"}
        dragElastic={0.2}
        dragMomentum={false}
        dragControls={dragControls}
        dragListener={false}
        style={{ x, display: "flex" }}
        dragConstraints={{
          left: -containerWidth * (totalPages - 1),
          right: 0,
        }}
        animate={{ x: targetX }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 1,
        }}
        onDragEnd={handleDragEnd}
      >
        {groupedSections.map((group, index) => (
          <LaunchpadSectionGroup
            key={index}
            style={{
              width: containerWidth,
              pointerEvents: "auto",
            }}
          >
            {group}
          </LaunchpadSectionGroup>
        ))}
      </motion.div>
      {totalPages > 1 && (
        <PaginationDots>
          {Array.from({ length: totalPages }).map((_, index) => (
            <DotButton
              key={index}
              onClick={() => setPage(index)}
              $active={page === index}
            />
          ))}
        </PaginationDots>
      )}
    </LaunchpadContainer>
  );
}

function LaunchpadSection({
  children,
  title,
  gridStyle,
  containerStyle,
  separatorStyle,
  gridPreset = "2-to-4",
}: LaunchpadSectionProps) {
  return (
    <LaunchpadSectionContainer $containerStyle={containerStyle}>
      <LaunchPadSectionSeparatorWrapper $separatorStyle={separatorStyle}>
        <Separator title={title} depth="0" />
      </LaunchPadSectionSeparatorWrapper>
      <Grid preset={gridPreset} containerStyle={gridStyle}>
        {children}
      </Grid>
    </LaunchpadSectionContainer>
  );
}

function LaunchpadSectionItem({
  href,
  label,
  iconUrl,
  containerStyle,
  iconStyle,
}: LaunchpadSectionItemProps) {
  return (
    <LaunchpadSectionItemLink $containerStyle={containerStyle} href={href}>
      {iconUrl && (
        <LaunchpadSectionIconWrapper $iconStyle={iconStyle}>
          <img width={400} height={400} src={iconUrl} />
        </LaunchpadSectionIconWrapper>
      )}
      {label && <span>{label}</span>}
    </LaunchpadSectionItemLink>
  );
}

const LaunchpadContainer = styled.div<{
  $containerStyle?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  cursor: grab;
  user-select: none;
  padding: 1.5rem 6px;
  gap: 0.5rem;
  border: 1px solid #d1d5db;
  overflow: hidden;
  position: relative;

  &:active {
    cursor: grabbing;
  }

  ${({ $containerStyle }) => $containerStyle}
`;

const LaunchpadSectionGroup = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PaginationDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const DotButton = styled.button<{ $active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background-color: ${({ $active }) => ($active ? "#6b7280" : "#d1d5db")};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
`;

const LaunchpadSectionContainer = styled.div<{
  $containerStyle?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${({ $containerStyle }) => $containerStyle}
`;

const LaunchPadSectionSeparatorWrapper = styled.div<{
  $separatorStyle?: CSSProp;
}>`
  padding-right: 1.5rem;

  @media (min-width: 640px) {
    padding-right: 4rem;
  }

  @media (min-width: 768px) {
    padding-right: 1.5rem;
  }

  @media (min-width: 1024px) {
    padding-right: 1.5rem;
  }

  ${({ $separatorStyle }) => $separatorStyle}
`;

const LaunchpadSectionItemLink = styled.a<{
  $containerStyle: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.5rem 1rem;
  margin-right: 1.5rem;
  margin-left: 0.5rem;
  font-size: 0.75rem;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #e5e7eb;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  }

  ${({ $containerStyle }) => $containerStyle}
`;

const LaunchpadSectionIconWrapper = styled.div<{
  $iconStyle: CSSProp;
}>`
  max-width: 30px;
  ${({ $iconStyle }) => $iconStyle}
`;

Launchpad.Section = LaunchpadSection;
LaunchpadSection.Item = LaunchpadSectionItem;

export { Launchpad };
