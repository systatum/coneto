import { COLOR_CLASS_MAP } from "../constants/color-map";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface TipMenuProps {
  children?: ReactNode;
  subMenuList?: TipMenuItemProps[];
  className?: string;
}

export interface TipMenuItemProps {
  caption: string;
  icon: LucideIcon;
  onClick?: () => void;
  iconColor?: string;
  isDangerous?: boolean;
  iconUrl?: string | null | undefined;
}

function TipMenu({ children, subMenuList, className }: TipMenuProps) {
  const tipMenuClass = clsx(
    "flex flex-col border border-gray-100 overflow-hidden shadow-xs rounded-xs",
    className
  );
  return (
    <div className={tipMenuClass}>
      {subMenuList.map((data, index) => (
        <TipMenuItem
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

function TipMenuItem({
  caption,
  icon: Icon,
  onClick,
  iconColor = "gray",
  isDangerous = false,
  iconUrl,
}: TipMenuItemProps) {
  const tipClass = clsx(
    "flex items-center gap-3 cursor-pointer hover:border-[2px] border-[2px] border-transparent p-2 rounded-[0px]",
    isDangerous
      ? "bg-red-500 hover:border-red-700 text-white hover:bg-[#e71f29]"
      : "bg-white hover:border-gray-500 hover:bg-[#f2f2f2]"
  );

  const isIconValid = iconUrl && iconUrl !== "";

  return (
    <div className={tipClass} onClick={onClick}>
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

      <span className={`text-sm`}>{caption}</span>
    </div>
  );
}

TipMenu.Item = TipMenuItem;
export { TipMenu };
