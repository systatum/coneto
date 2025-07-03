import { cn } from "./../lib/utils";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  ReactNode,
  useState,
} from "react";

interface SteplineProps {
  children?: ReactNode;
  className?: string;
  reversable?: boolean;
}

interface SteplineItemProps {
  title?: string;
  subtitle?: ReactNode[];
  completed?: boolean;
  className?: string;
  onClick?: () => void;
  id?: number;
}

function Stepline({ children, className, reversable }: SteplineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <div
      className={cn(
        "flex flex-row gap-2 py-2 px-2 relative overflow-x-auto scrollbar-thin-x",
        className
      )}
    >
      {childArray.map((child, index) => {
        if (
          !isValidElement<
            SteplineItemProps &
              Partial<{
                hoveredIndex?: number | null;
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
              if (reversable && completed) {
                onClick();
              }
            }}
            onMouseEnter={() => {
              setHoveredIndex(index + 1);
            }}
            onMouseLeave={() => {
              setHoveredIndex(null);
            }}
            className={cn(
              "flex flex-row gap-2 relative",
              reversable && completed && "cursor-pointer"
            )}
          >
            <div className="flex flex-row w-full justify-between">
              {cloneElement(child, {
                id: index + 1,
                hoveredIndex: hoveredIndex,
              })}
            </div>
            <div className="flex flex-row relative items-center w-full">
              {index !== childArray.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px min-w-[44px] bg-gray-400",
                    completed && "bg-[rgb(55,130,112)]"
                  )}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SteplineItem({
  subtitle,
  title,
  completed,
  className,
  id,
  hoveredIndex,
}: SteplineItemProps &
  Partial<{
    hoveredIndex?: number | null;
  }>) {
  const steplineItemId = `stepline-item-${id}`;

  return (
    <div
      id={steplineItemId}
      className={cn(
        "flex flex-row w-full gap-2 items-center whitespace-nowrap",
        className
      )}
    >
      <div className="flex relative">
        <div
          className={cn(
            "text-white absolute flex items-center justify-center min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] transform duration-200 bg-gray-600 rounded-full -translate-y-1/2 top-1/2",
            hoveredIndex === id && "scale-[130%] bg-gray-400",
            completed && "bg-[#4eb59c]"
          )}
        />
        <div
          className={cn(
            "text-white flex relative items-center justify-center min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] bg-gray-600 rounded-full",
            completed && "bg-[rgb(55,130,112)]"
          )}
        >
          {id}
        </div>
      </div>
      {(title || subtitle) && (
        <div className="flex flex-col">
          {title && <h2 className="font-medium text-sm">{title}</h2>}
          {subtitle && (
            <span className="flex flex-col text-xs">
              {subtitle.map((data, index) => (
                <Fragment key={index}>{data}</Fragment>
              ))}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

Stepline.Item = SteplineItem;
export { Stepline };
