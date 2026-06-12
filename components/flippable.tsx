import { applyClassName } from "./../constants/classname";
import {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled, { CSSProp } from "styled-components";
import { FlippableThemeConfig, useTheme } from "./../theme";

export interface FlippableProps {
  width?: string | number;
  height?: string | number;
  styles?: FlippableStyles;
  onFlip?: (isOpen?: boolean) => void;
  children?: ReactNode;
  back?: ReactNode;
  className?: string;
  id?: string;
  flipDuration?: number;
  flipOnClick?: boolean;
}

export interface FlippableStyles {
  self?: CSSProp;
  backStyle?: CSSProp;
  frontStyle?: CSSProp;
}

export interface FlippableRef {
  flip: () => void;
  unFlip: () => void;
  toggle: () => void;
}

const Flippable = forwardRef<FlippableRef, FlippableProps>(
  (
    {
      children,
      back,
      width = "240px",
      height = "300px",
      styles = {},
      onFlip,
      className,
      id,
      flipDuration = 0.4,
      flipOnClick,
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const flippableTheme = currentTheme?.flippable;

    const [isFlipped, setIsFlipped] = useState(false);
    const isFlippedRef = useRef(false);

    const flip = () => {
      setIsFlipped(true);
      isFlippedRef.current = true;
      onFlip?.(true);
    };

    const unFlip = () => {
      setIsFlipped(false);
      isFlippedRef.current = false;
      onFlip?.(false);
    };

    const toggle = () => {
      if (isFlippedRef.current) {
        unFlip();
      } else {
        flip();
      }
    };

    useImperativeHandle(ref, () => ({
      flip,
      unFlip,
      toggle,
    }));

    return (
      <Container
        id={id}
        className={applyClassName("flippable", className)}
        $width={width}
        $height={height}
        $style={styles.self}
        aria-label="flippable"
        onClick={(e) => {
          e.stopPropagation();
          if (flipOnClick) {
            toggle();
          }
        }}
      >
        <Face
          $flipped={!isFlipped}
          $flipDuration={flipDuration}
          aria-label="flippable-front-face"
          $style={styles.frontStyle}
          $theme={flippableTheme}
        >
          {children}
        </Face>
        <BackFace
          $flipDuration={flipDuration}
          $flipped={isFlipped}
          aria-label="flippable-back-face"
          $style={styles.backStyle}
          $theme={flippableTheme}
        >
          {back}
        </BackFace>
      </Container>
    );
  }
);

const Container = styled.div<{
  $width: string | number;
  $height: string | number;
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  position: relative;

  width: ${({ $width }) =>
    (typeof $width === "number" ? `${$width}px` : $width) ?? "100%"};
  height: ${({ $height }) =>
    (typeof $height === "number" ? `${$height}px` : $height) ?? "100%"};
  cursor: pointer;

  ${({ $style }) => $style};
`;

const Face = styled.div<{
  $style?: CSSProp;
  $theme?: FlippableThemeConfig;
  $flipped: boolean;
  $flipDuration?: number;
}>`
  position: absolute;
  inset: 0;
  border-radius: 10px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: ${({ $theme }) => $theme?.front?.backgroundColor};
  color: ${({ $theme }) => $theme?.front?.textColor};
  border: 1px solid ${({ $theme }) => $theme?.front?.borderColor};
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.08);

  transition:
    transform ${({ $flipDuration }) => ($flipDuration ?? 0.4) / 2.5}s
      cubic-bezier(0.4, 0.2, 0.2, 1)
      ${({ $flipped, $flipDuration }) =>
        $flipped ? `${($flipDuration ?? 0.4) / 2.5}s` : "0s"},
    opacity 0s linear
      ${({ $flipped, $flipDuration }) =>
        $flipped
          ? `${($flipDuration ?? 0.4) / 2.5}s`
          : `${($flipDuration ?? 0.4) / 2.5}s`},
    visibility 0s linear
      ${({ $flipped, $flipDuration }) =>
        $flipped
          ? `${($flipDuration ?? 0.4) / 2.5}s`
          : `${($flipDuration ?? 0.4) / 2.5}s`};

  transform: ${({ $flipped }) =>
    $flipped ? "rotateY(0deg)" : "rotateY(90deg)"};
  opacity: ${({ $flipped }) => ($flipped ? 1 : 0)};
  visibility: ${({ $flipped }) => ($flipped ? "visible" : "hidden")};

  ${({ $style }) => $style};
`;

const BackFace = styled(Face)`
  background-color: ${({ $theme }) => $theme?.back?.backgroundColor};
  color: ${({ $theme }) => $theme?.back?.textColor};
  border: 1px solid ${({ $theme }) => $theme?.back?.borderColor};

  transform: ${({ $flipped }) =>
    $flipped ? "rotateY(0deg)" : "rotateY(-90deg)"};

  ${({ $style }) => $style};
`;

export { Flippable };
