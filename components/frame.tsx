import React from "react";

interface FrameProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Frame: React.FC<FrameProps> = ({ title, children, className }) => {
  return (
    <div
      className={`relative w-full rounded-xs border border-gray-300 p-4 shadow-xs ${className || ""}`}
    >
      {title && (
        <h2 className="absolute -top-[14px] mb-2 bg-white px-[6px] font-medium">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Frame;
