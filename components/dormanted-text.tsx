import {
  RemixiconComponentType,
  RiCheckLine,
  RiPencilFill,
} from "@remixicon/react";
import { ReactNode, useState } from "react";
import { cn } from "../lib/utils";

export interface DormantedTextProps {
  label?: string;
  className?: string;
  containerClassName?: string;
  onActionClick?: () => void;
  icon?: RemixiconComponentType;
  dormantedFontSize?: number;
  children?: ReactNode;
  content?: string | number;
}

function DormantedText({
  onActionClick,
  className,
  dormantedFontSize = 17,
  icon: Icon = RiCheckLine,
  children,
  content,
}: DormantedTextProps) {
  const [dormantedLocal, setDormantedLocal] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [labelHeight, setLabelHeight] = useState<number>(0);
  const [inputHeight, setInputHeight] = useState<number>(0);

  const dormantPencilSize = dormantedFontSize * 1.05;

  const measureLabelHeight = (el: HTMLLabelElement | HTMLDivElement | null) => {
    if (el) {
      const height = el.getBoundingClientRect().height;
      if (el instanceof HTMLLabelElement) {
        setLabelHeight(height);
      } else {
        setInputHeight(height);
      }
    }
  };

  console.log(inputHeight);

  return dormantedLocal ? (
    <label
      ref={measureLabelHeight}
      onClick={() => {
        setDormantedLocal(false);
        setIsHovered(false);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={() => setIsHovered(true)}
      className={cn(
        "p-2 rounded-xs cursor-pointer duration-100 transform transition-all flex flex-row justify-between items-center w-fit relative gap-1 hover:bg-[#e9e9e9] border hover:border-[#e9e9e9] border-transparent",
        className
      )}
      style={{
        fontSize: dormantedFontSize,
      }}
    >
      {content}
      <RiPencilFill
        className={cn(
          "duration-100 transform transition-all",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        size={dormantPencilSize}
      />
    </label>
  ) : (
    <div
      className={cn(
        "relative w-full flex gap-[2px] flex-row ring-0 h-full justify-center items-center",
        className
      )}
      style={{
        minHeight: labelHeight,
      }}
    >
      <div ref={measureLabelHeight} className="w-full h-full">
        {children}
      </div>
      <div
        className={cn(
          "text-muted-foreground flex min-w-[30px] p-[2px] relative rounded-xs transition-all duration-200 cursor-pointer hover:bg-gray-300"
        )}
        style={{
          minHeight: 32.5 | inputHeight,
        }}
        onClick={(e) => {
          e.preventDefault();
          if (onActionClick) {
            onActionClick();
          }
          setDormantedLocal(true);
        }}
      >
        <Icon
          className="top-1/2 -translate-y-1/2 left-[6px]  absolute"
          size={18}
        />
      </div>
    </div>
  );
}

export { DormantedText };
