import { cn } from "./../lib/utils";
import { RemixiconComponentType, RiCloseLine } from "@remixicon/react";
import { useAnimation, motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface DrawerTabProps {
  tabs: Array<{
    id: number;
    title: string;
    icon: RemixiconComponentType;
    content: ReactNode;
  }>;
  containerClassName?: string;
  position?: "left" | "right";
}

export default function DrawerTab({
  tabs,
  containerClassName,
  position = "right",
}: DrawerTabProps) {
  const [isDrawerTab, setIsDrawerTab] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const controls = useAnimation();

  const handleToggleDrawer = (open: boolean) => {
    setIsDrawerTab(open);
    controls.start({
      x: open ? 0 : position === "left" ? "-100%" : "100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  };

  const containerDrawerTabClass = cn(
    "flex flex-col w-fit h-full bg-white min-h-screen",
    containerClassName
  );

  const selectedTab = tabs.find((tab) => tab.id === selected);

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
          `absolute flex h-full min-h-screen w-64 min-w-[300px] gap-1 flex-col border border-gray-300 bg-white p-4 pt-0 top-10 shadow-lg md:static md:hidden md:translate-x-0 md:shadow-none`,
          position === "left" ? "left-0 pl-12" : "right-0 pr-12"
        )}
      >
        {selectedTab && (
          <>
            <div className="flex flex-row justify-between items-center">
              <h2 className="font-medium py-[6px] text-sm">
                {selectedTab.title}
              </h2>
              <RiCloseLine
                className="cursor-pointer hover:bg-gray-300 text-gray-600 rounded-xs"
                size={16}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleDrawer(false);
                  setTimeout(() => setSelected(null), 100);
                }}
              />
            </div>
            <div
              aria-label="divider"
              className="border-b w-full absolute top-8 left-0 border-gray-200 h-px"
            />
            <span>{selectedTab.content}</span>
          </>
        )}
      </motion.div>

      <div
        className={cn(
          "pt-10 h-full fixed z-10 flex flex-col border-gray-300 gap-1 bg-gray-100 min-h-screen",
          position === "left" ? "left-0 border-r pl-1" : "right-0 border-l pr-1"
        )}
      >
        {tabs.map((data) => (
          <div
            key={data.id}
            onClick={() => {
              const isSame = selected === data.id;

              if (isSame && isDrawerTab) {
                handleToggleDrawer(false);
                setTimeout(() => setSelected(null), 100);
              } else {
                setSelected(data.id);

                if (!isDrawerTab) {
                  handleToggleDrawer(true);
                }
              }
            }}
            className={cn(
              "hover:border cursor-pointer z-10 p-1 rounded-xs border border-transparent hover:border-gray-300 relative ",
              data.id === selected && "border-gray-300 bg-gray-100"
            )}
          >
            {<data.icon size={24} />}
          </div>
        ))}
      </div>
    </div>
  );
}
