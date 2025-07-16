import { cn } from "./../lib/utils";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useState,
} from "react";
import {
  INNER_CIRCLE_VARIANT_CLASS,
  OUTER_CIRCLE_VARIANT_CLASS,
  SteplineItemState,
  TEXT_VARIANT_CLASS,
} from "./../constants/step-component-util";

export interface TimelineProps {
  children?: ReactNode;
  isClickable?: boolean;
}

export type TimelineItemProps = SteplineItemState &
  Partial<{
    sidenote?: ReactNode[];
    isClickable?: boolean;
  }>;

function Timeline({ children, isClickable = false }: TimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <div className="flex flex-col gap-1 relative">
      {childArray.map((child, index) => {
        if (
          !isValidElement<
            SteplineItemState &
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
                  OUTER_CIRCLE_VARIANT_CLASS[variant]
                )}
              />
              <div
                aria-label="inner-circle-timeline"
                className={cn(
                  "min-w-2 min-h-2 max-w-2 max-h-2 bg-gray-600 rounded-full -translate-x-[0.5px]",
                  INNER_CIRCLE_VARIANT_CLASS[variant]
                )}
              />
              <div
                aria-label="divider-timeline"
                className={cn(
                  "h-full w-px bg-gray-400",
                  INNER_CIRCLE_VARIANT_CLASS[variant],
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
  variant,
}: TimelineItemProps) {
  return (
    <div
      onClick={() => {
        if (isClickable) {
          onClick();
        }
      }}
      id={String(id)}
      className={cn(
        "flex flex-row gap-10 justify-between items-start",
        isClickable && "cursor-pointer",
        TEXT_VARIANT_CLASS[variant],
        className
      )}
    >
      <div className="flex flex-col w-full">
        <span className="font-medium">{title}</span>
        {subtitle && (
          <div className="flex flex-col text-sm">
            {subtitle.map((data, index) => (
              <span key={index}>{data}</span>
            ))}
          </div>
        )}
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
