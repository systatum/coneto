import styled, { css, CSSProp, keyframes } from "styled-components";
import { CSSProperties, ReactNode } from "react";

export interface ErrorSlateProps {
  code?:
    | "400"
    | "401"
    | "403"
    | "404"
    | "405"
    | "408"
    | "409"
    | "410"
    | "413"
    | "414"
    | "415"
    | "429"
    | "500"
    | "501"
    | "502"
    | "503"
    | "504"
    | "505";
  children?: ReactNode;
  title?: string;
  cubeFaceStyle?: CSSProp;
}

const rotateUp = keyframes`
  from {
    transform: rotateX(-20deg) rotateY(-20deg);
  }
  to {
    transform: rotateX(340deg) rotateY(-20deg);
  }
`;

const transformStyles = {
  front: css`
    transform: translateZ(50px);
  `,
  back: css`
    transform: rotateY(180deg) translateZ(50px);
  `,
  right: css`
    transform: rotateY(90deg) translateZ(50px);
  `,
  left: css`
    transform: rotateY(-90deg) translateZ(50px);
  `,
  top: css`
    transform: rotateX(90deg) translateZ(50px);
  `,
  bottom: css`
    transform: rotateX(-90deg) translateZ(50px);
  `,
};

function ErrorSlate({ code, children, title, cubeFaceStyle }: ErrorSlateProps) {
  const FACE_DATA = [
    { face: "front", content: code[0] },
    { face: "back", content: code[0] },
    { face: "right", content: code[1] },
    { face: "left", content: code[1] },
    { face: "top", content: code[2] },
    { face: "bottom", content: code[2] },
  ] as const;

  return (
    <ErrorSlateWrapper>
      <ErrorSlatePerspective>
        <Cube>
          {FACE_DATA.map(({ face, content }, i) => (
            <Face
              aria-label="face-error-slate"
              key={i}
              $transform={face}
              $style={cubeFaceStyle}
            >
              {content}
            </Face>
          ))}
        </Cube>
      </ErrorSlatePerspective>

      <ErrorSlateTitle>{title}</ErrorSlateTitle>
      {children}
    </ErrorSlateWrapper>
  );
}

const ErrorSlateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ErrorSlatePerspective = styled.div`
  position: absolute;
  top: 1rem;
  perspective: 1000px;
`;

const Cube = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  transform-style: preserve-3d;
  animation: ${rotateUp} 6s infinite linear;
  transform: rotateY(-20deg) rotateX(-20deg);
`;

const Face = styled.div<{
  $transform: keyof typeof transformStyles;
  $style?: CSSProp;
}>`
  position: absolute;
  width: 100px;
  height: 100px;
  font-size: 2.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dd0b0b;
  border: 1px solid #a80000;
  color: white;

  ${({ $transform }) => transformStyles[$transform]}

  ${({ $style }) => $style}
`;

const ErrorSlateTitle = styled.span`
  font-size: 90px;
`;

export { ErrorSlate };
