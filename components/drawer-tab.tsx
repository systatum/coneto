import { cn } from "./../lib/utils";
import { RemixiconComponentType, RiCloseLine } from "@remixicon/react";
import { useAnimation, motion } from "framer-motion";
import { ReactNode, useState } from "react";

export interface DrawerTabProps {
  tabs: Array<{
    id: number;
    title: string;
    icon: RemixiconComponentType;
    content: ReactNode;
  }>;
  containerClassName?: string;
  tabClassName?: string;
  drawerTabClassName?: string;
  position?: "left" | "right";
}

function DrawerTab({
  tabs,
  containerClassName,
  drawerTabClassName,
  tabClassName,
  position = "right",
}: DrawerTabProps) {
  const [isDrawerTab, setIsDrawerTab] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const controls = useAnimation();
  const isLeft = position === "left";

  const handleToggleDrawer = (open: boolean) => {
    setIsDrawerTab(open);
    controls.start({
      x: open ? 0 : isLeft ? "-100%" : "+100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  };

  const containerDrawerTabClass = cn(
    "flex flex-row w-full relative bg-white",
    containerClassName
  );

  const selectedTab = tabs?.filter((tab) => tab.id === selected);

  return (
    <div className={containerDrawerTabClass}>
      <motion.div
        initial={
          isLeft
            ? {
                x: "-100%",
              }
            : {
                x: "+100%",
              }
        }
        animate={controls}
        className={cn(
          `fixed flex w-64 min-w-[300px] gap-3 flex-col border border-gray-300 bg-white pb-4 top-10 shadow-lg md:translate-x-0 md:shadow-none`,
          isLeft ? "left-0" : "right-0",
          drawerTabClassName
        )}
      >
        <div
          className={cn(
            "h-fit absolute z-10 flex flex-col top-8 border-gray-300 bg-transparent gap-[2px]",
            isLeft ? "left-[298px]" : "right-[298px]",
            tabClassName
          )}
        >
          {tabs.map((data) => (
            <div
              role="button"
              aria-label={`Open ${data.title} tab`}
              tabIndex={0}
              key={data.id}
              onClick={() => {
                const isSame = selected === data.id;

                if (isSame && isDrawerTab) {
                  handleToggleDrawer(false);
                  setTimeout(() => setSelected(null), 400);
                } else {
                  setSelected(data.id);

                  if (!isDrawerTab) {
                    handleToggleDrawer(true);
                  }
                }
              }}
              className={cn(
                "cursor-pointer hover:bg-gray-100 bg-white border-gray-300 relative ",
                data.id !== selected && "border hover:border",
                data.id === selected &&
                  isLeft &&
                  "border-y border-r hover:border-y hover:border-r",
                data.id === selected &&
                  !isLeft &&
                  "border-y border-l hover:border-y hover:border-l",
                isLeft ? "p-2 rounded-r-xl" : "p-2 rounded-l-xl"
              )}
            >
              <data.icon size={20} />
            </div>
          ))}
        </div>

        {selectedTab &&
          selectedTab.map((data) => (
            <div
              key={data.id}
              className="flex flex-col gap-3 relative z-30 bg-white"
            >
              <div className="flex flex-row relative justify-between pl-4 pr-2 bg-gray-100 items-center z-40">
                <span className="font-medium py-[6px] text-sm">
                  {data.title}
                </span>
                <div className="cursor-pointer flex justify-center items-center w-5 h-5 hover:bg-gray-300 text-gray-600 rounded-xs">
                  <RiCloseLine
                    size={16}
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleDrawer(false);
                      setTimeout(() => setSelected(null), 400);
                    }}
                  />
                </div>
              </div>
              <div
                aria-label="divider"
                className="border-b w-full absolute top-8 left-0 border-gray-200 h-px"
              />
              <span className="px-4 relative z-40">{data.content}</span>
            </div>
          ))}
      </motion.div>
    </div>
  );
}
export { DrawerTab };
