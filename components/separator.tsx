import { cn } from "./../lib/utils";

export interface SeparatorProps {
  title?: string;
  className?: string;
  textFloat?: "left" | "right";
  depth?: string;
}

function Separator({
  title,
  className,
  textFloat = "left",
  depth = "20px",
}: SeparatorProps) {
  return (
    <div className={cn("flex text-gray-500 w-full relative", className)}>
      <span className="h-[2px] absolute w-full rounded-sm bg-gray-900 shadow-[inset_0_2px_2px_#ffffff,inset_0_-1px_1px_#7a7a7a]"></span>
      <span
        className={cn(
          "font-medium absolute -top-1/2 -translate-y-1/2 bg-white px-2"
        )}
        style={
          textFloat === "left"
            ? {
                left: depth,
              }
            : {
                right: depth,
              }
        }
      >
        {title}
      </span>
    </div>
  );
}

export { Separator };
