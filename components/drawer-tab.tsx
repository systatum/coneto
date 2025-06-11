import { cn } from "./../lib/utils";
import { RemixiconComponentType, RiCloseLine } from "@remixicon/react";
import { useAnimation, motion } from "framer-motion";
import { Fragment, ReactNode, useState } from "react";

interface DrawerTabProps {
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

export default function DrawerTab({
  tabs,
  containerClassName,
  drawerTabClassName,
  tabClassName,
  position = "right",
}: DrawerTabProps) {
  const [isDrawerTab, setIsDrawerTab] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const controls = useAnimation();

  const handleToggleDrawer = (open: boolean) => {
    setIsDrawerTab(open);
    if (position === "left") {
      controls.start({
        x: open ? 0 : "-100%",
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    } else if (position === "right") {
      controls.start({
        x: open ? 0 : "+100%",
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    }
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
          position === "left"
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
          position === "left" ? "left-0" : "right-0",
          drawerTabClassName
        )}
      >
        <div
          className={cn(
            "h-fit absolute z-10 flex flex-col border-gray-300 bg-white gap-[2px]",
            position === "left" ? "left-[300px] top-8" : "right-[300px]",
            tabClassName
          )}
        >
          {tabs.map((data) => (
            <div
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
                "hover:border cursor-pointer z-10 rounded-xs border hover:border-gray-300 border-gray-200 relative ",
                data.id === selected && "border-gray-300 bg-gray-100",
                position === "left" ? "p-2 rounded-r-xl" : "p-2 rounded-l-xl"
              )}
            >
              <data.icon size={20} />
            </div>
          ))}
        </div>

        {selectedTab &&
          selectedTab.map((data) => (
            <Fragment key={data.id}>
              <div className="flex flex-row justify-between pl-4 pr-2 bg-gray-100 items-center">
                <h2 className="font-medium py-[6px] text-sm">{data.title}</h2>
                <div className="cursor-pointer flex justify-center items-center w-5 h-5 hover:bg-gray-300 text-gray-600 rounded-xs">
                  <RiCloseLine
                    size={16}
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
              <span className="px-4">{data.content}</span>
            </Fragment>
          ))}
      </motion.div>
    </div>
  );
}
