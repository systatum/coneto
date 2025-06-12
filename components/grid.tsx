import { cn } from "./../lib/utils";
import { CSSProperties, ReactNode } from "react";
import Checkbox from "./checkbox";

interface GridProps {
  children?: ReactNode;
  height?: number | string;
  width?: number | string;
  gap?: number | string;
  containerClassName?: string;
  preset?: GridPresetKey;
}

interface GridCardProps {
  children?: ReactNode;
  thumbnail?: string;
  isSelected?: boolean;
  containerClassName?: string;
  onSelected?: () => void;
  selectable?: boolean;
}

function Grid({ children, gap = 8, containerClassName, preset }: GridProps) {
  const gridClass = cn(
    "grid w-full",
    GRID_PRESETS[preset]?.className,
    containerClassName
  );

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
  isSelected,
  selectable,
  ...props
}: GridCardProps) {
  const gridCardClass = cn(
    "text-sm h-full relative flex flex-col items-center w-full h-full p-1 gap-2 rounded-xs shadow",
    selectable && "cursor-pointer hover:bg-gray-100",
    containerClassName
  );

  return (
    <div
      {...props}
      className={gridCardClass}
      onClick={() => {
        if (selectable) {
          onSelected?.();
        }
      }}
    >
      <div className="absolute top-4 left-4">
        {selectable && (
          <Checkbox
            checked={isSelected}
            classNameParent={cn(
              "border-transparent w-[20px] h-[20px] rounded-xs"
            )}
            className="w-[16px] h-[16px]"
            readOnly
          />
        )}
      </div>
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

export interface GridPreset {
  label: string;
  className: string;
}

export const GRID_PRESETS = {
  "1-col": {
    label: "Single column",
    className: "grid-cols-1",
  },
  "2-col": {
    label: "2 columns fixed",
    className: "grid-cols-2",
  },
  "3-col": {
    label: "3 columns fixed",
    className: "grid-cols-3",
  },
  "4-col": {
    label: "4 columns fixed",
    className: "grid-cols-4",
  },
  "5-col": {
    label: "5 columns fixed",
    className: "grid-cols-5",
  },
  "6-col": {
    label: "6 columns fixed",
    className: "grid-cols-6",
  },
  "1-to-3": {
    label: "Responsive: 1 to 3 columns",
    className: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  },
  "1-to-4": {
    label: "Responsive: 1 to 6 columns",
    className: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  },
  "1-to-6": {
    label: "Responsive: 1 to 6 columns",
    className:
      "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  },
  "2-to-4": {
    label: "Responsive: 2 to 4 columns",
    className: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  },
  "3-to-5": {
    label: "Responsive: 3 to 5 columns",
    className: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5",
  },
  "3-to-6": {
    label: "Responsive: 3 to 6 columns",
    className: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6",
  },
  "auto-fit-400": {
    label: "Auto-fit min 400px",
    className: "grid-cols-[repeat(auto-fit,minmax(400px,1fr))]",
  },
  "auto-fit-350": {
    label: "Auto-fit min 350px",
    className: "grid-cols-[repeat(auto-fit,minmax(350px,1fr))]",
  },
  "auto-fit-300": {
    label: "Auto-fit min 300px",
    className: "grid-cols-[repeat(auto-fit,minmax(300px,1fr))]",
  },
  "auto-fit-250": {
    label: "Auto-fit min 250px",
    className: "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
  },
  "auto-fit-200": {
    label: "Auto-fit min 200px",
    className: "grid-cols-[repeat(auto-fit,minmax(200px,1fr))]",
  },
  "auto-fit-150": {
    label: "Auto-fit min 150px",
    className: "grid-cols-[repeat(auto-fill,minmax(150px,1fr))]",
  },
  "13-col": {
    label: "13 columns fixed",
    className: "grid-cols-13",
  },
  "16-col": {
    label: "16 columns fixed",
    className: "grid-cols-16",
  },
} as const;

type GridPresetKey = keyof typeof GRID_PRESETS;

Grid.Card = GridCard;
export { Grid };
