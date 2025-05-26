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
  caption: string;
  icon: LucideIcon;
  iconColor?: string;
  openOn?: "hover" | "click";
  subMenuList: TipMenuItemProps[];
  isOpen?: boolean;
  setIsOpen?: (data?: boolean) => void;
  className?: string;
  variant?: "default" | "primary" | "danger";
}

const VARIANT_CLASS_MAP = {
  default: "hover:border border border-transparent",
  primary: "bg-[rgb(86,154,236)] hover:bg-[rgb(64,142,232)] text-white",
  danger: "bg-[rgb(206,55,93)] hover:bg-[rgb(200,53,50)] text-white",
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
  openOn = "click",
  subMenuList,
  isOpen,
  setIsOpen,
  className,
  variant,
}: ToolbarMenuProps) {
  const handleClick = () => {
    if (openOn === "click") {
      setIsOpen?.();
    }
  };

  const toolbarMenuClass = cn(
    "flex items-center shadow-xs rounded-xs relative gap-3 cursor-pointer text-gray-700 hover:border border border-transparent p-2 rounded-xs",
    VARIANT_CLASS_MAP[variant]
  );

  return (
    <div
      className="relative flex flex-col"
      onMouseEnter={() => openOn === "hover" && setIsOpen(true)}
      onMouseLeave={() => openOn === "hover" && setIsOpen(false)}
    >
      <div onClick={handleClick} className={toolbarMenuClass}>
        <Icon size={20} className={cn(COLOR_CLASS_MAP[iconColor])} />
        <span className="text-sm sm:flex hidden">{caption}</span>
        {isOpen ? (
          <ChevronUp className="text-gray-400" size={20} />
        ) : (
          <ChevronDown className="text-gray-400" size={20} />
        )}
      </div>
      {isOpen && (
        <div className="absolute top-full mt-[2px] z-10">
          <TipMenu className={className} subMenuList={subMenuList} />
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
