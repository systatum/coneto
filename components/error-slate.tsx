import styled from "styled-components";
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
  cubeFaceStyle?: CSSProperties;
}

function ErrorSlate({ code, children, title, cubeFaceStyle }: ErrorSlateProps) {
  const defaultFaceStyle: CSSProperties = {
    background: "#dd0b0b",
    borderWidth: "1px",
    borderColor: "#a80000",
    borderStyle: "solid",
    color: "white",
  };

  const FACE_DATA = [
    { transformClass: "front", content: code[0] },
    {
      transformClass: "back",
      content: code[0],
    },
    {
      transformClass: "right",
      content: code[1],
    },
    {
      transformClass: "left",
      content: code[1],
    },
    {
      transformClass: "top",
      content: code[2],
    },
    {
      transformClass: "bottom",
      content: code[2],
    },
  ];

  return (
    <ErrorSlateWrapper>
      <ErrorSlatePerspective>
        <div className="cube">
          {FACE_DATA.map((face, i) => (
            <div
              key={i}
              style={{ ...defaultFaceStyle, ...cubeFaceStyle }}
              className={`face ${face.transformClass}`}
            >
              {face.content}
            </div>
          ))}
        </div>
      </ErrorSlatePerspective>

      <ErrorSlateTitle>{title}</ErrorSlateTitle>
      <>{children}</>
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

const ErrorSlateTitle = styled.span`
  font-size: 90px;
`;

export { ErrorSlate };
