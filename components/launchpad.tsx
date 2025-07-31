import {
  Children,
  isValidElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Separator } from "./separator";
import { motion } from "framer-motion";
import { Grid, GridPresetKey } from "./grid";
import { cn } from "./../lib/utils";

interface LaunchpadProps {
  children: ReactNode;
  className?: string;
  maxSection?: number;
}

interface LaunchpadSectionProps {
  children: ReactNode;
  title?: string;
  containerClassName?: string;
  childClassName?: string;
  separatorClassName?: string;
  gridPreset?: GridPresetKey;
}

interface LaunchpadSectionItemProps {
  href: string;
  iconUrl: string;
  label: string;
  className?: string;
  iconClassName?: string;
}

function Launchpad({ children, className, maxSection = 3 }: LaunchpadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [page, setPage] = useState(0);

  const allSections = Children.toArray(children).filter(isValidElement);
  const totalPages = Math.ceil(allSections.length / maxSection);

  const groupedSections = Array.from({ length: totalPages }, (_, i) =>
    allSections.slice(i * maxSection, (i + 1) * maxSection)
  );

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDragEnd = (
    _: MouseEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const threshold = containerWidth * 0.03;

    const isSwipeLeft = info.offset.x < -threshold;
    const isSwipeRight = info.offset.x > threshold;

    const isFastSwipeLeft = info.velocity.x < -300;
    const isFastSwipeRight = info.velocity.x > 300;

    const swipeDelta =
      isSwipeLeft || isFastSwipeLeft
        ? 1
        : isSwipeRight || isFastSwipeRight
          ? -1
          : 0;

    const nextPage = Math.max(0, Math.min(page + swipeDelta, totalPages - 1));

    setPage(nextPage);
  };

  const targetX = -page * containerWidth;

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col cursor-grab active:cursor-grabbing p-6 px-[6px] gap-4 border border-gray-300 overflow-hidden relative",
        className
      )}
    >
      <div className="relative">
        <motion.div
          drag={"x"}
          dragElastic={0.2}
          dragMomentum={false}
          dragConstraints={{
            left: -containerWidth * (totalPages - 1),
            right: 0,
          }}
          animate={{ x: targetX }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1,
          }}
          onDragEnd={handleDragEnd}
          className="flex"
        >
          {groupedSections.map((group, index) => (
            <div
              key={index}
              className="shrink-0 flex flex-col gap-6"
              style={{
                width: containerWidth,
                pointerEvents: "auto",
              }}
            >
              {group}
            </div>
          ))}
        </motion.div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={cn(
                "w-2 h-2 rounded-full cursor-pointer transition-colors",
                page === index ? "bg-gray-500" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LaunchpadSection({
  children,
  title,
  childClassName,
  containerClassName,
  separatorClassName,
  gridPreset = "2-to-4",
}: LaunchpadSectionProps) {
  return (
    <div className={cn("flex flex-col gap-6", containerClassName)}>
      <div className={cn("pr-10 sm:pr-16 md:pr-6 lg:pr-6", separatorClassName)}>
        <Separator title={title} depth="0" />
      </div>
      <Grid
        preset={gridPreset}
        containerClassName={cn(
          "-translate-x-2 md:translate-x-0 sm:pr-4",
          childClassName
        )}
      >
        {children}
      </Grid>
    </div>
  );
}

function LaunchpadSectionItem({
  href,
  label,
  iconUrl,
  className,
  iconClassName,
}: LaunchpadSectionItemProps) {
  return (
    <a
      className={cn(
        "flex flex-col border border-transparent p-1 mx-4 pt-3 duration-300 transition-all rounded-md hover:border-gray-200 hover:shadow-md gap-2 text-xs items-center",
        className
      )}
      href={href}
    >
      {iconUrl && (
        <div className={cn("max-w-[30px]", iconClassName)}>
          <img width={400} height={400} src={iconUrl} />
        </div>
      )}
      {label && <span>{label}</span>}
    </a>
  );
}

Launchpad.Section = LaunchpadSection;
LaunchpadSection.Item = LaunchpadSectionItem;

export { Launchpad };
