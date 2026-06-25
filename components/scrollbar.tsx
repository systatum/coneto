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
    const [thumbY, setThumbY] = useState({ height: 0, top: 0 });
    const [thumbX, setThumbX] = useState({ width: 0, left: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
    const isDraggingY = useRef(false);
    const isDraggingX = useRef(false);
    const dragStartY = useRef(0);
    const dragStartX = useRef(0);
    const dragStartScrollTop = useRef(0);
    const dragStartScrollLeft = useRef(0);

    useImperativeHandle(ref, () => ({
      getViewport: () => viewportRef.current,
    }));

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

      if (overflowY === "scroll" && scrollHeight > clientHeight) {
        const heightRatio = clientHeight / scrollHeight;
        const thumbHeight = Math.max(heightRatio * clientHeight, 30);
        const maxScrollTop = scrollHeight - clientHeight;
        const maxThumbTop = clientHeight - thumbHeight;
        const thumbTop = (scrollTop / maxScrollTop) * maxThumbTop;
        setThumbY({ height: thumbHeight - 4, top: thumbTop });
      }

      if (overflowX === "scroll" && scrollWidth > clientWidth) {
        const widthRatio = clientWidth / scrollWidth;
        const thumbWidth = Math.max(widthRatio * clientWidth, 30);
        const maxScrollLeft = scrollWidth - clientWidth;
        const maxThumbLeft = clientWidth - thumbWidth;
        const thumbLeft = (scrollLeft / maxScrollLeft) * maxThumbLeft;
        setThumbX({ width: thumbWidth - 4, left: thumbLeft });
      }
    }, [overflowX, overflowY]);

    const showScrollbars = useCallback(() => {
      const el = viewportRef.current;
      if (!el) return;

      if (overflowY === "scroll" && el.scrollHeight > el.clientHeight)
        setShowY(true);
      if (overflowX === "scroll" && el.scrollWidth > el.clientWidth)
        setShowX(true);

      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        if (!isDraggingY.current && !isDraggingX.current) {
          setShowY(false);
          setShowX(false);
        }
      }, autoHideDelay);
    }, [autoHideDelay, overflowX, overflowY]);

    const handleScroll = useCallback(() => {
      updateThumbs();
      showScrollbars();
      onScroll?.();
    }, [updateThumbs, showScrollbars, onScroll]);

    useEffect(() => {
      const el = viewportRef.current;
      if (!el) return;
      const ro = new ResizeObserver(() => updateThumbs());
      ro.observe(el);
      return () => ro.disconnect();
    }, [updateThumbs]);

    const onMouseDownY = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingY.current = true;
      dragStartY.current = e.clientY;
      dragStartScrollTop.current = viewportRef.current?.scrollTop ?? 0;

      const onMouseMove = (e: MouseEvent) => {
        const el = viewportRef.current;
        if (!el) return;
        const delta = e.clientY - dragStartY.current;
        const { scrollHeight, clientHeight } = el;
        const thumbHeight = Math.max(
          (clientHeight / scrollHeight) * clientHeight,
          30
        );
        const scrollRatio =
          (scrollHeight - clientHeight) / (clientHeight - thumbHeight);
        el.scrollTop = dragStartScrollTop.current + delta * scrollRatio;
      };

      const onMouseUp = () => {
        isDraggingY.current = false;
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

    const onMouseDownX = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingX.current = true;
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
            onMouseEnter={() => setIsDragging(true)}
            onMouseLeave={() => setIsDragging(false)}
            $visible={showY}
            $isDragging={isDragging}
          >
            <Thumb
              $theme={scrollbarTheme}
              ref={thumbYRef}
              style={{ height: thumbY.height, top: thumbY.top }}
              onMouseDown={onMouseDownY}
            />
          </TrackY>
        )}

        {overflowX === "scroll" && (
          <TrackX
            $theme={scrollbarTheme}
            onMouseEnter={() => setIsDragging(true)}
            onMouseLeave={() => setIsDragging(false)}
            $visible={showX}
            $isDragging={isDragging}
          >
            <Thumb
              $theme={scrollbarTheme}
              ref={thumbXRef}
              style={{ width: thumbX.width, left: thumbX.left }}
              onMouseDown={onMouseDownX}
            />
          </TrackX>
        )}
      </Wrapper>
    );
  }
);

Scrollbar.displayName = "Scrollbar";

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

const Thumb = styled.div<{ $theme?: ScrollbarThemeConfig }>`
  position: absolute;
  background-color: ${({ $theme }) => $theme?.scrollbarThumbColor};
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  height: 100%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

export { Scrollbar };
