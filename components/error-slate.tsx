import { cn } from "./../lib/utils";
import { CSSProperties, ReactNode } from "react";

interface ErrorSlateProps {
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
    <div className="flex flex-col gap-7 items-center relative justify-center">
      <div className="absolute top-4 perspective">
        <div className="cube">
          {FACE_DATA.map((face, i) => (
            <div
              key={i}
              style={{ ...defaultFaceStyle, ...cubeFaceStyle }}
              className={cn("face", face.transformClass)}
            >
              {face.content}
            </div>
          ))}
        </div>
      </div>

      <div className={"text-[90px]"}>{title}</div>
      <>{children}</>
    </div>
  );
}

export { ErrorSlate };
