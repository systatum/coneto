import { RemixiconComponentType } from "@remixicon/react";
import {
  Children,
  Fragment,
  isValidElement,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { css, CSSProp } from "styled-components";

interface WindowProps {
  orientation?: "horizontal" | "vertical";
  children?: ReactNode;
  style?: CSSProp;
  onResize?: () => void;
  onResizeComplete?: () => void;
  dividerStyle?: CSSProp;
}

export interface WindowCellProps {
  children?: ReactNode;
  style?: CSSProp;
  actions?: WindowActionProps[];
}

export interface WindowActionProps {
  onClick?: () => void;
  icon?: RemixiconComponentType;
  style?: string;
}

function Window({
  orientation = "vertical",
  children,
  style,
  onResize,
  onResizeComplete,
  dividerStyle,
}: WindowProps) {
  const isVertical = orientation === "vertical";
  const childrenArray = Children.toArray(children).filter(isValidElement);
  const sizeState = new Array(childrenArray.length).fill(
    1 / childrenArray.length
  );
  const [sizes, setSizes] = useState<number[]>(sizeState);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const draggingIndex = useRef<number | null>(null);
  const startPosition = useRef<number>(0);
  const startSizes = useRef<number[]>([]);

  const onMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (draggingIndex.current === null || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const totalSize = isVertical ? rect.width : rect.height;
      const currentPosition = isVertical
        ? e.clientX - rect.left
        : e.clientY - rect.top;

      const delta = currentPosition - startPosition.current;
      const deltaRatio = delta / totalSize;

      const currentIndex = draggingIndex.current;
      const nextIndex = currentIndex + 1;

      if (nextIndex >= startSizes.current.length) return;

      const originalCurrentSize = startSizes.current[currentIndex];
      const originalNextSize = startSizes.current[nextIndex];

      let newCurrentSize = originalCurrentSize + deltaRatio;
      let newNextSize = originalNextSize - deltaRatio;

      const minSize = 0.05;

      if (newCurrentSize < minSize) {
        newCurrentSize = minSize;
        newNextSize = originalCurrentSize + originalNextSize - minSize;
      }

      if (newNextSize < minSize) {
        newNextSize = minSize;
        newCurrentSize = originalCurrentSize + originalNextSize - minSize;
      }

      const newSizes = [...startSizes.current];
      newSizes[currentIndex] = newCurrentSize;
      newSizes[nextIndex] = newNextSize;

      setSizes(newSizes);
    },
    [isVertical]
  );

  const stopDrag = useCallback(() => {
    draggingIndex.current = null;
    startSizes.current = [];
    setIsDragging(false);
    if (onResizeComplete) {
      onResizeComplete();
    }
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopDrag);
  }, [onMouseMove]);

  const startDrag = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.preventDefault();

      draggingIndex.current = index;
      if (onResize) {
        onResize();
      }
      startSizes.current = [...sizes];
      setIsDragging(true);

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      startPosition.current = isVertical
        ? e.clientX - rect.left
        : e.clientY - rect.top;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", stopDrag);
    },
    [isVertical, sizes, onMouseMove, stopDrag]
  );

  useEffect(() => {
    const newLength = childrenArray.length;
    if (sizes.length !== newLength) {
      const newSizes = new Array(newLength).fill(1 / newLength);
      setSizes(newSizes);
    }
  }, [childrenArray.length]);

  return (
    <Container ref={containerRef} $isVertical={isVertical} $style={style}>
      {childrenArray.map((child, index) => (
        <Fragment key={index}>
          <CellWrapper
            $size={sizes[index]}
            $isDragging={isDragging}
            $isVertical={isVertical}
          >
            {child}
          </CellWrapper>
          {index < childrenArray.length - 1 && (
            <Divider
              $style={dividerStyle}
              className="divider"
              aria-label={`window-divider`}
              onMouseDown={startDrag(index)}
              $isVertical={isVertical}
            />
          )}
        </Fragment>
      ))}
    </Container>
  );
}

function WindowCell({ children, style, actions }: WindowCellProps) {
  return (
    <CellWrapper
      aria-label="window-cell"
      $size={1}
      $isVertical={true}
      $style={style}
    >
      {actions && (
        <ActionContainer>
          {actions.map((data, index) => (
            <ActionButton
              key={index}
              aria-label="window-button"
              onClick={() => {
                if (data.onClick) data.onClick();
              }}
              $style={data.style}
            >
              {data.icon && <data.icon size={16} />}
            </ActionButton>
          ))}
        </ActionContainer>
      )}
      {children}
    </CellWrapper>
  );
}

const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "$style" && prop !== "$isVertical",
})<{ $isVertical: boolean; $style?: CSSProp }>`
  display: flex;
  width: 100%;
  height: auto;
  overflow: hidden;

  flex-direction: ${({ $isVertical }) => ($isVertical ? "row" : "column")};
  ${({ $style }) => $style}
`;

const CellWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["$size", "$isVertical", "$style", "$isDragging"].includes(prop),
})<{
  $size: number;
  $isVertical: boolean;
  $style?: CSSProp;
  $isDragging?: boolean;
}>`
  position: relative;
  width: ${({ $isVertical, $size }) =>
    $isVertical ? `${$size * 100}%` : "100%"};
  height: ${({ $isVertical, $size }) =>
    !$isVertical ? `${$size * 100}%` : "100%"};
  ${({ $style }) => $style};
  -webkit-overflow-scrolling: "touch";
  pointer-events: ${({ $isDragging }) => ($isDragging ? "none" : "auto")};
  user-select: ${({ $isDragging }) => ($isDragging ? "none" : "auto")};
`;

const Divider = styled.div<{ $isVertical: boolean; $style?: CSSProp }>`
  position: relative;
  background-color: transparent;
  transition: background-color 0.3s;

  ${({ $isVertical }) =>
    $isVertical
      ? css`
          width: 1px;
          height: 100%;
          cursor: col-resize;
          border-right: 1px solid #d1d5db;
        `
      : css`
          height: 1px;
          width: 100%;
          cursor: row-resize;
          border-bottom: 1px solid #d1d5db;
        `}

  ${({ $style }) => $style}
`;

const ActionContainer = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
  display: flex;
  flex-direction: row;
`;

const ActionButton = styled.div<{ $style?: CSSProp }>`
  display: flex;
  align-items: center;
  position: relative;
  padding: 2px;
  gap: 8px;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #d1d5db;
  }

  ${({ $style }) => $style}
`;

Window.Cell = WindowCell;

export { Window };
