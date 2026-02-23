import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
  useEffect,
} from "react";
import styled, { CSSProp } from "styled-components";

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
}

export interface OverlayBlockerStylesProps {
  self?: CSSProp;
}

export const OverlayBlocker = forwardRef<
  OverlayBlockerRef,
  OverlayBlockerProps
>(({ show = false, zIndex = 9991999, onClick = "close", styles }, ref) => {
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
      $zIndex={zIndex}
      onClick={handleClick}
      $style={styles?.self}
    />
  );
});

const StyledOverlay = styled.div<{ $zIndex: number; $style?: CSSProp }>`
  position: absolute;
  inset: 0;
  background: rgba(3, 3, 3, 0.2);
  backdrop-filter: blur(2px);
  pointer-events: auto;
  z-index: ${({ $zIndex }) => $zIndex};

  ${({ $style }) => $style}
`;
