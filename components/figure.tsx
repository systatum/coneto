import { c } from "framer-motion/dist/types.d-Cjd591yU";
import { applyClassName } from "./../constants/classname";
import { ComponentType, HTMLAttributes } from "react";
import styled, { CSSProp } from "styled-components";

export interface FigureProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  image?: ComponentType<any> | string;
  size?: number;
  color?: string;
  styles?: FigureStyles;
  notification?: string;
}

export interface FigureStyles {
  self?: CSSProp;
  notificationStyle?: CSSProp;
}

function Figure({
  image: Icon,
  size = 16,
  color,
  styles,
  "aria-label": ariaLabel,
  className,
  notification,
  ...rest
}: FigureProps) {
  if (!Icon) return null;

  return (
    <Wrapper
      {...rest}
      className={applyClassName("figure", className)}
      $style={styles?.self}
    >
      {notification && (
        <Notification $size={size} $style={styles?.notificationStyle}>
          {notification}
        </Notification>
      )}

      {typeof Icon === "string" ? (
        <img
          alt="figure-icon"
          src={Icon}
          style={{
            minWidth: `${size}px`,
            minHeight: `${size}px`,
            maxWidth: `${size}px`,
            maxHeight: `${size}px`,
          }}
          aria-label={ariaLabel}
        />
      ) : (
        <Icon
          size={size}
          aria-label={ariaLabel}
          style={{ color: color ?? "currentColor" }}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.span<{ $style?: CSSProp }>`
  color: inherit;
  align-items: center;
  position: relative;

  ${({ $style }) => $style}
`;

const Notification = styled.span<{ $style?: CSSProp; $size?: number }>`
  position: absolute;
  top: 5%;
  right: 5%;
  transform: translate(50%, -50%);

  border-radius: 9999px;
  background-color: red;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  width: ${({ $size = 16 }) => `${$size * 0.8}px`};
  height: ${({ $size = 16 }) => `${$size * 0.8}px`};
  font-size: ${({ $size = 16 }) => `${$size * 0.4}px`};
  line-height: 1;

  ${({ $style }) => $style}
`;
export { Figure };
