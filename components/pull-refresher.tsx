import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import styled, { CSSProp, keyframes } from "styled-components";
import { LoadingSpinner } from "./loading-spinner";
import { applyClassName } from "./../constants/classname";

export interface PullRefresherProps {
  activatedAt?: string | number;
  preloadingSlot?: ((isReady?: boolean) => ReactNode) | ReactNode;
  loadingSlot?: ReactNode;
  onLoading: (ctx: { stopLoading: () => void }) => void;
  children: ReactNode;
  styles?: PullRefresherStyles;
  id?: string;
  className?: string;
}

type Phase = "idle" | "pulling" | "loading";

export interface PullRefresherStyles {
  containerStyle?: CSSProp;
  slotWrapperStyle?: CSSProp;
  contentStyle?: CSSProp;
}

const SLOT_DISPLAY_HEIGHT = 64;

function PullRefresher({
  activatedAt = "100px",
  preloadingSlot,
  loadingSlot,
  onLoading,
  children,
  styles,
  className,
  id,
}: PullRefresherProps) {
  const threshold = parsePx(activatedAt, 100);

  const [phase, setPhase] = useState<Phase>("idle");
  const [slotHeight, setSlotHeight] = useState(0);
  const [animated, setAnimated] = useState(false);
  const [activated, setActivated] = useState(false);

  const startYRef = useRef<number | null>(null);
  const currentPullRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const applyPull = useCallback(
    (rawDelta: number) => {
      if (rawDelta <= 0) {
        setSlotHeight(0);
        setActivated(false);
        return;
      }
      const pull =
        rawDelta > threshold
          ? threshold + (rawDelta - threshold) * 0.3
          : rawDelta;
      currentPullRef.current = pull;
      setSlotHeight(pull);
      setActivated(pull >= threshold);
    },
    [threshold]
  );

  const stopLoading = useCallback(() => {
    setAnimated(true);
    setSlotHeight(0);
    setPhase("idle");
    phaseRef.current = "idle";
    setTimeout(() => setAnimated(false), 450);
  }, []);

  const triggerLoading = useCallback(() => {
    setPhase("loading");
    phaseRef.current = "loading";
    setAnimated(true);
    setSlotHeight(SLOT_DISPLAY_HEIGHT);
    setTimeout(() => setAnimated(false), 450);
    onLoading({ stopLoading });
  }, [onLoading, stopLoading]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (phaseRef.current !== "idle") return;
    startYRef.current = e.clientY;
    setPhase("pulling");
    phaseRef.current = "pulling";
    currentPullRef.current = 0;
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (phaseRef.current !== "pulling" || startYRef.current === null) return;
      applyPull(e.clientY - startYRef.current);
    };

    const onMouseUp = () => {
      if (phaseRef.current !== "pulling") return;
      if (currentPullRef.current >= threshold) {
        triggerLoading();
      } else {
        setAnimated(true);
        setSlotHeight(0);
        setActivated(false);
        setPhase("idle");
        phaseRef.current = "idle";
        setTimeout(() => setAnimated(false), 450);
      }
      startYRef.current = null;
      currentPullRef.current = 0;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [applyPull, threshold, triggerLoading]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (phaseRef.current !== "idle") return;
    startYRef.current = e.touches[0].clientY;
    setPhase("pulling");
    phaseRef.current = "pulling";
    currentPullRef.current = 0;
  }, []);

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (phaseRef.current !== "pulling" || startYRef.current === null) return;
      applyPull(e.touches[0].clientY - startYRef.current);
    };

    const onTouchEnd = () => {
      if (phaseRef.current !== "pulling") return;
      if (currentPullRef.current >= threshold) {
        triggerLoading();
      } else {
        setAnimated(true);
        setSlotHeight(0);
        setActivated(false);
        setPhase("idle");
        phaseRef.current = "idle";
        setTimeout(() => setAnimated(false), 450);
      }
      startYRef.current = null;
      currentPullRef.current = 0;
    };

    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [applyPull, threshold, triggerLoading]);

  const resolvedPreloading =
    typeof preloadingSlot === "function" ? (
      preloadingSlot(activated)
    ) : preloadingSlot ? (
      preloadingSlot
    ) : (
      <DefaultPreloadingSlot activated={activated} />
    );

  const resolvedLoading =
    loadingSlot !== undefined ? loadingSlot : <LoadingSpinner iconSize={30} />;

  return (
    <Container
      id={id}
      className={applyClassName("pull-refresher", className)}
      $style={styles?.containerStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      aria-label="pull-refresher-container"
    >
      <SlotWrapper
        $height={slotHeight}
        $animated={animated}
        aria-label="pull-refresher-slot-loader"
        $style={styles?.slotWrapperStyle}
      >
        {slotHeight > 0 &&
          (phase === "loading" ? resolvedLoading : resolvedPreloading)}
      </SlotWrapper>

      <Content
        aria-label="pull-refresher-content"
        $style={styles?.contentStyle}
      >
        {children}
      </Content>
    </Container>
  );
}

const SlotWrapper = styled.div<{
  $height: number;
  $animated: boolean;
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 13px;
  height: ${({ $height }) => $height}px;
  transition: ${({ $animated }) =>
    $animated ? "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)" : "none"};

  ${({ $style }) => $style}
`;

const Container = styled.div<{ $style?: CSSProp }>`
  position: relative;
  overflow: hidden;
  width: 100%;
  user-select: none;
  height: 80dvh;
  max-height: 80dvh;

  ${({ $style }) => $style}
`;

const Content = styled.div<{ $style?: CSSProp }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  max-height: 80dvh;

  ${({ $style }) => $style}
`;

const Arrow = styled.svg<{ $flipped: boolean }>`
  transition: transform 0.2s ease;
  transform: ${({ $flipped }) =>
    $flipped ? "rotate(180deg)" : "rotate(0deg)"};
`;

const DefaultPreloadingSlot: React.FC<{ activated: boolean }> = ({
  activated,
}) => (
  <Arrow
    $flipped={activated}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </Arrow>
);

function parsePx(value: string | number | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  if (typeof value === "number") return value;
  const n = parseFloat(value);
  return isNaN(n) ? fallback : n;
}

export { PullRefresher };
