import { applyClassName } from "./../constants/classname";
import { ComponentType, HTMLAttributes } from "react";
import styled, { css, CSSProp } from "styled-components";

export interface FigureProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  image?: ComponentType<any> | string;
  size?: number;
  color?: string;
  styles?: FigureStyles;
  notificationBadge?: FigureNotification;
}

export interface FigureNotification {
  content?: string;
  backgroundColor?: string;
  frameSize?: string;
  fontSize?: string;
}

export interface FigureStyles {
  self?: CSSProp;
  notificationBadgeStyle?: CSSProp;
}

function Figure({
  image: Icon,
  size = 16,
  color,
  styles,
  "aria-label": ariaLabel,
  className,
  notificationBadge,
  ...rest
}: FigureProps) {
  if (!Icon) return null;

  return (
    <Wrapper
      {...rest}
      className={applyClassName("figure", className)}
      $style={styles?.self}
    >
      {notificationBadge && (
        <Notification
          $size={size}
          $fontSize={notificationBadge?.fontSize}
          $backgroundColor={notificationBadge?.backgroundColor}
          $frameSize={notificationBadge?.frameSize}
          $style={styles?.notificationBadgeStyle}
          $contentLength={notificationBadge?.content?.length}
        >
          {notificationBadge.content}
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

const Notification = styled.span<{
  $style?: CSSProp;
  $size?: number;
  $frameSize?: string;
  $fontSize?: string;
  $backgroundColor?: string;
  $contentLength?: number;
}>`
  position: absolute;
  top: 5%;
  right: 5%;
  transform: translate(50%, -50%);

  border-radius: 9999px;
  background-color: ${({ $backgroundColor }) => $backgroundColor ?? "red"};

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  width: ${({ $size, $frameSize, $contentLength }) =>
    $contentLength >= 3 ? "fit-content" : ($frameSize ?? `${$size * 0.8}px`)};
  height: ${({ $size, $frameSize }) => $frameSize ?? `${$size * 0.8}px`};
  font-size: ${({ $size, $fontSize }) => $fontSize ?? `${$size * 0.4}px`};
  ${({ $contentLength }) =>
    $contentLength >= 3 &&
    css`
      padding: 0px 3px;
    `};

  ${({ $style }) => $style};
`;
export { Figure };
