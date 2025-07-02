import { cn } from "./../lib/utils";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  ReactNode,
} from "react";

interface SteplineProps {
  children?: ReactNode;
}

interface SteplineItemProps {
  title?: string;
  subtitle?: ReactNode[];
  completed?: boolean;
  className?: string;
  id?: number;
}

function Stepline({ children }: SteplineProps) {
  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <div className="flex flex-row gap-2 py-2 relative overflow-x-auto scrollbar-thin-x">
      {childArray.map((child, index) => {
        if (!isValidElement<SteplineItemProps>(child)) return null;
        const completed = child.props.completed;

        return (
          <div key={index} className="flex flex-row gap-2 relative">
            <div className="flex flex-row w-full justify-between">
              {cloneElement(child, { id: index + 1 })}
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
}: SteplineItemProps) {
  return (
    <div
      className={cn(
        "flex flex-row w-full gap-2 items-center whitespace-nowrap",
        className
      )}
    >
      <div
        className={cn(
          "text-white flex items-center justify-center min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] bg-gray-600 rounded-full -translate-x-[0.5px] z-10",
          completed && "bg-[rgb(55,130,112)]"
        )}
      >
        {id}
      </div>
      <div className="flex flex-col">
        <h2 className="font-medium text-sm">{title}</h2>
        {subtitle && (
          <span className="flex flex-col text-xs">
            {subtitle.map((data, index) => (
              <Fragment key={index}>{data}</Fragment>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

Stepline.Item = SteplineItem;
export { Stepline };
