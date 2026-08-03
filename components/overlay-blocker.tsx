import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled, { CSSProp } from "styled-components";
import { applyClassName } from "./../constants/classname";
import { OverlayBlockerThemeConfig } from "./../theme";
import { useTheme } from "./../theme/provider";

export interface OverlayBlockerRef {
  close: () => void;
  open: () => void;
}

export type OverlayBlockerClickHandler =
  | "close"
  | "preventDefault"
  | ((helpers: { close: () => void; preventDefault: () => void }) => void);

export interface OverlayBlockerProps {
  show?: boolean;
  zIndex?: number;
  onClick?: OverlayBlockerClickHandler;
  styles?: OverlayBlockerStyles;
  children?: ReactNode;
  className?: string;
  id?: string;
  exemptRegions?: string[];

  /**
   * Scopes the overlay to its nearest positioned ancestor. The parent must be (or
   * become) `position: relative` for this to be contained correctly.
   */
  relative?: boolean;
}

export interface OverlayBlockerStyles {
  self?: CSSProp;
}

export const OverlayBlocker = forwardRef<
  OverlayBlockerRef,
  OverlayBlockerProps
>(
  (
    {
      show = false,
      zIndex,
      onClick = "close",
      styles,
      children,
      className,
      id,
      exemptRegions: _exemptRegions,
      relative = false,
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const overlayBlockerTheme = currentTheme.overlayBlocker;

    const resolvedZIndex = zIndex ?? (relative ? 10 : 9991999);

    const exemptRegions = [
      ".coneto-paper-dialog",
      ".coneto-dialog",
      ".coneto-sidebar",
      "#combo-list",
      ...(_exemptRegions ?? []),
    ];

    const [visible, setVisible] = useState(show);
    const overlayNodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!visible) return;

      if (document.querySelector(".sbdocs-content")) return;

      const safeRegions = exemptRegions ?? [];

      const scrollY = window.scrollY;
      const body = document.body;

      // `relative` scopes this to its own container, so the rest of the
      // page must keep scrolling normally - only lock/restore the body
      // when blocking the whole viewport.
      const prev = !relative
        ? {
            overflow: body.style.overflow,
            position: body.style.position,
            top: body.style.top,
            width: body.style.width,
          }
        : null;

      if (prev) {
        body.style.overflow = "hidden";
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.width = "100%";
      }

      const allow = (target: EventTarget | null) =>
        isInSafeZone(target, safeRegions);

      // When relative, only wheel/touch events landing on this overlay's
      // own footprint are blocked - everything else on the page scrolls
      // through untouched.
      const withinScope = (target: EventTarget | null) =>
        !relative ||
        (target instanceof Node && overlayNodeRef.current?.contains(target));

      const blockWheel = (e: WheelEvent) => {
        if (allow(e.target) || !withinScope(e.target)) return;
        e.preventDefault();
      };

      const blockTouch = (e: TouchEvent) => {
        if (allow(e.target) || !withinScope(e.target)) return;
        e.preventDefault();
      };

      window.addEventListener("wheel", blockWheel, { passive: false });
      window.addEventListener("touchmove", blockTouch, { passive: false });

      return () => {
        if (prev) {
          body.style.overflow = prev.overflow;
          body.style.position = prev.position;
          body.style.top = prev.top;
          body.style.width = prev.width;

          window.scrollTo(0, scrollY);
        }

        window.removeEventListener("wheel", blockWheel);
        window.removeEventListener("touchmove", blockTouch);
      };
    }, [exemptRegions, visible, relative]);

    const isInSafeZone = (target: EventTarget | null, regions: string[]) => {
      if (!(target instanceof Element)) {
        return false;
      }

      let el: Element | null = target;

      while (el) {
        const matched = regions.some((region) => {
          if (region.startsWith("#")) {
            return el.id === region.slice(1);
          }

          if (region.startsWith(".")) {
            return el.classList.contains(region.slice(1));
          }

          return false;
        });

        if (matched) {
          return true;
        }

        el = el.parentElement;
      }

      return false;
    };

    useEffect(() => {
      setVisible(show);
    }, [show]);

    const close = useCallback(() => {
      setVisible(false);
    }, []);

    const open = useCallback(() => {
      setVisible(true);
    }, []);

    useImperativeHandle(ref, () => ({
      close,
      open,
    }));

    const handleClick = () => {
      let defaultPrevented = false;

      const preventDefault = () => {
        defaultPrevented = true;
      };

      if (typeof onClick === "function") {
        onClick({ close, preventDefault });
      } else if (onClick === "preventDefault") {
        preventDefault();
        return;
      } else if (onClick === "close") {
        close();
        return;
      }

      if (!defaultPrevented) {
        close();
      }
    };

    if (!visible) return null;

    return (
      <StyledOverlay
        ref={overlayNodeRef}
        id={id}
        className={applyClassName("overlay-blocker", className)}
        aria-label="overlay-blocker"
        $zIndex={resolvedZIndex}
        $relative={relative}
        $theme={overlayBlockerTheme}
        onClick={handleClick}
        $style={styles?.self}
      >
        {children}
      </StyledOverlay>
    );
  }
);

const StyledOverlay = styled.div<{
  $zIndex: number;
  $relative?: boolean;
  $style?: CSSProp;
  $theme?: OverlayBlockerThemeConfig;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  overscroll-behavior: none;

  position: ${({ $relative }) => ($relative ? "absolute" : "fixed")};
  inset: 0;
  pointer-events: auto;
  background: ${({ $theme }) =>
    $theme?.backgroundColor ?? "rgba(3, 3, 3, 0.2)"};

  backdrop-filter: ${({ $theme }) => $theme?.backdropFilter ?? "blur(2px)"};

  z-index: ${({ $zIndex }) => $zIndex};

  ${({ $style }) => $style}
`;
