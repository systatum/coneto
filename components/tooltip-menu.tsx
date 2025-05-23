import { COLOR_CLASS_MAP } from "./../constants/color-map";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface TooltipMenuProps {
  children?: ReactNode;
  subMenuList?: TooltipMenuItemProps[];
  className?: string;
}

export interface TooltipMenuItemProps {
  caption: string;
  icon: LucideIcon;
  onClick?: () => void;
  iconColor?: string;
  isDangerous?: boolean;
  iconUrl?: string | null | undefined;
}

function TooltipMenu({ children, subMenuList, className }: TooltipMenuProps) {
  const tooltipMenuClass = clsx(
    "flex flex-col border border-gray-100",
    className
  );
  return (
    <div className={tooltipMenuClass}>
      {subMenuList.map((data, index) => (
        <TooltipMenuItem
          caption={data.caption}
          icon={data.icon}
          iconColor={data.iconColor}
          isDangerous={data.isDangerous}
          onClick={data.onClick}
          key={index}
        />
      ))}
      {children}
    </div>
  );
}

function TooltipMenuItem({
  caption,
  icon: Icon,
  onClick,
  iconColor = "gray",
  isDangerous = false,
  iconUrl,
}: TooltipMenuItemProps) {
  const tooltipClass = clsx(
    "flex items-center gap-3 cursor-pointer hover:border-blue-500 hover:border-[2px] border-[2px] border-transparent p-2 rounded-[0px]",
    isDangerous ? "bg-red-500 text-white" : "bg-white"
  );

  const isIconValid = iconUrl && iconUrl !== "";

  return (
    <div className={tooltipClass} onClick={onClick}>
      {isIconValid ? (
        <img
          width={30}
          height={30}
          className="h-full w-full object-contain"
          alt={`${caption} icon on the Systatum superapp`}
          src={iconUrl}
        />
      ) : (
        <Icon
          size={20}
          className={
            isDangerous ? "text-white" : clsx(COLOR_CLASS_MAP[iconColor])
          }
        />
      )}

      <span
        className={`text-sm ${isDangerous ? "text-white" : "text-gray-700"}`}
      >
        {caption}
      </span>
    </div>
  );
}

TooltipMenu.Item = TooltipMenuItem;
export { TooltipMenu };
