import {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import styled, { CSSProp } from "styled-components";
import { OverlayBlockerThemeConfig } from "./../theme";
import { useTheme } from "./../theme/provider";
import { applyClassName } from "./../constants/classname";

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
      zIndex = 9991999,
      onClick = "close",
      styles,
      children,
      className,
      id,
      exemptRegions: _exemptRegions,
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const overlayBlockerTheme = currentTheme.overlayBlocker;

    const exemptRegions = [
      ".coneto-paper-dialog",
      ".coneto-dialog",
      ".coneto-sidebar",
      ...(_exemptRegions ?? []),
    ];

    const [visible, setVisible] = useState(show);

    useEffect(() => {
      if (!visible) return;

      if (document.querySelector(".sbdocs-content")) return;

      const safeRegions = exemptRegions ?? [];

      const scrollY = window.scrollY;
      const body = document.body;

      const prev = {
        overflow: body.style.overflow,
        position: body.style.position,
        top: body.style.top,
        width: body.style.width,
      };

      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.width = "100%";

      const allow = (target: EventTarget | null) =>
        isInSafeZone(target, safeRegions);

      const blockWheel = (e: WheelEvent) => {
        if (allow(e.target)) return;
        e.preventDefault();
      };

      const blockTouch = (e: TouchEvent) => {
        if (allow(e.target)) return;
        e.preventDefault();
      };

      window.addEventListener("wheel", blockWheel, { passive: false });
      window.addEventListener("touchmove", blockTouch, { passive: false });

      return () => {
        body.style.overflow = prev.overflow;
        body.style.position = prev.position;
        body.style.top = prev.top;
        body.style.width = prev.width;

        window.removeEventListener("wheel", blockWheel);
        window.removeEventListener("touchmove", blockTouch);

        window.scrollTo(0, scrollY);
      };
    }, [exemptRegions, visible]);

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
        id={id}
        className={applyClassName("overlay-blocker", className)}
        aria-label="overlay-blocker"
        $zIndex={zIndex}
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
  $style?: CSSProp;
  $theme?: OverlayBlockerThemeConfig;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  overscroll-behavior: none;

  position: fixed;
  inset: 0;
  pointer-events: auto;
  background: ${({ $theme }) =>
    $theme?.backgroundColor ?? "rgba(3, 3, 3, 0.2)"};

  backdrop-filter: ${({ $theme }) => $theme?.backdropFilter ?? "blur(2px)"};

  z-index: ${({ $zIndex }) => $zIndex};

  ${({ $style }) => $style}
`;
