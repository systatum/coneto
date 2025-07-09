import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
} from "@remixicon/react";
import { cn } from "./../lib/utils";
import { useAnimation } from "framer-motion";
import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface PaperDialogProps {
  containerClassName?: string;
  tabClassName?: string;
  paperDialogClassName?: string;
  position?: "left" | "right";
  children: ReactNode;
  closable?: boolean;
}

const tabs = [
  {
    id: 1,
    icon: RiArrowRightSLine,
    title: "ArrowRight",
  },
  {
    id: 2,
    icon: RiArrowLeftSLine,
    title: "ArrowLeft",
  },
];

export default function PaperDialog({
  containerClassName,
  paperDialogClassName,
  position = "right",
  tabClassName,
  children,
  closable,
}: PaperDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean | null>(false);

  const controls = useAnimation();
  const isLeft = position === "left";

  const handleToggleDrawer = (open: boolean) => {
    setIsOpen(open);
    controls.start({
      x: open ? 0 : isLeft ? "-100%" : "+100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  };

  const containerDrawerTabClass = cn(
    "flex flex-row w-full relative bg-white",
    containerClassName
  );

  return (
    <div className={containerDrawerTabClass}>
      {isOpen !== null && (
        <motion.div
          initial={{ x: isLeft ? "-100%" : "100%" }}
          animate={controls}
          className={cn(
            `fixed flex w-64 min-w-[92vw] gap-3 flex-col border border-gray-300 bg-white pb-4 shadow-lg md:translate-x-0 md:shadow-none`,
            isLeft ? "left-0" : "right-0"
          )}
        >
          {closable && (
            <div
              role="button"
              onClick={() => {
                setIsOpen(null);
              }}
              className={cn(
                "cursor-pointer hover:bg-gray-100 bg-white border-gray-300 w-fit absolute ",
                "border hover:border",
                isLeft && "border-y border-r hover:border-y hover:border-r",
                !isLeft && "border-y border-l hover:border-y hover:border-l",
                isLeft
                  ? "p-2 rounded-r-xl left-[92vw]"
                  : "p-2 rounded-l-xl right-[92vw]"
              )}
            >
              <RiCloseLine size={20} />
            </div>
          )}
          <div
            className={cn(
              "h-fit absolute z-10 flex flex-col top-12 border-gray-300 bg-transparent gap-[2px]",
              isLeft ? "left-[92vw]" : "right-[92vw]",
              tabClassName
            )}
          >
            {tabs.map((data) => (
              <div
                role="button"
                tabIndex={0}
                key={data.id}
                onClick={() => {
                  if (position === "right") {
                    handleToggleDrawer(
                      data.title === "ArrowRight" ? false : true
                    );
                  } else {
                    handleToggleDrawer(
                      data.title === "ArrowRight" ? true : false
                    );
                  }
                }}
                className={cn(
                  "cursor-pointer hover:bg-gray-100 bg-white border-gray-300 relative ",
                  "border hover:border",
                  isLeft && "border-y border-r hover:border-y hover:border-r",
                  !isLeft && "border-y border-l hover:border-y hover:border-l",
                  isLeft ? "p-2 rounded-r-xl" : "p-2 rounded-l-xl"
                )}
              >
                <data.icon size={20} />
              </div>
            ))}
          </div>

          <div className={cn("flex flex-col gap-3 relative z-30 bg-white")}>
            <div
              className={cn("min-h-screen flex flex-col", paperDialogClassName)}
            >
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
