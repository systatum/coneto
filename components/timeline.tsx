import { cn } from "./../lib/utils";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useState,
} from "react";

interface TimelineProps {
  children?: ReactNode;
  isClickable?: boolean;
}

interface TimelineItemProps {
  title?: string;
  sidenote?: ReactNode[];
  subtitle?: ReactNode[];
  completed?: boolean;
  className?: string;
  onClick?: () => void;
  id?: number;
}

function Timeline({ children, isClickable = false }: TimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <div className="flex flex-col gap-2 relative">
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

        const completed = child.props.completed;
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
            <div className="relative flex flex-col items-center w-4">
              <div
                className={cn(
                  "w-2 h-2 bg-gray-600 transform duration-200 rounded-full absolute -translate-x-[0.5px] z-10",
                  hoveredIndex === index && "scale-[200%] bg-gray-400",
                  completed && "bg-[#4eb59c]"
                )}
              />
              <div
                className={cn(
                  "w-2 h-2 bg-gray-600 rounded-full -translate-x-[0.5px] z-10",
                  completed && "bg-[#17a114]"
                )}
              />
              <div
                className={cn(
                  "flex-1 h-full w-px bg-gray-400",
                  completed && "bg-[rgb(55,130,112)]"
                )}
              />
            </div>

            <div className="flex flex-col w-full -translate-y-2 mb-[7px] justify-between">
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
