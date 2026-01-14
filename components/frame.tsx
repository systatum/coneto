import React from "react";
import styled, { CSSProp } from "styled-components";

export interface FrameProps {
  title?: string;
  children: React.ReactNode;
  styles?: FrameStyles;
}

interface FrameStyles {
  containerStyle?: CSSProp;
  titleStyle?: CSSProp;
}

const Frame: React.FC<FrameProps> = ({ title, children, styles }) => {
  return (
    <FrameContainer $style={styles?.containerStyle}>
      {title && (
        <TitleContainer $style={styles?.titleStyle}>
          <TitleOverlay aria-hidden="true" />
          <TitleText>{title}</TitleText>
        </TitleContainer>
      )}
      {children}
    </FrameContainer>
  );
};

const FrameContainer = styled.div<{ $style?: CSSProp }>`
  position: relative;
  width: 100%;
  min-width: 500px;
  padding: 30px 16px;
  border-radius: var(--radius-xs);
  border: 1px solid #d1d5db;
  box-shadow: var(--shadow-xs);
  background-color: white;
  ${({ $style }) => $style}
`;

const TitleContainer = styled.span<{ $style?: CSSProp }>`
  position: absolute;
  top: -12px;
  left: 0.75rem;
  font-size: 0.95em;
  color: #999b9d;
  padding: 0px 6px;
  background-color: white;
  ${({ $style }) => $style}
`;

const TitleOverlay = styled.span`
  position: absolute;
  top: -2px;
  left: 0;
  width: 100%;
  height: 66.666667%;
  background-color: white;
  pointer-events: none;
`;

const TitleText = styled.span`
  position: relative;
`;

export { Frame };
