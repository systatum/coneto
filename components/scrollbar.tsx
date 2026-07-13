import {
  useRef,
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from "react";
import styled, { CSSProperties } from "styled-components";
import { ScrollbarThemeConfig, useTheme } from "./../theme";

interface ScrollbarProps {
  children: ReactNode;
  overflowX?: "scroll" | "hidden";
  overflowY?: "scroll" | "hidden";
  autoHideDelay?: number;
  onScroll?: () => void;
  style?: CSSProperties;
  totalSize?: number;
  scrollOffset?: number;
}

export interface ScrollbarRef {
  getViewport: () => HTMLDivElement | null;
}

const Scrollbar = forwardRef<ScrollbarRef, ScrollbarProps>(
  (
    {
      children,
      overflowX = "hidden",
      overflowY = "scroll",
      autoHideDelay = 1500,
      onScroll,
      style,
      totalSize,
      scrollOffset,
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const scrollbarTheme = currentTheme?.scrollbar;

    const viewportRef = useRef<HTMLDivElement>(null);
    const thumbYRef = useRef<HTMLDivElement>(null);
    const thumbXRef = useRef<HTMLDivElement>(null);

    const [showY, setShowY] = useState(false);
    const [showX, setShowX] = useState(false);

    const [isDraggingXState, setIsDraggingXState] = useState(false);
    const [isDraggingYState, setIsDraggingYState] = useState(false);

    const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
    const isDraggingY = useRef(false);
    const isDraggingX = useRef(false);
    const dragStartY = useRef(0);
    const dragStartX = useRef(0);
    const dragStartScrollTop = useRef(0);
    const dragStartScrollLeft = useRef(0);

    const isControlledY = totalSize != null && scrollOffset != null;

    // Always-fresh mirror of the controlled props, read synchronously inside
    // the scroll handler so the thumb never waits on a React re-render /
    // effect round-trip to catch up with the virtualizer.
    const controlledRef = useRef({ totalSize, scrollOffset });
    controlledRef.current = { totalSize, scrollOffset };

    useImperativeHandle(ref, () => ({
      getViewport: () => viewportRef.current,
    }));

    // Imperative thumb writes, avoid re-render by using React state for thumb scroll
    const applyThumbY = useCallback((height: number, top: number) => {
      const el = thumbYRef.current;
      if (!el) return;
      el.style.height = `${height}px`;
      el.style.transform = `translateY(${top}px)`;
    }, []);

    const applyThumbX = useCallback((width: number, left: number) => {
      const el = thumbXRef.current;
      if (!el) return;
      el.style.width = `${width}px`;
      el.style.transform = `translateX(${left}px)`;
    }, []);

    const updateThumbs = useCallback(() => {
      const el = viewportRef.current;
      if (!el) return;

      const {
        scrollTop,
        scrollLeft,
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth,
      } = el;

      if (
        !isControlledY &&
        overflowY === "scroll" &&
        scrollHeight > clientHeight
      ) {
        const heightRatio = clientHeight / scrollHeight;
        const thumbHeight = Math.max(heightRatio * clientHeight, 30);
        const maxScrollTop = scrollHeight - clientHeight;
        const maxThumbTop = clientHeight - thumbHeight;
        const thumbTop = (scrollTop / maxScrollTop) * maxThumbTop;
        applyThumbY(thumbHeight - 4, thumbTop);
      }

      if (overflowX === "scroll" && scrollWidth > clientWidth) {
        const widthRatio = clientWidth / scrollWidth;
        const thumbWidth = Math.max(widthRatio * clientWidth, 30);
        const maxScrollLeft = scrollWidth - clientWidth;
        const maxThumbLeft = clientWidth - thumbWidth;
        const thumbLeft = (scrollLeft / maxScrollLeft) * maxThumbLeft;
        applyThumbX(thumbWidth - 4, thumbLeft);
      }
    }, [overflowX, overflowY, isControlledY, applyThumbY, applyThumbX]);

    // Synchronous controlled-Y thumb update, driven by the native scroll
    // event itself (via controlledRef) rather than by waiting for
    // totalSize/scrollOffset props to propagate through a re-render.
    const updateControlledThumbY = useCallback(() => {
      const el = viewportRef.current;
      if (!el || !isControlledY) return;

      const { totalSize, scrollOffset } = controlledRef.current;
      const clientHeight = el.clientHeight;

      if (!clientHeight || (totalSize ?? 0) <= clientHeight) {
        applyThumbY(0, 0);
        return;
      }

      const heightRatio = clientHeight / (totalSize as number);
      const thumbHeight = Math.max(heightRatio * clientHeight, 30);
      const maxScrollTop = (totalSize as number) - clientHeight;
      const maxThumbTop = clientHeight - thumbHeight;
      const thumbTop =
        maxScrollTop > 0
          ? ((scrollOffset ?? 0) / maxScrollTop) * maxThumbTop
          : 0;

      applyThumbY(thumbHeight - 4, thumbTop);
    }, [isControlledY, applyThumbY]);

    // Virtualizer-derived thumbY (authoritative when provided).
    // Kept as a fallback for cases where totalSize/scrollOffset change
    // WITHOUT a native scroll event (e.g. rows loading in, resize, filtering),
    // since handleScroll won't fire in those cases.
    useEffect(() => {
      if (!isControlledY) return;
      updateControlledThumbY();
    }, [isControlledY, totalSize, scrollOffset, updateControlledThumbY]);

    const showScrollbars = useCallback(() => {
      const el = viewportRef.current;
      if (!el) return;

      const scrollHeightCheck = isControlledY
        ? (controlledRef.current.totalSize ?? 0) > el.clientHeight
        : el.scrollHeight > el.clientHeight;

      if (overflowY === "scroll" && scrollHeightCheck) setShowY(true);
      if (overflowX === "scroll" && el.scrollWidth > el.clientWidth)
        setShowX(true);

      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        if (!isDraggingY.current && !isDraggingX.current) {
          setShowY(false);
          setShowX(false);
        }
      }, autoHideDelay);
    }, [autoHideDelay, overflowX, overflowY, isControlledY]);

    const handleScroll = useCallback(() => {
      // Controlled-Y thumb position is driven by the virtualizer's
      // scrollOffset, not the DOM's own scrollTop, so update it
      // synchronously here rather than through updateThumbs().
      if (isControlledY) {
        updateControlledThumbY();
        if (overflowX === "scroll") {
          // X axis still tracks the DOM directly since totalSize/scrollOffset
          // only ever describe the virtualized (vertical) axis.
          const el = viewportRef.current;
          if (el) {
            const { scrollLeft, scrollWidth, clientWidth } = el;
            if (scrollWidth > clientWidth) {
              const widthRatio = clientWidth / scrollWidth;
              const thumbWidth = Math.max(widthRatio * clientWidth, 30);
              const maxScrollLeft = scrollWidth - clientWidth;
              const maxThumbLeft = clientWidth - thumbWidth;
              const thumbLeft = (scrollLeft / maxScrollLeft) * maxThumbLeft;
              applyThumbX(thumbWidth - 4, thumbLeft);
            }
          }
        }
      } else {
        updateThumbs();
      }

      showScrollbars();
      onScroll?.();
    }, [
      isControlledY,
      updateControlledThumbY,
      updateThumbs,
      showScrollbars,
      onScroll,
      overflowX,
      applyThumbX,
    ]);

    useEffect(() => {
      const el = viewportRef.current;
      if (!el) return;
      const ro = new ResizeObserver(() => {
        if (isControlledY) {
          updateControlledThumbY();
        } else {
          updateThumbs();
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [updateThumbs, updateControlledThumbY, isControlledY]);

    const onMouseDownY = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        isDraggingY.current = true;
        setIsDraggingYState(true);
        dragStartY.current = e.clientY;
        dragStartScrollTop.current = viewportRef.current?.scrollTop ?? 0;

        const onMouseMove = (e: MouseEvent) => {
          const el = viewportRef.current;
          if (!el) return;
          const delta = e.clientY - dragStartY.current;
          const { clientHeight } = el;
          const effectiveScrollHeight = isControlledY
            ? (controlledRef.current.totalSize ?? el.scrollHeight)
            : el.scrollHeight;
          const thumbHeight = Math.max(
            (clientHeight / effectiveScrollHeight) * clientHeight,
            30
          );
          const scrollRatio =
            (effectiveScrollHeight - clientHeight) /
            (clientHeight - thumbHeight);
          el.scrollTop = dragStartScrollTop.current + delta * scrollRatio;
        };

        const onMouseUp = () => {
          isDraggingY.current = false;
          setIsDraggingYState(false);
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);

          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
          hideTimerRef.current = setTimeout(() => {
            setShowY(false);
            setShowX(false);
          }, 800);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      },
      [isControlledY]
    );

    const onMouseDownX = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingX.current = true;
      setIsDraggingXState(true);
      dragStartX.current = e.clientX;
      dragStartScrollLeft.current = viewportRef.current?.scrollLeft ?? 0;

      const onMouseMove = (e: MouseEvent) => {
        const el = viewportRef.current;
        if (!el) return;
        const delta = e.clientX - dragStartX.current;
        const { scrollWidth, clientWidth } = el;
        const thumbWidth = Math.max(
          (clientWidth / scrollWidth) * clientWidth,
          30
        );
        const scrollRatio =
          (scrollWidth - clientWidth) / (clientWidth - thumbWidth);
        el.scrollLeft = dragStartScrollLeft.current + delta * scrollRatio;
      };

      const onMouseUp = () => {
        isDraggingX.current = false;
        setIsDraggingXState(false);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => {
          setShowY(false);
          setShowX(false);
        }, 800);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }, []);

    return (
      <Wrapper style={style}>
        <Viewport
          ref={viewportRef}
          onScroll={handleScroll}
          $overflowX={overflowX}
          $overflowY={overflowY}
        >
          {children}
        </Viewport>

        {overflowY === "scroll" && (
          <TrackY
            $theme={scrollbarTheme}
            $visible={showY}
            $isDragging={isDraggingYState}
          >
            <Thumb
              $theme={scrollbarTheme}
              $isDragging={isDraggingYState}
              ref={thumbYRef}
              style={{ height: 0, top: 0 }}
              onMouseDown={onMouseDownY}
            />
          </TrackY>
        )}

        {overflowX === "scroll" && (
          <TrackX
            $theme={scrollbarTheme}
            $visible={showX}
            $isDragging={isDraggingXState}
          >
            <Thumb
              $theme={scrollbarTheme}
              $isDragging={isDraggingXState}
              ref={thumbXRef}
              style={{ width: 0, left: 0 }}
              onMouseDown={onMouseDownX}
            />
          </TrackX>
        )}
      </Wrapper>
    );
  }
);

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const Viewport = styled.div<{ $overflowX: string; $overflowY: string }>`
  height: 100%;
  width: 100%;
  overflow-x: ${({ $overflowX }) =>
    $overflowX === "scroll" ? "scroll" : "hidden"};
  overflow-y: ${({ $overflowY }) =>
    $overflowY === "scroll" ? "scroll" : "hidden"};

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TrackY = styled.div<{
  $visible: boolean;
  $isDragging?: boolean;
  $theme?: ScrollbarThemeConfig;
}>`
  position: absolute;
  right: 2px;
  top: 2px;
  bottom: 2px;
  width: 5px;
  border-radius: 3px;
  transition: opacity 0.3s ease;
  z-index: 9999;
  opacity: ${({ $visible, $isDragging }) => ($visible || $isDragging ? 1 : 0)};
  pointer-events: auto;
  background-color: ${({ $theme }) => $theme?.scrollbarTrackColor};

  &:hover {
    opacity: 1;
  }
`;

const TrackX = styled.div<{
  $visible: boolean;
  $isDragging?: boolean;
  $theme?: ScrollbarThemeConfig;
}>`
  position: absolute;
  bottom: 2px;
  left: 2px;
  right: 2px;
  height: 5px;
  border-radius: 3px;
  transition: opacity 0.3s ease;
  z-index: 9999;
  opacity: ${({ $visible, $isDragging }) => ($visible || $isDragging ? 1 : 0)};
  pointer-events: auto;
  background-color: ${({ $theme }) => $theme?.scrollbarTrackColor};

  &:hover {
    opacity: 1;
  }
`;

const Thumb = styled.div<{
  $theme?: ScrollbarThemeConfig;
  $isDragging?: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({ $theme, $isDragging }) =>
    $isDragging
      ? $theme?.scrollbarThumbActiveColor
      : $theme?.scrollbarThumbColor};
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  height: 100%;
  will-change: transform;

  &:hover {
    background-color: ${({ $theme }) => $theme?.scrollbarThumbActiveColor};
  }
`;

export { Scrollbar };
