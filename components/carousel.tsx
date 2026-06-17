import { applyClassName } from "./../constants/classname";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import {
  Children,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { css, CSSProp } from "styled-components";

export interface CarouselProps {
  length?: number;
  currentPage?: number;
  onChange?: (event?: CarouselChangeEvent) => void;
  initialPage?: number;
  controller?: boolean | CarouselControl;
  styles?: CarouselStyles;
  children?: ReactNode;
  className?: string;
  autoHeight?: boolean;
  id?: string;
}

export interface CarouselControl {
  circle?: CarouselCirclePosition | null;
  arrow?: CarouselArrowPosition | null;
}

export interface CarouselChangeEvent {
  page: number;
  preventDefault: () => void;
}

export const CarouselCirclePosition = {
  BottomCenter: "bottom-center",
  TopCenter: "top-center",
} as const;

export type CarouselCirclePosition =
  (typeof CarouselCirclePosition)[keyof typeof CarouselCirclePosition];

export const CarouselArrowPosition = {
  CenterSide: "center-side",
} as const;

export type CarouselArrowPosition =
  (typeof CarouselArrowPosition)[keyof typeof CarouselArrowPosition];

export interface CarouselStyles {
  containerStyle?: CSSProp;
  controlStyle?: CSSProp;
  contentStyle?: CSSProp;
  arrowStyle?: CSSProp;
}

function Carousel({
  children,
  length,
  currentPage,
  initialPage = 0,
  controller = true,
  styles,
  id,
  className,
  autoHeight,
  onChange,
}: CarouselProps) {
  const slides = Children.toArray(children);
  const totalPages = length ?? slides.length;

  const [internalPage, setInternalPage] = useState(() =>
    clamp(initialPage - 1, 0, Math.max(0, totalPages - 1))
  );

  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const isControlled = currentPage !== undefined;
  const activePage = isControlled
    ? clamp(currentPage, 0, Math.max(0, totalPages - 1))
    : internalPage;

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    if (!autoHeight) {
      return;
    }

    const slide = slideRefs.current[activePage];

    if (!slide) {
      return;
    }

    const updateHeight = () => {
      setHeight(slide.offsetHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);

    resizeObserver.observe(slide);

    return () => {
      resizeObserver.disconnect();
    };
  }, [activePage, autoHeight]);

  const goTo = useCallback(
    (page: number) => {
      const nextPage = clamp(page, 0, totalPages - 1);

      let prevented = false;

      if (onChange) {
        onChange({
          page: nextPage,
          preventDefault: () => {
            prevented = true;
          },
        });
      }

      if (prevented) {
        return;
      }

      if (!isControlled) {
        setInternalPage(nextPage);
      }
    },
    [isControlled, totalPages, onChange]
  );

  const handlePrev = useCallback(() => {
    const prevPage = activePage - 1;

    goTo(prevPage);
  }, [activePage, goTo]);

  const handleNext = useCallback(() => {
    const nextPage = activePage + 1;

    goTo(nextPage);
  }, [activePage, goTo]);

  const rootRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(totalPages - 1);
      }
    },
    [handlePrev, handleNext, goTo, totalPages]
  );

  // drag process
  const dragStartX = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) {
      return;
    }

    setDragging(true);
    const delta = e.clientX - dragStartX.current;

    setDragOffset(delta);
  };

  const handlePointerUp = () => {
    if (dragOffset < -100) {
      handleNext();
    } else if (dragOffset > 100) {
      handlePrev();
    }

    setDragOffset(0);
    setDragging(false);
    dragStartX.current = null;
  };

  useEffect(() => {
    console.log("active", activePage);
    console.log("slide", slideRefs.current[activePage]);
    console.log("height", slideRefs.current[activePage]?.offsetHeight);
  }, [activePage]);

  useEffect(() => {
    if (!isControlled) {
      setInternalPage(clamp(initialPage, 0, Math.max(0, totalPages - 1)));
    }
  }, []);

  const atStart = activePage === 0;
  const atEnd = activePage >= totalPages - 1;

  return (
    <Container
      ref={rootRef}
      role="region"
      aria-label="carousel"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      id={id}
      className={applyClassName("carousel", className)}
      $style={styles?.containerStyle}
      $height={autoHeight ? height : undefined}
    >
      <Track $page={activePage} $dragging={dragging} $dragOffset={dragOffset}>
        {slides.map((slide, i) => (
          <Slide
            key={i}
            role="group"
            ref={(element) => {
              slideRefs.current[i] = element;
            }}
            aria-roledescription="slide"
            aria-label={`carousel-slide-${i + 1}-of-${totalPages}`}
            aria-hidden={i !== activePage}
            $style={styles?.contentStyle}
          >
            {slide}
          </Slide>
        ))}
      </Track>

      <PrevButton
        $controller={controller}
        onClick={handlePrev}
        disabled={atStart}
        aria-label="carousel-previous-slide"
        $style={css`
          ${defaultArrowCss}
          ${styles?.arrowStyle}
        `}
      >
        <RiArrowLeftSLine />
      </PrevButton>

      <NextButton
        $controller={controller}
        onClick={handleNext}
        disabled={atEnd}
        aria-label="carousel-next-slide"
        $style={css`
          ${defaultArrowCss}
          ${styles?.arrowStyle}
        `}
      >
        <RiArrowRightSLine />
      </NextButton>

      {controller && totalPages > 1 && (
        <Controls
          $controller={controller}
          $controlStyle={styles?.controlStyle}
          role="tablist"
          aria-label="carousel-slides"
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <ControlDot
              key={i}
              $active={i === activePage}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === activePage}
              aria-label={`carousel-slide-${i + 1}`}
            />
          ))}
        </Controls>
      )}
    </Container>
  );
}

