import { cn } from "./../lib/utils";
import {
  RemixiconComponentType,
  RiCloseLine,
  RiInformation2Fill,
} from "@remixicon/react";
import { ReactNode } from "react";

interface MessageboxProps {
  variant?: "primary" | "success" | "danger" | "warning";
  title: string;
  icon?: RemixiconComponentType;
  children: ReactNode;
  actionLinks?: ActionLinkProps[];
  closable?: boolean;
  onCloseRequest?: () => void;
}

interface ActionLinkProps {
  caption: string;
  onClick?: () => void;
  href?: string;
  type: "button" | "link";
}

const MESSAGEBOX_VARIATIONS = {
  primary: {
    container: "bg-[rgb(231,242,252)] text-[rgb(42,99,180)]",
    border: "border-[rgb(42,99,180)]",
    icon: "text-[rgb(42,99,180)]",
  },
  success: {
    container: "bg-[rgb(233,243,232)] text-[rgb(67,132,61)]",
    border: "border-[rgb(67,132,61)]",
    icon: "text-[rgb(67,132,61)]",
  },
  danger: {
    container: "bg-[rgb(246,231,231)] text-[rgb(185,44,37)]",
    border: "border-[rgb(185,44,37)]",
    icon: "text-[rgb(185,44,37)]",
  },
  warning: {
    container: "bg-[rgb(251,240,228)] text-[rgb(158,91,32)]",
    border: "border-[rgb(158,91,32)]",
    icon: "text-[rgb(158,91,32)]",
  },
};

export default function Messagebox({
  variant = "primary",
  title,
  icon: Icon = RiInformation2Fill,
  children,
  actionLinks,
  onCloseRequest,
  closable = false,
}: MessageboxProps) {
  const messageBoxVariant = MESSAGEBOX_VARIATIONS[variant];

  return (
    <div
      className={cn(
        "flex flex-row p-3 py-5 pt-[11px] w-full gap-3 relative border-t-2 rounded-xs overflow-hidden h-full",
        messageBoxVariant.container
      )}
    >
      <div className={cn("absolute", messageBoxVariant.border)} />
      {Icon && (
        <Icon className={cn("mt-1", messageBoxVariant.icon)} size={16} />
      )}
      <div className="flex flex-col gap-1">
        <span className="font-semibold">{title}</span>
        <span className="text-sm">{children}</span>
        {actionLinks && (
          <div className="flex flex-row gap-2">
            {actionLinks?.map((action, index) => {
              const sharedClasses = cn(
                "text-sm cursor-pointer font-medium duration-300 transition-all w-fit",
                messageBoxVariant.icon
              );

              if (action.type === "button") {
                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={sharedClasses}
                  >
                    {action.caption}
                  </button>
                );
              }

              return (
                <a
                  key={index}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={sharedClasses}
                >
                  {action.caption}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {closable && (
        <RiCloseLine
          role="button"
          aria-label="Closable request"
          onClick={(e) => {
            e.stopPropagation();
            onCloseRequest();
          }}
          size={18}
          className={cn(
            "absolute top-4 right-3 duration-300 transition-all hover:bg-gray-300 cursor-pointer"
          )}
        />
      )}
    </div>
  );
}
