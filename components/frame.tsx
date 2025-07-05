import clsx from "clsx";
import React from "react";

export interface FrameProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  classNameTitle?: string;
}

const Frame: React.FC<FrameProps> = ({
  title,
  children,
  classNameTitle,
  className,
}) => {
  const backgroundClass =
    className?.split(" ").find((cls) => cls.startsWith("bg-")) || "bg-white";
  const backgroundClassTitle =
    classNameTitle?.split(" ").find((cls) => cls.startsWith("bg-")) ||
    "bg-white";

  return (
    <div
      className={clsx(
        backgroundClass,
        className,
        `relative w-full min-w-[500px] py-[30px] rounded-xs border border-gray-300 p-4 shadow-xs  `
      )}
    >
      {title && (
        <span
          className={clsx(
            backgroundClassTitle,
            classNameTitle,
            "absolute -top-[11px] text-[#999b9d] text-[0.95em] left-3 text-base px-[6px]"
          )}
        >
          <span
            className="absolute -top-[2px] left-0 w-full h-2/3 bg-white pointer-events-none"
            aria-hidden="true"
          />
          <span className="relative">{title}</span>
        </span>
      )}
      {children}
    </div>
  );
};

export default Frame;
