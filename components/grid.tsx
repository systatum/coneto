import { cn } from "./../lib/utils";
import { CSSProperties, ReactNode } from "react";

interface GridProps {
  children?: ReactNode;
  height?: number | string;
  width?: number | string;
  columns?: ResponsiveColumnsProps;
  gap?: number | string;
  containerClassName?: string;
}

interface GridCardProps {
  children?: ReactNode;
  thumbnail?: string;
  containerClassName?: string;
  onSelected?: () => void;
}

interface ResponsiveColumnsProps {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

function Grid({ children, gap = 8, containerClassName, columns }: GridProps) {
  const responsiveGridCols = getResponsiveGridCols(columns);
  const gridClass = cn("grid w-full", responsiveGridCols, containerClassName);

  const style: CSSProperties = {
    gap: typeof gap === "number" ? `${gap}px` : gap,
  };

  return (
    <div className={gridClass} style={style}>
      {children}
    </div>
  );
}

function GridCard({
  children,
  thumbnail,
  containerClassName,
  onSelected,
}: GridCardProps) {
  const gridCardClass = cn(
    "text-sm cursor-pointer h-full flex flex-col items-center w-full h-full p-1 gap-2 rounded-xs shadow",
    containerClassName
  );

  return (
    <div className={gridCardClass} onClick={() => onSelected?.()}>
      <div className="bg-gray-200 w-full flex items-center justify-center">
        <img
          src={thumbnail}
          alt={`This is ${thumbnail} Image from Systatum Corp`}
        />
      </div>
      <div className="w-full h-full flex flex-col">{children}</div>
    </div>
  );
}

function getResponsiveGridCols(columns?: ResponsiveColumnsProps): string {
  if (!columns) return "";

  const entries: [keyof ResponsiveColumnsProps, string][] = [
    ["base", "grid-cols"],
    ["sm", "sm:grid-cols"],
    ["md", "md:grid-cols"],
    ["lg", "lg:grid-cols"],
    ["xl", "xl:grid-cols"],
  ];

  return entries
    .map(([key, prefix]) => (columns[key] ? `${prefix}-${columns[key]}` : ""))
    .filter(Boolean)
    .join(" ");
}

Grid.Card = GridCard;
export { Grid };
