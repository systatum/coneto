import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import clsx from "clsx";

export type TooltipProps = {
  children: ReactNode;
  text: ReactNode;
  openOn?: "hover" | "click";
  drawerClassName?: string;
  containerClassName?: string;
  arrowClassName?: string;
  underline?: "underline" | "underline-dot" | "transparent" | "blue" | "gray";
};

function Tooltip({
  children,
  text,
  openOn = "hover",
  drawerClassName,
  containerClassName,
  arrowClassName,
  underline = "underline",
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const tooltipContainerClass = clsx(
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

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, openOn]);

  return (
    <div ref={tooltipRef} className="relative inline-flex items-center">
      <div
        {...triggerProps}
        className={cn(tooltipContainerClass, containerClassName)}
      >
        {text}
      </div>
      {isOpen && (
        <>
          <div
            aria-label="tooltip-arrow"
            className={cn(
              "absolute z-10 top-full mt-1 bg-gray-600 left-[25%] -translate-x-[25%] h-2 w-2 rotate-45",
              arrowClassName
            )}
          />
          <div
            className={cn(
              "absolute left-0 top-full z-50 mt-2 w-max rounded-xs bg-gray-600 px-2 py-1 text-xs text-white shadow-lg",
              drawerClassName
            )}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}

export { Tooltip };
