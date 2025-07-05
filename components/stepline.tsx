import {
  INNER_CIRCLE_VARIANT_CLASS,
  OUTER_CIRCLE_VARIANT_CLASS,
  SteplineItemState,
  TEXT_VARIANT_CLASS,
} from "./../constants/step-component-util";
import { cn } from "./../lib/utils";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  ReactNode,
  useState,
} from "react";

export interface SteplineProps {
  children?: ReactNode;
  className?: string;
  reversable?: boolean;
}

export type SteplineItemProps = SteplineItemState &
  Partial<{
    hoveredIndex?: number | null;
  }>;

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
            SteplineItemState &
              Partial<{
                hoveredIndex?: number | null;
              }>
          >(child)
        )
          return null;
        const variant = child.props.variant;
        const onClick = child.props.onClick;

        return (
          <div
            key={index}
            onClick={() => {
              if (reversable && variant) {
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
              reversable && variant && "cursor-pointer"
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
                    variant === "error" && "bg-[#b60000]",
                    (variant === "completed" || variant === "current") &&
                      "bg-[#00b62e]"
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
  variant = "todo",
  className,
  id,
  hoveredIndex,
}: SteplineItemProps) {
  return (
    <div
      id={String(id)}
      className={cn(
        "flex flex-row w-full gap-2 items-center whitespace-nowrap",
        className
      )}
    >
      <div className="flex relative">
        <div
          aria-label="outer-circle"
          className={cn(
            "text-white absolute flex items-center justify-center min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] transform duration-200 bg-gray-600 rounded-full -translate-y-1/2 top-1/2",
            hoveredIndex === id && "scale-[130%]",
            OUTER_CIRCLE_VARIANT_CLASS[variant]
          )}
        />
        <div
          aria-label="inner-circle"
          className={cn(
            "text-white flex relative items-center justify-center min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] bg-gray-600 rounded-full",
            INNER_CIRCLE_VARIANT_CLASS[variant]
          )}
        >
          {id}
        </div>
      </div>
      {(title || subtitle) && (
        <div className={cn("flex flex-col", TEXT_VARIANT_CLASS[variant])}>
          {title && <span className="font-medium text-sm">{title}</span>}
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
