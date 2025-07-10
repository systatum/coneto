import { RemixiconComponentType } from "@remixicon/react";
import { cn } from "./../lib/utils";
import {
  Children,
  isValidElement,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface WindowProps {
  orientation?: "horizontal" | "vertical";
  children?: ReactNode;
  className?: string;
}

interface WindowCellProps {
  children?: ReactNode;
  className?: string;
  actions?: WindowActionProps[];
}

export interface WindowActionProps {
  onClick?: () => void;
  icon?: RemixiconComponentType;
  className?: string;
}

function Window({
  orientation = "vertical",
  children,
  className,
}: WindowProps) {
  const isVertical = orientation === "vertical";
  const childrenArray = Children.toArray(children).filter(isValidElement);
  const sizeState = new Array(childrenArray.length).fill(
    1 / childrenArray.length
  );
  const [sizes, setSizes] = useState<number[]>(sizeState);

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

      console.log("Dragging:", {
        isVertical,
        currentPosition,
        delta,
        deltaRatio,
        currentIndex: draggingIndex.current,
      });
    },
    [isVertical]
  );

  const stopDrag = useCallback(() => {
    draggingIndex.current = null;
    startSizes.current = [];
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopDrag);
  }, [onMouseMove]);

  const startDrag = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.preventDefault();

      draggingIndex.current = index;
      startSizes.current = [...sizes];

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
    <div
      ref={containerRef}
      className={cn(
        "flex w-full h-full overflow-hidden",
        isVertical ? "flex-row" : "flex-col",
        className
      )}
    >
      {childrenArray.map((child, index) => (
        <div
          key={index}
          style={{
            [isVertical ? "width" : "height"]: `${sizes[index] * 100}%`,
            [isVertical ? "height" : "width"]: "100%",
          }}
          className="relative w-full h-full"
        >
          {child}

          {index < childrenArray.length - 1 && (
            <div
              onMouseDown={startDrag(index)}
              className={cn(
                "absolute z-10 bg-transparent transition-colors",
                isVertical
                  ? "top-0 -right-0 w-px h-full cursor-col-resize border-r border-gray-300"
                  : "left-0 -bottom-0 h-px w-full cursor-row-resize border-b border-gray-300"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function WindowCell({ children, className, actions }: WindowCellProps) {
  return (
    <div className={cn("flex flex-row relative w-full h-full", className)}>
      <div className="absolute right-4 top-4">
        {actions && (
          <div className="flex flex-row w-full">
            {actions.map((data, index) => (
              <div
                key={index}
                onClick={() => {
                  if (data.onClick) {
                    data.onClick();
                  }
                }}
                className={cn(
                  "flex relative w-full items-center cursor-pointer px-3 py-2 gap-2",
                  data.className
                )}
              >
                {data.icon && (
                  <span className="absolute hover:bg-gray-400 transition-all duration-300 right-2 top-1/2 -translate-y-1/2">
                    <data.icon size={16} />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}

Window.Cell = WindowCell;

export { Window };
