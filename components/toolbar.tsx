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
  iconColor?: string;
  subMenuList: TipMenuItemProps[];
  isOpen?: boolean;
  setIsOpen?: (data?: boolean) => void;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "primary" | "danger";
}

const VARIANT_CLASS_MAP = {
  hover: {
    default: "hover:bg-gray-100",
    primary: "hover:bg-[rgb(64,142,232)] text-white",
    danger: "hover:bg-[rgb(200,53,50)] text-white",
  },
  default: {
    default: "border bg-white border-transparent",
    primary: "bg-[rgb(86,154,236)] text-white",
    danger: "bg-[rgb(206,55,93)] text-white",
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
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node)
      ) {
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
  const toolbarClass = cn("flex w-full flex-row cursor-pointer", className);

  return (
    <div ref={toolbarRef} className={toolbarClass}>
      {childrenWithProps}
    </div>
  );
}

function ToolbarMenu({
  caption,
  icon: Icon,
  iconColor = "gray",
  subMenuList,
  isOpen,
  setIsOpen,
  onClick,
  className,
  variant = "default",
}: ToolbarMenuProps) {
  const [hovered, setHovered] = useState<"main" | "original" | "dropdown">(
    "original"
  );

  const handleClickOpen = () => {
    setIsOpen?.();
  };

  const handleMainClick = () => {
    onClick?.();
  };

  const toolbarMenuClass = cn(
    "flex items-center w-full relative border overflow-hidden cursor-pointer text-gray-700 hover:border border border-transparent rounded-xs",
    VARIANT_CLASS_MAP.default[variant]
  );
  const toolbarMenuHoverClass = VARIANT_CLASS_MAP.hover[variant];

  return (
    <div className="relative flex flex-col ">
      <div className={toolbarMenuClass}>
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
            `absolute top-1 right-[30px] md:right-9 text-[44px] h-full max-h-[28px] w-fit border-[0.5px]`,
            variant === "default" ? "text-[#ececec]" : ""
          )}
        ></span>
        <div
          onMouseEnter={() => setHovered("dropdown")}
          onMouseLeave={() => setHovered("original")}
          className={cn(
            "flex p-2 relative",
            hovered === "dropdown" && toolbarMenuHoverClass
          )}
          onClick={handleClickOpen}
        >
          {isOpen ? (
            <ChevronUp
              className={variant === "default" ? "text-gray-400" : ""}
              size={20}
            />
          ) : (
            <ChevronDown
              className={variant === "default" ? "text-gray-400" : ""}
              size={20}
            />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-full mt-[1px] z-10">
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
