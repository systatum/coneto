import * as React from "react";
import { cn } from "./../lib/utils";
import { LoadingSpinner } from "./loading-spinner";
import {
  RemixiconComponentType,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from "@remixicon/react";
import { TipMenu, TipMenuItemProps } from "./tip-menu";

export type ButtonVariants = {
  variant?:
    | "link"
    | "outline"
    | "default"
    | "primary"
    | "danger"
    | "secondary"
    | "ghost";
  size?: "default" | "icon" | "sm" | "lg";
};

const ButtonActiveVariant: Record<
  NonNullable<ButtonVariants["variant"]>,
  string
> = {
  default: "bg-[rgb(207,204,203)]",
  primary: "bg-[rgb(64,142,232)]",
  danger: "bg-[rgb(200,53,50)]",
  outline: "bg-accent text-accent-foreground dark:bg-input/50",
  secondary: "bg-secondary/80",
  ghost: "bg-accent text-accent-foreground dark:bg-accent/50",
  link: "underline",
};

function getButtonClasses(
  variant?: ButtonVariants["variant"],
  size?: ButtonVariants["size"]
) {
  let base =
    "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xs text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";

  let variantClass = "";
  switch (variant) {
    case "primary":
      variantClass =
        "bg-[rgb(86,154,236)] text-white hover:bg-[rgb(64,142,232)]";
      break;
    case "danger":
      variantClass = "bg-[rgb(206,55,93)] text-white hover:bg-[rgb(200,53,50)]";
      break;
    case "outline":
      variantClass =
        "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50";
      break;
    case "secondary":
      variantClass =
        "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80";
      break;
    case "ghost":
      variantClass =
        "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50";
      break;
    case "link":
      variantClass = "text-primary underline-offset-4 hover:underline";
      break;
    default:
      variantClass =
        "bg-[rgb(243,243,243)] text-black hover:bg-[rgb(207,204,203)]";
  }

  let sizeClass = "";
  switch (size) {
    case "sm":
      sizeClass = "h-8 rounded-xs gap-1.5 px-3 has-[>svg]:px-2.5";
      break;
    case "lg":
      sizeClass = "h-10 rounded-xs px-6 has-[>svg]:px-4";
      break;
    case "icon":
      sizeClass = "size-9";
      break;
    default:
      sizeClass = "h-9 px-4 py-2 has-[>svg]:px-3";
  }

  return `${base} ${variantClass} ${sizeClass}`;
}

function Button({
  className,
  variant = "default",
  children,
  isLoading,
  size = "default",
  tipMenu,
  subMenuList,
  dropdownClassName,
  openedIcon: OpenedIcon = RiArrowDownSLine,
  closedIcon: ClosedIcon = RiArrowUpSLine,
  ...props
}: React.ComponentProps<"button"> &
  ButtonVariants & {
    isLoading?: boolean;
    tipMenu?: boolean;
    subMenuList?: TipMenuItemProps[];
    dropdownClassName?: string;
    openedIcon?: RemixiconComponentType;
    closedIcon?: RemixiconComponentType;
  }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState<
    "main" | "original" | "dropdown"
  >("original");
  const [positionClass, setPositionClass] = React.useState<
    "left-0" | "right-0"
  >("left-0");

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const halfWindowWidth = window.innerWidth / 2;

      setPositionClass(rect.left > halfWindowWidth ? "right-0" : "left-0");
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="flex flex-row h-fit w-fit relative items-center"
    >
      <button
        onMouseEnter={() => setHovered("main")}
        onMouseLeave={() => setHovered("original")}
        className={cn(
          getButtonClasses(variant, size),
          "relative",
          tipMenu && "rounded-none",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        <span className="pointer-events-none absolute inset-0 rounded-xs bg-white opacity-0 active:opacity-10" />
        {children}
        {isLoading && <LoadingSpinner />}
      </button>

      {tipMenu && (
        <>
          <span
            aria-label="divider"
            className={cn(
              "absolute transform duration-200 right-[40px] h-full w-px border-l top-1/2 -translate-y-1/2 text-[#a5a0a0] z-10",
              hovered === "original" && !isOpen && "h-[80%]"
            )}
          />
          <button
            className={cn(
              getButtonClasses(variant, size),
              "relative",
              tipMenu && "rounded-none",
              isOpen && ButtonActiveVariant[variant],
              className
            )}
            onMouseEnter={() => setHovered("dropdown")}
            onMouseLeave={() => setHovered("original")}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <OpenedIcon
                className={variant === "default" ? "text-gray-400" : ""}
                size={20}
              />
            ) : (
              <ClosedIcon
                className={variant === "default" ? "text-gray-400" : ""}
                size={20}
              />
            )}
          </button>
        </>
      )}

      {isOpen && (
        <div
          onMouseEnter={() => setHovered("dropdown")}
          onMouseLeave={() => setHovered("original")}
          className={cn("absolute top-full -translate-y-1 z-10", positionClass)}
        >
          <TipMenu
            setIsOpen={() => {
              setIsOpen(false);
              setHovered("original");
            }}
            className={dropdownClassName}
            subMenuList={subMenuList}
          />
        </div>
      )}
    </div>
  );
}

export { Button };
