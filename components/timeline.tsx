import { cn } from "./../lib/utils";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useState,
} from "react";

export interface TimelineProps {
  children?: ReactNode;
  isClickable?: boolean;
}

export interface TimelineItemProps {
  title?: string;
  sidenote?: ReactNode[];
  subtitle?: ReactNode[];
  variant?: "current" | "todo" | "error" | "completed";
  className?: string;
  onClick?: () => void;
  id?: number;
}

function Timeline({ children, isClickable = false }: TimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <div className="flex flex-col gap-1 relative">
      {childArray.map((child, index) => {
        if (
          !isValidElement<
            TimelineItemProps &
              Partial<{
                isClickable?: boolean;
              }>
          >(child)
        )
          return null;

        const isLast = index === childArray.length - 1;
        const variant = child.props.variant;
        const onClick = child.props.onClick;

        return (
          <div
            key={index}
            onClick={() => {
              if (isClickable) {
                onClick();
              }
            }}
            onMouseEnter={() => {
              setHoveredIndex(index);
            }}
            onMouseLeave={() => {
              setHoveredIndex(null);
            }}
            className={cn(
              "flex flex-row gap-2 relative",
              isClickable && "cursor-pointer"
            )}
          >
            <div className="relative flex flex-col items-center w-5">
              <div
                aria-label="outer-circle-timeline"
                className={cn(
                  "w-1 h-1 bg-gray-600 transform duration-200 rounded-full absolute -translate-x-[0.5px]  translate-y-[2px]",
                  hoveredIndex === index && "scale-[300%] bg-gray-400",
                  variant === "error" && "bg-[#8f0751]",
                  (variant === "completed" || variant === "current") &&
                    "bg-[#2fe620]"
                )}
              />
              <div
                aria-label="circle-timeline"
                className={cn(
                  "min-w-2 min-h-2 max-w-2 max-h-2 bg-gray-600 rounded-full -translate-x-[0.5px]",
                  variant === "error" && "bg-[#b60000]",
                  (variant === "completed" || variant === "current") &&
                    "bg-[#00b62e]"
                )}
              />
              <div
                aria-label="divider-timeline"
                className={cn(
                  "h-full w-px bg-gray-400",
                  variant === "error" && "bg-[#b60000]",
                  (variant === "completed" || variant === "current") &&
                    "bg-[#00b62e]",
                  isLast && "h-[calc(100%-1.2rem)]"
                )}
              />
            </div>

            <div
              className={cn(
                "flex flex-col w-full -translate-y-2 mb-[7px] justify-between",
                isLast && "mb-0"
              )}
            >
              {cloneElement(child, {
                id: index,
                isClickable: isClickable,
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineItem({
  subtitle,
  title,
  sidenote,
  className,
  id,
  onClick,
  isClickable,
}: TimelineItemProps & {
  isClickable?: boolean;
}) {
  const timelineItemId = `timeline-${id}`;

  return (
    <div
      onClick={() => {
        if (isClickable) {
          onClick();
        }
      }}
      id={timelineItemId}
      className={cn(
        "flex flex-row gap-10 justify-between items-start",
        isClickable && "cursor-pointer",
        className
      )}
    >
      <div className="flex flex-col w-full">
        <h2 className="font-medium">{title}</h2>
        <div className="flex flex-col text-sm">
          {subtitle &&
            subtitle.map((data, index) => <span key={index}>{data}</span>)}
        </div>
      </div>
      {sidenote && (
        <div className="flex flex-col min-w-[100px]">
          {sidenote.map((data, index) => (
            <span key={index}>{data}</span>
          ))}
        </div>
      )}
    </div>
  );
}

Timeline.Item = TimelineItem;
export { Timeline };