const Container = styled.div<{ $style?: CSSProp; $height?: number }>`
  position: relative;
  width: 100%;
  overflow: hidden;
  touch-action: pan-y;
  user-select: none;

  ${({ $height }) =>
    $height &&
    css`
      height: ${$height}px;
      transition: height 300ms ease;
    `};

  ${({ $style }) => $style}
`;

const Track = styled.div<{
  $page: number;
  $dragOffset?: number;
  $dragging?: boolean;
}>`
  display: flex;
  align-items: flex-start;
  will-change: transform;
  transition: ${({ $dragging }) =>
    $dragging ? "none" : "transform 380ms cubic-bezier(0.4, 0, 0.2, 1)"};
  ${({ $page, $dragOffset }) => css`
    transform: translateX(calc(${$page * -100}% + ${$dragOffset}px));
  `};
`;

const Slide = styled.div<{ $style?: CSSProp }>`
  flex: 0 0 100%;
  min-width: 0;
  padding: 4px;

  ${({ $style }) => $style}
`;

const ArrowButton = styled.button<{
  $style?: CSSProp;
  $controller?: CarouselControl | boolean;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0.5rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;

  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: #1a1a1a;

  transition:
    background 180ms ease,
    box-shadow 180ms ease,
    opacity 180ms ease;

  &:hover:not(:disabled) {
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

const PrevButton = styled(ArrowButton)`
  ${({ $controller }) =>
    shouldShowControl($controller, "arrow")
      ? css`
          left: 0.75rem;
        `
      : css`
          display: none;
        `}

  ${({ $style }) => $style}
`;

const NextButton = styled(ArrowButton)`
  ${({ $controller }) =>
    shouldShowControl($controller, "arrow")
      ? css`
          right: 0.75rem;
        `
      : css`
          display: none;
        `}

  ${({ $style }) => $style}
`;

const defaultArrowCss = css`
  width: 2.25rem;
  height: 2.25rem;

  svg {
    display: block;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
`;

const controlPositionStyles: Record<CarouselCirclePosition, CSSProp> = {
  "bottom-center": css`
    position: absolute;
    bottom: 0.875rem;
    left: 50%;
    transform: translateX(-50%);
    justify-content: center;
  `,
  "top-center": css`
    position: absolute;
    top: 0.875rem;
    left: 50%;
    transform: translateX(-50%);
    justify-content: center;
  `,
};

const Controls = styled.div<{
  $controller: CarouselControl | boolean;
  $controlStyle?: CSSProp;
}>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  pointer-events: none;

  ${({ $controller }) =>
    shouldShowControl($controller, "circle")
      ? typeof $controller === "object"
        ? controlPositionStyles[$controller.circle ?? "bottom-center"]
        : controlPositionStyles["bottom-center"]
      : css`
          display: none;
        `}

  ${({ $controlStyle }) => $controlStyle}
`;

const shouldShowControl = (
  control: CarouselControl | boolean | undefined,
  type: "arrow" | "circle"
) => {
  if (control === true) return true;
  if (control === false) return false;

  if (typeof control === "object") {
    return control[type] !== null;
  }

  return false;
};

const ControlDot = styled.button<{ $active: boolean; $style?: CSSProp }>`
  pointer-events: all;
  width: ${({ $active }) => ($active ? "1.5rem" : "0.5rem")};
  height: 0.5rem;
  border-radius: 9999px;
  border: none;
  padding: 0;
  cursor: pointer;
  transition:
    width 250ms ease,
    background 250ms ease;
  background: ${({ $active }) => ($active ? "#3b82f6" : "rgba(0, 0, 0, 0.25)")};

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  ${({ $style }) => $style}
`;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export { Carousel };

Carousel.CircleControllerPosition = CarouselCirclePosition;
Carousel.ArrowControllerPosition = CarouselArrowPosition;
