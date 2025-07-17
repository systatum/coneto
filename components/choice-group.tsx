import { cn } from "./../lib/utils";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";
import { RadioProps } from "./radio";
import { CheckboxProps } from "./checkbox";

export interface ChoiceGroupProps {
  children: ReactNode;
  className?: string;
}

function ChoiceGroup({ children, className }: ChoiceGroupProps) {
  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <div
      className={cn(
        "flex flex-col border border-gray-200 rounded-xs overflow-hidden",
        className
      )}
    >
      {childArray.map((child, index) => {
        const isLast = index === childArray.length - 1;
        const componentChild = child as ReactElement<
          RadioProps | CheckboxProps
        >;

        const modifiedChild = cloneElement(componentChild, {
          highlightOnChecked: true,
        });

        return (
          <div key={index}>
            {modifiedChild}
            {!isLast && (
              <div
                aria-label="divider for choice group"
                className="h-px bg-gray-200"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export { ChoiceGroup };
