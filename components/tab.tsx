import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TabFieldsProps } from "../type/Tab";

interface TabProps {
  view: string | null;
  fields: TabFieldsProps[];
  setView: (data: string | null) => void;
}

export default function Tab({ fields, view, setView }: TabProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const activeId = hovered || view;
  const activeIndex = fields.findIndex((item) => item.id === activeId);
  const tabRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [tabSizes, setTabSizes] = useState<{ width: number; left: number }[]>(
    []
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, fields.length);

    while (tabRefs.current.length < fields.length) {
      tabRefs.current.push(null);
    }
  }, [fields]);

  useEffect(() => {
    if (!view && fields.length > 0) {
      setView(fields[0].id);
    }
  }, [view, fields, setView]);

  useEffect(() => {
    const calculateTabSizes = () => {
      if (
        !tabRefs.current.length ||
        !tabRefs.current[0] ||
        !containerRef.current
      )
        return;

      const parentRect = containerRef.current.getBoundingClientRect();

      const sizes = tabRefs.current.map((tabRef) => {
        if (!tabRef) return { width: 0, left: 0 };

        const rect = tabRef.getBoundingClientRect();
        return {
          width: rect.width,
          left: rect.left - parentRect.left,
        };
      });

      setTabSizes(sizes);
      setIsInitialized(true);
    };

    calculateTabSizes();
    const timeoutId = setTimeout(calculateTabSizes, 50);

    window.addEventListener("resize", calculateTabSizes);
    return () => {
      window.removeEventListener("resize", calculateTabSizes);
      clearTimeout(timeoutId);
    };
  }, [fields.length]);

  const setTabRef = (index: number) => (element: HTMLDivElement | null) => {
    tabRefs.current[index] = element;
  };

  const getInitialPosition = () => {
    if (!isInitialized && fields.length > 0) {
      if (activeIndex === 0) {
        return { left: 4, width: 60 };
      }
    }

    if (isInitialized && activeIndex !== -1 && tabSizes[activeIndex]) {
      return {
        left: tabSizes[activeIndex].left,
        width: tabSizes[activeIndex].width - 3,
      };
    }

    return { left: 4, width: 60 };
  };

  const initialPosition = getInitialPosition();

  return (
    <div
      ref={containerRef}
      className="relative flex w-fit flex-row items-center justify-center overflow-hidden rounded-xl border border-gray-100 px-1 shadow-sm"
    >
      <motion.div
        layout
        className="absolute top-1 bottom-1 z-0 h-[25px] rounded-xl bg-blue-600"
        initial={{
          left: initialPosition.left,
          width: initialPosition.width,
        }}
        animate={{
          left: initialPosition.left,
          width: initialPosition.width,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 30,
        }}
      />

      {fields.map((data, index) => {
        const isHovered = hovered === data.id;
        const isActive = view === data.id;

        const textColor =
          isHovered || (!hovered && isActive) ? "text-white" : "text-gray-900";

        return (
          <div
            key={index}
            ref={setTabRef(index)}
            className={`relative z-10 cursor-pointer px-4 py-1 text-center font-medium transition-colors duration-200 ${textColor}`}
            onMouseEnter={() => setHovered(data.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setView(data.id)}
          >
            {data.title}
          </div>
        );
      })}
    </div>
  );
}
