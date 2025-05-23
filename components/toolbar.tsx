import { COLOR_CLASS_MAP } from "./../constants/color-map";
import clsx from "clsx";
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
import { TooltipMenu, TooltipMenuItemProps } from "./tooltip-menu";

interface ToolbarProps {
  children: ReactNode;
  className?: string;
}

interface ToolbarMenuProps {
  caption: string;
  icon: LucideIcon;
  iconColor?: string;
  openOn?: "hover" | "click";
  subMenuList: TooltipMenuItemProps[];
  isOpen?: boolean;
  setIsOpen?: (data?: boolean) => void;
  className?: string;
}

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
  const toolbarClass = clsx("flex flex-row cursor-pointer", className);

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
  openOn = "click",
  subMenuList,
  isOpen,
  setIsOpen,
  className,
}: ToolbarMenuProps) {
  const handleClick = () => {
    if (openOn === "click") {
      setIsOpen?.();
    }
  };

  return (
    <div
      className="relative flex flex-col"
      onMouseEnter={() => openOn === "hover" && setIsOpen(true)}
      onMouseLeave={() => openOn === "hover" && setIsOpen(false)}
    >
      <div
        onClick={handleClick}
        className="flex items-center relative gap-3 cursor-pointer hover:border-blue-400 hover:border border border-transparent p-2 rounded-xs"
      >
        <Icon size={20} className={clsx(COLOR_CLASS_MAP[iconColor])} />
        <span className="text-sm sm:flex hidden text-gray-700">{caption}</span>
        {isOpen ? (
          <ChevronUp className="text-gray-400" size={20} />
        ) : (
          <ChevronDown className="text-gray-400" size={20} />
        )}
      </div>
      {isOpen && (
        <div className="absolute top-full mt-[2px] z-10">
          <TooltipMenu className={className} subMenuList={subMenuList} />
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
