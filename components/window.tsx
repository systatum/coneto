import { RemixiconComponentType } from "@remixicon/react";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import { Button } from "./button";

export interface WindowProps {
  orientation?: "horizontal" | "vertical";
  children?: ReactNode;
  onResize?: () => void;
  onResizeComplete?: () => void;
  initialSizeRatio?: number[];
  styles?: WindowStylesProps;
}

export interface WindowStylesProps {
  style?: CSSProp;
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
  styles,
  onResize,
  onResizeComplete,
  initialSizeRatio,
}: WindowProps) {
  const isVertical = orientation === "vertical";
  const childrenArray = Children.toArray(children).filter(isValidElement);
  const sizeState = initialSizeRatio
    ? normalizeSizes(initialSizeRatio)
    : new Array(childrenArray.length).fill(1 / childrenArray.length);
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
    <Container
      aria-label="window"
      ref={containerRef}
      $isVertical={isVertical}
      $style={styles?.style}
    >
      {childrenArray.map((child, index) => (
        <Fragment key={index}>
          {cloneElement(
            child as ReactElement<WindowCellProps & WindowCellInternalProps>,
            {
              size: sizes[index],
              isDragging: isDragging,
              isVertical: isVertical,
            }
          )}
          {index < childrenArray.length - 1 && (
            <Divider
              $style={styles?.dividerStyle}
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

interface WindowCellInternalProps {
  size: number;
  isDragging: boolean;
  isVertical: boolean;
}

function WindowCell(props: WindowCellProps) {
  const { children, style, actions } = props;

  const {
    size = 1,
    isDragging = false,
    isVertical = true,
  } = props as WindowCellInternalProps;

  return (
    <CellWrapper
      aria-label="window-cell"
      $size={size}
      $isDragging={isDragging}
      $isVertical={isVertical}
      $style={style}
    >
      {actions && (
        <ActionContainer>
          {actions.map((data, index) => (
            <Button
              variant="transparent"
              key={index}
              aria-label="window-button"
              onClick={() => {
                if (data.onClick) data.onClick();
              }}
              styles={{
                containerStyle: css`
                  position: absolute;
                  top: 0.5rem;
                  right: 0.5rem;
                  cursor: pointer;
                  transition: all 0.3s;
                  border-radius: 2px;
                  padding: 2px;
                  width: fit-content;
                  height: fit-content;
                  z-index: 50;
                `,
                self: css`
                  width: fit-content;
                  height: fit-content;
                  padding: 2px;
                `,
              }}
            >
              {data.icon && <data.icon size={16} />}
            </Button>
          ))}
        </ActionContainer>
      )}
      {children}
    </CellWrapper>
  );
}

const Container = styled.div<{ $isVertical: boolean; $style?: CSSProp }>`
  display: flex;
  width: 100%;
  height: auto;
  overflow: hidden;

  flex-direction: ${({ $isVertical }) => ($isVertical ? "row" : "column")};
  ${({ $style }) => $style}
`;

const CellWrapper = styled.div<{
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
  -webkit-overflow-scrolling: "touch";
  pointer-events: ${({ $isDragging }) => ($isDragging ? "none" : "auto")};
  user-select: ${({ $isDragging }) => ($isDragging ? "none" : "auto")};

  ${({ $style }) => $style};
`;

const Divider = styled.div<{ $isVertical: boolean; $style?: CSSProp }>`
  position: relative;
  background-color: transparent;
  transition: background-color 0.3s;
  z-index: 100;

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
  pointer-events: auto;
  z-index: 40;
`;

function normalizeSizes(sizes: number[]) {
  const total = sizes.reduce((a, b) => a + b, 0);
  return sizes.map((s) => s / total);
}

Window.Cell = WindowCell;

export { Window };
