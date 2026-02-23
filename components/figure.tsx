import { ComponentType, ImgHTMLAttributes, HTMLAttributes } from "react";
import styled, { CSSProp } from "styled-components";

export interface FigureProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  icon?: ComponentType<any> | string;
  iconSize?: number;
  iconColor?: string;
  styles?: FigureStylesProps;
}

export interface FigureStylesProps {
  self?: CSSProp;
}

function Figure({
  icon: Icon,
  iconSize = 16,
  iconColor,
  styles,
  "aria-label": ariaLabel,
  ...rest
}: FigureProps) {
  if (!Icon) return null;

  return (
    <Wrapper {...rest}>
      {typeof Icon === "string" ? (
        <img
          alt="figure-icon"
          src={Icon}
          width={iconSize}
          height={iconSize}
          aria-label={ariaLabel}
        />
      ) : (
        <Icon
          size={iconSize}
          aria-label={ariaLabel}
          style={{ color: iconColor ?? "black" }}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.span<{ $style?: CSSProp }>`
  ${({ $style }) => $style}
`;

export { Figure };
