import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useAnimation } from "framer-motion";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { motion } from "framer-motion";
import { cn } from "./../lib/utils";

interface SidebarProps {
  children?: ReactNode;
  className?: string;
  position?: "left" | "right";
}

interface SidebarItemProps {
  isFixed?: boolean;
  className?: string;
  children?: ReactNode;
}

function Sidebar({ children, className, position = "left" }: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const controls = useAnimation();

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
      position === "left"
        ? controls.set({ x: !mobile ? 0 : "-100%" })
        : controls.set({ x: !mobile ? 0 : "+100%" });
    }
  }, [controls]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
      position === "left"
        ? controls.set({ x: !mobile ? 0 : "-100%" })
        : controls.set({ x: !mobile ? 0 : "+100%" });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [controls]);

  const handleToggleSidebar = (open: boolean) => {
    setIsSidebarOpen(open);
    if (isMobile && position === "left") {
      controls.start({
        x: open ? 0 : "-100%",
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    } else if (isMobile && position === "right") {
      controls.start({
        x: open ? 0 : "+100%",
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      isMobile && handleToggleSidebar(position === "left" ? false : true),
    onSwipedRight: () =>
      isMobile && handleToggleSidebar(position === "left" ? true : false),
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <>
      {isSidebarOpen && (
        <div
          {...handlers}
          className={cn(
            `fixed top-0 h-full z-30 md:hidden`,
            isSidebarOpen ? "w-full" : "w-[5%]",
            position === "left" ? "left-0" : "right-0"
          )}
        />
      )}

      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => handleToggleSidebar(false)}
        />
      )}

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
        animate={isMobile ? controls : { x: 0 }}
        className={cn(
          `fixed z-40 flex h-full min-h-screen w-64 min-w-[300px] flex-col shadow-md border-gray-300 bg-white p-6 pt-10 md:static md:hidden md:translate-x-0`,
          position === "left" ? "left-0 border-r" : "right-0 border-l",
          className
        )}
      >
        {children}
      </motion.div>

      {isMobile && !isSidebarOpen && (
        <button
          {...handlers}
          onClick={() => handleToggleSidebar(true)}
          className={cn(
            "fixed top-0 z-30 block h-full cursor-pointer rounded-xs border border-gray-200 bg-white p-[2px] shadow-md md:hidden",
            position === "left" ? "left-0" : "right-0"
          )}
        >
          {position === "left" ? <RiArrowRightSLine /> : <RiArrowLeftSLine />}
        </button>
      )}

      <div
        className={cn(
          `fixed overflow-y-auto top-0 z-40 hidden h-full min-h-screen w-64 min-w-[300px] border-gray-200 bg-white p-6 pt-10 shadow-md md:fixed md:flex md:translate-x-0 md:flex-col`,
          position === "left" ? "left-0 border-r" : "right-0 border-l",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}

function SidebarItem({ isFixed, className, children }: SidebarItemProps) {
  const sidebarItemClass = cn(
    "w-full h-fit flex flex-col my-2",
    isFixed ? "" : "max-h-[300px]",
    className
  );
  return <div className={sidebarItemClass}>{children}</div>;
}

function SidebarSpacer() {
  return <div className="hidden md:block md:min-w-[300px]" />;
}

Sidebar.Spacer = SidebarSpacer;
Sidebar.Item = SidebarItem;
export { Sidebar };
