import { ReactNode, useState } from "react";
import { RiArrowRightSLine } from "@remixicon/react";
import { motion } from "framer-motion";
import styled, { css, CSSProp } from "styled-components";

interface BoxbarProps {
  children: ReactNode;
  containerStyle?: CSSProp;
  childStyle?: CSSProp;
  minHeight?: number;
  maxHeight?: number;
}

function Boxbar({
  childStyle,
  containerStyle,
  children,
  minHeight = 40,
  maxHeight,
}: BoxbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BaseBoxbar
      initial={{ height: minHeight }}
      animate={{ height: isOpen ? (maxHeight ?? "auto") : minHeight }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      $containerStyle={containerStyle}
      $maxHeight={maxHeight}
    >
      <ChildWrapper $childStyle={childStyle}>{children}</ChildWrapper>

      <ToggleButton
        aria-label="boxbar-toggle"
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <RiArrowRightSLine size={14} />
      </ToggleButton>
    </BaseBoxbar>
  );
}

const BaseBoxbar = styled(motion.div)<{
  $containerStyle: CSSProp;
  $maxHeight: number | undefined;
}>`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  position: relative;

  ${({ $maxHeight }) =>
    $maxHeight &&
    css`
      max-height: fit-content;
    `}
  ${({ $containerStyle }) => $containerStyle}
`;

const ChildWrapper = styled.span<{ $childStyle: CSSProp }>`
  padding: 0.5rem;
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  ${({ $childStyle }) => $childStyle}
`;

const ToggleButton = styled(motion.button)`
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  top: 0.5rem;
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
