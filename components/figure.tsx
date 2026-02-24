import { ComponentType, HTMLAttributes } from "react";
import styled, { CSSProp } from "styled-components";

export interface FigureProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  image?: ComponentType<any> | string;
  size?: number;
  color?: string;
  styles?: FigureStylesProps;
}

export interface FigureStylesProps {
  self?: CSSProp;
}

function Figure({
  image: Icon,
  size = 16,
  color,
  styles,
  "aria-label": ariaLabel,
  ...rest
}: FigureProps) {
  if (!Icon) return null;

  return (
    <Wrapper {...rest} $style={styles?.self}>
      {typeof Icon === "string" ? (
        <img
          alt="figure-icon"
          src={Icon}
          width={size}
          height={size}
          aria-label={ariaLabel}
        />
      ) : (
        <Icon
          size={size}
          aria-label={ariaLabel}
          style={{ color: color ?? "black" }}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.span<{ $style?: CSSProp }>`
  ${({ $style }) => $style}
`;

export { Figure };
