import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./../lib/utils";
import LoadingSpinner from "./loading-spinner";
import {
  RemixiconComponentType,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from "@remixicon/react";
import { TipMenu, TipMenuItemProps } from "./tip-menu";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xs text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-[rgb(243,243,243)] text-black hover:bg-[rgb(207,204,203)]",
        primary: "bg-[rgb(86,154,236)] text-white hover:bg-[rgb(64,142,232)]",
        danger: "bg-[rgb(206,55,93)] text-white hover:bg-[rgb(200,53,50)]",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-xs gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-xs px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const ButtonActiveVariant = {
  default: "bg-[rgb(207,204,203)]",
  primary: "bg-[rgb(64,142,232)]",
  danger: "bg-[rgb(200,53,50)]",
  outline: "bg-accent text-accent-foreground dark:bg-input/50",
  secondary: "bg-secondary/80",
  ghost: "bg-accent text-accent-foreground dark:bg-accent/50",
  link: "underline",
};

function Button({
  className,
  variant,
  children,
  isLoading,
  size,
  tipMenu,
  subMenuList,
  dropdownClassName,
  openedIcon: OpenedIcon = RiArrowDownSLine,
  closedIcon: ClosedIcon = RiArrowUpSLine,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
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

      if (rect.left > halfWindowWidth) {
        setPositionClass("right-0");
      } else {
        setPositionClass("left-0");
      }
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="flex flex-row relative items-center">
      <button
        onMouseEnter={() => setHovered("main")}
        onMouseLeave={() => setHovered("original")}
        className={cn(
          buttonVariants({ variant, size }),
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
        <React.Fragment>
          <span
            aria-label="divider"
            className={cn(
              "absolute transform duration-200 right-[34%] h-full w-px border-l top-1/2 -translate-y-1/2 text-[#a5a0a0] z-10",
              hovered === "original" && !isOpen && "h-[80%]"
            )}
          />
          <button
            className={cn(
              buttonVariants({ variant, size }),
              "relative",
              tipMenu && "rounded-none",
              isOpen && ButtonActiveVariant[variant],
              className
            )}
            onMouseEnter={() => {
              setHovered("dropdown");
            }}
            onMouseLeave={() => {
              setHovered("original");
            }}
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
        </React.Fragment>
      )}

      {isOpen && (
        <div
          onMouseEnter={() => setHovered("dropdown")}
          onMouseLeave={() => {
            setHovered("original");
          }}
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

export { Button, buttonVariants };
