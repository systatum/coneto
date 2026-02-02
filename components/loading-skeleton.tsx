import React, { HTMLAttributes, ReactNode } from "react";
import styled, { CSSProp, keyframes } from "styled-components";

export interface LoadingSkeletonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: CSSProp;
  children?: ReactNode;
}

function LoadingSkeleton({ style, children, ...props }: LoadingSkeletonProps) {
  return (
    <LoadingSkeletonWrapper
      aria-label="loading-skeleton-wrapper"
      {...props}
      $style={style}
    >
      {children}
    </LoadingSkeletonWrapper>
  );
}

const LoadingSkeletonWrapper = styled.div<{ $style?: CSSProp }>`
  width: 100%;
  padding: 16px;

  ${({ $style }) => $style}
`;

export interface LoadingSkeletonItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: CSSProp;
  height?: number | string;
  width?: number | string;
}

function LoadingSkeletonItem({
  style,
  height,
  width,
  ...props
}: LoadingSkeletonItemProps) {
  return (
    <LoadingSkeletonItemStyled
      aria-label="loading-skeleton-item"
      {...props}
      $width={width}
      $height={height}
      $style={style}
    />
  );
}

const shimmer = keyframes`
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
`;

const LoadingSkeletonItemStyled = styled.div<{
  $height?: string | number;
  $width?: string | number;
  $style?: CSSProp;
}>`
  height: ${({ $height }) =>
    typeof $height === "number" ? `${$height}px` : $height || "16px"};
  width: ${({ $width }) =>
    typeof $width === "number" ? `${$width}px` : $width || "100%"};
  border-radius: 6px;
  background: linear-gradient(90deg, #eeeeee 25%, #dddddd 37%, #eeeeee 63%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s ease infinite;

  ${({ $style }) => $style}
`;

LoadingSkeleton.Item = LoadingSkeletonItem;

export { LoadingSkeleton };
