import { cn } from "./../lib/utils";
import {
  RemixiconComponentType,
  RiArrowRightSLine,
  RiMoreFill,
  RiMoreLine,
} from "@remixicon/react";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CrumbProps {
  children?: ReactNode;
  maxShown?: number;
  className?: string;
  iconSeparator?: RemixiconComponentType;
}

interface CrumbItemProps {
  path?: string;
  children?: ReactNode;
  isLast?: boolean;
  className?: string;
  onClick?: () => void;
}

function Crumb({
  iconSeparator: Icon = RiArrowRightSLine,
  maxShown = 3,
  children,
  className,
}: CrumbProps) {
  const [expanded, setExpanded] = useState(false);

  const allItems = Children.toArray(children).filter(
    isValidElement
  ) as ReactElement<CrumbItemProps>[];

  const itemCount = allItems.length;

  const showEllipsis = !expanded && itemCount > maxShown;
  let shownItems: ReactNode[] = [];

  if (!showEllipsis) {
    shownItems = allItems;
  } else {
    const first = allItems[0];
    const last = allItems[itemCount - 1];
    const current = allItems[itemCount - 2];

    shownItems = [first, "ellipsis", current, last];
  }

  return (
    <nav aria-label="crumb" className="flex flex-row">
      <AnimatePresence initial={false} mode="popLayout">
        {shownItems.map((data, index) => {
          const isEllipsis = data === "ellipsis";
          const isLast = index === shownItems.length - 1;

          if (isEllipsis) {
            return (
              <motion.li
                key="ellipsis"
                className="flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <RiMoreLine
                  size={20}
                  className="text-gray-500 hover:text-[#61A9F9] cursor-pointer"
                  onClick={() => setExpanded(true)}
                />
                {!isLast && <Icon size={20} className="mx-2 text-gray-400" />}
              </motion.li>
            );
          }

          if (isValidElement<CrumbItemProps>(data)) {
            return (
              <motion.li
                key={
                  (isValidElement(data) && data.key?.toString()) ||
                  `crumb-${index}`
                }
                className="flex items-center min-h-[24px] max-h-[24px]"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {cloneElement(data, {
                  isLast,
                  className,
                })}
                {!isLast && <Icon size={20} className="mx-2 text-gray-400" />}
              </motion.li>
            );
          }

          return null;
        })}
      </AnimatePresence>
    </nav>
  );
}

function CrumbItem({
  path,
  children,
  isLast = false,
  className,
  onClick,
}: CrumbItemProps) {
  return path ? (
    <a
      href={path}
      className={cn(
        "text-gray-600 hover:text-[#61A9F9]",
        isLast && "text-black font-medium",
        className
      )}
    >
      {children}
    </a>
  ) : (
    <span
      onClick={onClick}
      className={cn(
        "text-gray-600 hover:text-[#61A9F9]",
        isLast && "text-black font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

Crumb.Item = CrumbItem;

export { Crumb };
