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
        onClick={toggle}
        $width={width}
        $height={height}
        $style={styles.self}
        $flipped={isFlipped}
        $flipDuration={flipDuration}
        aria-label="flippable"
      >
        <Face
          aria-label="flippable-face"
          $style={styles.frontStyle}
          $theme={flippableTheme}
        >
          {children}
        </Face>
        <BackFace
          aria-label="flippable-face"
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
  $flipped: boolean;
  $flipDuration?: number;
}>`
  display: flex;
  flex-direction: column;
  position: relative;

  width: ${({ $width }) =>
    (typeof $width === "number" ? `${$width}px` : $width) ?? "100%"};
  height: ${({ $height }) =>
    (typeof $height === "number" ? `${$height}px` : $height) ?? "100%"};
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform ${({ $flipDuration }) => $flipDuration ?? 0.4}s
    cubic-bezier(0.4, 0.2, 0.2, 1);
  transform: rotateY(${({ $flipped }) => ($flipped ? "180deg" : "0deg")});

  ${({ $style }) => $style};
`;

const Face = styled.div<{ $style?: CSSProp; $theme?: FlippableThemeConfig }>`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 10px;
  overflow: hidden;
  background-color: ${({ $theme }) => $theme?.front?.backgroundColor};
  color: ${({ $theme }) => $theme?.front?.textColor};
  border: 1px solid ${({ $theme }) => $theme?.front?.borderColor};

  ${({ $style }) => $style};
`;

const BackFace = styled(Face)`
  transform: rotateY(180deg);
  background-color: ${({ $theme }) => $theme?.back?.backgroundColor};
  color: ${({ $theme }) => $theme?.back?.textColor};
  border: 1px solid ${({ $theme }) => $theme?.back?.borderColor};

  ${({ $style }) => $style};
`;

export { Flippable };
