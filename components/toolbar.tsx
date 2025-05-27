import { COLOR_CLASS_MAP } from "./../constants/color-map";
import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { TipMenu, TipMenuItemProps } from "./tip-menu";
import { cn } from "./../lib/utils";

interface ToolbarProps {
  children: ReactNode;
  className?: string;
}

interface ToolbarMenuProps {
  caption?: string;
  icon?: LucideIcon;
  openedIcon?: LucideIcon;
  closedIcon?: LucideIcon;
  iconColor?: string;
  subMenuList: TipMenuItemProps[];
  isOpen?: boolean;
  setIsOpen?: (data?: boolean) => void;
  onClick?: () => void;
  className?: string;
  classNameContainer?: string;
  variant?: "default" | "primary" | "danger";
}

const VARIANT_CLASS_MAP = {
  hover: {
    default: "hover:bg-gray-100",
    primary: "hover:bg-[rgb(64,142,232)] text-white",
    danger: "hover:bg-[rgb(200,53,50)] text-white",
  },
  default: {
    default: "border bg-white border-transparent hover:border-[#ececec]",
    primary:
      "bg-[rgb(86,154,236)] text-white border-transparent hover:border-[#5286c9]",
    danger:
      "bg-[rgb(206,55,93)] text-white border-transparent hover:border-[#c00000]",
  },
};

function Toolbar({ children, className }: ToolbarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const handleOpen = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (toolbarRef.current && !toolbarRef.current.contains(target)) {
        setOpenIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const childrenWithProps = Children.map(children, (child, index) => {
    if (isToolbarMenuElement(child)) {
      return cloneElement(child, {
        isOpen: openIndex === index,
        setIsOpen: () => handleOpen(index),
      });
    }
    return child;
  });
  const toolbarClass = cn("flex w-full flex-row", className);

  return (
    <div ref={toolbarRef} className={toolbarClass}>
      {childrenWithProps}
    </div>
  );
}

function ToolbarMenu({
  caption,
  icon: Icon,
  openedIcon: OpenedIcon = ChevronDown,
  closedIcon: ClosedIcon = ChevronUp,
  iconColor = "gray",
  subMenuList,
  isOpen,
  setIsOpen,
  onClick,
  className,
  classNameContainer,
  variant = "default",
}: ToolbarMenuProps) {
  const [hovered, setHovered] = useState<"main" | "original" | "dropdown">(
    "original"
  );
  const [positionClass, setPositionClass] = useState<"left-0" | "right-0">(
    "left-0"
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
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

  const handleClickOpen = () => {
    setIsOpen?.();
  };

  const handleMainClick = () => {
    onClick?.();
  };

  const toolbarMenuClass = cn(
    "flex items-center w-full relative border border-transparent select-none overflow-hidden cursor-pointer text-gray-700 hover:border rounded-sm",
    VARIANT_CLASS_MAP.default[variant],
    classNameContainer
  );
  const toolbarMenuHoverClass = VARIANT_CLASS_MAP.hover[variant];

  return (
    <div ref={containerRef} className="relative flex flex-col mr-1">
      <div className={toolbarMenuClass}>
        {(Icon || caption) && (
          <>
            <div
              onMouseEnter={() => setHovered("main")}
              onMouseLeave={() => setHovered("original")}
              onClick={handleMainClick}
              className={cn(
                `flex flex-row items-center gap-2 p-2`,
                hovered === "main" && toolbarMenuHoverClass
              )}
            >
              {Icon && (
                <Icon size={20} className={cn(COLOR_CLASS_MAP[iconColor])} />
              )}
              {caption && (
                <span className="text-sm sm:flex hidden px-2">{caption}</span>
              )}
            </div>
            <span
              className={cn(
                `absolute  right-[30px] md:right-9 text-[44px] h-full  w-fit border-[0.5px]`,
                variant === "default" ? "text-[#ececec]" : "",
                hovered === "original"
                  ? "max-h-[28px] top-1"
                  : "top-0 max-h-[40px]"
              )}
            ></span>
          </>
        )}
        <div
          onMouseEnter={() => {
            setHovered("dropdown");
          }}
          onMouseLeave={() => {
            setHovered("original");
          }}
          className={cn(
            "flex p-2 relative",
            hovered === "dropdown" && toolbarMenuHoverClass
          )}
          onClick={handleClickOpen}
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
        </div>
      </div>
      <div className="absolute top-8 border w-full right-0 max-w-[40px] min-h-[10px] border-transparent z-20"></div>

      {isOpen && (
        <div className={cn("absolute top-full z-10", positionClass)}>
          <TipMenu
            setIsOpen={() => setIsOpen(false)}
            className={className}
            subMenuList={subMenuList}
          />
        </div>
      )}
    </div>
  );
}

function isToolbarMenuElement(
  element: ReactNode
): element is ReactElement<ToolbarMenuProps> {
  return isValidElement(element) && typeof element.type !== "string";
}
Toolbar.Menu = ToolbarMenu;
export { Toolbar };
