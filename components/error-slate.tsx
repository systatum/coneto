import { ReactNode } from "react";

interface ErrorSlateProps {
  code?: "404" | "500" | "403";
  children?: ReactNode;
  title?: string;
}

function ErrorSlate({
  code,
  children,
  title = "PageNotFound",
}: ErrorSlateProps) {
  return (
    <div className="flex flex-col gap-7 items-center relative justify-center">
      <div className="perspective absolute top-4">
        <div className="cube">
          <div className="face front">{code[0]}</div>
          <div className="face back">{code[0]}</div>
          <div className="face right">{code[1]}</div>
          <div className="face left">{code[1]}</div>
          <div className="face top">{code[2]}</div>
          <div className="face bottom">{code[2]}</div>
        </div>
      </div>
      <div className={"text-[90px]"}>{title}</div>
      <>{children}</>
    </div>
  );
}

export { ErrorSlate };
