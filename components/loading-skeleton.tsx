import {
  Children,
  cloneElement,
  HTMLAttributes,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";
import styled, { css, CSSProp, keyframes } from "styled-components";

type FlashDirection =
  | "left-to-right"
  | "right-to-left"
  | "top-to-bottom"
  | "bottom-to-top";

type FlashRate = "slow" | "normal" | "fast" | number;

export interface LoadingSkeletonOptionsProps {
  flashDirection?: FlashDirection;
  flashRate?: FlashRate;
  baseColor?: string;
  highlightColor?: string;
}

interface LoadingSkeletonBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  children?: ReactNode;
  styles?: LoadingSkeletonStyles;
}

export interface LoadingSkeletonStyles {
  self?: CSSProp;
}

export interface LoadingSkeletonProps
  extends LoadingSkeletonBaseProps,
    LoadingSkeletonOptionsProps {
  height?: number | string;
  width?: number | string;
}

function LoadingSkeleton({
  styles,
  children,
  flashRate = "normal",
  flashDirection = "left-to-right",
  baseColor,
  highlightColor,
  ...props
}: LoadingSkeletonProps) {
  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <LoadingSkeletonWrapper
      aria-label="loading-skeleton-wrapper"
      {...props}
      $style={styles?.self}
    >
      {childArray.map((child, index) => {
        const componentChild = child as ReactElement<
          LoadingSkeletonItemProps & LoadingSkeletonOptionsProps
        >;

        const isItem = componentChild.type === LoadingSkeleton.Item;

        return cloneElement(componentChild, {
          key: index,
          ...(isItem && {
            ...componentChild.props,
            flashDirection:
              componentChild.props.flashDirection ?? flashDirection,
            flashRate: componentChild.props.flashRate ?? flashRate,
            baseColor: componentChild.props.baseColor ?? baseColor,
            highlightColor:
              componentChild.props.highlightColor ?? highlightColor,
          }),
        });
      })}
    </LoadingSkeletonWrapper>
  );
}

const LoadingSkeletonWrapper = styled.div<{ $style?: CSSProp }>`
  width: 100%;
  padding: 16px;

  ${({ $style }) => $style}
`;

export interface LoadingSkeletonItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "style">,
    LoadingSkeletonOptionsProps {
  styles?: LoadingSkeletonStyles;
  height?: number | string;
  width?: number | string;
}

function LoadingSkeletonItem({
  styles,
  height,
  width,
  flashDirection,
  flashRate,
  baseColor,
  highlightColor,
  ...props
}: LoadingSkeletonItemProps) {
  return (
    <LoadingSkeletonItemStyled
      aria-label="loading-skeleton-item"
      {...props}
      $width={width}
      $height={height}
      $style={styles?.self}
      $flashDirection={flashDirection}
      $flashRate={flashRate}
      $baseColor={baseColor}
      $highlightColor={highlightColor}
    />
  );
}

const shimmerX = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const shimmerXReverse = keyframes`
  0% { background-position: 400px 0; }
  100% { background-position: -400px 0; }
`;

const shimmerY = keyframes`
  0% { background-position: 0 -400px; }
  100% { background-position: 0 400px; }
`;

const shimmerYReverse = keyframes`
  0% { background-position: 0 400px; }
  100% { background-position: 0 -400px; }
`;

const LoadingSkeletonItemStyled = styled.div<{
  $height?: string | number;
  $width?: string | number;
  $style?: CSSProp;
  $flashDirection?: FlashDirection;
  $flashRate?: FlashRate;
  $baseColor?: string;
  $highlightColor?: string;
}>`
  height: ${({ $height }) =>
    typeof $height === "number" ? `${$height}px` : $height || "16px"};
  width: ${({ $width }) =>
    typeof $width === "number" ? `${$width}px` : $width || "100%"};

  border-radius: 6px;

  background: ${({
    $flashDirection,
    $baseColor = "#eeeeee",
    $highlightColor = "#dddddd",
  }) =>
    $flashDirection === "top-to-bottom" || $flashDirection === "bottom-to-top"
      ? css`linear-gradient(
          180deg,
          ${$baseColor} 25%,
          ${$highlightColor} 37%,
          ${$baseColor} 63%
        )`
      : css`linear-gradient(
          90deg,
          ${$baseColor} 25%,
          ${$highlightColor} 37%,
          ${$baseColor} 63%
        )`};

  background-size: ${({ $flashDirection }) =>
    $flashDirection === "top-to-bottom" || $flashDirection === "bottom-to-top"
      ? "100% 400px"
      : "400px 100%"};

  animation: ${({ $flashDirection }) => resolveAnimation($flashDirection)}
    ${({ $flashRate }) => resolveRate($flashRate)} ease infinite;

  ${({ $style }) => $style}
`;

const resolveAnimation = (direction?: FlashDirection) => {
  switch (direction) {
    case "right-to-left":
      return shimmerXReverse;
    case "top-to-bottom":
      return shimmerY;
    case "bottom-to-top":
      return shimmerYReverse;
    case "left-to-right":
    default:
      return shimmerX;
  }
};

const resolveRate = (rate?: "slow" | "normal" | "fast" | number) => {
  if (typeof rate === "number") return `${rate}s`;

  switch (rate) {
    case "slow":
      return "2s";
    case "fast":
      return "0.8s";
    default:
      return "1.4s";
  }
};

LoadingSkeleton.Item = LoadingSkeletonItem;

export { LoadingSkeleton };
