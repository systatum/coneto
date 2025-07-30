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
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";

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
  dropdownClassName?: string;
  containerClassName?: string;
  triggerClassName?: string;
  toggleActiveClassName?: string;
  variant?: "default" | "primary" | "danger" | "none";
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
  dropdownClassName,
  containerClassName,
  triggerClassName,
  toggleActiveClassName,
  variant = "default",
}: ToolbarMenuProps) {
  const [hovered, setHovered] = useState<"main" | "original" | "dropdown">(
    "original"
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles, update } = useFloating({
    open: isOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip({ padding: 40 }), shift()],
    placement: "bottom-start",
  });

  useEffect(() => {
    if (isOpen) update();
  }, [isOpen, update]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    containerClassName
  );

  return (
    <div
      aria-label={`toolbar-menu`}
      ref={containerRef}
      className="relative flex flex-col mr-1"
    >
      <div ref={refs.setReference} className={toolbarMenuClass}>
        {(Icon || caption) && (
          <>
            <button
              aria-label={`toolbar-menu-button-${caption}`}
              onMouseEnter={() => setHovered("main")}
              onMouseLeave={() => setHovered("original")}
              onClick={handleMainClick}
              className={cn(
                `flex flex-row items-center gap-2 p-2`,
                hovered === "main" && toolbarMenuHoverClass,
                isOpen && toolbarMenuBorderActiveClass,
                triggerClassName
              )}
            >
              {Icon && (
                <Icon size={20} className={cn(COLOR_CLASS_MAP[iconColor])} />
              )}
              {caption && (
                <span className="text-sm sm:flex hidden px-2">{caption}</span>
              )}
            </button>
            <span
              aria-label="divider"
              className={cn(
                "absolute transform duration-200 right-[35px] h-full w-px border-[0.5px] top-1/2 -translate-y-1/2 text-[#bdbdbd] z-10",
                hovered === "original" && !isOpen && "h-[80%]"
              )}
            ></span>
          </>
        )}
        <button
          aria-label={`toolbar-menu-toggle`}
          onMouseEnter={() => setHovered("dropdown")}
          onMouseLeave={() => setHovered("original")}
          className={cn(
            "flex p-2 relative h-full items-center max-w-[36px]",
            hovered === "dropdown" && toolbarMenuHoverClass,
            isOpen && toolbarMenuBackgroundActiveClass,
            isOpen && toolbarMenuBorderActiveClass,
            triggerClassName,
            isOpen && toggleActiveClassName
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
        </button>
      </div>

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{ ...floatingStyles, zIndex: 9999 }}
          onMouseEnter={() => setHovered("dropdown")}
          onMouseLeave={() => setHovered("original")}
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

function isToolbarMenuElement(
  element: ReactNode
): element is ReactElement<ToolbarMenuProps> {
  return isValidElement(element) && typeof element.type !== "string";
}

Toolbar.Menu = ToolbarMenu;
export { Toolbar };
