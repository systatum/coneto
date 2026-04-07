import React, { HTMLAttributes } from "react";
import styled, { CSSProp } from "styled-components";
import { useTheme } from "./../theme/provider";
import { FrameThemeConfiguration } from "./../theme";

export interface FrameProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "style"> {
  title?: string;
  children: React.ReactNode;
  styles?: FrameStyles;
}

export interface FrameStyles {
  containerStyle?: CSSProp;
  titleStyle?: CSSProp;
}

function Frame({ title, children, styles, ...props }: FrameProps) {
  const { currentTheme } = useTheme();
  const frameTheme = currentTheme?.frame;

  return (
    <FrameContainer
      aria-label="frame"
      {...props}
      $style={styles?.containerStyle}
      $theme={frameTheme}
    >
      {title && (
        <TitleContainer $theme={frameTheme} $style={styles?.titleStyle}>
          <TitleOverlay aria-hidden="true" $theme={frameTheme} />
          <TitleText $theme={frameTheme}>{title}</TitleText>
        </TitleContainer>
      )}
      {children}
    </FrameContainer>
  );
}

const FrameContainer = styled.div<{
  $style?: CSSProp;
  $theme?: FrameThemeConfiguration;
}>`
  position: relative;
  width: 100%;
  min-width: 500px;
  padding: 30px 16px;
  border-radius: var(--radius-xs);
  border: 1px solid ${({ $theme }) => $theme?.borderColor || "#d1d5db"};
  box-shadow: ${({ $theme }) => $theme?.boxShadow || "var(--shadow-xs)"};
  background-color: ${({ $theme }) => $theme?.backgroundColor || "white"};
  ${({ $style }) => $style}
`;

const TitleContainer = styled.span<{
  $style?: CSSProp;
  $theme?: FrameThemeConfiguration;
}>`
  position: absolute;
  top: -12px;
  left: 0.75rem;
  font-size: 0.95em;
  padding: 0px 6px;

  color: ${({ $theme }) => $theme?.titleColor || "#999b9d"};
  background-color: ${({ $theme }) => $theme?.titleBackgroundColor || "white"};

  ${({ $style }) => $style}
`;

const TitleOverlay = styled.span<{ $theme?: FrameThemeConfiguration }>`
  position: absolute;
  top: -2px;
  left: 0;
  width: 100%;
  height: 66.666667%;
  background-color: ${({ $theme }) =>
    $theme?.overlayBackgroundColor || "white"};
  pointer-events: none;
`;

const TitleText = styled.span<{ $theme: FrameThemeConfiguration }>`
  position: relative;
  color: ${({ $theme }) => $theme?.titleColor || "#999b9d"};
`;

export { Frame };
