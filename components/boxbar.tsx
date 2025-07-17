import { ReactNode, useState } from "react";
import { cn } from "../lib/utils";
import { RiArrowRightSLine } from "@remixicon/react";
import { motion } from "framer-motion";

interface BoxbarProps {
  children: ReactNode;
  containerClassName?: string;
  childClassName?: string;
  minHeight?: number;
  maxHeight?: number;
}

function Boxbar({
  childClassName,
  containerClassName,
  children,
  minHeight = 40,
  maxHeight,
}: BoxbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ height: minHeight }}
      animate={{
        height: isOpen ? (maxHeight ? maxHeight : "auto") : minHeight,
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "overflow-hidden flex flex-row justify-start items-start border rounded-xs relative border-gray-300 bg-white",
        maxHeight ? "" : "max-h-fit",
        containerClassName
      )}
    >
      <span className={cn("p-2 w-full flex-wrap flex", childClassName)}>
        {children}
      </span>
      <button
        className="mt-2 mr-2 top-2 w-fit right-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <RiArrowRightSLine size={14} />
        </motion.div>
      </button>
    </motion.div>
  );
}

export { Boxbar };
