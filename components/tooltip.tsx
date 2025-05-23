import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import clsx from "clsx";

type TooltipProps = {
  children: React.ReactNode;
  text: string;
  openOn?: "hover" | "click";
  className?: string;
  classNameParent?: string;
  underline?: "underline" | "underline-dot" | "transparent" | "blue" | "gray";
};

export default function Tooltip({
  children,
  text,
  openOn = "hover",
  className = "",
  classNameParent,
  underline = "underline",
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const parentClassNameDefault = clsx(
    openOn === "hover" ? "cursor-default" : "cursor-pointer",
    underline === "underline"
      ? "underline decoration-black"
      : underline === "underline-dot"
        ? "underline decoration-dotted decoration-black"
        : underline === "transparent"
          ? "no-underline"
          : underline === "blue"
            ? "underline decoration-blue-500"
            : underline === "gray"
              ? "underline decoration-gray-500"
              : ""
  );

  const triggerProps =
    openOn === "hover"
      ? {
          onMouseEnter: () => setIsOpen(true),
          onMouseLeave: () => setIsOpen(false),
        }
      : {
          onClick: () => setIsOpen((prev) => !prev),
        };

  useEffect(() => {
    if (openOn !== "click" || !isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, openOn]);

  return (
    <span ref={tooltipRef} className="relative inline-flex items-center">
      <span
        {...triggerProps}
        className={cn(parentClassNameDefault, classNameParent)}
      >
        {text}
      </span>
      {isOpen && (
        <div
          className={cn(
            "absolute left-[20%] -translate-x-[20%] top-full z-50 mt-2 w-max rounded-xs bg-gray-600 px-2 py-1 text-xs text-white shadow-lg",
            className
          )}
        >
          <div
            className={cn(
              "absolute z-10 -top-1 left-[25%] -translate-x-[25%] h-2 w-2 rotate-45 bg-gray-600",
              className
            )}
          />
          {children}
        </div>
      )}
    </span>
  );
}
