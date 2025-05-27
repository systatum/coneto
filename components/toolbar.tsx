import { COLOR_CLASS_MAP } from "./../constants/color-map";
import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
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
import { RemixiconComponentType } from "@remixicon/react";

interface ToolbarProps {
  children: ReactNode;
  className?: string;
}

interface ToolbarMenuProps {
  caption?: string;
  icon?: RemixiconComponentType;
  openedIcon?: RemixiconComponentType;
  closedIcon?: RemixiconComponentType;
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
  base: {
    default: "bg-white hover:border-[#ececec]",
    primary: "bg-[rgb(86,154,236)] hover:border-[#5286c9]",
    danger: "bg-[rgb(206,55,93)] hover:border-[#c00000]",
  },
  hover: {
    default: "hover:bg-gray-100",
    primary: "hover:bg-[rgb(64,142,232)]",
    danger: "hover:bg-[rgb(200,53,50)]",
  },
};

const VARIANT_ACTIVE = {
  background: {
    default: "bg-gray-100",
    primary: "bg-[rgb(64,142,232)]",
    danger: "bg-[rgb(200,53,50)]",
  },
  border: {
    default: "border-[#ececec]",
    primary: "border-[#5286c9]",
    danger: "border-[#c00000]",
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
  openedIcon: OpenedIcon = RiArrowDownSLine,
  closedIcon: ClosedIcon = RiArrowUpSLine,
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
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const toolbarMenuContainerClass = VARIANT_CLASS_MAP.base[variant];
  const toolbarMenuHoverClass = VARIANT_CLASS_MAP.hover[variant];

  const toolbarMenuBorderActiveClass = VARIANT_ACTIVE.border[variant];
  const toolbarMenuBackgroundActiveClass = VARIANT_ACTIVE.background[variant];

  const toolbarMenuClass = cn(
    "flex items-center w-full hover:border border-transparent relative border select-none overflow-hidden cursor-pointer rounded-sm",
    toolbarMenuContainerClass,
    variant !== "default" ? "text-white" : "text-gray-700",
    isOpen && toolbarMenuBorderActiveClass,
    classNameContainer
  );

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
                hovered === "main" && toolbarMenuHoverClass,
                isOpen && toolbarMenuBorderActiveClass
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
                `absolute right-[30px] md:right-9 text-[44px] h-full  w-fit border-[0.5px]`,
                variant === "default" ? "text-[#ececec]" : "",
                hovered === "original" && !isOpen
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
            hovered === "dropdown" && toolbarMenuHoverClass,
            isOpen && toolbarMenuBackgroundActiveClass,
            isOpen && toolbarMenuBorderActiveClass
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
        <div
          onMouseEnter={() => setHovered("dropdown")}
          onMouseLeave={() => {
            setHovered("original");
          }}
          className={cn("absolute top-full z-10", positionClass)}
        >
          <TipMenu
            setIsOpen={() => {
              setIsOpen(false);
              setHovered("original");
            }}
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
