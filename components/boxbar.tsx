import { ReactNode, useEffect, useRef, useState } from "react";
import { RiArrowRightSLine } from "@remixicon/react";
import { motion } from "framer-motion";
import styled, { css, CSSProp } from "styled-components";

interface BoxbarProps {
  children: ReactNode;
  containerStyle?: CSSProp;
}

function Boxbar({ containerStyle, children }: BoxbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;

    const updateHeights = () => {
      const styles = getComputedStyle(el);
      const paddingTop = parseFloat(styles.paddingTop || "0");
      const paddingBottom = parseFloat(styles.paddingBottom || "0");

      let firstRowHeight = 0;

      if (el.children.length > 0) {
        const firstChild = el.children[0] as HTMLElement;
        const firstTop = firstChild.offsetTop;

        let rowBottom = firstChild.offsetTop + firstChild.offsetHeight;

        for (let i = 1; i < el.children.length; i++) {
          const child = el.children[i] as HTMLElement;
          if (child.offsetTop > firstTop) {
            break;
          }
          rowBottom = Math.max(rowBottom, child.offsetTop + child.offsetHeight);
        }

        firstRowHeight = rowBottom - firstTop;
      }

      setContentHeight(el.scrollHeight);
      setCollapsedHeight(firstRowHeight + paddingTop + paddingBottom);
    };

    setTimeout(updateHeights, 0);

    const observer = new ResizeObserver(() => {
      setTimeout(updateHeights, 0);
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [children]);

  const shouldShowToggle = contentHeight > collapsedHeight;

  return (
    <BaseBoxbar
      ref={contentRef}
      initial={{ height: collapsedHeight }}
      animate={{ height: isOpen ? contentHeight : collapsedHeight }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      $containerStyle={containerStyle}
    >
      {children}

      {shouldShowToggle && (
        <ToggleButton
          aria-label="boxbar-toggle"
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <RiArrowRightSLine size={14} />
        </ToggleButton>
      )}
    </BaseBoxbar>
  );
}

const BaseBoxbar = styled(motion.div)<{
  $containerStyle: CSSProp;
}>`
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  position: relative;
  max-height: fit-content;
  padding: 0.5rem;
  padding-right: 30px;
  gap: 6px;

  ${({ $containerStyle }) => $containerStyle}
`;

const ToggleButton = styled(motion.button)`
  position: absolute;
  top: 0.55rem;
  right: 0.5rem;
  width: fit-content;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  background-color: transparent;

  &:hover {
    background-color: #f3f4f6;
  }
`;

export { Boxbar };
