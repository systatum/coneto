import { cn } from "./../lib/utils";
import { Children, Fragment, isValidElement, ReactNode } from "react";

interface TimelineProps {
  children?: ReactNode;
}

interface TimelineItemProps {
  title?: string;
  sidenote?: ReactNode[];
  subtitle?: ReactNode[];
  completed?: boolean;
  className?: string;
}

function Timeline({ children }: TimelineProps) {
  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <div className="flex flex-col gap-2 relative">
      {childArray.map((child, index) => {
        const completed =
          isValidElement(child) &&
          (child.props as TimelineItemProps)?.completed;
        return (
          <div key={index} className="flex flex-row gap-2 relative">
            <div className="relative top-[6px] flex flex-col items-center w-4">
              <div
                className={cn(
                  "w-2 h-2 bg-gray-600 rounded-full -translate-x-[0.5px] z-10",
                  completed && "bg-[rgb(55,130,112)]"
                )}
              />
              {index !== childArray.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-full w-px bg-gray-400",
                    completed && "bg-[rgb(55,130,112)]"
                  )}
                />
              )}
            </div>

            <div className="flex flex-col w-full justify-between">{child}</div>
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
}: TimelineItemProps) {
  return (
    <div
      className={cn("flex flex-row justify-between items-center", className)}
    >
      <div className="flex flex-col">
        <h2 className="font-medium">{title}</h2>
        <div className="flex flex-col text-sm">
          {subtitle &&
            subtitle.map((data, index) => <span key={index}>{data}</span>)}
        </div>
      </div>
      <div className="flex flex-col">
        {sidenote &&
          sidenote.map((data, index) => <span key={index}>{data}</span>)}
      </div>
    </div>
  );
}

Timeline.Item = TimelineItem;
export { Timeline };
