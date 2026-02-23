import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useAnimation } from "framer-motion";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { motion } from "framer-motion";
import styled, { CSSProp } from "styled-components";
import { OverlayBlocker } from "./overlay-blocker";

export interface SidebarProps {
  children?: ReactNode;
  styles?: SidebarStylesProps;
  position?: "left" | "right";
}

export interface SidebarStylesProps {
  mobileStyle?: CSSProp;
  desktopStyle?: CSSProp;
}

export interface SidebarItemProps {
  isFixed?: boolean;
  style?: CSSProp;
  children?: ReactNode;
}

function Sidebar({ children, styles, position = "left" }: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const controls = useAnimation();

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
      controls.set({
        x: !mobile ? 0 : position === "left" ? "-100%" : "+100%",
      });
    }
  }, [controls, position]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
      controls.set({
        x: !mobile ? 0 : position === "left" ? "-100%" : "+100%",
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [controls, position]);

  const handleToggleSidebar = (open: boolean) => {
    setIsSidebarOpen(open);
    if (isMobile) {
      controls.start({
        x: open ? 0 : position === "left" ? "-100%" : "+100%",
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
      {isSidebarOpen && isMobile && (
        <OverlayBlocker
          show={isSidebarOpen}
          onClick={() => handleToggleSidebar(false)}
        />
      )}

      <MotionSidebar
        initial={{ x: position === "left" ? "-100%" : "+100%" }}
        animate={isMobile ? controls : { x: 0 }}
        $position={position}
        $style={styles?.mobileStyle}
      >
        {children}
      </MotionSidebar>

      {isMobile && !isSidebarOpen && (
        <ToggleButton
          {...handlers}
          onClick={() => handleToggleSidebar(true)}
          $position={position}
        >
          {position === "left" ? <RiArrowRightSLine /> : <RiArrowLeftSLine />}
        </ToggleButton>
      )}

      <DesktopSidebar $position={position} $style={styles?.desktopStyle}>
        {children}
      </DesktopSidebar>
    </>
  );
}

const MotionSidebar = styled(motion.div)<{
  $position: "left" | "right";
  $style?: CSSProp;
}>`
  position: fixed;
  z-index: 9999999;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  width: 16rem;
  min-width: 300px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
  background-color: white;
  padding: 2.5rem 1.5rem 1.5rem;

  ${({ $position }) =>
    $position === "left"
      ? "left: 0; border-right: 1px solid #d1d5db;"
      : "right: 0; border-left: 1px solid #d1d5db;"}
  @media (min-width: 768px) {
    display: none;
  }
  ${({ $style }) => $style}
`;

const ToggleButton = styled.button<{
  $position: "left" | "right";
}>`
  position: fixed;
  top: 0;
  z-index: 30;
  display: block;
  height: 100%;
  padding: 2px;
  background-color: white;
  border-radius: var(--radius-xs);
  border: 1px solid #e5e7eb;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;

  ${({ $position }) => ($position === "left" ? "left: 0;" : "right: 0;")}

  @media (min-width: 768px) {
    display: none;
  }
`;

const DesktopSidebar = styled.div<{
  $position: "left" | "right";
  $style?: CSSProp;
}>`
  position: fixed;
  z-index: 40;
  display: none;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  width: 16rem;
  min-width: 300px;
  overflow-y: auto;
  padding: 2.5rem 1.5rem 1.5rem;
  background-color: white;
  border-color: #e5e7eb;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);

  ${({ $position }) =>
    $position === "left"
      ? "left: 0; border-right: 1px solid #d1d5db;"
      : "right: 0; border-left: 1px solid #d1d5db;"}

  @media (min-width: 768px) {
    display: flex;
  }

  ${({ $style }) => $style}
`;

function SidebarItem({ isFixed, style, children }: SidebarItemProps) {
  return (
    <StyledSidebarItem isFixed={isFixed} $style={style}>
      {children}
    </StyledSidebarItem>
  );
}
const StyledSidebarItem = styled.div<{
  isFixed?: boolean;
  $style?: CSSProp;
}>`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;

  ${({ isFixed }) => !isFixed && `max-height: 300px;`}
  ${({ $style }) => $style}
`;

export interface SidebarSpacerProps {
  mobileWidth?: string;
  desktopWidth?: string;
}

function SidebarSpacer({ desktopWidth, mobileWidth }: SidebarSpacerProps) {
  return (
    <StyledSidebarSpacer
      $desktopWidth={desktopWidth}
      $mobileWidth={mobileWidth}
    />
  );
}

const StyledSidebarSpacer = styled.div<{
  $mobileWidth?: string;
  $desktopWidth?: string;
}>`
  display: flex;
  background-color: transparent;
  min-width: ${({ $mobileWidth }) =>
    $mobileWidth ? `${$mobileWidth}` : "30px"};

  @media (min-width: 768px) {
    display: block;
    min-width: ${({ $desktopWidth }) =>
      $desktopWidth ? `${$desktopWidth}` : "300px"};
  }
`;

Sidebar.Spacer = SidebarSpacer;
Sidebar.Item = SidebarItem;
export { Sidebar };
