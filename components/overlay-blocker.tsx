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
  styles?: OverlayBlockerStylesProps;
  children?: ReactNode;
}

export interface OverlayBlockerStylesProps {
  self?: CSSProp;
}

export const OverlayBlocker = forwardRef<
  OverlayBlockerRef,
  OverlayBlockerProps
>(
  (
    { show = false, zIndex = 9991999, onClick = "close", styles, children },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const overlayBlockerTheme = currentTheme.overlayBlocker;

    const [visible, setVisible] = useState(show);

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
  position: absolute;
  inset: 0;
  pointer-events: auto;
  background: ${({ $theme }) =>
    $theme?.backgroundColor ?? "rgba(3, 3, 3, 0.2)"};

  backdrop-filter: ${({ $theme }) => $theme?.backdropFilter ?? "blur(2px)"};

  z-index: ${({ $zIndex }) => $zIndex};

  ${({ $style }) => $style}
`;
