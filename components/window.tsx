import { RemixiconComponentType } from "@remixicon/react";
import {
  Children,
  cloneElement,
  forwardRef,
  Fragment,
  HTMLAttributes,
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
  self?: CSSProp;
  dividerStyle?: CSSProp;
}

export interface WindowCellProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  children?: ReactNode;
  styles?: WindowCellStylesProps;
  actions?: WindowActionProps[];
}

export interface WindowCellStylesProps {
  self?: CSSProp;
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
  const runOnResize = useRafThrottle(onResize);

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

      runOnResize();
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
      $style={styles?.self}
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

/**
 * useRafThrottle
 *
 * A hook that returns a throttled version of a callback using `requestAnimationFrame`.
 * Ensures the callback runs at most once per animation frame, regardless of how
 * many times the throttled function is called.
 *
 * Useful for performance-heavy operations like dragging, resizing, or scroll events.
 *
 * @template T - Function type to be throttled
 * @param callback - The function to throttle
 * @returns A throttled version of the callback
 *
 * How it works:
 * 1. Store the latest arguments in `lastArgs`.
 * 2. If a frame is already scheduled (`frame.current`), ignore the call.
 * 3. Otherwise, schedule the callback via `requestAnimationFrame`.
 * 4. Once executed, clear `frame.current` so the next frame can be scheduled.
 *
 * This ensures:
 * - At most one callback per animation frame.
 * - Calls are synced to the browser’s repaint cycle (~60fps, or higher on high-refresh monitors).
 */

function useRafThrottle<T extends (...args: any[]) => void>(callback?: T) {
  const frame = useRef<number | null>(null);
  const lastArgs = useRef<Parameters<T> | null>(null);

  const throttled = useCallback(
    (...args: Parameters<T>) => {
      lastArgs.current = args;

      if (frame.current !== null) return;

      frame.current = requestAnimationFrame(() => {
        if (callback && lastArgs.current) {
          callback(...lastArgs.current);
        }
        frame.current = null;
      });
    },
    [callback]
  );

  return throttled;
}

interface WindowCellInternalProps {
  size: number;
  isDragging: boolean;
  isVertical: boolean;
}

const WindowCell = forwardRef<HTMLDivElement, WindowCellProps>(
  ({ children, styles, actions, ...props }, ref) => {
    const {
      size = 1,
      isDragging = false,
      isVertical = true,
      ...rest
    } = props as WindowCellInternalProps;

    return (
      <CellWrapper
        {...rest}
        ref={ref}
        style={{
          width: isVertical ? `${size * 100}%` : "100%",
          height: !isVertical ? `${size * 100}%` : "100%",
        }}
        aria-label="window-cell"
        $isDragging={isDragging}
        $style={styles?.self}
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
);

const Container = styled.div<{ $isVertical: boolean; $style?: CSSProp }>`
  display: flex;
  width: 100%;
  height: auto;
  overflow: hidden;

  flex-direction: ${({ $isVertical }) => ($isVertical ? "row" : "column")};
  ${({ $style }) => $style}
`;

const CellWrapper = styled.div<{
  $style?: CSSProp;
  $isDragging?: boolean;
}>`
  position: relative;
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
          border-right: 2.5px solid #d1d5db;
        `
      : css`
          height: 1px;
          width: 100%;
          cursor: row-resize;
          border-bottom: 2.5px solid #d1d5db;
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
